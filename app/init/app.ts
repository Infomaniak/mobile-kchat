// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import DatabaseManager from '@database/manager';
import {getAllServerCredentials} from '@init/credentials';
import ImageCacheMigration from '@init/image_cache_migration';
import PushNotifications from '@init/push_notifications';
import GlobalEventHandler from '@managers/global_event_handler';
import {matomo} from '@managers/matomo';
import NetworkManager from '@managers/network_manager';
import SessionManager from '@managers/session_manager';
import WebsocketManager from '@managers/websocket_manager';
import {queryAllActiveServers} from '@queries/app/servers';
import EphemeralStore from '@store/ephemeral_store';
import {NavigationStore} from '@store/navigation_store';
import {logDebug} from '@utils/log';

let baseAppInitialized = false;
let serverCredentials: ServerCredential[] = [];

Promise.allSettled = Promise.allSettled || (<T>(promises: Array<Promise<T>>) => Promise.all(
    promises.map((p) => p.
        then((value) => ({status: 'fulfilled', value})).
        catch((reason) => ({status: 'rejected', reason})),
    ),
));

export async function initialize() {
    if (!baseAppInitialized) {
        baseAppInitialized = true;
        const start = Date.now();

        try {
            await DatabaseManager.initAppDatabase();

            // Open the app DB first and decrypt credentials only for known server URLs so logged-in
            // launches no longer enumerate every generic-password service (upstream #10056).
            const tDb = Date.now();
            const activeUrls = (await queryAllActiveServers()?.fetch() ?? []).map((s) => s.url);
            serverCredentials = await getAllServerCredentials(activeUrls);
            logDebug('[Perf] initialize credentials+activeServers', `${Date.now() - tDb}ms`, `${serverCredentials.length} servers`);

            const tServers = Date.now();
            await DatabaseManager.initServerDatabases(serverCredentials.map((c) => c.serverUrl));
            logDebug('[Perf] initialize serverDatabases', `${Date.now() - tServers}ms`);

            const tNetwork = Date.now();
            await NetworkManager.init(serverCredentials);
            logDebug('[Perf] initialize networkManager', `${Date.now() - tNetwork}ms`);

            await ImageCacheMigration.init();
            GlobalEventHandler.init();
            SessionManager.init();
        } catch (error) {
            baseAppInitialized = false;
            throw error;
        }

        logDebug('[Perf] initialize base init', `${Date.now() - start}ms`);
    }

    NavigationStore.reset();
    EphemeralStore.setCurrentThreadId('');
    EphemeralStore.setProcessingNotification('');

    PushNotifications.init(serverCredentials.length > 0);
    await WebsocketManager.init(serverCredentials);

    if (!__DEV__) {
        matomo.trackAppStart({});
    }
}

export function cleanup() {
    // Managers don't have cleanup methods yet
}
