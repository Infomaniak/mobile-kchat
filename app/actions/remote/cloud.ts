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
                ...limits,
                id: 'boards',
            };
            await operator.handleLimit({
                limits: [limitsWithId],
                prepareRecordsOnly: true,
            });
        }
    } catch (error) {
        logDebug('error on fetchCloudLimits', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
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
            const raw = {
                ...usage,
                id: 'usage',
            };
            await operator.handleUsage({
                usage: [raw],
                prepareRecordsOnly: true,
            });
        }
    } catch (error) {
        logDebug('error on fetchUsage', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
    }
};
