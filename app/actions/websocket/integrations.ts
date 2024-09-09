// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import IntegrationsManager from '@managers/integrations_manager';
import {getActiveServerUrl} from '@queries/app/servers';

export async function handleOpenDialogEvent(serverUrl: string, msg: WebSocketMessage) {
    const dialog: InteractiveDialogConfig = msg.data?.dialog;
    if (!dialog) {
        return;
    }

    try {
        const currentServer = await getActiveServerUrl();
        if (currentServer === serverUrl) {
            IntegrationsManager.getManager(serverUrl).setDialog(dialog);
        }
    } catch {
        // Do nothing
    }
    
}
