// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {syncMultiTeam} from '@actions/remote/entry/ikcommon';
import {getServerCredentials} from '@init/credentials';

export async function handleTeamSyncEvent(serverUrl: string) {
    try {
        const credentials = await getServerCredentials(serverUrl);
        if (credentials) {
            await syncMultiTeam(credentials.token);
        }
    } catch (e) {
        // Do nothing
    }
}
