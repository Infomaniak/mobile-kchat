// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import DatabaseManager from '@database/manager';
import {getAllServerCredentials} from '@init/credentials';
import ImageCacheMigration from '@init/image_cache_migration';
import {initialLaunch} from '@init/launch';
import ManagedApp from '@init/managed_app';
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

        serverCredentials = await getAllServerCredentials();
        const serverUrls = serverCredentials.map((credential) => credential.serverUrl);

        await DatabaseManager.init(serverUrls);
        await NetworkManager.init(serverCredentials);
        await ImageCacheMigration.init();

        GlobalEventHandler.init();
        ManagedApp.init();
        SessionManager.init();
    }
}

export async function start() {
    await withMinDuration(async () => {
        NavigationStore.reset();
        EphemeralStore.setCurrentThreadId('');
        EphemeralStore.setProcessingNotification('');

        await initialize();

        PushNotifications.init(serverCredentials.length > 0);

        registerNavigationListeners();
        registerScreens();

        await WebsocketManager.init(serverCredentials);
    }, 1000); // Ik: min duration for splashscreen

    if (!__DEV__) {
        // Ik Analytics / Matomo
        matomo.trackAppStart({});
    }

    initialLaunch();

}
