// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Model} from '@nozbe/watermelondb';
import {field, json, writer} from '@nozbe/watermelondb/decorators';

import {MM_TABLES} from '@constants/database';
import {safeParseJSON} from '@utils/helpers';

export default class LimitsModel extends Model {
    static table = MM_TABLES.SERVER.LIMIT;
    @json('boards', safeParseJSON) boards!: BoardsLimitProps;
    @field('bots') bots!: number;
    @field('custom_emojis') custom_emojis!: number;
    @json('files', safeParseJSON) files!: FilesLimitProps;
    @field('guests') guests!: number;
    @field('incoming_webhooks') incoming_webhooks!: number;
    @json('integrations', safeParseJSON) integrations!: IntegrationsLimitProps;
    @field('members') members!: number;
    @json('messages', safeParseJSON) messages!: MessagesLimitProps;
    @field('outgoing_webhooks') outgoing_webhooks!: number;
    @field('private_channels') private_channels!: number;
    @field('public_channels') public_channels!: number;
    @field('reminder_custom_date') reminder_custom_date!: boolean;
    @field('scheduled_draft_custom_date') scheduled_draft_custom_date!: boolean;
    @field('sidebar_categories') sidebar_categories!: number;
    @field('storage') storage!: number;
    @json('teams', safeParseJSON) teams!: TeamsLimitProps;

    @writer async updateLimits(usage: Partial<LimitsModel>) {
        await this.update((record) => {
            record.boards = usage.boards ?? this.boards;
            record.bots = usage.bots ?? this.bots;
            record.custom_emojis = usage.custom_emojis ?? this.custom_emojis;
            record.guests = usage.guests ?? this.guests;
            record.incoming_webhooks = usage.incoming_webhooks ?? this.incoming_webhooks;
            record.integrations = usage.integrations ?? this.integrations;
            record.members = usage.members ?? this.members;
            record.messages = usage.messages ?? this.messages;
            record.outgoing_webhooks = usage.outgoing_webhooks ?? this.outgoing_webhooks;
            record.private_channels = usage.private_channels ?? this.private_channels;
            record.public_channels = usage.public_channels ?? this.public_channels;
            record.reminder_custom_date = usage.reminder_custom_date ?? this.reminder_custom_date;
            record.scheduled_draft_custom_date = usage.scheduled_draft_custom_date ?? this.scheduled_draft_custom_date;
            record.sidebar_categories = usage.sidebar_categories ?? this.sidebar_categories;
            record.storage = usage.storage ?? this.storage;
        });
    }
}
