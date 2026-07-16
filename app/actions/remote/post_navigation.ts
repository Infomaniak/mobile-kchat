// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {General} from '@constants';
import DatabaseManager from '@database/manager';
import {getChannelById, getMyChannel} from '@queries/servers/channel';
import {getPostById} from '@queries/servers/post';
import {getIsCRTEnabled} from '@queries/servers/thread';
import EphemeralStore from '@store/ephemeral_store';
import {getFullErrorMessage} from '@utils/errors';
import {logDebug} from '@utils/log';

import {switchToChannelById} from './channel';
import {fetchPostById, fetchPostsAround} from './post';

import type PostModel from '@typings/database/models/servers/post';

type ResolvedPost = {
    channelId: string;
    createAt: number;
    id: string;
    rootId: string;
};

type JumpToPostInChannelOptions = {
    channelId?: string;
    groupLabel?: RequestGroupLabel;
    logPrefix?: string;
    postId: string;
    teamId?: string;
};

const postModelToResolvedPost = (post: PostModel): ResolvedPost => ({
    channelId: post.channelId,
    createAt: post.createAt,
    id: post.id,
    rootId: post.rootId,
});

const apiPostToResolvedPost = (post: Post): ResolvedPost => ({
    channelId: post.channel_id,
    createAt: post.create_at,
    id: post.id,
    rootId: post.root_id,
});

async function resolvePost(serverUrl: string, postId: string, groupLabel?: RequestGroupLabel) {
    const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
    const post = await getPostById(database, postId);
    if (post) {
        return {post: postModelToResolvedPost(post)};
    }

    const result = await fetchPostById(serverUrl, postId, true, groupLabel);
    if (result.post) {
        return {post: apiPostToResolvedPost(result.post)};
    }

    return {error: result.error ?? 'Post'};
}

export async function jumpToPostInChannel(serverUrl: string, options: JumpToPostInChannelOptions) {
    const {channelId, groupLabel, logPrefix = 'jumpToPostInChannel', postId, teamId} = options;

    try {
        logDebug(`[${logPrefix}] start`, {postId, channelId, teamId});

        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const resolved = await resolvePost(serverUrl, postId, groupLabel);
        if (resolved.error || !resolved.post) {
            logDebug(`[${logPrefix}] failed to resolve post`, {
                postId,
                error: resolved.error ? getFullErrorMessage(resolved.error) : undefined,
            });
            return {error: resolved.error ?? 'Post'};
        }

        const sourcePost = resolved.post;
        const targetChannelId = sourcePost.channelId || channelId;
        if (!targetChannelId) {
            logDebug(`[${logPrefix}] failed to resolve channel`, {postId});
            return {error: 'Channel'};
        }

        logDebug(`[${logPrefix}] post resolved`, {
            postId: sourcePost.id,
            channelId: targetChannelId,
            rootId: sourcePost.rootId,
            createAt: sourcePost.createAt,
        });

        const myChannel = await getMyChannel(database, targetChannelId);
        if (!myChannel) {
            logDebug(`[${logPrefix}] missing channel membership`, {postId, channelId: targetChannelId});
            return {error: 'Channel'};
        }

        const channel = await getChannelById(database, targetChannelId);
        const targetTeamId = channel?.teamId || teamId;
        const isCRTEnabled = await getIsCRTEnabled(database);
        let targetPost = sourcePost;

        logDebug(`[${logPrefix}] channel resolved`, {
            channelId: targetChannelId,
            teamId: targetTeamId,
            isCRTEnabled,
            isReply: Boolean(sourcePost.rootId),
        });

        if (isCRTEnabled && sourcePost.rootId) {
            logDebug(`[${logPrefix}] CRT reply detected, resolving root post`, {postId, rootId: sourcePost.rootId});
            const rootPostResult = await resolvePost(serverUrl, sourcePost.rootId, groupLabel);
            if (rootPostResult.post) {
                targetPost = rootPostResult.post;
                logDebug(`[${logPrefix}] root post resolved`, {
                    postId,
                    rootId: targetPost.id,
                    rootCreateAt: targetPost.createAt,
                });
            } else {
                logDebug(`[${logPrefix}] root post missing, keeping reply as target`, {
                    postId,
                    rootId: sourcePost.rootId,
                    error: rootPostResult.error ? getFullErrorMessage(rootPostResult.error) : undefined,
                });
            }
        }

        let aroundResult;
        try {
            logDebug(`[${logPrefix}] fetching posts around target`, {
                channelId: targetChannelId,
                targetPostId: targetPost.id,
                targetCreateAt: targetPost.createAt,
            });
            EphemeralStore.addLoadingMessagesForChannel(serverUrl, targetChannelId);
            aroundResult = await fetchPostsAround(serverUrl, targetChannelId, targetPost.id, General.POST_AROUND_CHUNK_SIZE, isCRTEnabled);
        } finally {
            EphemeralStore.stopLoadingMessagesForChannel(serverUrl, targetChannelId);
        }

        if (aroundResult.error) {
            logDebug(`[${logPrefix}] failed to fetch posts around target`, {
                channelId: targetChannelId,
                targetPostId: targetPost.id,
                error: getFullErrorMessage(aroundResult.error),
            });
            return {error: aroundResult.error};
        }

        logDebug(`[${logPrefix}] fetched posts around target`, {
            channelId: targetChannelId,
            targetPostId: targetPost.id,
            postsCount: aroundResult.posts?.length ?? 0,
        });

        EphemeralStore.setChannelJumpTarget(serverUrl, {
            channelId: targetChannelId,
            createAt: targetPost.createAt,
            postId: targetPost.id,
        });

        logDebug(`[${logPrefix}] switching to channel`, {
            channelId: targetChannelId,
            teamId: targetTeamId,
            targetPostId: targetPost.id,
        });
        await switchToChannelById(serverUrl, targetChannelId, targetTeamId, false, groupLabel);
        logDebug(`[${logPrefix}] switch complete`, {
            channelId: targetChannelId,
            targetPostId: targetPost.id,
        });

        return {};
    } catch (error) {
        logDebug(`[${logPrefix}] error`, getFullErrorMessage(error));
        return {error};
    }
}
