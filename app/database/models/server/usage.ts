// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

import {MM_TABLES} from '@app/constants/database';

export default class CloudUsageModel extends Model {
    static table = MM_TABLES.SERVER.USAGE;

    @field('custom_emojis') custom_emojis!: number;
    @field('guests') guests!: number;
    @field('incoming_webhooks') incoming_webhooks!: number;
    @field('members') members!: number;
    @field('outgoing_webhooks') outgoing_webhooks!: number;
    @field('pending_guests') pending_guests!: number;
    @field('private_channels') private_channels!: number;
    @field('public_channels') public_channels!: number;
    @field('sidebar_categories') sidebar_categories!: number;
    @field('storage') storage!: number;
}
