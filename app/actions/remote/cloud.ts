// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {getFullErrorMessage} from '@app/utils/errors';
import {logDebug} from '@app/utils/log';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';

import {forceLogoutIfNecessary} from './session';

export const fetchCloudLimits = async (serverUrl: string, fetchOnly = false) => {
    try {
        const client = NetworkManager.getClient(serverUrl);

        const limits = await client.getCloudLimits();
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!operator) {
            return;
        }

        if (!fetchOnly && limits) {
            const limitsWithId = {
                id: 'boards',
                ...limits,
            };
            await operator.handleLimit({
                limits: [limitsWithId],
                prepareRecordsOnly: false,
            });
        }

        return limits;
    } catch (error) {
        logDebug('error on fetchCloudLimits', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
        return {error};
    }
};

export const fetchUsage = async (serverUrl: string, fetchOnly = false) => {
    try {
        const client = NetworkManager.getClient(serverUrl);

        const usage = await client.getUsage();
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!operator) {
            return;
        }
        if (!fetchOnly && usage) {
            const usageWithId = {
                id: 'guests',
                ...usage,
            };
            await operator.handleUsage({
                usage: [usageWithId],
                prepareRecordsOnly: false,
            });
        }

        return usage;
    } catch (error) {
        logDebug('error on fetchUsage', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
        return {error};
    }
};
