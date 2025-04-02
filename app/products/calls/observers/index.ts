// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {switchMap, combineLatest, Observable, of as of$} from 'rxjs';

import {General} from '@constants';
import {getUserIdFromChannelName} from '@utils/user';

import type {ChannelModel} from '@database/models/server';

export const observeIsCallsEnabledInChannel = (userId: Observable<string>, channel: Observable<ChannelModel | undefined>) => {
    return combineLatest([userId, channel]).pipe(switchMap(([id, c]) => {
        const teammateId = (c?.type === General.DM_CHANNEL) ? getUserIdFromChannelName(id, c?.name) : undefined;
        const isOwnDirectMessage = (c?.type === General.DM_CHANNEL) && id === teammateId;
        return of$(!isOwnDirectMessage);
    }));
};
