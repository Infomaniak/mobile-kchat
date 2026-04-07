// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database} from '@nozbe/watermelondb';
import {firstValueFrom} from 'rxjs';

import {ActionType, License} from '@constants';
import {SYSTEM_IDENTIFIERS} from '@constants/database';
import DatabaseManager from '@database/manager';
import ServerDataOperator from '@database/operator/server_data_operator';
import TestHelper from '@test/test_helper';

import {queryPostsWithPermalinkReferences, observeIsBoREnabled, getFailedOrPendingPosts} from './post';

describe('Post Queries', () => {
    const serverUrl = 'post.test.com';
    let database: Database;
    let operator: ServerDataOperator;

    beforeEach(async () => {
        await DatabaseManager.init([serverUrl]);
        const serverDatabaseAndOperator = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        database = serverDatabaseAndOperator.database;
        operator = serverDatabaseAndOperator.operator;
    });

    afterEach(async () => {
        await DatabaseManager.destroyServerDatabase(serverUrl);
    });

    describe('queryPostsWithPermalinkReferences', () => {
        it('should return posts that reference the given post ID', async () => {
            const referencedPostId = 'referenced_post_123';
            const referencingPost = TestHelper.fakePost({
                id: 'referencing_post_456',
                channel_id: 'channel1',
                metadata: {
                    embeds: [
                        {
                            type: 'permalink',
                            url: '',
                            data: {
                                post_id: referencedPostId,
                            },
                        },
                    ],
                },
            });

            const nonReferencingPost = TestHelper.fakePost({
                id: 'non_referencing_post_789',
                channel_id: 'channel1',
                metadata: {
                    embeds: [
                        {
                            type: 'opengraph',
                            url: 'https://example.com',
                            data: {},
                        },
                    ],
                },
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [referencingPost.id, nonReferencingPost.id],
                posts: [referencingPost, nonReferencingPost],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await queryPostsWithPermalinkReferences(database, referencedPostId);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(referencingPost.id);
        });

        it('should return posts from multiple channels that reference the same post', async () => {
            const referencedPostId = 'referenced_post_123';
            const channel1Post = TestHelper.fakePost({
                id: 'channel1_post',
                channel_id: 'channel1',
                metadata: {
                    embeds: [
                        {
                            type: 'permalink',
                            url: '',
                            data: {
                                post_id: referencedPostId,
                            },
                        },
                    ],
                },
            });

            const channel2Post = TestHelper.fakePost({
                id: 'channel2_post',
                channel_id: 'channel2',
                metadata: {
                    embeds: [
                        {
                            type: 'permalink',
                            url: '',
                            data: {
                                post_id: referencedPostId,
                            },
                        },
                    ],
                },
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [channel1Post.id, channel2Post.id],
                posts: [channel1Post, channel2Post],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await queryPostsWithPermalinkReferences(database, referencedPostId);

            expect(result).toHaveLength(2);
            expect(result.map((p) => p.id)).toEqual(expect.arrayContaining([channel1Post.id, channel2Post.id]));
        });

        it('should exclude deleted posts', async () => {
            const referencedPostId = 'referenced_post_123';
            const deletedPost = TestHelper.fakePost({
                id: 'deleted_post',
                channel_id: 'channel1',
                delete_at: Date.now(),
                metadata: {
                    embeds: [
                        {
                            type: 'permalink',
                            url: '',
                            data: {
                                post_id: referencedPostId,
                            },
                        },
                    ],
                },
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [deletedPost.id],
                posts: [deletedPost],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await queryPostsWithPermalinkReferences(database, referencedPostId);

            expect(result).toHaveLength(0);
        });

        it('should exclude posts without metadata', async () => {
            const referencedPostId = 'referenced_post_123';
            const postWithoutMetadata = TestHelper.fakePost({
                id: 'post_without_metadata',
                channel_id: 'channel1',
                metadata: undefined,
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [postWithoutMetadata.id],
                posts: [postWithoutMetadata],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await queryPostsWithPermalinkReferences(database, referencedPostId);

            expect(result).toHaveLength(0);
        });

        it('should exclude posts with empty embeds', async () => {
            const referencedPostId = 'referenced_post_123';
            const postWithEmptyEmbeds = TestHelper.fakePost({
                id: 'post_with_empty_embeds',
                channel_id: 'channel1',
                metadata: {
                    embeds: [],
                },
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [postWithEmptyEmbeds.id],
                posts: [postWithEmptyEmbeds],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await queryPostsWithPermalinkReferences(database, referencedPostId);

            expect(result).toHaveLength(0);
        });

        it('should handle multiple embeds and find the correct permalink', async () => {
            const referencedPostId = 'referenced_post_123';
            const postWithMultipleEmbeds = TestHelper.fakePost({
                id: 'post_with_multiple_embeds',
                channel_id: 'channel1',
                metadata: {
                    embeds: [
                        {
                            type: 'opengraph',
                            url: 'https://example.com',
                            data: {},
                        },
                        {
                            type: 'permalink',
                            url: '',
                            data: {
                                post_id: referencedPostId,
                            },
                        },
                        {
                            type: 'image',
                            url: 'https://example.com/image.jpg',
                            data: {},
                        },
                    ],
                },
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [postWithMultipleEmbeds.id],
                posts: [postWithMultipleEmbeds],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await queryPostsWithPermalinkReferences(database, referencedPostId);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(postWithMultipleEmbeds.id);
        });

        it('should return empty array when no posts reference the given post ID', async () => {
            const nonExistentPostId = 'non_existent_post_456';

            const result = await queryPostsWithPermalinkReferences(database, nonExistentPostId);

            expect(result).toHaveLength(0);
        });

        it('should only match exact post_id in permalink data', async () => {
            const referencedPostId = 'referenced_post_123';
            const partialMatchPost = TestHelper.fakePost({
                id: 'partial_match_post',
                channel_id: 'channel1',
                metadata: {
                    embeds: [
                        {
                            type: 'permalink',
                            url: '',
                            data: {
                                post_id: 'referenced_post_12345',
                            },
                        },
                    ],
                },
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [partialMatchPost.id],
                posts: [partialMatchPost],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await queryPostsWithPermalinkReferences(database, referencedPostId);

            expect(result).toHaveLength(0);
        });
    });

    describe('observeIsBoREnabled', () => {
        it('should return true when both feature is enabled and license is valid', async () => {
            await operator.handleSystem({
                systems: [{id: SYSTEM_IDENTIFIERS.LICENSE, value: {IsLicensed: 'true', SkuShortName: License.SKU_SHORT_NAME.EnterpriseAdvanced}}],
                prepareRecordsOnly: false,
            });

            await operator.handleConfigs({
                configs: [
                    {id: 'EnableBurnOnRead', value: 'true'},
                    {id: 'BuildEnterpriseReady', value: 'true'},
                ],
                configsToDelete: [],
                prepareRecordsOnly: false,
            });

            const result = await firstValueFrom(observeIsBoREnabled(database));
            expect(result).toBe(true);
        });

        it('should return false when feature is disabled but license is valid', async () => {
            await operator.handleSystem({
                systems: [{id: SYSTEM_IDENTIFIERS.LICENSE, value: {IsLicensed: 'true', SkuShortName: License.SKU_SHORT_NAME.EnterpriseAdvanced}}],
                prepareRecordsOnly: false,
            });

            await operator.handleConfigs({
                configs: [
                    {id: 'EnableBurnOnRead', value: 'false'},
                ],
                configsToDelete: [],
                prepareRecordsOnly: false,
            });

            const result = await firstValueFrom(observeIsBoREnabled(database));
            expect(result).toBe(false);
        });

        it('should return false when feature is enabled but license is insufficient', async () => {
            await operator.handleSystem({
                systems: [{id: SYSTEM_IDENTIFIERS.LICENSE, value: {IsLicensed: 'true', SkuShortName: License.SKU_SHORT_NAME.Enterprise}}],
                prepareRecordsOnly: false,
            });

            await operator.handleConfigs({
                configs: [
                    {id: 'EnableBurnOnRead', value: 'true'},
                    {id: 'BuildEnterpriseReady', value: 'true'},
                ],
                configsToDelete: [],
                prepareRecordsOnly: false,
            });

            const result = await firstValueFrom(observeIsBoREnabled(database));
            expect(result).toBe(false);
        });

        it('should return false when both feature is disabled and license is insufficient', async () => {
            await operator.handleSystem({
                systems: [{id: SYSTEM_IDENTIFIERS.LICENSE, value: {IsLicensed: 'true', SkuShortName: License.SKU_SHORT_NAME.Professional}}],
                prepareRecordsOnly: false,
            });

            await operator.handleConfigs({
                configs: [
                    {id: 'EnableBurnOnRead', value: 'false'},
                    {id: 'BuildEnterpriseReady', value: 'true'},
                ],
                configsToDelete: [],
                prepareRecordsOnly: false,
            });

            const result = await firstValueFrom(observeIsBoREnabled(database));
            expect(result).toBe(false);
        });

        it('should return false when no config is set', async () => {
            await operator.handleSystem({
                systems: [{id: SYSTEM_IDENTIFIERS.LICENSE, value: {IsLicensed: 'true', SkuShortName: License.SKU_SHORT_NAME.EnterpriseAdvanced}}],
                prepareRecordsOnly: false,
            });

            const result = await firstValueFrom(observeIsBoREnabled(database));
            expect(result).toBe(false);
        });
    });

    describe('getFailedOrPendingPosts', () => {
        it('should return posts with pending_post_id equal to id', async () => {
            const pendingPost = TestHelper.fakePost({
                id: 'pending-post-1',
                channel_id: 'channel1',
                pending_post_id: 'pending-post-1',
                create_at: Date.now() - 1000,
            });

            const confirmedPost = TestHelper.fakePost({
                id: 'confirmed-post-1',
                channel_id: 'channel1',
                pending_post_id: '', // Empty means confirmed by server
                create_at: Date.now(),
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [pendingPost.id, confirmedPost.id],
                posts: [pendingPost, confirmedPost],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await getFailedOrPendingPosts(database);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(pendingPost.id);
        });

        it('should return posts in chronological order (oldest first)', async () => {
            const post1 = TestHelper.fakePost({
                id: 'post-1',
                channel_id: 'channel1',
                pending_post_id: 'post-1',
                create_at: Date.now() - 2000,
            });

            const post2 = TestHelper.fakePost({
                id: 'post-2',
                channel_id: 'channel1',
                pending_post_id: 'post-2',
                create_at: Date.now() - 1000,
            });

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: [post1.id, post2.id],
                posts: [post1, post2],
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await getFailedOrPendingPosts(database);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(post1.id);
            expect(result[1].id).toBe(post2.id);
        });

        it('should respect the limit parameter', async () => {
            const posts = Array.from({length: 15}, (_, i) => TestHelper.fakePost({
                id: `post-${i}`,
                channel_id: 'channel1',
                pending_post_id: `post-${i}`,
                create_at: Date.now() - (i * 1000),
            }));

            const models = await operator.handlePosts({
                actionType: ActionType.POSTS.RECEIVED_NEW,
                order: posts.map((p) => p.id),
                posts,
                prepareRecordsOnly: true,
            });
            await operator.batchRecords(models, 'test');

            const result = await getFailedOrPendingPosts(database, 5);

            expect(result).toHaveLength(5);
        });

        it('should return empty array when no pending posts', async () => {
            const result = await getFailedOrPendingPosts(database);
            expect(result).toHaveLength(0);
        });
    });
});
