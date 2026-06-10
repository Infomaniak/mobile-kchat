// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q, type Database} from '@nozbe/watermelondb';
import deepEqual from 'deep-equal';
import {DeviceEventEmitter} from 'react-native';

import {Events} from '@constants';
import {MM_TABLES, SYSTEM_IDENTIFIERS} from '@constants/database';
import DatabaseManager from '@database/manager';
import {getServerCredentials} from '@init/credentials';
import {
    getConfig,
    getLicense,
    getLastGlobalDataRetentionRun,
} from '@queries/servers/system';
import PostModel from '@typings/database/models/servers/post';
import {logDebug, logError, logInfo} from '@utils/log';
import {captureMessage} from '@utils/sentry';

import {deletePostsForChannelsWithAutotranslation} from './channel';
import {deletePosts} from './post';

import type {DataRetentionPoliciesRequest} from '@actions/remote/systems';

const {SERVER: {POST}} = MM_TABLES;

// Thresholds for volume-based cleanup
const POST_VOLUME_THRESHOLD = 100_000;
const POST_VOLUME_TARGET = 80_000;
const CLEANUP_BATCH_SIZE = 5_000;

export async function storeConfigAndLicense(serverUrl: string, config: ClientConfig, license: ClientLicense) {
    try {
        // If we have credentials for this server then update the values in the database
        const credentials = await getServerCredentials(serverUrl);
        if (credentials) {
            const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            const currentLicense = await getLicense(database);
            const systems: IdValue[] = [];

            if (!deepEqual(license, currentLicense)) {
                systems.push({
                    id: SYSTEM_IDENTIFIERS.LICENSE,
                    value: JSON.stringify(license),
                });
            }

            if (systems.length) {
                await operator.handleSystem({systems, prepareRecordsOnly: false});
                DeviceEventEmitter.emit(Events.LICENSE_CHANGED, {serverUrl, license});
            }

            return await storeConfig(serverUrl, config);
        }
    } catch (error) {
        logError('An error occurred while saving config & license', error);
    }
    return [];
}

export async function storeConfig(serverUrl: string, config: ClientConfig | undefined, prepareRecordsOnly = false) {
    if (!config) {
        return [];
    }

    try {
        const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const currentConfig = await getConfig(database);
        const configsToUpdate: IdValue[] = [];
        const configsToDelete: IdValue[] = [];

        // Check if EnableAutoTranslation changed from enabled to disabled
        const enableAutoTranslationChanged = (currentConfig?.EnableAutoTranslation === 'true') !== (config.EnableAutoTranslation === 'true');

        let k: keyof ClientConfig;
        for (k in config) {
            if (currentConfig?.[k] !== config[k]) {
                configsToUpdate.push({
                    id: k,
                    value: config[k],
                });
            }
        }
        for (k in currentConfig) {
            if (config[k] === undefined) {
                configsToDelete.push({
                    id: k,
                    value: currentConfig[k],
                });
            }
        }

        if (configsToDelete.length || configsToUpdate.length) {
            const results = await operator.handleConfigs({configs: configsToUpdate, configsToDelete, prepareRecordsOnly});
            DeviceEventEmitter.emit(Events.CONFIG_CHANGED, {serverUrl, config});

            // If EnableAutoTranslation was disabled, delete posts and disable user autotranslation
            if (enableAutoTranslationChanged) {
                await deletePostsForChannelsWithAutotranslation(serverUrl, prepareRecordsOnly);
            }

            return results;
        }
    } catch (error) {
        logError('storeConfig', error);
    }
    return [];
}

export async function storeDataRetentionPolicies(serverUrl: string, data: DataRetentionPoliciesRequest, prepareRecordsOnly = false) {
    try {
        const {globalPolicy, teamPolicies, channelPolicies} = data;
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const systems: IdValue[] = [{
            id: SYSTEM_IDENTIFIERS.DATA_RETENTION_POLICIES,
            value: globalPolicy || {},
        }, {
            id: SYSTEM_IDENTIFIERS.GRANULAR_DATA_RETENTION_POLICIES,
            value: {
                team: teamPolicies || [],
                channel: channelPolicies || [],
            },
        }];

        return operator.handleSystem({
            systems,
            prepareRecordsOnly,
        });
    } catch {
        return [];
    }
}

export async function updateLastDataRetentionRun(serverUrl: string, value?: number, prepareRecordsOnly = false) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        const systems: IdValue[] = [{
            id: SYSTEM_IDENTIFIERS.LAST_DATA_RETENTION_RUN,
            value: value || Date.now(),
        }];

        return operator.handleSystem({systems, prepareRecordsOnly});
    } catch (error) {
        logError('Failed updateLastDataRetentionRun', error);
        return {error};
    }
}

export async function dataRetentionCleanup(serverUrl: string) {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        const lastRunAt = await getLastGlobalDataRetentionRun(database);
        const lastCleanedToday = new Date(lastRunAt).toDateString() === new Date().toDateString();

        // Do not run if clean up is already done today
        if (lastRunAt && lastCleanedToday) {
            return {error: undefined};
        }

        const result = await dataRetentionWithoutPolicyCleanup(serverUrl);
        await volumeBasedCleanup(serverUrl);

        if (!result.error) {
            await updateLastDataRetentionRun(serverUrl);
        }

        await database.unsafeVacuum();

        return result;
    } catch (error) {
        logError('An error occurred while performing data retention cleanup', error);
        return {error};
    }
}

