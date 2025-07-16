// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import NetworkManager from '@managers/network_manager';

export const fetchCloudLimits = async (serverUrl: string, fetchOnly = false) => {
    try {
        const client = NetworkManager.getClient(serverUrl);

        const limits = await client.getCloudLimits();

        // if (!fetchOnly && limits.length) {
        //     await operator.handleUsers({
        //         limits,
        //         prepareRecordsOnly: false,
        //     });
        // }

        return limits;
    } catch (error) {
        // logDebug('error on fetchUsersByIds', getFullErrorMessage(error));
        // forceLogoutIfNecessary(serverUrl, error);
        return {error};
    }
};

export const fetchUsage = async (serverUrl: string, fetchOnly = false) => {
    try {
        const client = NetworkManager.getClient(serverUrl);

        const limits = await client.getUsage();

        // if (!fetchOnly && limits.length) {
        //     await operator.handleUsers({
        //         limits,
        //         prepareRecordsOnly: false,
        //     });
        // }

        return limits;
    } catch (error) {
        // logDebug('error on fetchUsersByIds', getFullErrorMessage(error));
        // forceLogoutIfNecessary(serverUrl, error);
        return {error};
    }
};
