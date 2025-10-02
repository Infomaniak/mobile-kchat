// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {CloudUsageModel, LimitModel} from '@database/models/server';
import type {CloudUsage} from '@typings/components/cloud';

export function useGetUsageDeltas(usage: CloudUsageModel, limits: LimitModel): CloudUsage {
    const usageDelta = () => {
        if (!usage || !limits) {
            return {
                id: '',
                storage: -1073741825, // to avoid showing the banner almost full storage banner when we don't have usage/limits yet
                public_channels: -1,
                private_channels: -1,
                guests: 0,
                pending_guests: 0,
                members: 0,
                custom_emojis: 0,
                incoming_webhooks: 0,
                outgoing_webhooks: 0,
                sidebar_categories: 0,
                scheduled_draft_custom_date: -1,
                reminder_custom_date: -1,
            };
        }

        return (
            {
                id: '',
                storage: usage.storage - limits.storage,
                public_channels: usage.public_channels - limits.public_channels,
                private_channels: usage.private_channels - limits.private_channels,
                guests: usage.guests - limits.guests,
                pending_guests: -usage.pending_guests,
                members: usage.members - limits.members,
                custom_emojis: usage.custom_emojis - limits.custom_emojis,
                incoming_webhooks: usage.incoming_webhooks - limits.incoming_webhooks,
                outgoing_webhooks: usage.outgoing_webhooks - limits.outgoing_webhooks,
                sidebar_categories: usage.sidebar_categories - limits.sidebar_categories,
                scheduled_draft_custom_date: limits.scheduled_draft_custom_date === true ? -1 : 0, // to simplify usage, we threat those are enable or disabled
                reminder_custom_date: limits.reminder_custom_date === true ? -1 : 0, // to simplify usage, we threat those are enable or disabled
            }
        );
    };

    return usageDelta();
}
