// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import CookieManager, {type Cookie} from '@react-native-cookies/cookies';
import {Image} from 'expo-image';
import {AppState, type AppStateStatus, DeviceEventEmitter, Platform} from 'react-native';

import {storeOnboardingViewedValue} from '@actions/app/global';
import {syncMultiTeam, syncServerData} from '@actions/remote/entry/ikcommon';
import {cancelSessionNotification, logout} from '@actions/remote/session';
import {Events, Launch} from '@constants';
import DatabaseManager from '@database/manager';
import {resetMomentLocale} from '@i18n';
import {getAllServerCredentials, removeServerCredentials} from '@init/credentials';
import {relaunchApp} from '@init/launch';
import PushNotifications from '@init/push_notifications';
import NetworkManager from '@managers/network_manager';
import SecurityManager from '@managers/security_manager';
import WebsocketManager from '@managers/websocket_manager';
import {getAllServers, getServerDisplayName} from '@queries/app/servers';
import {getCurrentUser} from '@queries/servers/user';
import {getThemeFromState} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';
import {deleteFileCache, deleteFileCacheByDir} from '@utils/file';
import {isMainActivity} from '@utils/helpers';
import {addNewServer} from '@utils/server';

import type {LaunchType} from '@typings/launch';

type LogoutCallbackArg = {
    serverUrl: string;
    removeServer: boolean;
}

export class SessionManagerSingleton {
    private previousAppState: AppStateStatus;
    private scheduling = false;
    private terminatingSessionUrl = new Set<string>();

    constructor() {
        AppState.addEventListener('change', this.onAppStateChange);

        DeviceEventEmitter.addListener(Events.SERVER_LOGOUT, this.onLogout);
        DeviceEventEmitter.addListener(Events.SESSION_EXPIRED, this.onSessionExpired);

        this.previousAppState = AppState.currentState;
    }

    init() {
        this.cancelAllSessionNotifications();
    }

    private cancelAllSessionNotifications = async () => {
        const serverCredentials = await getAllServerCredentials();
        for (const {serverUrl} of serverCredentials) {
            cancelSessionNotification(serverUrl);
        }
    };

    private clearCookies = async (serverUrl: string, webKit: boolean) => {
        try {
            const cookies = await CookieManager.get(serverUrl, webKit);
            const values = Object.values(cookies);
            values.forEach((cookie: Cookie) => {
                CookieManager.clearByName(serverUrl, cookie.name, webKit);
            });
        } catch (error) {
            // Nothing to clear
        }
    };

    private clearCookiesForServer = async (serverUrl: string) => {
        if (Platform.OS === 'ios') {
            this.clearCookies(serverUrl, false);
            this.clearCookies(serverUrl, true);
        } else if (Platform.OS === 'android') {
            CookieManager.flush();
        }
    };

    private resetLocale = async () => {
        if (Object.keys(DatabaseManager.serverDatabases).length) {
            const serverDatabase = await DatabaseManager.getActiveServerDatabase();
            const user = await getCurrentUser(serverDatabase!);
            resetMomentLocale(user?.locale);
        } else {
            resetMomentLocale();
        }
    };

    private terminateSession = async (serverUrl: string, removeServer: boolean) => {
        cancelSessionNotification(serverUrl);
        await removeServerCredentials(serverUrl);
        PushNotifications.removeServerNotifications(serverUrl);
        SecurityManager.removeServer(serverUrl);

        NetworkManager.invalidateClient(serverUrl);
        WebsocketManager.invalidateClient(serverUrl);

        if (removeServer) {
            await DatabaseManager.destroyServerDatabase(serverUrl);
        } else {
            await DatabaseManager.deleteServerDatabase(serverUrl);
        }

        this.resetLocale();
        this.clearCookiesForServer(serverUrl);
        Image.clearDiskCache();
        deleteFileCache(serverUrl);
        deleteFileCacheByDir('mmPasteInput');
        deleteFileCacheByDir('thumbnails');
        if (Platform.OS === 'android') {
            deleteFileCacheByDir('image_cache');
        }
    };

    private onAppStateChange = async (appState: AppStateStatus) => {
        if (appState === this.previousAppState || !isMainActivity()) {
            return;
        }

        this.previousAppState = appState;
        switch (appState) {
            case 'active':
                // if (!EphemeralStore.isLoggingIn()) {
                //     this.syncServerData();
                //     this.syncMultiTeam();
                // }
                setTimeout(this.cancelAllSessionNotifications, 750);
                break;
            case 'background':
            case 'inactive':
                break;
        }
    };

    private syncServerData = async () => {
        try {
            await syncServerData();
        } catch (error) {
            // do nothing
        }
    };

    private syncMultiTeam = async () => {
        try {
            const credentials = await getAllServerCredentials();

            if (credentials?.length > 0) {
                await syncMultiTeam(credentials[0].token);
            }
        } catch (error) {
            // do nothing
        }
    };

    private onLogout = async ({serverUrl, removeServer}: LogoutCallbackArg) => {
        if (this.terminatingSessionUrl.has(serverUrl)) {
            return;
        }
        const activeServerUrl = await DatabaseManager.getActiveServerUrl();
        const activeServerDisplayName = await DatabaseManager.getActiveServerDisplayName();
        await this.terminateSession(serverUrl, removeServer);

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
    };

    private onSessionExpired = async (serverUrl: string) => {
        this.terminatingSessionUrl.add(serverUrl);

        // logout is not doing anything in this scenario, but we keep it
        // to keep the same flow as other logout scenarios.
        await logout(serverUrl, undefined, {skipServerLogout: true, skipEvents: true});

        await this.terminateSession(serverUrl, false);

        const activeServerUrl = await DatabaseManager.getActiveServerUrl();
        const serverDisplayName = await getServerDisplayName(serverUrl);

        await relaunchApp({launchType: Launch.Normal, serverUrl, displayName: serverDisplayName});
        if (activeServerUrl) {
            addNewServer(getThemeFromState(), serverUrl, serverDisplayName);
        } else {
            EphemeralStore.theme = undefined;
        }
        this.terminatingSessionUrl.delete(serverUrl);
    };
}

const SessionManager = new SessionManagerSingleton();
export default SessionManager;
