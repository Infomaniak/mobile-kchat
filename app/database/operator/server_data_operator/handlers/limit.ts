// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';
import {logWarning} from '@utils/log';

import {transformLimitRecord} from '../transformers/limit';

import type ServerDataOperatorBase from '.';
import type LimitsModel from '@app/database/models/server/limits';
import type {Limits} from '@typings/components/cloud';
import type {HandleLimitsArgs} from '@typings/database/database';

const {
    LIMIT,
} = MM_TABLES.SERVER;

export interface LimitHandlerMix {
    handleLimit: ({limits, prepareRecordsOnly}: any) => Promise<LimitsModel[]>;
}

const LimitHandler = <TBase extends Constructor<ServerDataOperatorBase>>(superclass: TBase) => class extends superclass {
    handleLimit = async ({limits, prepareRecordsOnly = true}: HandleLimitsArgs): Promise<LimitsModel[]> => {
        if (!limits?.length) {
            logWarning('An empty or undefined "limits" array has been passed to the handleLimit method');
            return [];
        }

        const db = this.database;
        const collection = db.get<LimitsModel>(LIMIT);
        const [existing] = await collection.query(Q.take(1)).fetch();

        // Fetch the first (and only expected) limit record, if it exists
        const newLimit = limits[0];

        if (existing) {
            // Compare the existing record with the incoming one to check for changes
            const hasChanged =
                existing.bots !== newLimit.bots ||
                existing.custom_emojis !== newLimit.custom_emojis ||
                existing.guests !== newLimit.guests ||
                existing.incoming_webhooks !== newLimit.incoming_webhooks ||
                existing.members !== newLimit.members ||
                existing.outgoing_webhooks !== newLimit.outgoing_webhooks ||
                existing.private_channels !== newLimit.private_channels ||
                existing.public_channels !== newLimit.public_channels ||
                existing.sidebar_categories !== newLimit.sidebar_categories ||
                existing.storage !== newLimit.storage ||
                existing.reminder_custom_date !== newLimit.reminder_custom_date ||
                existing.scheduled_draft_custom_date !== newLimit.scheduled_draft_custom_date ||
                existing.files !== newLimit.files ||
                existing.messages !== newLimit.messages ||
                existing.boards !== newLimit.boards ||
                existing.integrations !== newLimit.integrations ||
                existing.teams !== newLimit.teams;

            if (!hasChanged) {
                return [];
            }

            // Update the existing record with the new data (same ID)
            const updated = await this.handleRecords<LimitsModel, Limits>({
                fieldName: 'id',
                transformer: transformLimitRecord,
                prepareRecordsOnly,
                createOrUpdateRawValues: [{
                    ...newLimit,
                    id: existing.id,
                }],
                tableName: LIMIT,
            }, 'handleLimit');

            if (updated.length) {
                await this.batchRecords(updated, 'handleLimit');
            }

            return updated;
        }

        // No existing record: create a new limit record with a fixed ID
        const newRecord = {
            ...newLimit,
            id: 'limits',
        };

        const created = await this.handleRecords<LimitsModel, Limits>({
            fieldName: 'id',
            transformer: transformLimitRecord,
            prepareRecordsOnly,
            createOrUpdateRawValues: [newRecord],
            tableName: LIMIT,
        }, 'handleLimit');

        if (created.length) {
            await this.batchRecords(created, 'handleLimit');
        }

        return created;
    };
};

export default LimitHandler;
