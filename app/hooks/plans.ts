// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

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

const quotaMessages = new Map<string, string>([
    ['admin|paid', 'file_upload.quota.exceeded.paidPlan.admin'],
    ['admin|free', 'file_upload.quota.exceeded.admin'],
    ['user|_', 'file_upload.quota.exceeded'],
]);

export const getQuotaDescription = (currentPackName: PackName | undefined, isAdmin: boolean) => {
    const isPaid = isPaidPlan(currentPackName);

    let role = 'user';
    let plan = '_';

    if (isAdmin) {
        role = 'admin';
        plan = isPaid ? 'paid' : 'free';
    }

    return quotaMessages.get(`${role}|${plan}`) ?? '';
};

const paidPlans = ['ksuite_standard', 'ksuite_entreprise', 'ksuite_pro'];

export const getNextWcPack = (current: PackName | undefined) => {
    const index = current ? planOrder.indexOf(current) : -1;
    const next =
        index >= 0 && index < planOrder.length - 1 ? planOrder[index + 1] : planOrder[0];
    return wcPlanMap[next];
};

const isPaidPlan = (plan: PackName | undefined): boolean => {
    if (!plan) {
        return false;
    }
    return paidPlans.includes(plan);
};

export const quotaGate = (
    remaining: number | boolean,
) => {
    const isQuotaExceeded =
        (typeof remaining === 'number' && remaining >= 0) ||
        (typeof remaining === 'boolean' && remaining === false);

    return {isQuotaExceeded};
};
