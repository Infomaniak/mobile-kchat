/* eslint-disable max-nested-callbacks */
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {auditTime, combineLatestWith, map, shareReplay, switchMap} from 'rxjs/operators';

import {Preferences} from '@constants';
import {getSidebarPreferenceAsBool} from '@helpers/api/preference';
import {filterAndSortMyChannels, makeChannelsMap} from '@helpers/database';
import {getChannelById, observeChannelsByLastPostAt, observeNotifyPropsByChannels, queryMyChannelUnreads} from '@queries/servers/channel';
import {querySidebarPreferences} from '@queries/servers/preference';
import {observeLastUnreadChannelId} from '@queries/servers/system';
import {observeUnreadsAndMentions} from '@queries/servers/thread';

import UnreadCategories from './unreads';

import type {WithDatabaseArgs} from '@typings/database/database';
import type ChannelModel from '@typings/database/models/servers/channel';
import type PreferenceModel from '@typings/database/models/servers/preference';

type WithDatabaseProps = WithDatabaseArgs & {
    currentTeamId: string;
    isTablet: boolean;
    onlyUnreads: boolean;
}

type CA = [
    a: Array<ChannelModel | null>,
    b: ChannelModel | undefined,
]

type ChannelState = {
    isMuted: boolean;
    isUnread: boolean;
    mentionsCount: number;
};

const concatenateChannelsArray = ([a, b]: CA) => {
    return of$(b ? a.filter((c) => c && c.id !== b.id).concat(b) : a);
};

const enhanced = withObservables(['currentTeamId', 'isTablet', 'onlyUnreads'], ({currentTeamId, isTablet, database, onlyUnreads}: WithDatabaseProps) => {
    const unreadsOnTop = querySidebarPreferences(database, Preferences.CHANNEL_SIDEBAR_GROUP_UNREADS).
        observeWithColumns(['value']).
        pipe(
            switchMap((prefs: PreferenceModel[]) => of$(getSidebarPreferenceAsBool(prefs, Preferences.CHANNEL_SIDEBAR_GROUP_UNREADS))),
        );

    const getC = (lastUnreadChannelId: string) => getChannelById(database, lastUnreadChannelId);

    const unreadData = unreadsOnTop.pipe(switchMap((gU) => {
        if (gU || onlyUnreads) {
            const lastUnread = isTablet ? observeLastUnreadChannelId(database).pipe(
                switchMap(getC),
            ) : of$(undefined);
            const myUnreadChannels = queryMyChannelUnreads(database, currentTeamId).observeWithColumns(['last_post_at', 'is_unread', 'mentions_count']);
            const notifyProps = myUnreadChannels.pipe(switchMap((cs) => observeNotifyPropsByChannels(database, cs)));
            const channels = myUnreadChannels.pipe(switchMap((myChannels) => observeChannelsByLastPostAt(database, myChannels)));
            const channelsMap = channels.pipe(switchMap((cs) => of$(makeChannelsMap(cs))));
            const channelStates = myUnreadChannels.pipe(
                combineLatestWith(notifyProps),
                auditTime(0),
                switchMap(([myChannels, notify]) => of$(myChannels.reduce<Record<string, ChannelState>>((result, myChannel) => {
                    result[myChannel.id] = {
                        isMuted: notify[myChannel.id]?.mark_unread === 'mention',
                        isUnread: myChannel.isUnread,
                        mentionsCount: myChannel.mentionsCount,
                    };
                    return result;
                }, {}))),
            );

            const sortedUnreadChannels = myUnreadChannels.pipe(
                combineLatestWith(channelsMap, notifyProps),
                auditTime(0),
                map(filterAndSortMyChannels),
                combineLatestWith(lastUnread),
                auditTime(0),
                switchMap(concatenateChannelsArray),
            );

            return sortedUnreadChannels.pipe(
                combineLatestWith(channelStates),
                auditTime(0),
                switchMap(([unreads, states]) => of$({channelStates: states, unreadChannels: unreads})),
            );
        }
        return of$({channelStates: {}, unreadChannels: []});
    }), shareReplay({bufferSize: 1, refCount: true}));
    const unreadThreads = observeUnreadsAndMentions(database, {teamId: currentTeamId, includeDmGm: true});

    return {
        channelStates: unreadData.pipe(map(({channelStates}) => channelStates)),
        unreadChannels: unreadData.pipe(map(({unreadChannels}) => unreadChannels)),
        unreadThreads,
    };
});

export default withDatabase(enhanced(UnreadCategories));
