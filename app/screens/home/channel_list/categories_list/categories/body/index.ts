// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$, Observable} from 'rxjs';
import {switchMap, combineLatestWith, distinctUntilChanged} from 'rxjs/operators';

import {Preferences} from '@constants';
import {DMS_CATEGORY} from '@constants/categories';
import {querySidebarPreferences} from '@queries/servers/preference';
import {observeCurrentUserId, observeLastUnreadChannelId} from '@queries/servers/system';
import {observeDeactivatedUsers} from '@queries/servers/user';
import {type ChannelWithMyChannel, filterArchivedChannels, filterAutoclosedDMs, filterManuallyClosedDms, getUnreadIds, sortChannels} from '@utils/categories';

import CategoryBody from './category_body';

import type {WithDatabaseArgs} from '@typings/database/database';
import type CategoryModel from '@typings/database/models/servers/category';
import type ChannelModel from '@typings/database/models/servers/channel';
import type MyChannelModel from '@typings/database/models/servers/my_channel';
import type PreferenceModel from '@typings/database/models/servers/preference';

type EnhanceProps = {
    category: CategoryModel;
    locale: string;
    currentUserId: string;
    isTablet: boolean;
    unreadsOnTop: boolean;
    manuallyClosedPrefs$: Observable<PreferenceModel[]>;
    autoclosePrefs$: Observable<PreferenceModel[]>;
    currentChannelId$: Observable<string>;
    notifyPropsByChannelId$: Observable<Record<string, Partial<ChannelNotifyProps>>>;
} & WithDatabaseArgs

const withUserId = withObservables([], ({database}: WithDatabaseArgs) => ({currentUserId: observeCurrentUserId(database)}));

const observeCategoryChannels = (category: CategoryModel, myChannels: Observable<MyChannelModel[]>) => {
    const channels = category.channels.observeWithColumns(['create_at', 'display_name']);
    const manualSort = category.categoryChannelsBySortOrder.observeWithColumns(['sort_order']);
    return myChannels.pipe(
        combineLatestWith(channels, manualSort),
        switchMap(([my, cs, sorted]) => {
            const channelMap = new Map<string, ChannelModel>(cs.map((c) => [c.id, c]));
            const categoryChannelMap = new Map<string, number>(sorted.map((s) => [s.channelId, s.sortOrder]));
            return of$(my.reduce<ChannelWithMyChannel[]>((result, myChannel) => {
                const channel = channelMap.get(myChannel.id);
                if (channel) {
                    const channelWithMyChannel: ChannelWithMyChannel = {
                        channel,
                        myChannel,
                        sortOrder: categoryChannelMap.get(myChannel.id) || 0,
                    };
                    result.push(channelWithMyChannel);
                }

                return result;
            }, []));
        }),
    );
};

const enhanced = withObservables(['unreadsOnTop'], ({category, currentUserId, database, isTablet, locale, unreadsOnTop, manuallyClosedPrefs$, autoclosePrefs$, currentChannelId$, notifyPropsByChannelId$}: EnhanceProps) => {
    const categoryMyChannels = category.myChannels.observeWithColumns(['is_unread']);
    const channelsWithMyChannel = observeCategoryChannels(category, categoryMyChannels);
    const currentChannelId = isTablet ? currentChannelId$ : of$('');
    const lastUnreadId = isTablet ? observeLastUnreadChannelId(database) : of$(undefined);

    let limit = of$(Preferences.CHANNEL_SIDEBAR_LIMIT_DMS_DEFAULT);
    if (category.type === DMS_CATEGORY) {
        limit = querySidebarPreferences(database, Preferences.CHANNEL_SIDEBAR_LIMIT_DMS).
            observeWithColumns(['value']).pipe(
                switchMap((val) => {
                    return val[0] ? of$(parseInt(val[0].value, 10)) : of$(Preferences.CHANNEL_SIDEBAR_LIMIT_DMS_DEFAULT);
                }),
            );
    }

    const categorySorting = category.observe().pipe(
        switchMap((c) => of$(c.sorting)),
        distinctUntilChanged(),
    );

    const deactivated = (category.type === DMS_CATEGORY) ? observeDeactivatedUsers(database) : of$(undefined);
    const sortedChannels = channelsWithMyChannel.pipe(
        combineLatestWith(categorySorting, currentChannelId, lastUnreadId, notifyPropsByChannelId$, manuallyClosedPrefs$, autoclosePrefs$, deactivated, limit),
        switchMap(([cwms, sorting, channelId, unreadId, notifyProps, manuallyClosedDms, autoclose, deactivatedUsers, maxDms]) => {
            let channelsW = cwms;

            channelsW = filterArchivedChannels(channelsW, channelId);
            channelsW = filterAutoclosedDMs(category.type, maxDms, currentUserId, channelId, channelsW, autoclose, notifyProps, deactivatedUsers, unreadId);
            channelsW = filterManuallyClosedDms(channelsW, notifyProps, manuallyClosedDms, currentUserId, unreadId);

            return of$(sortChannels(sorting, channelsW, notifyProps, locale));
        }),
    );

    const unreadIds = channelsWithMyChannel.pipe(
        combineLatestWith(notifyPropsByChannelId$, lastUnreadId),
        switchMap(([cwms, notifyProps, unreadId]) => {
            return of$(getUnreadIds(cwms, notifyProps, unreadId));
        }),
    );

    return {
        category,
        sortedChannels,
        unreadIds,
        unreadsOnTop: of$(unreadsOnTop),
    };
});

export default withDatabase(withUserId(enhanced(CategoryBody)));
