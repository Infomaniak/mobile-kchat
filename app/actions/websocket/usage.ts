// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchUsage} from '@actions/remote/cloud';
import DatabaseManager from '@database/manager';
import {getCurrentTeamId} from '@queries/servers/system';

export async function handleLimitationChanged(serverUrl: string) {
    const activeServerUrl = await DatabaseManager.getActiveServerUrl();
    if (!activeServerUrl) {
        throw new Error('No active server URL found');
    }
    const operator = DatabaseManager.serverDatabases[activeServerUrl]?.operator;
    if (!operator) {
        throw new Error('Cannot find server database');
    }
    const {database} = operator;

    const currentTeamId = await getCurrentTeamId(database);

    await fetchUsage(serverUrl, currentTeamId);
}
