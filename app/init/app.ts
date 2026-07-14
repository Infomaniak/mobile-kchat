// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import DatabaseManager from '@database/manager';
import {getAllServerCredentials} from '@init/credentials';
import ImageCacheMigration from '@init/image_cache_migration';
import {initialLaunch} from '@init/launch';
import PushNotifications from '@init/push_notifications';
import GlobalEventHandler from '@managers/global_event_handler';
import {matomo} from '@managers/matomo';
import NetworkManager from '@managers/network_manager';
import SessionManager from '@managers/session_manager';
import WebsocketManager from '@managers/websocket_manager';
import {registerScreens} from '@screens/index';
import {registerNavigationListeners} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';
import NavigationStore from '@store/navigation_store';
import {logInfo} from '@utils/log';
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
    if (!baseAppInitialized) {
        baseAppInitialized = true;

        let stepStart = Date.now();
        serverCredentials = await getAllServerCredentials();
        logInfo('[AppInit] getAllServerCredentials took', Date.now() - stepStart, 'ms');

        const serverUrls = serverCredentials.map((credential) => credential.serverUrl);

        stepStart = Date.now();
        await DatabaseManager.init(serverUrls);
        logInfo('[AppInit] DatabaseManager.init took', Date.now() - stepStart, 'ms');

        stepStart = Date.now();
        await NetworkManager.init(serverCredentials);
        logInfo('[AppInit] NetworkManager.init took', Date.now() - stepStart, 'ms');

        stepStart = Date.now();
        await ImageCacheMigration.init();
        logInfo('[AppInit] ImageCacheMigration.init took', Date.now() - stepStart, 'ms');

        stepStart = Date.now();
        GlobalEventHandler.init();
        logInfo('[AppInit] GlobalEventHandler.init took', Date.now() - stepStart, 'ms');

        stepStart = Date.now();
        SessionManager.init();
        logInfo('[AppInit] SessionManager.init took', Date.now() - stepStart, 'ms');
    }
}

export async function start() {
    const totalStart = Date.now();

    await withMinDuration(async () => {
        NavigationStore.reset();
        EphemeralStore.setCurrentThreadId('');
        EphemeralStore.setProcessingNotification('');

        let stepStart = Date.now();
        await initialize();
        logInfo('[AppInit] initialize() total took', Date.now() - stepStart, 'ms');

        stepStart = Date.now();
        PushNotifications.init(serverCredentials.length > 0);
        logInfo('[AppInit] PushNotifications.init took', Date.now() - stepStart, 'ms');

        stepStart = Date.now();
        registerNavigationListeners();
        registerScreens();
        logInfo('[AppInit] registerNavigationListeners + registerScreens took', Date.now() - stepStart, 'ms');

        stepStart = Date.now();
        await WebsocketManager.init(serverCredentials);
        logInfo('[AppInit] WebsocketManager.init took', Date.now() - stepStart, 'ms');
    }, 1000); // Ik: min duration for splashscreen

    logInfo('[AppInit] TOTAL start() took', Date.now() - totalStart, 'ms');

    if (!__DEV__) {
        // Ik Analytics / Matomo
        matomo.trackAppStart({});
    }

    initialLaunch();

}
