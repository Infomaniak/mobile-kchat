// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import {DeviceEventEmitter} from 'react-native';

import {ActionType, Events, Navigation, Screens} from '@constants';
import {MM_TABLES} from '@constants/database';
import DatabaseManager from '@database/manager';
import {getChannelById} from '@queries/servers/channel';
import {getPostById} from '@queries/servers/post';
import {getCurrentTeamId, getCurrentUserId, prepareCommonSystemValues, type PrepareCommonSystemValuesArgs, setCurrentTeamAndChannelId} from '@queries/servers/system';
import {addChannelToTeamHistory, addTeamToTeamHistory} from '@queries/servers/team';
import {getThreadById, prepareThreadsFromReceivedPosts, queryThreadsInTeam} from '@queries/servers/thread';
import {getCurrentUser} from '@queries/servers/user';
import {dismissAllModals, dismissAllModalsAndPopToRoot, dismissAllOverlays, goToScreen, navigateToScreen} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';
import NavigationStore from '@store/navigation_store';
import {isTablet} from '@utils/helpers';
import {logDebug, logError} from '@utils/log';

import type Model from '@nozbe/watermelondb/Model';
import type ThreadModel from '@typings/database/models/servers/thread';

const {SERVER: {THREAD}} = MM_TABLES;

export const switchToGlobalThreads = async (serverUrl: string, teamId?: string, prepareRecordsOnly = false) => {
    const dt = Date.now();
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const models: Model[] = [];

        let teamIdToUse = teamId;
        if (!teamId) {
            teamIdToUse = await getCurrentTeamId(database);
        }

        if (!teamIdToUse) {
            throw new Error('no team to switch to');
        }

        await setCurrentTeamAndChannelId(operator, teamIdToUse, '');
        const history = await addChannelToTeamHistory(operator, teamIdToUse, Screens.GLOBAL_THREADS, true);
        models.push(...history);

        if (!prepareRecordsOnly) {
            await operator.batchRecords(models, 'switchToGlobalThreads');
        }

        const isTabletDevice = isTablet();
        if (isTabletDevice) {
            DeviceEventEmitter.emit(Navigation.NAVIGATION_HOME, Screens.GLOBAL_THREADS);
        } else {
            goToScreen(Screens.GLOBAL_THREADS, '', {}, {topBar: {visible: false}});
        }

        logDebug('[switchToGlobalThreads] completed in', Date.now() - dt, 'ms');
        return {models};
    } catch (error) {
        logError('Failed switchToGlobalThreads', error);
        return {error};
    }
};

export const switchToThread = async (serverUrl: string, rootId: string, isFromNotification = false) => {
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const user = await getCurrentUser(database);
        if (!user) {
            throw new Error('User not found');
        }

        const post = await getPostById(database, rootId);
        if (!post) {
            throw new Error('Post not found');
        }
        const channel = await getChannelById(database, post.channelId);
        if (!channel) {
            throw new Error('Channel not found');
        }

        const currentTeamId = await getCurrentTeamId(database);
        const isTabletDevice = isTablet();
        const teamId = channel.teamId || currentTeamId;
        const currentThreadId = EphemeralStore.getCurrentThreadId();

        EphemeralStore.setCurrentThreadId(rootId);
        if (isFromNotification) {
            if (currentThreadId && currentThreadId === rootId && NavigationStore.getScreensInStack().includes(Screens.THREAD)) {
                await dismissAllModals();
                await dismissAllOverlays();
                return {};
            }

            await dismissAllModalsAndPopToRoot();
            await NavigationStore.waitUntilScreenIsTop(Screens.CHANNEL_LIST);
            if (currentTeamId !== teamId && isTabletDevice) {
                DeviceEventEmitter.emit(Navigation.NAVIGATION_HOME, Screens.GLOBAL_THREADS);
            }
        }

        if (currentTeamId !== teamId) {
            const modelPromises: Array<Promise<Model[]>> = [];
            modelPromises.push(addTeamToTeamHistory(operator, teamId, true));
            const commonValues: PrepareCommonSystemValuesArgs = {
                currentChannelId: channel.id,
                currentTeamId: teamId,
            };
            modelPromises.push(prepareCommonSystemValues(operator, commonValues));
            const models = (await Promise.all(modelPromises)).flat();
            if (models.length) {
                await operator.batchRecords(models, 'switchToThread');
            }
        }

        DeviceEventEmitter.emit(Events.CLOSE_INPUT_ACCESSORY_VIEW);

        // Bottom-sheet screens (gallery, pickers) are not modals but were
        // dismissed as RNN overlays in this flow before expo-router.
        if (NavigationStore.getScreensInStack().includes(Screens.THREAD) && NavigationStore.hasOverlaysOpened()) {
            await dismissAllModals();
            await dismissAllOverlays();
        }

        await NavigationStore.waitUntilScreenHasLoaded(Screens.CHANNEL_LIST);
        navigateToScreen(Screens.THREAD, {rootId, channelName: channel.displayName});

        return {};
    } catch (error) {
        logError('Failed switchToThread', error);
        EphemeralStore.setCurrentThreadId('');
        return {error};
    }
};

