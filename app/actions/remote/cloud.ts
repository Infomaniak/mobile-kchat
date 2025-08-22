// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Q} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';
import DatabaseManager from '@database/manager';
import {CloudUsageModel, LimitModel, type LimitModel as LimitModelType} from '@database/models/server';
import NetworkManager from '@managers/network_manager';
import {getFullErrorMessage} from '@utils/errors';
import {logDebug} from '@utils/log';

import {forceLogoutIfNecessary} from './session';

export const fetchCloudLimits = async (serverUrl: string, teamId?: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);

        const limitsFetch = await client.getCloudLimits();
        const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!operator || !teamId) {
            return;
        }

        const limitsCollection = database.collections.get<LimitModelType>(MM_TABLES.SERVER.LIMIT);
        const [limits] = await limitsCollection.query(
            Q.where('id', teamId),
        ).fetch();

        if (limits) {
            await limits.updateLimits(limitsFetch);
        } else {
            await database.write(async () => {
                await database.get<LimitModel>(MM_TABLES.SERVER.LIMIT).create((record) => {
                    record._raw.id = teamId;
                    record.boards = limitsFetch.boards ?? {cards: 0, views: 0};
                    record.bots = limitsFetch.bots ?? 0;
                    record.custom_emojis = limitsFetch.custom_emojis ?? 0;
                    record.guests = limitsFetch.guests ?? 0;
                    record.incoming_webhooks = limitsFetch.incoming_webhooks ?? 0;
                    record.integrations = limitsFetch.integrations ?? {enabled: 0};
                    record.members = limitsFetch.members ?? 0;
                    record.messages = limitsFetch.messages ?? {history: 0};
                    record.outgoing_webhooks = limitsFetch.outgoing_webhooks ?? 0;
                    record.private_channels = limitsFetch.private_channels ?? 0;
                    record.public_channels = limitsFetch.public_channels ?? 0;
                    record.reminder_custom_date = limitsFetch.reminder_custom_date ?? false;
                    record.scheduled_draft_custom_date = limitsFetch.scheduled_draft_custom_date ?? false;
                    record.sidebar_categories = limitsFetch.sidebar_categories ?? 0;
                    record.storage = limitsFetch.storage ?? 0;
                });
            });
        }
    } catch (error) {
        logDebug('error on fetchCloudLimits', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
    }
};

export const fetchUsage = async (serverUrl: string, teamId?: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        const usageFetch = await client.getUsage();
        const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!operator || !teamId) {
            return;
        }

        const usageCollection = database.collections.get<CloudUsageModel>(MM_TABLES.SERVER.USAGE);
        const [usage] = await usageCollection.query(
            Q.where('id', teamId),
        ).fetch();

        if (usage) {
            await usage.updateUsage(usageFetch);
        } else {
            await database.write(async () => {
                await database.get<CloudUsageModel>(MM_TABLES.SERVER.USAGE).create((record) => {
                    record._raw.id = teamId;
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
