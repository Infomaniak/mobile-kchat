// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q, type Database} from '@nozbe/watermelondb';
import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {createElement, memo, useCallback, useEffect, useRef, useState} from 'react';
import {DeviceEventEmitter, type FlatList, type GestureResponderEvent} from 'react-native';
import {combineLatest, of as of$} from 'rxjs';
import {switchMap, distinctUntilChanged, map as map$} from 'rxjs/operators';

import {Events, General, Preferences} from '@constants';
import {useServerUrl} from '@context/server';
import {getAdvanceSettingPreferenceAsBool} from '@helpers/api/preference';
import {observeMyChannel} from '@queries/servers/channel';
import {queryPostsBetween, queryPostsInChannel} from '@queries/servers/post';
import {queryAdvanceSettingsPreferences} from '@queries/servers/preference';
import {observeIsCRTEnabled} from '@queries/servers/thread';
import EphemeralStore, {type ChannelJumpTarget} from '@store/ephemeral_store';
import {logDebug} from '@utils/log';

import ChannelPostList from './channel_post_list';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';
import type PostsInChannelModel from '@typings/database/models/servers/posts_in_channel';

const MAX_POSTS_LIMIT = 3000;
const TARGET_NEWER_POSTS_LIMIT = 2;

const getTargetChunk = (postsInChannel: PostsInChannelModel[], targetPostCreateAt?: number) => {
    if (!targetPostCreateAt) {
        return postsInChannel[0];
    }

    return postsInChannel.find((chunk) => chunk.earliest <= targetPostCreateAt && chunk.latest >= targetPostCreateAt) || postsInChannel[0];
};

const mergePostsAroundTarget = (newerPosts: PostModel[], olderPosts: PostModel[]) => {
    const postsById = new Map<string, PostModel>();
    [...newerPosts, ...olderPosts].forEach((post) => postsById.set(post.id, post));
    return Array.from(postsById.values()).sort((a, b) => b.createAt - a.createAt);
};

const hasPostWithCreateAt = (posts: PostModel[], createAt: number) => {
    return posts.some((post) => post.createAt === createAt);
};

const observePostsAroundTarget = (
    database: Database,
    channelId: string,
    earliest: number,
    latest: number,
    isCRTEnabled: boolean,
    targetPostCreateAt: number,
    postsLimit: number,
) => {
    const rootId = isCRTEnabled ? '' : undefined;
    const newerPostsLimit = Math.min(TARGET_NEWER_POSTS_LIMIT, Math.ceil(postsLimit / 2));
    const olderPostsLimit = postsLimit - newerPostsLimit;
    const newerPosts = queryPostsBetween(database, targetPostCreateAt, latest, Q.asc, '', channelId, rootId, newerPostsLimit).observe();
    const olderPosts = queryPostsBetween(database, earliest, targetPostCreateAt, Q.desc, '', channelId, rootId, olderPostsLimit).observe();

    return combineLatest([newerPosts, olderPosts]).pipe(
        map$(([newer, older]) => {
            const mergedPosts = mergePostsAroundTarget(newer, older);
            logDebug('[ChannelPostListWrapper] selected target window', {
                channelId,
                targetPostCreateAt,
                newerPostsLimit,
                olderPostsLimit,
                newerCount: newer.length,
                olderCount: older.length,
                mergedCount: mergedPosts.length,
                containsTarget: hasPostWithCreateAt(mergedPosts, targetPostCreateAt),
            });
            return mergedPosts;
        }),
    );
};

