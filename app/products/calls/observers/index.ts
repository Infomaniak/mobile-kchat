// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {distinctUntilChanged, switchMap, combineLatest, Observable, of as of$} from 'rxjs';

import {observeCallsConfig, observeCallsState} from '@calls/state';
import {License} from '@constants';
import {observeLicense} from '@queries/servers/system';

import type {Database} from '@nozbe/watermelondb';

export type LimitRestrictedInfo = {
    limitRestricted: boolean;
    maxParticipants: number;
    isCloudStarter: boolean;
}

export const observeIsCallsEnabledInChannel = () => {
    return of$(true);
};

export const observeIsCallLimitRestricted = (database: Database, serverUrl: string, channelId: string) => {
    const maxParticipants = observeCallsConfig(serverUrl).pipe(
        switchMap((c) => of$(c.MaxCallParticipants)),
        distinctUntilChanged(),
    );
    const callNumOfParticipants = observeCallsState(serverUrl).pipe(
        switchMap((cs) => of$(Object.keys(cs.calls[channelId]?.participants || {}).length)),
        distinctUntilChanged(),
    );
    const isCloud = observeLicense(database).pipe(
        switchMap((l) => of$(l?.Cloud === 'true')),
        distinctUntilChanged(),
    );
    const skuShortName = observeCallsConfig(serverUrl).pipe(
        switchMap((c) => of$(c.sku_short_name)),
        distinctUntilChanged(),
    );
    return combineLatest([maxParticipants, callNumOfParticipants, isCloud, skuShortName]).pipe(
        switchMap(([max, numParticipants, cloud, sku]) => of$({
            limitRestricted: max !== 0 && numParticipants >= max,
            maxParticipants: max,
            isCloudStarter: cloud && sku === License.SKU_SHORT_NAME.Starter,
        })),
        distinctUntilChanged((prev, curr) =>
            prev.limitRestricted === curr.limitRestricted && prev.maxParticipants === curr.maxParticipants && prev.isCloudStarter === curr.isCloudStarter),
    ) as Observable<LimitRestrictedInfo>;
};
