// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// IK change: agents feature not available on our server
// import {checkIsAgentsPluginEnabled} from '@agents/actions/remote/agents_status';
// import {handleAgentsReconnect} from '@agents/actions/websocket/reconnect';

import {markChannelAsViewed} from '@actions/local/channel';
import {dataRetentionCleanup} from '@actions/local/systems';
import {markChannelAsRead} from '@actions/remote/channel';
import {
    entry,
    handleEntryAfterLoadNavigation,
    setExtraSessionProps,
} from '@actions/remote/entry/common';
import {deferredAppEntryActions} from '@actions/remote/entry/deferred';
import {fetchPostsForChannel, fetchPostThread} from '@actions/remote/post';
import {openAllUnreadChannels} from '@actions/remote/preference';
import {autoUpdateTimezone} from '@actions/remote/user';
import {Screens} from '@constants';
import DatabaseManager from '@database/manager';
import AppsManager from '@managers/apps_manager';
import {getActiveServerUrl} from '@queries/app/servers';
import {getLastPostInThread} from '@queries/servers/post';
import {
    getConfig,
    getCurrentChannelId,
    getCurrentTeamId,
    getLicense,
    getLastFullSync,
    setLastFullSync,
} from '@queries/servers/system';
import {getIsCRTEnabled} from '@queries/servers/thread';
import {getCurrentUser} from '@queries/servers/user';
import EphemeralStore from '@store/ephemeral_store';
import NavigationStore from '@store/navigation_store';
import {setTeamLoading} from '@store/team_load_store';
import {isTablet} from '@utils/helpers';
import {logDebug, logError, logInfo} from '@utils/log';
import {captureException, captureMessage} from '@utils/sentry';

import type {Model} from '@nozbe/watermelondb';

const SLOW_RECONNECT_BATCH_THRESHOLD = 5000;

function getModelsByTable(models: Model[]) {
    const counts = models.reduce<Record<string, number>>((acc, model) => {
        acc[model.table] = (acc[model.table] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function captureSlowReconnectBatch(serverUrl: string, groupLabel: BaseRequestGroupLabel | undefined, models: Model[], duration: number) {
    if (duration < SLOW_RECONNECT_BATCH_THRESHOLD) {
        return;
    }

    captureMessage(`Slow websocket reconnect batch: ${JSON.stringify({
        serverUrl,
        groupLabel,
        duration,
        models: models.length,
        tables: getModelsByTable(models),
    })}`);
}

export async function handleFirstConnect(serverUrl: string, groupLabel?: BaseRequestGroupLabel) {
    setExtraSessionProps(serverUrl, groupLabel);
    autoUpdateTimezone(serverUrl, groupLabel);
    return doReconnect(serverUrl, groupLabel);
}

export async function handleReconnect(serverUrl: string, groupLabel: BaseRequestGroupLabel = 'WebSocket Reconnect') {
    return doReconnect(serverUrl, groupLabel);
}

async function doReconnect(serverUrl: string, groupLabel?: BaseRequestGroupLabel) {
    const operator = DatabaseManager.serverDatabases[serverUrl]?.operator;
    if (!operator) {
        const err = new Error(`[doReconnect] cannot find server database for ${serverUrl}`);
        logError(err);
        captureException(err);
        return err;
    }

    const appDatabase = DatabaseManager.appDatabase?.database;
    if (!appDatabase) {
        const err = new Error('[doReconnect] cannot find app database');
        logError(err);
        captureException(err);
        return err;
    }

    const {database} = operator;

    const lastFullSync = await getLastFullSync(database);
    const now = Date.now();

    const currentTeamId = await getCurrentTeamId(database);

    const currentChannelId = await getCurrentChannelId(database);

    logInfo('[doReconnect] setting team loading for', serverUrl);
    setTeamLoading(serverUrl, true);

    try {
        const entryData = await entry(serverUrl, currentTeamId, currentChannelId, lastFullSync, groupLabel);
        if ('error' in entryData) {
            const err = entryData.error instanceof Error ? entryData.error : new Error(String(entryData.error));
            logError('[doReconnect] entry error for', serverUrl, err);
            captureException(err);
            return err;
        }
        const {models, initialTeamId, initialChannelId, prefData, teamData, chData, meData, gmConverted} = entryData;

        await handleEntryAfterLoadNavigation(serverUrl, teamData.memberships || [], chData?.memberships || [], currentTeamId || '', currentChannelId || '', initialTeamId, initialChannelId, gmConverted);

        const dt = Date.now();
        if (models?.length) {
            await operator.batchRecords(models, 'doReconnect');
        }

        const batchDuration = Date.now() - dt;
        captureSlowReconnectBatch(serverUrl, groupLabel, models || [], batchDuration);
        logInfo('WEBSOCKET RECONNECT MODELS BATCHING TOOK', `${batchDuration}ms`);

        await fetchPostDataIfNeeded(serverUrl, groupLabel);

        const {id: currentUserId, locale: currentUserLocale} = (await getCurrentUser(database))!;
        const license = await getLicense(database);
        const config = await getConfig(database);

        await deferredAppEntryActions(serverUrl, lastFullSync, currentUserId, currentUserLocale, prefData.preferences, config, license, teamData, chData, meData, initialTeamId, undefined, groupLabel);

        await setLastFullSync(operator, now);

        openAllUnreadChannels(serverUrl, groupLabel);

        dataRetentionCleanup(serverUrl);

        AppsManager.refreshAppBindings(serverUrl, groupLabel);
    } catch (error) {
        logError('[doReconnect] unexpected error for', serverUrl, error);
        captureException(error);
        return error instanceof Error ? error : new Error(String(error));
    } finally {
        setTeamLoading(serverUrl, false);
    }

    return undefined;
}

async function fetchPostDataIfNeeded(serverUrl: string, groupLabel?: RequestGroupLabel) {
    try {
        const isActiveServer = (await getActiveServerUrl()) === serverUrl;
        if (!isActiveServer) {
            return;
        }

        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const currentChannelId = await getCurrentChannelId(database);
        const isCRTEnabled = await getIsCRTEnabled(database);
        const mountedScreens = NavigationStore.getScreensInStack();
        const isChannelScreenMounted = mountedScreens.includes(Screens.CHANNEL);
        const isThreadScreenMounted = mountedScreens.includes(Screens.THREAD);
        const tabletDevice = isTablet();

        if (isCRTEnabled && isThreadScreenMounted) {
            // Fetch new posts in the thread only when CRT is enabled,
            // for non-CRT fetchPostsForChannel includes posts in the thread
            const rootId = EphemeralStore.getCurrentThreadId();
            if (rootId) {
                const lastPost = await getLastPostInThread(database, rootId);
                if (lastPost) {
                    if (lastPost) {
                        const options: FetchPaginatedThreadOptions = {};
                        options.fromCreateAt = lastPost.createAt;
                        options.fromPost = lastPost.id;
                        options.direction = 'down';
                        await fetchPostThread(serverUrl, rootId, options, false, groupLabel);
                    }
                }
            }
        }

        if (currentChannelId && (isChannelScreenMounted || tabletDevice)) {
            await fetchPostsForChannel(serverUrl, currentChannelId, false, false, groupLabel);
            markChannelAsRead(serverUrl, currentChannelId, false, groupLabel);
            if (!EphemeralStore.wasNotificationTapped()) {
                markChannelAsViewed(serverUrl, currentChannelId, true);
            }
            EphemeralStore.setNotificationTapped(false);
        }
    } catch (error) {
        logDebug('could not fetch needed post after WS reconnect', error);
    }
}