// When new post arrives:
// 1. If a reply, then update the reply_count, add user as the participant
// 2. Else add the post as a thread
export async function createThreadFromNewPost(serverUrl: string, post: Post, prepareRecordsOnly = false) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const models: Model[] = [];
        if (post.root_id) {
            // Update the thread data: `reply_count`
            const {model: threadModel} = await updateThread(serverUrl, post.root_id, {reply_count: post.reply_count}, true);
            if (threadModel) {
                models.push(threadModel);
            }

            // Add user as a participant to the thread
            const threadParticipantModels = await operator.handleThreadParticipants({
                threadsParticipants: [{
                    thread_id: post.root_id,
                    participants: [{
                        thread_id: post.root_id,
                        id: post.user_id,
                    }],
                }],
                prepareRecordsOnly: true,
                skipSync: true,
            });
            models.push(...threadParticipantModels);
        } else { // If the post is a root post, then we need to add it to the thread table
            const threadModels = await prepareThreadsFromReceivedPosts(operator, [post], false);
            models.push(...threadModels);
        }

        if (!prepareRecordsOnly) {
            await operator.batchRecords(models, 'createThreadFromNewPost');
        }

        return {models};
    } catch (error) {
        logError('Failed createThreadFromNewPost', error);
        return {error};
    }
}

// On receiving threads, Along with the "threads" & "thread participants", extract and save "posts" & "users"
export async function processReceivedThreads(serverUrl: string, threads: Thread[], teamId: string, prepareRecordsOnly = false) {
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const currentUserId = await getCurrentUserId(database);

        const posts: Post[] = [];
        const users: UserProfile[] = [];
        const threadsToHandle: ThreadWithLastFetchedAt[] = [];

        // Extract posts & users from the received threads
        for (let i = 0; i < threads.length; i++) {
            const {participants, post} = threads[i];
            posts.push(post);
            participants.forEach((participant) => {
                if (currentUserId !== participant.id) {
                    users.push(participant);
                }
            });
            threadsToHandle.push({...threads[i], lastFetchedAt: post.create_at});
        }

        const postModels = await operator.handlePosts({
            actionType: ActionType.POSTS.RECEIVED_IN_CHANNEL,
            order: [],
            posts,
            prepareRecordsOnly: true,
        });

        const threadModels = await operator.handleThreads({
            threads: threadsToHandle,
            teamId,
            prepareRecordsOnly: true,
        });

        const models = [...postModels, ...threadModels];

        if (users.length) {
            const userModels = await operator.handleUsers({
                users,
                prepareRecordsOnly: true,
            });
            models.push(...userModels);
        }

        if (!prepareRecordsOnly) {
            await operator.batchRecords(models, 'processReceivedThreads');
        }
        return {models};
    } catch (error) {
        logError('Failed processReceivedThreads', error);
        return {error};
    }
}

