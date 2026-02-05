// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React from 'react';
import {combineLatest, of as of$} from 'rxjs';
import {switchMap, distinctUntilChanged, tap} from 'rxjs/operators';

import {Preferences} from '@constants';
import {getAdvanceSettingPreferenceAsBool} from '@helpers/api/preference';
import {observeMyChannel} from '@queries/servers/channel';
import {queryPostsBetween, queryPostsInChannel} from '@queries/servers/post';
import {queryAdvanceSettingsPreferences} from '@queries/servers/preference';
import {observeIsCRTEnabled} from '@queries/servers/thread';
import {captureMessage} from '@utils/sentry';

import ChannelPostList from './channel_post_list';

import type {ChunkGap} from '@typings/components/post_list';
import type {WithDatabaseArgs} from '@typings/database/database';
import type PostsInChannelModel from '@typings/database/models/servers/posts_in_channel';

// Calculate gaps between chunks (sorted by latest desc)
// A gap exists when there's a discontinuity between consecutive chunks
const calculateGaps = (postsInChannel: PostsInChannelModel[], channelId: string): ChunkGap[] => {
    const gaps: ChunkGap[] = [];

    for (let i = 0; i < postsInChannel.length - 1; i++) {
        const currentChunk = postsInChannel[i];
        const nextChunk = postsInChannel[i + 1];

        // If there's a gap between the current chunk's earliest and the next chunk's latest
        // (chunks are sorted by latest desc, so nextChunk is older)
        if (currentChunk.earliest > nextChunk.latest) {
            gaps.push({
                channelId,
                gapAfterTimestamp: currentChunk.earliest,
            });
        }
    }

    return gaps;
};

const enhanced = withObservables(['channelId'], ({database, channelId}: {channelId: string} & WithDatabaseArgs) => {
    const isCRTEnabledObserver = observeIsCRTEnabled(database);
    const postsInChannelObserver = queryPostsInChannel(database, channelId).observeWithColumns(['earliest', 'latest']);

    return {
        isCRTEnabled: isCRTEnabledObserver,
        lastViewedAt: observeMyChannel(database, channelId).pipe(
            switchMap((myChannel) => of$(myChannel?.viewedAt)),
            distinctUntilChanged(),
        ),
        chunkGaps: postsInChannelObserver.pipe(
            tap((postsInChannel) => {
                // Detect problematic state: first chunk with empty range (earliest === latest)
                // This can cause the channel to appear empty even when there are posts
                // See: https://github.com/mattermost/mattermost-mobile/issues/9103
                if (postsInChannel.length > 0) {
                    const firstChunk = postsInChannel[0];
                    if (firstChunk.earliest === firstChunk.latest) {
                        captureMessage(`[POSTS_IN_CHANNEL] Empty range detected in first chunk: channelId=${channelId}, earliest=${firstChunk.earliest}, latest=${firstChunk.latest}, totalChunks=${postsInChannel.length}`);
                    }
                }
            }),
            switchMap((postsInChannel) => of$(calculateGaps(postsInChannel, channelId))),
        ),
        posts: combineLatest([isCRTEnabledObserver, postsInChannelObserver]).pipe(
            switchMap(([isCRTEnabled, postsInChannel]) => {
                if (!postsInChannel.length) {
                    return of$([]);
                }

                const {earliest, latest} = postsInChannel[0];
                return queryPostsBetween(database, earliest, latest, Q.desc, '', channelId, isCRTEnabled ? '' : undefined).observe();
            }),
        ),
        shouldShowJoinLeaveMessages: queryAdvanceSettingsPreferences(database, Preferences.ADVANCED_FILTER_JOIN_LEAVE).
            observeWithColumns(['value']).pipe(
                switchMap((preferences) => of$(getAdvanceSettingPreferenceAsBool(preferences, Preferences.ADVANCED_FILTER_JOIN_LEAVE, true))),
                distinctUntilChanged(),
            ),
    };
});

export default React.memo(withDatabase(enhanced(ChannelPostList)));
