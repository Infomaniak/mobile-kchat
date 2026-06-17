/* eslint-disable max-nested-callbacks */
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$, Observable} from 'rxjs';
import {auditTime, combineLatestWith, distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators';

import {Preferences} from '@constants';
import {DMS_CATEGORY} from '@constants/categories';
import {getSidebarPreferenceAsBool} from '@helpers/api/preference';
import {queryPreferencesByCategoryAndName, querySidebarPreferences} from '@queries/servers/preference';
import {observeCurrentChannelId, observeCurrentUserId, observeLastUnreadChannelId} from '@queries/servers/system';
import {observeDeactivatedUsers} from '@queries/servers/user';
import {
    type ChannelWithMyChannel,
    filterArchivedChannels,
    filterAutoclosedDMs,
    filterManuallyClosedDms,
    getUnreadIds,
    sortChannelsWithMyChannel,
} from '@utils/categories';

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
    notifyPropsPerChannel: Record<string, Partial<ChannelNotifyProps>>;
} & WithDatabaseArgs

type ChannelState = {
    isMuted: boolean;
    isUnread: boolean;
    mentionsCount: number;
};

const withUserId = withObservables([], ({database}: WithDatabaseArgs) => ({currentUserId: observeCurrentUserId(database)}));

const observeCategoryChannels = (category: CategoryModel, myChannels: Observable<MyChannelModel[]>) => {
    const channels = category.channels.observeWithColumns(['create_at', 'delete_at', 'display_name', 'name', 'shared', 'team_id', 'type']);
    const manualSort = category.categoryChannelsBySortOrder.observeWithColumns(['sort_order']);
    return myChannels.pipe(
        combineLatestWith(channels, manualSort),
        auditTime(0),
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

const enhanced = withObservables(['notifyPropsPerChannel'], ({category, currentUserId, database, isTablet, locale, notifyPropsPerChannel}: EnhanceProps) => {
    const categoryMyChannels = category.myChannels.observeWithColumns(['last_post_at', 'is_unread', 'mentions_count']);
    const channelsWithMyChannel = observeCategoryChannels(category, categoryMyChannels);
    const currentChannelId = isTablet ? observeCurrentChannelId(database) : of$('');
    const lastUnreadId = isTablet ? observeLastUnreadChannelId(database) : of$(undefined);

    const unreadsOnTop = querySidebarPreferences(database, Preferences.CHANNEL_SIDEBAR_GROUP_UNREADS).
        observeWithColumns(['value']).
        pipe(
            switchMap((prefs: PreferenceModel[]) => of$(getSidebarPreferenceAsBool(prefs, Preferences.CHANNEL_SIDEBAR_GROUP_UNREADS))),
        );

    let limit = of$(Preferences.CHANNEL_SIDEBAR_LIMIT_DMS_DEFAULT);
    if (category.type === DMS_CATEGORY) {
        limit = querySidebarPreferences(database, Preferences.CHANNEL_SIDEBAR_LIMIT_DMS).
            observeWithColumns(['value']).pipe(
                switchMap((val) => {
                    return val[0] ? of$(parseInt(val[0].value, 10)) : of$(Preferences.CHANNEL_SIDEBAR_LIMIT_DMS_DEFAULT);
                }),
            );
    }

    const hiddenDmPrefs = queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.DIRECT_CHANNEL_SHOW, undefined, 'false').
        observeWithColumns(['value']);
    const hiddenGmPrefs = queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.GROUP_CHANNEL_SHOW, undefined, 'false').
        observeWithColumns(['value']);
    const manuallyClosedPrefs = hiddenDmPrefs.pipe(
        combineLatestWith(hiddenGmPrefs),
        switchMap(([dms, gms]) => of$(dms.concat(gms))),
    );

    const approxViewTimePrefs = queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.CHANNEL_APPROXIMATE_VIEW_TIME, undefined).
        observeWithColumns(['value']);
    const openTimePrefs = queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.CHANNEL_OPEN_TIME, undefined).
        observeWithColumns(['value']);
    const autoclosePrefs = approxViewTimePrefs.pipe(
        combineLatestWith(openTimePrefs),
        switchMap(([viewTimes, openTimes]) => of$(viewTimes.concat(openTimes))),
    );

    const categorySorting = category.observe().pipe(
        switchMap((c) => of$(c.sorting)),
        distinctUntilChanged(),
    );

    const deactivated = (category.type === DMS_CATEGORY) ? observeDeactivatedUsers(database) : of$(undefined);
    const sortedChannelsWithMyChannel = channelsWithMyChannel.pipe(
        combineLatestWith(categorySorting, currentChannelId, lastUnreadId, manuallyClosedPrefs, autoclosePrefs, deactivated, limit),
        auditTime(0),
        switchMap(([cwms, sorting, channelId, unreadId, manuallyClosedDms, autoclose, deactivatedUsers, maxDms]) => {
            let channelsW = cwms;

            channelsW = filterArchivedChannels(channelsW, channelId);
            channelsW = filterAutoclosedDMs(
                category.type,
                maxDms,
                currentUserId,
                channelId,
                channelsW,
                autoclose,
                notifyPropsPerChannel,
                deactivatedUsers,
                unreadId,
            );
            channelsW = filterManuallyClosedDms(channelsW, notifyPropsPerChannel, manuallyClosedDms, currentUserId, unreadId);

            return of$(sortChannelsWithMyChannel(sorting, channelsW, notifyPropsPerChannel, locale));
        }),
        shareReplay({bufferSize: 1, refCount: true}),
    );

    const channelStates = sortedChannelsWithMyChannel.pipe(
        map((cwms) => cwms.reduce<Record<string, ChannelState>>((result, cwm) => {
            result[cwm.channel.id] = {
                isMuted: notifyPropsPerChannel[cwm.channel.id]?.mark_unread === 'mention',
                isUnread: cwm.myChannel.isUnread,
                mentionsCount: cwm.myChannel.mentionsCount,
            };
            return result;
        }, {})),
    );

    const sortedChannels = sortedChannelsWithMyChannel.pipe(
        map((cwms) => cwms.map((cwm) => cwm.channel)),
    );

    const unreadIds = channelsWithMyChannel.pipe(
        combineLatestWith(lastUnreadId),
        auditTime(0),
        switchMap(([cwms, unreadId]) => {
            return of$(getUnreadIds(cwms, notifyPropsPerChannel, unreadId));
        }),
    );

    return {
        category,
        channelStates,
        sortedChannels,
        unreadIds,
        unreadsOnTop,
    };
});

export default withDatabase(withUserId(enhanced(CategoryBody)));