async function dataRetentionWithoutPolicyCleanup(serverUrl: string) {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const cutoff = getDataRetentionPolicyCutoff(14); // 14 days

        const postIds = await database.get<PostModel>(POST).query(
            Q.where('create_at', Q.lt(cutoff)),
        ).fetchIds();

        return dataRetentionCleanPosts(serverUrl, postIds);
    } catch (error) {
        logError('An error occurred while performing data retention without policy cleanup', error);
        return {error};
    }
}

export async function dataRetentionCleanPosts(serverUrl: string, postIds: string[]) {
    if (postIds.length) {
        const batchSize = 1000;
        const deletePromises = [];
        for (let i = 0; i < postIds.length; i += batchSize) {
            const batch = postIds.slice(i, batchSize);
            deletePromises.push(
                deletePosts(serverUrl, batch),
            );
        }
        const deleteResult = await Promise.all(deletePromises);
        for (const {error} of deleteResult) {
            if (error) {
                return {error};
            }
        }
    }

    return {error: undefined};
}

// Returns cutoff time based on the policy's post_duration
function getDataRetentionPolicyCutoff(postDuration: number) {
    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - postDuration);
    periodDate.setHours(0);
    periodDate.setMinutes(0);
    periodDate.setSeconds(0);
    return periodDate.getTime();
}

export async function setLastServerVersionCheck(serverUrl: string, reset = false) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        await operator.handleSystem({
            systems: [{
                id: SYSTEM_IDENTIFIERS.LAST_SERVER_VERSION_CHECK,
                value: reset ? 0 : Date.now(),
            }],
            prepareRecordsOnly: false,
        });
        return {error: undefined};
    } catch (error) {
        logError('setLastServerVersionCheck', error);
        return {error};
    }
}

export async function setGlobalThreadsTab(serverUrl: string, globalThreadsTab: GlobalThreadsTab) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        await operator.handleSystem({
            systems: [{
                id: SYSTEM_IDENTIFIERS.GLOBAL_THREADS_TAB,
                value: globalThreadsTab,
            }],
            prepareRecordsOnly: false,
        });
        return {error: undefined};
    } catch (error) {
        logError('setGlobalThreadsTab', error);
        return {error};
    }
}

export async function dismissAnnouncement(serverUrl: string, announcementText: string) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.LAST_DISMISSED_BANNER, value: announcementText}], prepareRecordsOnly: false});
        return {error: undefined};
    } catch (error) {
        logError('An error occurred while dismissing an announcement', error);
        return {error};
    }
}

const SLOW_CLEANUP_THRESHOLD = 5000;

function captureSlowCleanup(serverUrl: string, duration: number) {
    if (duration < SLOW_CLEANUP_THRESHOLD) {
        return;
    }

    captureMessage(`Slow volume-based cleanup: ${JSON.stringify({
        serverUrl,
        duration,
    })}`);
}

export async function volumeBasedCleanup(serverUrl: string) {
    const start = Date.now();
    let duration = 0;

    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        // Cleanup posts first. This cascades to threads/reactions/participants via deletePosts().
        await cleanupPostsByVolume(serverUrl, database);

        duration = Date.now() - start;
        captureSlowCleanup(serverUrl, duration);
        logInfo('VOLUME BASED CLEANUP TOOK', `${duration}ms`);

        return {error: undefined};
    } catch (error) {
        duration = Date.now() - start;
        captureSlowCleanup(serverUrl, duration);
        logInfo('VOLUME BASED CLEANUP TOOK', `${duration}ms`);
        logError('[volumeBasedCleanup] Failed', error);
        return {error};
    }
}

async function cleanupPostsByVolume(serverUrl: string, database: Database) {
    let count = await database.get<PostModel>(POST).query().fetchCount();
    logDebug('[cleanupPostsByVolume] Current count:', count);

    while (count > POST_VOLUME_THRESHOLD) {
        const toDelete = Math.min(count - POST_VOLUME_TARGET, CLEANUP_BATCH_SIZE);
        logDebug(`[cleanupPostsByVolume] Deleting ${toDelete} oldest posts (current: ${count}, target: ${POST_VOLUME_TARGET})`);

        // eslint-disable-next-line no-await-in-loop -- sequential batch cleanup; each iteration depends on updated count
        const postIds = await database.get<PostModel>(POST).query(
            Q.sortBy('create_at', Q.asc),
            Q.take(toDelete),
        ).fetchIds();

        if (!postIds.length) {
            break;
        }

        // eslint-disable-next-line no-await-in-loop -- sequential batch cleanup
        const {error} = await dataRetentionCleanPosts(serverUrl, postIds);
        if (error) {
            logError('[cleanupPostsByVolume] Error deleting posts batch', error);
            break;
        }

        // eslint-disable-next-line no-await-in-loop -- sequential batch cleanup
        count = await database.get<PostModel>(POST).query().fetchCount();
    }
}

