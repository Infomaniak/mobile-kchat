// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {logDebug} from '@app/utils/log';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';

// See LICENSE.txt for license information.
// Infomaniak
export const fetchDrafts = async (serverUrl: string, currentTeamId: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        const drafts = await client.getDrafts(currentTeamId);

        const operator = DatabaseManager.serverDatabases[serverUrl]?.operator;
        if (!operator) {
            return;
        }

        await operator.handleDrafts({
            drafts,
            prepareRecordsOnly: false,
            prune: true,
        });
    } catch (error) {
        logDebug('Error retrieving drafts:', error);
    }
};
