// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Model} from '@nozbe/watermelondb';
import {field, json} from '@nozbe/watermelondb/decorators';

import {MM_TABLES} from '@app/constants/database';
import {safeParseJSON} from '@app/utils/helpers';

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
}
