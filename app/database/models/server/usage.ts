// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {field, writer} from '@nozbe/watermelondb/decorators';
import Model from '@nozbe/watermelondb/Model';

import {MM_TABLES} from '@app/constants/database';
const {
    USAGE,
} = MM_TABLES.SERVER;

export default class CloudUsageModel extends Model {
    static table = USAGE;

    @writer async updateUsage(usage: Partial<CloudUsageModel>) {
        await this.update((record) => {
            record.custom_emojis = usage.custom_emojis ?? this.custom_emojis;
            record.guests = usage.guests ?? this.guests;
            record.incoming_webhooks = usage.incoming_webhooks ?? this.incoming_webhooks;
            record.members = usage.members ?? this.members;
            record.outgoing_webhooks = usage.outgoing_webhooks ?? this.outgoing_webhooks;
            record.pending_guests = usage.pending_guests ?? this.pending_guests;
            record.private_channels = usage.private_channels ?? this.private_channels;
            record.public_channels = usage.public_channels ?? this.public_channels;
            record.sidebar_categories = usage.sidebar_categories ?? this.sidebar_categories;
            record.storage = usage.storage ?? this.storage;
        });
    }

    // @writer async createUsage(usage: Partial<CloudUsageModel>) {
    //     const usageRecord = await this.collections.get<CloudUsageModel>(MM_TABLES.SERVER.USAGE).create((record) => {
    //         record._raw.id = 'usage'; // or dynamic id by team
    //         record.custom_emojis = usage.custom_emojis ?? 0;
    //         record.guests = usage.guests ?? 0;
    //         record.incoming_webhooks = usage.incoming_webhooks ?? 0;
    //         record.members = usage.members ?? 0;
    //         record.outgoing_webhooks = usage.outgoing_webhooks ?? 0;
    //         record.pending_guests = usage.pending_guests ?? 0;
    //         record.private_channels = usage.private_channels ?? 0;
    //         record.public_channels = usage.public_channels ?? 0;
    //         record.sidebar_categories = usage.sidebar_categories ?? 0;
    //         record.storage = usage.storage ?? 0;
    //     });
    //     return usageRecord;
    //     console.log('CloudUsageModel.createUsage done');
    // }

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
