// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q, type Database} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';
import {logWarning} from '@utils/log';

import {transformUsageRecord} from '../transformers/usage';

import type ServerDataOperatorBase from '.';
import type CloudUsageModel from '@app/database/models/server/usage';
import type {CloudUsage} from '@typings/components/cloud';
import type {HandleUsageArgs} from '@typings/database/database';

const {
    USAGE,
} = MM_TABLES.SERVER;

export interface UsageHandlerMix {
    handleUsage: ({usage, prepareRecordsOnly}: any) => Promise<CloudUsageModel[]>;
}

const UsageHandler = <TBase extends Constructor<ServerDataOperatorBase>>(superclass: TBase) => class extends superclass {
    handleUsage = async ({usage, prepareRecordsOnly = true}: HandleUsageArgs): Promise<CloudUsageModel[]> => {
        if (!usage?.length) {
            logWarning('Empty usage array passed to handleUsage');
            return [];
        }

        const db: Database = this.database;
        const collection = db.get<CloudUsageModel>(USAGE);

        // Fetch the first (and only expected) usage record, if it exists
        const [existing] = await collection.query(Q.take(1)).fetch();

        const usageEntry = usage[0];

        if (existing) {
            // Compare the existing record with the incoming one to check for changes
            const hasChanged =
                existing.custom_emojis !== usageEntry.custom_emojis ||
                existing.guests !== usageEntry.guests ||
                existing.incoming_webhooks !== usageEntry.incoming_webhooks ||
                existing.members !== usageEntry.members ||
                existing.outgoing_webhooks !== usageEntry.outgoing_webhooks ||
                existing.pending_guests !== usageEntry.pending_guests ||
                existing.private_channels !== usageEntry.private_channels ||
                existing.public_channels !== usageEntry.public_channels ||
                existing.sidebar_categories !== usageEntry.sidebar_categories ||
                existing.storage !== usageEntry.storage;

            // If nothing has changed, skip update
            if (!hasChanged) {
                return [];
            }

            // Update the existing record with the new data (same ID)
            const updated = await this.handleRecords<CloudUsageModel, CloudUsage>({
                fieldName: 'id',
                transformer: transformUsageRecord,
                prepareRecordsOnly,
                createOrUpdateRawValues: [{
                    ...usageEntry,
                    id: existing.id,
                }],
                tableName: USAGE,
            }, 'handleUsage');

            if (updated.length) {
                await this.batchRecords(updated, 'handleUsage');
            }

            return updated;
        }

        // No existing record: create a new usage record with a fixed ID
        const newUsage = {
            ...usageEntry,
            id: 'usage',
        };

        const created = await this.handleRecords<CloudUsageModel, CloudUsage>({
            fieldName: 'id',
            transformer: transformUsageRecord,
            prepareRecordsOnly,
            createOrUpdateRawValues: [newUsage],
            tableName: USAGE,
        }, 'handleUsage');

        if (created.length) {
            await this.batchRecords(created, 'handleUsage');
        }

        return created;
    };
};

export default UsageHandler;
