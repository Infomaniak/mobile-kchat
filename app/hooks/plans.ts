// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useDatabase} from '@nozbe/watermelondb/react';
import {useEffect, useState} from 'react';

import {observeCurrentPackName} from '@app/queries/servers/team';

export type PackName = 'ksuite_essential' | 'ksuite_standard' | 'ksuite_pro' | 'ksuite_entreprise'
export type WcPackName = 'essential' | 'standard' | 'business' | 'entreprise';

const wcPlanMap: Record<PackName, WcPackName> = {
    ksuite_essential: 'essential',
    ksuite_standard: 'standard',
    ksuite_pro: 'business',
    ksuite_entreprise: 'entreprise',
};

const planOrder: PackName[] = [
    'ksuite_essential',
    'ksuite_standard',
    'ksuite_pro',
    'ksuite_entreprise',
];
export function useNextPlan() {
    const database = useDatabase();
    const [packName, setPackName] = useState<PackName | undefined>();

    useEffect(() => {
        const sub = observeCurrentPackName(database).subscribe(setPackName);
        return () => sub.unsubscribe();
    }, [database]);

    return getNextWcPack(packName);
}

const paidPlans = ['ksuite_standard', 'ksuite_entreprise', 'ksuite_pro'];

export const getNextWcPack = (current: PackName | undefined) => {
    const index = current ? planOrder.indexOf(current) : -1;
    const next =
        index >= 0 && index < planOrder.length - 1 ? planOrder[index + 1] : planOrder[0];
    return wcPlanMap[next];
};

export const isPaidPlan = (plan: PackName | undefined): boolean => {
    if (!plan) {
        return false;
    }
    return paidPlans.includes(plan);
};

export const quotaGate = (
    remaining: number | boolean,
    currentPlan: PackName | undefined,
) => {
    const isQuotaExceeded =
        (typeof remaining === 'number' && remaining >= 0) ||
        (typeof remaining === 'boolean' && remaining === false);

    const withQuotaCheck = (cb: () => void) => {
        return () => {
            true;
        };
    };

    return {isQuotaExceeded, withQuotaCheck};
};
