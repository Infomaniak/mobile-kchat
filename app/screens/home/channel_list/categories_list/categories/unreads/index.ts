// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$, type Observable} from 'rxjs';
import {combineLatestWith, map, switchMap} from 'rxjs/operators';

import {filterAndSortMyChannels, makeChannelsMap} from '@helpers/database';
import {getChannelById, observeChannelsByLastPostAt, queryMyChannelUnreads} from '@queries/servers/channel';
import {observeLastUnreadChannelId} from '@queries/servers/system';
import {observeUnreadsAndMentions} from '@queries/servers/thread';

import UnreadCategories from './unreads';

import type {WithDatabaseArgs} from '@typings/database/database';
import type ChannelModel from '@typings/database/models/servers/channel';

type WithDatabaseProps = WithDatabaseArgs & {
    currentTeamId: string;
    isTablet: boolean;
    onlyUnreads: boolean;
    unreadsOnTop: boolean;
    notifyPropsByChannelId$: Observable<Record<string, Partial<ChannelNotifyProps>>>;
}

type CA = [
    a: Array<ChannelModel | null>,
    b: ChannelModel | undefined,
]

const concatenateChannelsArray = ([a, b]: CA) => {
    return of$(b ? a.filter((c) => c && c.id !== b.id).concat(b) : a);
};

const enhanced = withObservables(['currentTeamId', 'isTablet', 'onlyUnreads', 'unreadsOnTop'], ({currentTeamId, isTablet, database, onlyUnreads, unreadsOnTop, notifyPropsByChannelId$}: WithDatabaseProps) => {
    const getC = (lastUnreadChannelId: string) => getChannelById(database, lastUnreadChannelId);

    const unreadChannels = (unreadsOnTop || onlyUnreads) ?
        (() => {
            const lastUnread = isTablet ? observeLastUnreadChannelId(database).pipe(
                switchMap(getC),
            ) : of$(undefined);
            const myUnreadChannels = queryMyChannelUnreads(database, currentTeamId).observeWithColumns(['last_post_at', 'is_unread']);
            const channels = myUnreadChannels.pipe(switchMap((myChannels) => observeChannelsByLastPostAt(database, myChannels)));
            const channelsMap = channels.pipe(switchMap((cs) => of$(makeChannelsMap(cs))));

            return myUnreadChannels.pipe(
                combineLatestWith(channelsMap, notifyPropsByChannelId$),
                map(filterAndSortMyChannels),
                combineLatestWith(lastUnread),
                switchMap(concatenateChannelsArray),
            );
        })() :
        of$([]);
    const unreadThreads = observeUnreadsAndMentions(database, {teamId: currentTeamId, includeDmGm: true});

    return {
        unreadChannels,
        unreadThreads,
    };
});

export default withDatabase(enhanced(UnreadCategories));
