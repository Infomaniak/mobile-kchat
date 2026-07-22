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
import EphemeralStore from '@store/ephemeral_store';
import NavigationStore from '@store/navigation_store';
import {logInfo, logWarning} from '@utils/log';
import {withMinDuration} from '@utils/timing';

// Controls whether the main initialization (database, etc...) is done, either on app launch
// or on the Share Extension, for example.
let baseAppInitialized = false;

let serverCredentials: ServerCredential[];

// Fallback Polyfill for Promise.allSettle
Promise.allSettled = Promise.allSettled || (<T>(promises: Array<Promise<T>>) => Promise.all(
    promises.map((p) => p.
        then((value) => ({
            status: 'fulfilled',
            value,
        })).
        catch((reason) => ({
            status: 'rejected',
            reason,
        })),
    ),
));

export async function initialize() {
    if (baseAppInitialized) {
        logInfo('[ExpoRouterBoot] initialize(): skipped, already initialized');
        return;
    }

    logInfo('[ExpoRouterBoot] initialize(): begin');
    baseAppInitialized = true;

    serverCredentials = await getAllServerCredentials();
    logInfo('[ExpoRouterBoot] initialize(): credentials loaded', serverCredentials.length);
    const serverUrls = serverCredentials.map((credential) => credential.serverUrl);

    logInfo('[ExpoRouterBoot] initialize(): DatabaseManager.init begin');
    await DatabaseManager.init(serverUrls);
    logInfo('[ExpoRouterBoot] initialize(): DatabaseManager.init done');
    logInfo('[ExpoRouterBoot] initialize(): NetworkManager.init begin');
    await NetworkManager.init(serverCredentials);
    logInfo('[ExpoRouterBoot] initialize(): NetworkManager.init done');
    logInfo('[ExpoRouterBoot] initialize(): ImageCacheMigration.init begin');
    await ImageCacheMigration.init();
    logInfo('[ExpoRouterBoot] initialize(): ImageCacheMigration.init done');

    GlobalEventHandler.init();
    SessionManager.init();
    logInfo('[ExpoRouterBoot] initialize(): managers initialized');
}

export async function start() {
    logInfo('[ExpoRouterBoot] start(): begin');
    await withMinDuration(async () => {
        NavigationStore.reset();
        EphemeralStore.setCurrentThreadId('');
        EphemeralStore.setProcessingNotification('');

        await initialize();

        logInfo('[ExpoRouterBoot] start(): PushNotifications.init begin');
        PushNotifications.init(serverCredentials.length > 0);
        logInfo('[ExpoRouterBoot] start(): PushNotifications.init done');

        logInfo('[ExpoRouterBoot] start(): WebsocketManager.init begin');
        await WebsocketManager.init(serverCredentials);
        logInfo('[ExpoRouterBoot] start(): WebsocketManager.init done');

    }, 1000); // Ik: min duration for splashscreen

    // Trigger initial data sync for cold start (onAppStateChange won't fire if already active)
    logInfo('[ExpoRouterBoot] start(): triggerInitialResync begin');
    if (typeof SessionManager.triggerInitialResync === 'function') {
        SessionManager.triggerInitialResync();
        logInfo('[ExpoRouterBoot] start(): triggerInitialResync done');
    } else {
        logWarning('[ExpoRouterBoot] start(): triggerInitialResync unavailable, continuing boot');
    }

    if (!__DEV__) {
        // Ik Analytics / Matomo
        matomo.trackAppStart({});
    }

    logInfo('[ExpoRouterBoot] start(): done');
}
