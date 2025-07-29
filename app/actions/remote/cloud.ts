// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Q} from '@nozbe/watermelondb';

import {MM_TABLES} from '@app/constants/database';
import {CloudUsageModel, LimitModel, type LimitModel as LimitModelType} from '@app/database/models/server';
import {getFullErrorMessage} from '@app/utils/errors';
import {logDebug} from '@app/utils/log';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';

import {forceLogoutIfNecessary} from './session';

export const fetchCloudLimits = async (serverUrl: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);

        const limitsFetch = await client.getCloudLimits();
        const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!operator) {
            return;
        }

        const limitsCollection = database.collections.get<LimitModelType>(MM_TABLES.SERVER.LIMIT);
        const [limits] = await limitsCollection.query(
            Q.where('id', 'limits'),
        ).fetch();

        if (limits) {
            await limits.updateLimits(limitsFetch);
        } else {
            await LimitModel.createLimits(limitsCollection, limitsFetch);
        }
    } catch (error) {
        logDebug('error on fetchCloudLimits', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
    }
};

export const fetchUsage = async (serverUrl: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        const usageFetch = await client.getUsage();
        const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!operator) {
            return;
        }

        const usageCollection = database.collections.get<CloudUsageModel>(MM_TABLES.SERVER.USAGE);
        const [usage] = await usageCollection.query(
            Q.where('id', 'usage'),
        ).fetch();

        if (usage) {
            await usage.updateUsage(usageFetch);
        } else {
            await CloudUsageModel.createUsage(usageCollection, usageFetch);
        }
    } catch (error) {
        logDebug('error on fetchUsage', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
    }
};
