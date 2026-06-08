// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {createElement, memo, useCallback, useEffect, useState} from 'react';
import {combineLatest, of as of$} from 'rxjs';
import {switchMap, distinctUntilChanged} from 'rxjs/operators';

import {General, Preferences} from '@constants';
import {getAdvanceSettingPreferenceAsBool} from '@helpers/api/preference';
import {observeMyChannel} from '@queries/servers/channel';
import {queryPostsBetween, queryPostsInChannel} from '@queries/servers/post';
import {queryAdvanceSettingsPreferences} from '@queries/servers/preference';
import {observeIsCRTEnabled} from '@queries/servers/thread';

import ChannelPostList from './channel_post_list';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables(['channelId', 'postsLimit'], ({database, channelId, postsLimit}: {
    channelId: string;
    postsLimit: number;
} & WithDatabaseArgs) => {
    const isCRTEnabledObserver = observeIsCRTEnabled(database);
    const postsInChannelObserver = queryPostsInChannel(database, channelId).observeWithColumns(['earliest', 'latest']);

    return {
        isCRTEnabled: isCRTEnabledObserver,
        lastViewedAt: observeMyChannel(database, channelId).pipe(
            switchMap((myChannel) => of$(myChannel?.viewedAt)),
            distinctUntilChanged(),
        ),
        posts: combineLatest([isCRTEnabledObserver, postsInChannelObserver]).pipe(
            switchMap(([isCRTEnabled, postsInChannel]) => {
                if (!postsInChannel.length) {
                    return of$([]);
                }

                const {earliest, latest} = postsInChannel[0];
                return queryPostsBetween(database, earliest, latest, Q.desc, '', channelId, isCRTEnabled ? '' : undefined, postsLimit).observe();
            }),
        ),
        shouldShowJoinLeaveMessages: queryAdvanceSettingsPreferences(database, Preferences.ADVANCED_FILTER_JOIN_LEAVE).
            observeWithColumns(['value']).pipe(
                switchMap((preferences) => of$(getAdvanceSettingPreferenceAsBool(preferences, Preferences.ADVANCED_FILTER_JOIN_LEAVE, true))),
                distinctUntilChanged(),
            ),
    };
});

const ObservableChannelPostList = withDatabase(enhanced(ChannelPostList));

type ChannelPostListWrapperProps = {
    channelId: string;
    listRef: React.RefObject<any>;
    onTouchMove?: (event: {nativeEvent: {pageX: number; pageY: number}}) => void;
    onTouchEnd?: () => void;
}

const ChannelPostListWrapper = ({channelId, ...otherProps}: ChannelPostListWrapperProps) => {
    const [postsLimit, setPostsLimit] = useState(General.POST_CHUNK_SIZE);

    useEffect(() => {
        setPostsLimit(General.POST_CHUNK_SIZE);
    }, [channelId]);

    const requestMorePosts = useCallback(() => {
        setPostsLimit((prev: number) => prev + General.POST_CHUNK_SIZE);
    }, []);

    return createElement(ObservableChannelPostList, {
        channelId,
        postsLimit,
        requestMorePosts,
        ...otherProps,
    });
};

export default memo(ChannelPostListWrapper);
