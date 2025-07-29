// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Q} from '@nozbe/watermelondb';

import {MM_TABLES} from '@app/constants/database';
import {getFullErrorMessage} from '@app/utils/errors';
import {logDebug} from '@app/utils/log';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';

import {forceLogoutIfNecessary} from './session';

import type {CloudUsageModel, LimitModel} from '@app/database/models/server';

export const fetchCloudLimits = async (serverUrl: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);

        const limitsFetch = await client.getCloudLimits();
        const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!operator) {
            return;
        }

        const limitsCollection = database.collections.get<LimitModel>(MM_TABLES.SERVER.LIMIT);
        const [limits] = await limitsCollection.query(Q.take(1)).fetch();

        if (limits) {
            await limits.updateLimits(limitsFetch);
        } else {
            await database.write(async () => {
                await database.get<LimitModel>(MM_TABLES.SERVER.LIMIT).create((record) => {
                    record.boards = limitsFetch.boards ?? {max: 0, warning: 0};
                    record.bots = limitsFetch.bots ?? 0;
                    record.custom_emojis = limitsFetch.custom_emojis ?? 0;
                    record.guests = limitsFetch.guests ?? 0;
                    record.incoming_webhooks = limitsFetch.incoming_webhooks ?? 0;
                    record.integrations = limitsFetch.integrations ?? {max: 0, warning: 0};
                    record.members = limitsFetch.members ?? 0;
                    record.messages = limitsFetch.messages ?? {max: 0, warning: 0};
                    record.outgoing_webhooks = limitsFetch.outgoing_webhooks ?? 0;
                    record.private_channels = limitsFetch.private_channels ?? 0;
                    record.public_channels = limitsFetch.public_channels ?? 0;
                    record.reminder_custom_date = limitsFetch.reminder_custom_date ?? false;
                    record.scheduled_draft_custom_date = limitsFetch.scheduled_draft_custom_date ?? false;
                    record.sidebar_categories = limitsFetch.sidebar_categories ?? 0;
                    record.storage = limitsFetch.storage ?? 0;
                    record._raw.id = 'limits';
                });
            });
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
        const [usage] = await usageCollection.query(Q.take(1)).fetch();

        if (usage) {
            await usage.updateUsage(usageFetch);
        } else {
            await database.write(async () => {
                await database.get<CloudUsageModel>(MM_TABLES.SERVER.USAGE).create((record) => {
                    record._raw.id = 'usage';
                    record.custom_emojis = usageFetch.custom_emojis ?? 0;
                    record.guests = usageFetch.guests ?? 0;
                    record.incoming_webhooks = usageFetch.incoming_webhooks ?? 0;
                    record.members = usageFetch.members ?? 0;
                    record.outgoing_webhooks = usageFetch.outgoing_webhooks ?? 0;
                    record.pending_guests = usageFetch.pending_guests ?? 0;
                    record.private_channels = usageFetch.private_channels ?? 0;
                    record.public_channels = usageFetch.public_channels ?? 0;
                    record.sidebar_categories = usageFetch.sidebar_categories ?? 0;
                    record.storage = usageFetch.storage ?? 0;
                });
            });
        }
    } catch (error) {
        logDebug('error on fetchUsage', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
    }
};
