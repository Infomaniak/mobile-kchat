// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useEffect, useMemo, useState} from 'react';

import {fetchCloudLimits, fetchUsage} from '@actions/remote/cloud';
import {useServerUrl} from '@app/context/server';

import {useGetLimits} from './limits';

export function useGetUsage(): any {
    // const isLoggedIn = useIsLoggedIn();
    // const cloudLimits = useSelector(getCloudLimits);

    // const cloudLimitsReceived = useSelector(getCloudLimitsLoaded);
    // const dispatch = useDispatch();
    const [usage, setUsage] = useState(undefined);
    const serverUrl = useServerUrl();
    useEffect(() => {
        let isMounted = true;
        (async () => {
            const result = await fetchUsage(serverUrl);
            if (isMounted) {
                setUsage(result);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [serverUrl]);
    console.log('🚀 ~ uudage', usage);

    return usage;

    // const result: [Limits, boolean] = useMemo(() => {
    //     return [cloudLimits, cloudLimitsReceived];
    // }, [cloudLimits, cloudLimitsReceived]);
    // return result;
}

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

export function useGetUsageDeltas(): any {
    const usage = useGetUsage();
    const [limits, limitsLoaded] = useGetLimits();

    console.log('je passe');

    const usageDelta = useMemo(() => {
        if (!usage) {
            return {usageLoaded: false};
        }
        return (
            {
                storage: usage.storage - withBackupValue(limits.storage, limitsLoaded),
                public_channels: usage.public_channels - withBackupValue(limits.public_channels, limitsLoaded),
                private_channels: usage.private_channels - withBackupValue(limits.private_channels, limitsLoaded),
                guests: usage.guests - withBackupValue(limits.guests, limitsLoaded),
                pending_guests: -usage.pending_guests,
                members: usage.members - withBackupValue(limits.members, limitsLoaded),
                usageLoaded: usage.usageLoaded,

                // files: {
                //     totalStorage: usage.files.totalStorage - withBackupValue(limits.files?.total_storage, limitsLoaded),
                //     totalStorageLoaded: usage.files.totalStorageLoaded,
                // },
                // messages: {
                //     history: usage.messages.history - withBackupValue(limits.messages?.history, limitsLoaded),
                //     historyLoaded: usage.messages.historyLoaded,
                // },
                // teams: {
                //     active: usage.teams.active - withBackupValue(limits.teams?.active, limitsLoaded),

                //     // cloudArchived doesn't count against usage, but we pass the value along for convenience
                //     cloudArchived: usage.teams.cloudArchived,
                //     teamsLoaded: usage.teams.teamsLoaded,
                // },
                custom_emojis: usage.custom_emojis - withBackupValue(limits.custom_emojis, limitsLoaded),
                incoming_webhooks: usage.incoming_webhooks - withBackupValue(limits.incoming_webhooks, limitsLoaded),
                outgoing_webhooks: usage.outgoing_webhooks - withBackupValue(limits.outgoing_webhooks, limitsLoaded),
                sidebar_categories: usage.sidebar_categories - withBackupValue(limits.sidebar_categories, limitsLoaded),
                scheduled_draft_custom_date: limits.scheduled_draft_custom_date === true ? -1 : 0, // to simplify usage, we threat those are enable or disabled
                reminder_custom_date: limits.reminder_custom_date === true ? -1 : 0, // to simplify usage, we threat those are enable or disabled
            }
        );
    }, [usage, limits, limitsLoaded]);

    return usageDelta;
}
