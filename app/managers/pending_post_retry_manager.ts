// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {retryFailedPost} from '@actions/remote/post';
import DatabaseManager from '@database/manager';
import {getFailedOrPendingPosts} from '@queries/servers/post';
import {logDebug, logError} from '@utils/log';
import {isPostPendingOrFailed} from '@utils/post';
import {sleep} from '@utils/promise';

import NetworkManager from './network_manager';

import type PostModel from '@typings/database/models/servers/post';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;
const BATCH_SIZE = 10;
const HEALTH_CHECK_TIMEOUT_MS = 10000;

class PendingPostRetryManagerSingleton {
    private retryAttempts = new Map<string, number>();
    private processingPosts = new Set<string>();
    private processingPromise: Promise<void> | null = null;

    public triggerRetry = async (): Promise<void> => {
        // Atomic check-and-set using promise chaining
        if (this.processingPromise) {
            logDebug('[PendingPostRetryManager] Already processing, waiting for current batch');
            await this.processingPromise;
            return;
        }

        this.processingPromise = this.processAllServers();

        try {
            await this.processingPromise;
        } finally {
            this.processingPromise = null;
        }
    };

    private processAllServers = async (): Promise<void> => {
        const serverUrls = Object.keys(DatabaseManager.serverDatabases);

        for (const serverUrl of serverUrls) {
            try {
                // eslint-disable-next-line no-await-in-loop
                await this.processServer(serverUrl);
            } catch (error) {
                logError(`[PendingPostRetryManager] Error processing server ${serverUrl}`, error);
            }
        }
    };

    private processServer = async (serverUrl: string): Promise<void> => {
        // Verify backend health FIRST before querying DB
        if (!await this.verifyBackendHealth(serverUrl)) {
            logDebug(`[PendingPostRetryManager] Backend not healthy for ${serverUrl}, skipping`);
            return;
        }

        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        // Query pending posts chronologically (oldest first)
        const posts = await getFailedOrPendingPosts(database, BATCH_SIZE);

        if (posts.length === 0) {
            return;
        }

        logDebug(`[PendingPostRetryManager] Found ${posts.length} pending posts for ${serverUrl}`);

        // Process posts sequentially
        for (const post of posts) {
            // eslint-disable-next-line no-await-in-loop
            await this.retryPostWithBackoff(serverUrl, post);
        }
    };

    private verifyBackendHealth = async (serverUrl: string): Promise<boolean> => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            const healthCheckPromise = client.getMe();

            // Race against timeout
            const result = await Promise.race([
                healthCheckPromise,
                new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('Health check timeout')), HEALTH_CHECK_TIMEOUT_MS);
                }),
            ]);

            return result != null;
        } catch (error) {
            logDebug(`[PendingPostRetryManager] Backend health check failed for ${serverUrl}`, error);
            return false;
        }
    };

    private retryPostWithBackoff = async (serverUrl: string, post: PostModel): Promise<void> => {
        const postId = post.id;

        // Check if already being processed
        if (this.processingPosts.has(postId)) {
            logDebug(`[PendingPostRetryManager] Post ${postId} already being processed`);
            return;
        }

        // Check retry limit
        const attempts = this.retryAttempts.get(postId) || 0;
        if (attempts >= MAX_RETRIES) {
            logDebug(`[PendingPostRetryManager] Post ${postId} exceeded max retries`);
            return;
        }

        this.processingPosts.add(postId);

        try {
            // Apply exponential backoff BEFORE any DB operations
            if (attempts > 0) {
                const delay = BASE_DELAY_MS * Math.pow(2, attempts - 1);
                logDebug(`[PendingPostRetryManager] Backing off for ${delay}ms before retry ${attempts + 1}`);
                await sleep(delay);
            }

            // Get database reference inside try block
            let database;
            try {
                const dbResult = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
                database = dbResult.database;
            } catch (dbError) {
                logError(`[PendingPostRetryManager] Failed to get database for ${serverUrl}`, dbError);
                this.retryAttempts.set(postId, attempts + 1);
                return;
            }

            // Re-fetch from DB to verify still pending
            let freshPost: PostModel;
            try {
                freshPost = await database.get<PostModel>('Post').find(postId);
            } catch (findError) {
                logDebug(`[PendingPostRetryManager] Post ${postId} not found in DB, skipping`);
                this.retryAttempts.delete(postId);
                return;
            }

            if (!freshPost || !isPostPendingOrFailed(freshPost)) {
                logDebug(`[PendingPostRetryManager] Post ${postId} no longer pending, skipping`);
                this.retryAttempts.delete(postId);
                return;
            }

            // Attempt retry using existing action
            logDebug(`[PendingPostRetryManager] Retrying post ${postId} (attempt ${attempts + 1}/${MAX_RETRIES})`);
            const result = await retryFailedPost(serverUrl, freshPost);

            if (result.error) {
                logDebug(`[PendingPostRetryManager] Retry failed for post ${postId}`, result.error);
                this.retryAttempts.set(postId, attempts + 1);
            } else {
                logDebug(`[PendingPostRetryManager] Retry succeeded for post ${postId}`);
                this.retryAttempts.delete(postId);
            }
        } catch (error) {
            logError(`[PendingPostRetryManager] Error retrying post ${postId}`, error);
            this.retryAttempts.set(postId, attempts + 1);
        } finally {
            this.processingPosts.delete(postId);
        }
    };

    public clearRetryAttempts = (postId: string): void => {
        this.retryAttempts.delete(postId);
    };

    public reset = (): void => {
        this.retryAttempts.clear();
        this.processingPosts.clear();
        this.processingPromise = null;
    };
}

const PendingPostRetryManager = new PendingPostRetryManagerSingleton();

export const testExports = {
    PendingPostRetryManagerSingleton,
    MAX_RETRIES,
    BASE_DELAY_MS,
    BATCH_SIZE,
    HEALTH_CHECK_TIMEOUT_MS,
};

export default PendingPostRetryManager;
