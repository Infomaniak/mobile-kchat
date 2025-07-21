// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {MM_TABLES} from '@constants/database';
import {prepareBaseRecord} from '@database/operator/server_data_operator/transformers/index';

import type {CloudUsageModel} from '@app/database/models/server';
import type {CloudUsage} from '@typings/components/cloud';
import type {TransformerArgs} from '@typings/database/database';

const {USAGE} = MM_TABLES.SERVER;

export const transformUsageRecord = ({action, database, value}: TransformerArgs): Promise<CloudUsageModel> => {
    const raw = value.raw as CloudUsage;

    const fieldsMapper = (usage: CloudUsageModel) => {
        usage.custom_emojis = raw.custom_emojis;
        usage.guests = raw.guests;
        usage.incoming_webhooks = raw.incoming_webhooks;
        usage.members = raw.members;
        usage.outgoing_webhooks = raw.outgoing_webhooks;
        usage.pending_guests = raw.pending_guests;
        usage.private_channels = raw.private_channels;
        usage.public_channels = raw.public_channels;
        usage.sidebar_categories = raw.sidebar_categories;
        usage.storage = raw.storage;
    };

    return prepareBaseRecord({
        action,
        database,
        tableName: USAGE,
        value,
        fieldsMapper,
    }) as Promise<CloudUsageModel>;
};
