// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {AppState, type AppStateStatus, DeviceEventEmitter, Platform} from 'react-native';

import {storeGlobal, storeOnboardingViewedValue} from '@actions/app/global';
import {terminateSession} from '@actions/local/session';
import {syncMultiTeam} from '@actions/remote/entry/ikcommon';
import {handleFirstConnect, handleReconnect} from '@actions/websocket';
import {Events, Launch} from '@constants';
import {GLOBAL_IDENTIFIERS} from '@constants/database';
import DatabaseManager from '@database/manager';
import {getAllServerCredentials} from '@init/credentials';
import {relaunchApp} from '@init/launch';
import {queryGlobalValue} from '@queries/app/global';
import {getAllServers} from '@queries/app/servers';
import {resetToInfomaniakNoTeams} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';
import {deleteFileCacheByDir} from '@utils/file';
import {isMainActivity} from '@utils/helpers';
import {logError} from '@utils/log';

import type {LaunchType} from '@typings/launch';

type LogoutCallbackArg = {
    serverUrl: string;
    removeServer: boolean;
}

export class SessionManagerSingleton {
    private previousAppState: AppStateStatus;
    private terminatingSessionUrl = new Set<string>();
    private firstSyncedUrls = new Set<string>();
    private syncingUrls = new Set<string>();

    constructor() {
        AppState.addEventListener('change', this.onAppStateChange);

        DeviceEventEmitter.addListener(Events.SERVER_LOGOUT, this.onLogout);
        DeviceEventEmitter.addListener(Events.ACTIVE_SERVER_CHANGED, this.onActiveServerChanged);
        DeviceEventEmitter.addListener(Events.NO_TEAMS, this.onNoTeams);

        this.previousAppState = AppState.currentState;
    }

    init() {
        let updateToMigrationDone = false;
        queryGlobalValue(GLOBAL_IDENTIFIERS.CACHE_MIGRATION)?.fetch().then((records) => {
            const cacheMigrationDone = Boolean(records?.[0]?.value);
            if (!cacheMigrationDone) {
                if (Platform.OS === 'ios') {
                    deleteFileCacheByDir('com.hackemist.SDImageCache');
                } else if (Platform.OS === 'android') {
                    deleteFileCacheByDir('image_cache');
                    deleteFileCacheByDir('image_manager_disk_cache');
                }
                updateToMigrationDone = true;
            }
        }).finally(() => {
            if (updateToMigrationDone) {
                storeGlobal(GLOBAL_IDENTIFIERS.CACHE_MIGRATION, true);
            }
        });
    }

    private onAppStateChange = async (appState: AppStateStatus) => {
        if (appState === this.previousAppState || !isMainActivity()) {
            return;
        }

        this.previousAppState = appState;
        switch (appState) {
            case 'active':
                this.syncMultiTeam();
                this.resyncActiveServer();
                break;
            case 'background':
            case 'inactive':
                break;
        }
    };

    triggerInitialResync() {
        this.syncMultiTeam();
        this.resyncActiveServer();
    }

    private syncMultiTeam = async () => {
        try {
            const credentials = await getAllServerCredentials();

            if (credentials?.length > 0) {
                await syncMultiTeam(credentials[0].token);
            }
        } catch (error) {
            logError('[SessionManager] syncMultiTeam failed', error);
        }
    };

    private resyncActiveServer = async () => {
        try {
            const activeServerUrl = await DatabaseManager.getActiveServerUrl();
            if (activeServerUrl) {
                await this.triggerSync(activeServerUrl);
            }
        } catch (error) {
            logError('[SessionManager] resyncActiveServer failed', error);
        }
    };

    triggerSync = async (serverUrl: string): Promise<Error | undefined> => {
        if (this.syncingUrls.has(serverUrl)) {
            return undefined;
        }
        try {
            this.syncingUrls.add(serverUrl);
            if (this.firstSyncedUrls.has(serverUrl)) {
                await handleReconnect(serverUrl);
            } else {
                const error = await handleFirstConnect(serverUrl);
                if (error) {
                    logError('[SessionManager] handleFirstConnect failed', error);
                    return error;
                }
                this.firstSyncedUrls.add(serverUrl);
            }
        } catch (error: any) {
            logError('[SessionManager] triggerSync failed', error);
            return new Error(String(error));
        } finally {
            this.syncingUrls.delete(serverUrl);
        }
        return undefined;
    };

    private onActiveServerChanged = async ({serverUrl}: {serverUrl: string}) => {
        try {
            if (serverUrl) {
                await this.triggerSync(serverUrl);
            }
        } catch (error) {
            logError('[SessionManager] onActiveServerChanged failed', error);
        }
    };

    private onLogout = async ({serverUrl, removeServer}: LogoutCallbackArg) => {
        if (this.terminatingSessionUrl.has(serverUrl)) {
            return;
        }
        try {
            this.terminatingSessionUrl.add(serverUrl);

            // Remove from synced urls so next login will trigger firstConnect again
            this.firstSyncedUrls.delete(serverUrl);

            const activeServerUrl = await DatabaseManager.getActiveServerUrl();
            const activeServerDisplayName = await DatabaseManager.getActiveServerDisplayName();

            await terminateSession(serverUrl, removeServer);

            if (activeServerUrl === serverUrl) {
                let displayName = '';
                let launchType: LaunchType = Launch.AddServer;
                if (!Object.keys(DatabaseManager.serverDatabases).length) {
                    EphemeralStore.theme = undefined;
                    launchType = Launch.Normal;

                    if (activeServerDisplayName) {
                        displayName = activeServerDisplayName;
                    }
                }

                // set the onboardingViewed value to false so the launch will show the onboarding screen after all servers were removed
                const servers = await getAllServers();
                if (!servers.length) {
                    await storeOnboardingViewedValue(false);
                }

                relaunchApp({launchType, serverUrl, displayName});
            }
        } finally {
            this.terminatingSessionUrl.delete(serverUrl);
        }
    };

    private onNoTeams = async () => {
        try {
            const servers = await getAllServers();
            if (!servers.length) {
                await resetToInfomaniakNoTeams();

            }
        } catch (error) {
            logError('[SessionManager] onNoTeams failed', error);
        }
    };

}

const SessionManager = new SessionManagerSingleton();
export default SessionManager;
