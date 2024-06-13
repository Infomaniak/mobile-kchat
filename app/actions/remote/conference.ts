// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {handleConferenceReceived} from '@actions/websocket/conference';
import {getFullErrorMessage} from '@app/utils/errors';
import {logDebug} from '@app/utils/log';
import NetworkManager from '@managers/network_manager';

import {forceLogoutIfNecessary} from './session';

export const fetchConference = async (serverUrl: string, conferenceId: string, fetchOnly = false) => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        const conference = await client.getCall(conferenceId);

        if (!fetchOnly) {
            // Update the local DB
            handleConferenceReceived(serverUrl, conference);
        }

        return {conference};
    } catch (error) {
        logDebug('error on fetchConference', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
        return {error};
    }
};
