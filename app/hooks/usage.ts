// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {CloudUsageModel, LimitModel} from '@database/models/server';
import type {CloudUsage} from '@typings/components/cloud';

// Returns an object of type CloudUsage with the values being the delta between the limit, and the actual usage of this installation.
// A value < 0 means that they are NOT over the limit. A value > 0 means they've exceeded that limit
// 2 teams used, minus 1 team limit = value > 0, limit exceeded
// 10MB files used, minus 1000MB limit = value < 0, limit not exceeded.
// etc.
// withBackupValue will set the limit arbitrarily high in the event that the limit isn't set
export const withBackupValue = (maybeLimit: number | undefined, limitsLoaded: boolean) => {
    if (!limitsLoaded) {
        return Number.MAX_VALUE;
    }

    if (maybeLimit === -1 || maybeLimit === undefined) { // IK: backend can send -1 as unlimited instead of undefined
        return Number.MAX_VALUE;
    }

    return maybeLimit;
};

export function useGetUsageDeltas(usage: CloudUsageModel, limits: LimitModel): CloudUsage {
    const usageDelta = () => {
        const limitsLoaded = true;
        if (!usage || !limits) {
            return {
                id: '',
                storage: -1073741825, // to avoid showing the banner almost full storage banner when we don't have usage/limits yet
                public_channels: 0,
                private_channels: 0,
                guests: 0,
                pending_guests: 0,
                members: 0,
                custom_emojis: 0,
                incoming_webhooks: 0,
                outgoing_webhooks: 0,
                sidebar_categories: 0,
                scheduled_draft_custom_date: 0,
                reminder_custom_date: 0,
            };
        }
        return (
            {
                id: '',
                storage: usage.storage - withBackupValue(limits.storage, limitsLoaded),
                public_channels: usage.public_channels - withBackupValue(limits.public_channels, limitsLoaded),
                private_channels: usage.private_channels - withBackupValue(limits.private_channels, limitsLoaded),
                guests: usage.guests - withBackupValue(limits.guests, limitsLoaded),
                pending_guests: -usage.pending_guests,
                members: usage.members - withBackupValue(limits.members, limitsLoaded),
                custom_emojis: usage.custom_emojis - withBackupValue(limits.custom_emojis, limitsLoaded),
                incoming_webhooks: usage.incoming_webhooks - withBackupValue(limits.incoming_webhooks, limitsLoaded),
                outgoing_webhooks: usage.outgoing_webhooks - withBackupValue(limits.outgoing_webhooks, limitsLoaded),
                sidebar_categories: usage.sidebar_categories - withBackupValue(limits.sidebar_categories, limitsLoaded),
                scheduled_draft_custom_date: limits.scheduled_draft_custom_date === true ? -1 : 0, // to simplify usage, we threat those are enable or disabled
                reminder_custom_date: limits.reminder_custom_date === true ? -1 : 0, // to simplify usage, we threat those are enable or disabled
            }
        );
    };

    return usageDelta();
}