export async function markTeamThreadsAsRead(serverUrl: string, teamId: string, prepareRecordsOnly = false) {
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const threads = await queryThreadsInTeam(database, teamId, {onlyUnreads: true, hasReplies: true, isFollowing: true}).fetch();
        const models = threads.map((thread) => thread.prepareUpdate((record) => {
            record.unreadMentions = 0;
            record.unreadReplies = 0;
            record.lastViewedAt = Date.now();
            record.viewedAt = Date.now();
        }));
        if (!prepareRecordsOnly) {
            await operator.batchRecords(models, 'markTeamThreadsAsRead');
        }
        return {models};
    } catch (error) {
        logError('Failed markTeamThreadsAsRead', error);
        return {error};
    }
}

export async function markThreadAsViewed(serverUrl: string, threadId: string, prepareRecordsOnly = false) {
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const thread = await getThreadById(database, threadId);
        if (!thread) {
            return {error: 'Thread not found'};
        }

        thread.prepareUpdate((th) => {
            th.viewedAt = thread.lastViewedAt;
            th.lastViewedAt = Date.now();
        });

        if (!prepareRecordsOnly) {
            await operator.batchRecords([thread], 'markThreadAsViewed');
        }

        return {model: thread};
    } catch (error) {
        logError('Failed markThreadAsViewed', error);
        return {error};
    }
}

export async function updateThread(serverUrl: string, threadId: string, updatedThread: Partial<ThreadWithViewedAt>, prepareRecordsOnly = false) {
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const thread = await getThreadById(database, threadId);
        if (!thread) {
            throw new Error('Thread not found');
        }

        const model = thread.prepareUpdate((record) => {
            record.isFollowing = updatedThread.is_following ?? record.isFollowing;
            record.replyCount = updatedThread.reply_count ?? record.replyCount;
            record.lastViewedAt = updatedThread.last_viewed_at ?? record.lastViewedAt;
            record.viewedAt = updatedThread.viewed_at ?? record.viewedAt;
            record.unreadMentions = updatedThread.unread_mentions ?? record.unreadMentions;
            record.unreadReplies = updatedThread.unread_replies ?? record.unreadReplies;
        });
        if (!prepareRecordsOnly) {
            await operator.batchRecords([model], 'updateThread');
        }
        return {model};
    } catch (error) {
        let logger = logError;

        if (__DEV__) {
            logger = logDebug;
        }
        logger('Failed updateThread', error);
        return {error};
    }
}

export async function updateTeamThreadsSync(serverUrl: string, data: TeamThreadsSync, prepareRecordsOnly = false) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const models = await operator.handleTeamThreadsSync({data: [data], prepareRecordsOnly});
        if (!prepareRecordsOnly) {
            await operator.batchRecords(models, 'updateTeamThreadsSync');
        }
        return {models};
    } catch (error) {
        logError('Failed updateTeamThreadsSync', error);
        return {error};
    }
}

/**
 * Permanently removes a locally stored thread and its relations (team entries and participants).
 *
 * When the root post of a thread is deleted, the kChat server hard-deletes the thread row and the
 * threads sync never reports the deletion (threads are returned without any delete_at), so this is
 * the only way the app learns about it: the websocket post_deleted event on the root post.
 */
export async function deleteThread(serverUrl: string, threadId: string) {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const threads = await database.get<ThreadModel>(THREAD).query(Q.where('id', threadId)).fetch();
        if (!threads.length) {
            return {models: []};
        }

        await database.write(async () => {
            const promises: Array<Promise<void>> = [];
            for (const thread of threads) {
                promises.push(thread.destroyPermanently());
                promises.push(thread.threadsInTeam.destroyAllPermanently());
                promises.push(thread.participants.destroyAllPermanently());
            }
            await Promise.all(promises);
        });

        return {models: []};
    } catch (error) {
        logError('Failed deleteThread', error);
        return {error};
    }
}
