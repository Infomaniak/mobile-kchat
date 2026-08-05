// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';
import DatabaseManager from '@database/manager';
import {getCurrentUserId} from '@queries/servers/system';

import type ChannelModel from '@typings/database/models/servers/channel';

const BATCH_SIZE = 500;

function generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
}

function buildBatchInserts(
    tableName: string,
    columns: string[],
    rows: Array<Array<string | number | null>>,
): Array<[string, Array<string | number | null>]> {
    const result: Array<[string, Array<string | number | null>]> = [];
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const placeholders = batch.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');
        const flatValues = batch.flat();
        result.push([
            `INSERT INTO "${tableName}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES ${placeholders}`,
            flatValues,
        ]);
    }
    return result;
}

export async function injectPerfPostsAndThreads(serverUrl: string, count: number): Promise<{
    durationMs: number;
    postsInserted: number;
}> {
    const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

    // Find "perf-mobile" channel for performance testing
    const channels = await database.get<ChannelModel>(MM_TABLES.SERVER.CHANNEL).query(
        Q.where('name', 'perf-mobile'),
    ).fetch();

    if (!channels.length) {
        throw new Error('No perf-mobile channel found in database. Please create a channel named "perf-mobile" on this server.');
    }

    const perfChannel = channels[0];
    const channelId = perfChannel.id;
    const teamId = perfChannel.teamId;
    const userId = await getCurrentUserId(database);

    if (!userId) {
        throw new Error('No current user found in database.');
    }

    const posts: Array<Array<string | number | null>> = [];
    const threads: Array<Array<string | number | null>> = [];
    const threadsInTeam: Array<Array<string | number | null>> = [];

    const now = Date.now();
    const earliestPostAt = now - ((count - 1) * 1000);

    for (let i = 0; i < count; i++) {
        const id = generateId();
        const createAt = now - (i * 1000);

        // Post table columns in WatermelonDB order:
        // id, _status, _changed, channel_id, create_at, delete_at, edit_at, is_pinned, message,
        // message_source, metadata, original_id, pending_post_id, previous_post_id, props,
        // root_id, type, update_at, user_id
        posts.push([
            id, 'synced', '', channelId, createAt, 0, 0, 0,
            `Perf post ${i}`, '', null, '', '', '', '{}', '', '',
            createAt, userId,
        ]);

        // Thread table columns:
        // id, _status, _changed, is_following, last_reply_at, last_viewed_at, reply_count,
        // unread_mentions, unread_replies, viewed_at, last_fetched_at
        threads.push([
            id, 'synced', '', 1, createAt, 0, 1, 0, 0, 0, createAt,
        ]);

        // ThreadsInTeam table columns:
        // id, _status, _changed, team_id, thread_id
        threadsInTeam.push([
            generateId(), 'synced', '', teamId, id,
        ]);
    }

    const postColumns = [
        'id', '_status', '_changed', 'channel_id', 'create_at', 'delete_at', 'edit_at',
        'is_pinned', 'message', 'message_source', 'metadata', 'original_id',
        'pending_post_id', 'previous_post_id', 'props', 'root_id', 'type', 'update_at', 'user_id',
    ];
    const threadColumns = [
        'id', '_status', '_changed', 'is_following', 'last_reply_at', 'last_viewed_at',
        'reply_count', 'unread_mentions', 'unread_replies', 'viewed_at', 'last_fetched_at',
    ];
    const titColumns = [
        'id', '_status', '_changed', 'team_id', 'thread_id',
    ];

    // One PostsInChannel chunk spanning all injected posts
    const picId = generateId();
    const picColumns = ['id', '_status', '_changed', 'channel_id', 'earliest', 'latest'];
    const picValues: Array<Array<string | number | null>> = [
        [picId, 'synced', '', channelId, earliestPostAt, now],
    ];

    const sqls: Array<[string, Array<string | number | null>]> = [];

    sqls.push(...buildBatchInserts('Post', postColumns, posts));
    sqls.push(...buildBatchInserts('Thread', threadColumns, threads));
    sqls.push(...buildBatchInserts('ThreadsInTeam', titColumns, threadsInTeam));
    sqls.push(...buildBatchInserts('PostsInChannel', picColumns, picValues));

    const start = performance.now();
    await database.write(() => {
        return database.adapter.unsafeExecute({sqls});
    });
    const durationMs = performance.now() - start;

    return {
        durationMs,
        postsInserted: count,
    };
}

export async function clearPerfPostsAndThreads(serverUrl: string): Promise<void> {
    const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

    await database.write(() => {
        return database.adapter.unsafeExecute({
            sqls: [
                ["DELETE FROM Thread WHERE id IN (SELECT id FROM Post WHERE message LIKE 'Perf post %')", []],
                ["DELETE FROM ThreadsInTeam WHERE thread_id IN (SELECT id FROM Post WHERE message LIKE 'Perf post %')", []],
                ["DELETE FROM Post WHERE message LIKE 'Perf post %'", []],
            ],
        });
    });
}