const enhanced = withObservables(['channelId', 'postsLimit', 'targetPostCreateAt'], ({database, channelId, postsLimit, targetPostCreateAt}: {
    channelId: string;
    postsLimit: number;
    targetPostCreateAt?: number;
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
                    logDebug('[ChannelPostListWrapper] no post chunks available', {channelId, targetPostCreateAt});
                    return of$([]);
                }

                const {earliest, latest} = getTargetChunk(postsInChannel, targetPostCreateAt);
                logDebug('[ChannelPostListWrapper] selected post chunk', {
                    channelId,
                    targetPostCreateAt,
                    chunkCount: postsInChannel.length,
                    earliest,
                    latest,
                    postsLimit,
                    isCRTEnabled,
                });

                if (targetPostCreateAt) {
                    return observePostsAroundTarget(database, channelId, earliest, latest, isCRTEnabled, targetPostCreateAt, postsLimit);
                }

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
    listRef: React.RefObject<FlatList<string | PostModel> | null>;
    onTouchMove?: (event: GestureResponderEvent) => void;
    onTouchEnd?: () => void;
}

const ChannelPostListWrapper = ({channelId, ...otherProps}: ChannelPostListWrapperProps) => {
    const serverUrl = useServerUrl();
    const [postsLimit, setPostsLimit] = useState(General.POST_CHUNK_SIZE);
    const [jumpTarget, setJumpTarget] = useState<ChannelJumpTarget | undefined>(() => EphemeralStore.getChannelJumpTarget(serverUrl, channelId));
    const jumpTargetRef = useRef(jumpTarget);

    useEffect(() => {
        jumpTargetRef.current = jumpTarget;
    }, [jumpTarget]);

    useEffect(() => {
        const target = EphemeralStore.getChannelJumpTarget(serverUrl, channelId);
        logDebug('[ChannelPostListWrapper] channel mounted/reset', {
            channelId,
            hasTarget: Boolean(target),
            targetPostId: target?.postId,
            targetCreateAt: target?.createAt,
        });
        setPostsLimit(General.POST_CHUNK_SIZE);
        setJumpTarget(target);

        return () => {
            const targetToClear = jumpTargetRef.current;
            if (targetToClear) {
                if (EphemeralStore.isSwitchingToChannel(channelId)) {
                    logDebug('[ChannelPostListWrapper] preserving target during channel switch', {
                        channelId,
                        targetPostId: targetToClear.postId,
                    });
                    return;
                }

                logDebug('[ChannelPostListWrapper] clearing target on unmount', {
                    channelId,
                    targetPostId: targetToClear.postId,
                });
                EphemeralStore.clearChannelJumpTarget(serverUrl, channelId, targetToClear.postId, false);
            }
        };
    }, [channelId, serverUrl]);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener(Events.CHANNEL_JUMP_TARGET, ({serverUrl: eventServerUrl, channelId: eventChannelId, target}) => {
            if (eventServerUrl === serverUrl && eventChannelId === channelId) {
                logDebug('[ChannelPostListWrapper] target event received', {
                    channelId,
                    hasTarget: Boolean(target),
                    targetPostId: target?.postId,
                    targetCreateAt: target?.createAt,
                });
                setJumpTarget(target);
            }
        });

        return () => listener.remove();
    }, [channelId, serverUrl]);

    const resetJumpTarget = useCallback(() => {
        const target = jumpTargetRef.current;
        if (!target) {
            return false;
        }

        logDebug('[ChannelPostListWrapper] resetting target to recent posts', {
            channelId,
            targetPostId: target.postId,
        });
        EphemeralStore.clearChannelJumpTarget(serverUrl, channelId, target.postId);
        return true;
    }, [channelId, serverUrl]);

    const requestMorePosts = useCallback(() => {
        setPostsLimit((prev: number) => Math.min(prev + General.POST_CHUNK_SIZE, MAX_POSTS_LIMIT));
    }, []);

    return createElement(ObservableChannelPostList, {
        channelId,
        forceShowScrollToEndBtn: Boolean(jumpTarget),
        highlightedPostId: jumpTarget?.postId,
        highlightedPostSelectedAt: jumpTarget?.selectedAt,
        postsLimit,
        requestMorePosts,
        resetJumpTarget,
        targetPostCreateAt: jumpTarget?.createAt,
        ...otherProps,
    });
};

export default memo(ChannelPostListWrapper);
