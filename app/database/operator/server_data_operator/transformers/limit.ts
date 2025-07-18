// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {MM_TABLES} from '@constants/database';
import {prepareBaseRecord} from '@database/operator/server_data_operator/transformers/index';

import type LimitsModel from '@app/database/models/server/limits';
import type {Limits} from '@typings/components/cloud';
import type {TransformerArgs} from '@typings/database/database';

const {LIMIT} = MM_TABLES.SERVER;

export const transformLimitRecord = ({action, database, value}: TransformerArgs): Promise<LimitsModel> => {
    const raw = value.raw as Limits;

    const fieldsMapper = (limits: LimitsModel) => {
        limits.boards = raw.boards;
        limits.bots = raw.bots;
        limits.custom_emojis = raw.custom_emojis;
        limits.files = raw.files;
        limits.guests = raw.guests;
        limits.incoming_webhooks = raw.incoming_webhooks;
        limits.integrations = raw.integrations;
        limits.members = raw.members;
        limits.messages = raw.messages;
        limits.outgoing_webhooks = raw.outgoing_webhooks;
        limits.private_channels = raw.private_channels;
        limits.public_channels = raw.public_channels;
        limits.reminder_custom_date = raw.reminder_custom_date;
        limits.scheduled_draft_custom_date = raw.scheduled_draft_custom_date;
        limits.sidebar_categories = raw.sidebar_categories;
        limits.storage = raw.storage;
        limits.teams = raw.teams;
    };

    return prepareBaseRecord({
        action,
        database,
        tableName: LIMIT,
        value,
        fieldsMapper,
    }) as Promise<LimitsModel>;
};
