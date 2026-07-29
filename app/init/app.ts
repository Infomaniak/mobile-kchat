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
import {NavigationStore} from '@store/navigation_store';

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
        serverCredentials = await getAllServerCredentials();
        const serverUrls = serverCredentials.map((credential) => credential.serverUrl);
        await DatabaseManager.init(serverUrls);
        await NetworkManager.init(serverCredentials);
        await ImageCacheMigration.init();
        GlobalEventHandler.init();
        SessionManager.init();
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
    GlobalEventHandler.cleanup();
    SessionManager.cleanup();
}
