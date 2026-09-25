// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {waitFor} from '@testing-library/react-native';

import {deleteThread, processReceivedThreads} from '@actions/local/thread';
import {ActionType} from '@constants';
import {MM_TABLES, SYSTEM_IDENTIFIERS} from '@constants/database';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import TestHelper from '@test/test_helper';

import {
    fetchThread,
    updateTeamThreadsAsRead,
    markThreadAsRead,
    markThreadAsUnread,
    updateThreadFollowing,
    fetchThreads,
    syncTeamThreads,
    rescanTeamThreads,
    loadEarlierThreads,
    fetchAndSwitchToThread,
    syncThreadsIfNeeded,
    batchTeamThreadSync,
} from './thread';

import type {Client} from '@client/rest';
import type ServerDataOperator from '@database/operator/server_data_operator';
import type ThreadModel from '@typings/database/models/servers/thread';

const {SERVER: {THREAD, THREADS_IN_TEAM, THREAD_PARTICIPANT}} = MM_TABLES;

const serverUrl = 'baseHandler.test.com';
let operator: ServerDataOperator;

const channelId = 'channelid1';
const teamId = 'teamid1';

const team: Team = {
    id: teamId,
    name: 'team1',
} as Team;

const user1 = {id: 'userid1', username: 'user1', email: 'user1@mattermost.com', roles: ''} as UserProfile;
const user2 = {id: 'userid2', username: 'user2', email: 'user2@mattermost.com', roles: ''} as UserProfile;

const post1 = TestHelper.fakePost({channel_id: channelId, id: 'postid1'});

const thread1: Thread = {id: 'postid1',
    reply_count: 1,
    last_reply_at: 1,
    last_viewed_at: 1,
    participants: [user1],
    post: {id: 'postid1',
        channel_id: channelId,
        create_at: 1,
        message: 'post1',
        user_id: user1.id} as Post,
    unread_replies: 0,
    unread_mentions: 0,
    delete_at: 0,
};

const threads = [
    thread1,
] as ThreadWithLastFetchedAt[];

const throwFunc = () => {
    throw Error('error');
};

let unreadFetchError = false;
const getThreadsMock = jest.fn((userId: string, _teamId: string, _before: unknown, _after: unknown, _perPage: unknown, _deleted: unknown, unread?: boolean, _since?: number) => {
    if (unread && unreadFetchError) {
        return Promise.reject(new Error('unread fetch failed'));
    }
    return Promise.resolve({threads, total: threads.length, total_unread_mentions: 0, total_unread_threads: 0});
});

const partialClient: Partial<Client> = {
    getThread: jest.fn((userId: string, _teamId: string, threadId: string) => Promise.resolve({...thread1, id: threadId})),
    updateTeamThreadsAsRead: jest.fn(),
    markThreadAsRead: jest.fn(),
    markThreadAsUnread: jest.fn(),
    updateThreadFollow: jest.fn(),
    getThreads: getThreadsMock,
};
const mockClient = partialClient as Client;

let mockGetIsCRTEnabled: jest.Mock;
jest.mock('@queries/servers/thread', () => {
    const original = jest.requireActual('@queries/servers/thread');
    mockGetIsCRTEnabled = jest.fn(() => true);
    return {
        ...original,
        getIsCRTEnabled: mockGetIsCRTEnabled,
    };
});

beforeAll(() => {

    // @ts-ignore
    NetworkManager.getClient = () => mockClient;
});

beforeEach(async () => {
    await DatabaseManager.init([serverUrl]);
    operator = DatabaseManager.serverDatabases[serverUrl]!.operator;
});

afterEach(async () => {
    await DatabaseManager.destroyServerDatabase(serverUrl);
});

describe('get threads', () => {
    it('fetchThread - handle error', async () => {
        jest.mocked(mockClient.getThread).mockImplementationOnce(jest.fn(throwFunc));
        const result = await fetchThread(serverUrl, teamId, thread1.id);
        expect(result).toBeDefined();
        expect(result.error).toBeDefined();
    });

    it('fetchThread - base case', async () => {
        const result = await fetchThread(serverUrl, teamId, thread1.id);
        expect(result).toBeDefined();
        expect(result.error).toBeUndefined();
        expect(result.data).toBeDefined();
    });

    it('fetchThreads - handle error', async () => {
        const result = await fetchThreads('foo', '', {});
        expect(result).toBeDefined();
        expect(result.error).toBeTruthy();
    });

    it('fetchThreads - no current user', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});

        const result = await fetchThreads(serverUrl, team.id, {});
        expect(result).toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error).toBe('currentUser not found');
    });

    it('fetchThreads - base case', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        const result = await fetchThreads(serverUrl, team.id, {});
        expect(result).toBeDefined();
        expect(result.error).toBeFalsy();
        expect(result.threads).toBeDefined();
        expect(result.threads?.[0].id).toBe(thread1.id);
    });

    it('syncTeamThreads - handle error', async () => {
        const result = await syncTeamThreads('foo', '');
        expect(result).toBeDefined();
        expect(result.error).toBeTruthy();
    });

    it('syncTeamThreads - base case', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        const result = await syncTeamThreads(serverUrl, team.id);
        expect(result).toBeDefined();
        expect(result.error).toBeFalsy();
        expect(result.models).toBeDefined();
        expect(result.models?.length).toBe(4); // 1 thread, 1 thread participant, 1 latest thread in team, 1 team thread sync (the unread thread is actually the latest so it the duplicate is removed)

        // Sync again after first sync
        const result2 = await syncTeamThreads(serverUrl, team.id);
        expect(result2).toBeDefined();
        expect(result2.error).toBeFalsy();
        expect(result2.models).toBeDefined();
        expect(result2.models?.length).toBe(1); // 1 team thread sync
    });

    it('syncTeamThreads - surfaces unread threads fetch error on incremental sync [RM-591015]', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        // First sync populates the sync data so the next sync takes the incremental path
        const first = await syncTeamThreads(serverUrl, team.id);
        expect(first.error).toBeFalsy();

        unreadFetchError = true;
        try {
            const result = await syncTeamThreads(serverUrl, team.id);
            expect(result).toBeDefined();
            expect(result.error).toBeTruthy();
        } finally {
            unreadFetchError = false;
        }
    });

    it('syncTeamThreads - keeps the incremental since on every sync so a refresh does not re-fetch all threads [RM-625222]', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        // First sync populates the sync data so the next sync takes the incremental path
        const first = await syncTeamThreads(serverUrl, team.id);
        expect(first.error).toBeFalsy();

        getThreadsMock.mockClear();
        const second = await syncTeamThreads(serverUrl, team.id);
        expect(second.error).toBeFalsy();

        // Every all-threads fetch must use the incremental since, never a full re-fetch (the unread fetch is a full re-fetch by design)
        const allThreadsCalls = getThreadsMock.mock.calls.filter((call) => call[5] === true);
        expect(allThreadsCalls.length).toBeGreaterThan(0);
        for (const call of allThreadsCalls) {
            expect(call[7]).toBeGreaterThan(0);
        }
    });

    it('rescanTeamThreads - re-applies thread data without the incremental since window [RM-625222]', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        const getThreadRow = async () => {
            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            const rows = await database.get(THREAD).query().fetch();
            return rows.find((t) => t.id === thread1.id) as ThreadModel | undefined;
        };

        // Seed the local thread with stale data
        const seeded = await rescanTeamThreads(serverUrl, team.id);
        expect(seeded.error).toBeFalsy();
        expect((await getThreadRow())?.replyCount).toBe(1);

        // The server now reports newer data, the rescan must re-apply it even though the
        // incremental window would consider the thread already seen
        getThreadsMock.mockImplementationOnce(() => Promise.resolve({
            threads: [{...thread1, reply_count: 5} as ThreadWithLastFetchedAt],
            total: 1,
            total_unread_mentions: 0,
            total_unread_threads: 0,
        }));

        const rescan = await rescanTeamThreads(serverUrl, team.id);
        expect(rescan.error).toBeFalsy();
        expect((await getThreadRow())?.replyCount).toBe(5);

        // The rescan fetches without a since window
        const lastCall = getThreadsMock.mock.calls[getThreadsMock.mock.calls.length - 1];
        expect(lastCall[7]).toBeUndefined();
    });

    it('deleteThread - removes the local thread, its team entries and participants [RM-625222]', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const countRows = async (table: string) => (await database.get(table).query().fetch()).length;

        // Seed the thread with a second participant so children rows exist
        const seeded = await processReceivedThreads(serverUrl, [{...thread1, participants: [user1, user2]}], team.id);
        expect(seeded.error).toBeFalsy();

        const getThreadRow = async () => {
            const rows = await database.get(THREAD).query().fetch();
            return rows.find((t) => t.id === thread1.id);
        };
        expect(await getThreadRow()).toBeDefined();
        expect(await countRows(THREADS_IN_TEAM)).toBeGreaterThan(0);
        expect(await countRows(THREAD_PARTICIPANT)).toBeGreaterThan(0);

        const res = await deleteThread(serverUrl, thread1.id);
        expect(res.error).toBeFalsy();

        expect(await getThreadRow()).toBeUndefined();
        expect(await countRows(THREADS_IN_TEAM)).toBe(0);
        expect(await countRows(THREAD_PARTICIPANT)).toBe(0);
    });

    it('syncThreadsIfNeeded - handle error', async () => {
        const result = await syncThreadsIfNeeded('foo', true, []);
        expect(result).toBeDefined();
        expect(result.error).toBeTruthy();
    });

    it('syncThreadsIfNeeded - base case', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        const result = await syncThreadsIfNeeded(serverUrl, true, [team]);
        expect(result).toBeDefined();
        expect(result.error).toBeFalsy();
        expect(result.models).toBeDefined();
        expect(result.models?.length).toBe(4); // 1 thread, 1 thread participant, 1 latest thread in team, 1 team thread sync (the unread thread is actually the latest so it the duplicate is removed)
    });

    it('loadEarlierThreads - handle error', async () => {
        const result = await loadEarlierThreads('foo', '', '');
        expect(result).toBeDefined();
        expect(result.error).toBeTruthy();
    });

    it('loadEarlierThreads - no current user', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});

        const result = await loadEarlierThreads(serverUrl, team.id, thread1.id);
        expect(result).toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.error).toBe('currentUser not found');
    });

    it('loadEarlierThreads - base case', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        const result = await loadEarlierThreads(serverUrl, team.id, thread1.id);
        expect(result).toBeDefined();
        expect(result.error).toBeUndefined();
        expect(result.threads).toBeDefined();
        expect(result.threads?.[0].id).toBe(thread1.id);
        expect(result.models).toBeDefined();
        expect(result.models?.length).toBe(4); // 1 thread, 1 thread participant, 1 thread in team, 1 team thread sync
    });

    it('fetchAndSwitchToThread - handle error', async () => {
        const result = await fetchAndSwitchToThread('foo', '');
        expect(result).toBeDefined();
        expect(result.error).toBeTruthy();
    });

    it('fetchAndSwitchToThread - does not crash when user is not a member', async () => {
        await operator.handlePosts({
            actionType: ActionType.POSTS.RECEIVED_IN_CHANNEL,
            order: [post1.id],
            posts: [post1],
            prepareRecordsOnly: false,
        });
        await operator.handleThreads({threads, prepareRecordsOnly: false, teamId: team.id});

        const result = await fetchAndSwitchToThread(serverUrl, thread1.id);
        expect(result).toBeDefined();
        expect(result.error).toBeUndefined();
    });
});

describe('update threads', () => {
    it('updateTeamThreadsAsRead - handle error', async () => {
        jest.mocked(mockClient.updateTeamThreadsAsRead).mockImplementationOnce(jest.fn(throwFunc));
        const result = await updateTeamThreadsAsRead(serverUrl, teamId);
        expect(result).toBeDefined();
        expect(result.error).toBeDefined();
    });

    it('updateTeamThreadsAsRead - base case', async () => {
        const result = await updateTeamThreadsAsRead(serverUrl, teamId);
        expect(result).toBeDefined();
        expect(result.error).toBeUndefined();
    });

    it('markThreadAsRead - handle error', async () => {
        const result = await markThreadAsRead('foo', '', '');
        expect(result).toBeDefined();
        expect(result.error).toBeDefined();
    });

    it('markThreadAsRead - base case', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_TEAM_ID, value: teamId}], prepareRecordsOnly: false});
        await operator.handlePosts({
            actionType: ActionType.POSTS.RECEIVED_IN_CHANNEL,
            order: [post1.id],
            posts: [post1],
            prepareRecordsOnly: false,
        });

        const result = await markThreadAsRead(serverUrl, undefined, thread1.id);
        expect(result).toBeDefined();
        expect(result.error).toBeUndefined();
    });

    it('markThreadAsUnread - handle error', async () => {
        const result = await markThreadAsUnread('foo', '', '', '');
        expect(result).toBeDefined();
        expect(result.error).toBeDefined();
    });

    it('markThreadAsUnread - base case', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_TEAM_ID, value: teamId}], prepareRecordsOnly: false});
        await operator.handlePosts({
            actionType: ActionType.POSTS.RECEIVED_IN_CHANNEL,
            order: [post1.id],
            posts: [post1],
            prepareRecordsOnly: false,
        });

        const result = await markThreadAsUnread(serverUrl, '', thread1.id, post1.id);
        expect(result).toBeDefined();
        expect(result.error).toBeUndefined();
    });

    it('updateThreadFollowing - handle error', async () => {
        const result = await updateThreadFollowing('foo', '', '', false, false);
        expect(result).toBeDefined();
        expect(result.error).toBeDefined();
    });

    it('updateThreadFollowing - base case', async () => {
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_TEAM_ID, value: teamId}], prepareRecordsOnly: false});
        await operator.handlePosts({
            actionType: ActionType.POSTS.RECEIVED_IN_CHANNEL,
            order: [post1.id],
            posts: [post1],
            prepareRecordsOnly: false,
        });
        await operator.handleThreads({threads, prepareRecordsOnly: false, teamId: team.id});

        const result = await updateThreadFollowing(serverUrl, '', thread1.id, true, true);
        expect(result).toBeDefined();
        expect(result.error).toBeUndefined();
    });
});

describe('batchTeamThreadSync', () => {
    // We don't use fake timers since they break the
    // database operations.

    beforeEach(() => {
        jest.mocked(mockClient.getThreads).mockClear();
    });

    const teamFilter = (id: string) => {
        return (call: unknown[]) => call[1] === id && call[6] === undefined;
    };

    // fetchThreads calls twice the function, one for the unreads and one for
    // the latests. We expect that part to work correctly and if one is called
    // for unreads, the one for the latest is also called.
    const allCallsFilter = (call: unknown[]) => call[6] === undefined;

    it('returns early when CRT is disabled', async () => {
        mockGetIsCRTEnabled.mockResolvedValueOnce(false);

        await batchTeamThreadSync(serverUrl, teamId);

        await waitFor(() => expect(mockClient.getThreads).not.toHaveBeenCalled(), {timeout: 600});
    });

    it('schedules sync after timeout when CRT is enabled', async () => {
        mockGetIsCRTEnabled.mockResolvedValue(true);
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        await batchTeamThreadSync(serverUrl, teamId);
        expect(mockClient.getThreads).not.toHaveBeenCalled();

        await waitFor(() => expect(mockClient.getThreads).toHaveBeenCalled());
        const getThreadsCalls = jest.mocked(mockClient.getThreads).mock.calls;
        expect(getThreadsCalls.filter(teamFilter(teamId))).toHaveLength(1);
        expect(getThreadsCalls.filter(allCallsFilter)).toHaveLength(1);
    });

    it('batches multiple teamIds and syncs each after timeout', async () => {
        mockGetIsCRTEnabled.mockResolvedValue(true);
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        await batchTeamThreadSync(serverUrl, teamId);
        await batchTeamThreadSync(serverUrl, 'teamid2');
        expect(mockClient.getThreads).not.toHaveBeenCalled();

        await waitFor(() => expect(mockClient.getThreads).toHaveBeenCalled());
        const getThreadsCalls = jest.mocked(mockClient.getThreads).mock.calls;
        expect(getThreadsCalls.filter(teamFilter(teamId))).toHaveLength(1);
        expect(getThreadsCalls.filter(teamFilter('teamid2'))).toHaveLength(1);
        expect(getThreadsCalls.filter(allCallsFilter)).toHaveLength(2);
    });

    it('calling several times for the same team id does not create multiple calls', async () => {
        mockGetIsCRTEnabled.mockResolvedValue(true);
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        await batchTeamThreadSync(serverUrl, teamId);
        await batchTeamThreadSync(serverUrl, teamId);

        await waitFor(() => expect(mockClient.getThreads).toHaveBeenCalled());
        const getThreadsCalls = jest.mocked(mockClient.getThreads).mock.calls;
        expect(getThreadsCalls.filter(teamFilter(teamId))).toHaveLength(1);
        expect(getThreadsCalls.filter(allCallsFilter)).toHaveLength(1);
    });

    it('includes direct channels when empty teamId is in batch only once', async () => {
        mockGetIsCRTEnabled.mockResolvedValue(true);
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});

        await batchTeamThreadSync(serverUrl, '');
        await batchTeamThreadSync(serverUrl, teamId);
        await batchTeamThreadSync(serverUrl, 'teamid2');
        await batchTeamThreadSync(serverUrl, 'teamid3');

        await waitFor(() => expect(mockClient.getThreads).toHaveBeenCalled());
        expect(mockClient.getThreads).toHaveBeenCalled();
        const getThreadsCalls = jest.mocked(mockClient.getThreads).mock.calls;
        expect(getThreadsCalls.filter(teamFilter(teamId)).length).toBe(1);
        expect(getThreadsCalls.filter(teamFilter('teamid2')).length).toBe(1);
        expect(getThreadsCalls.filter(teamFilter('teamid3')).length).toBe(1);
        expect(getThreadsCalls.filter(allCallsFilter)).toHaveLength(3);
        expect(getThreadsCalls.filter((call) => call[10] === false && call[6] === undefined).length).toBe(1);
    });

    it('logs error when syncTeamThreads returns error', async () => {
        mockGetIsCRTEnabled.mockResolvedValue(true);
        await operator.handleSystem({systems: [{id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: user1.id}], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user1], prepareRecordsOnly: false});
        const logErrorSpy = jest.spyOn(require('@utils/log'), 'logError').mockImplementation(() => {});
        jest.mocked(mockClient.getThreads).mockImplementationOnce(() => {
            throw new Error('sync failed');
        });

        await batchTeamThreadSync(serverUrl, teamId);

        await waitFor(() => expect(logErrorSpy).toHaveBeenCalled());
        expect(logErrorSpy).toHaveBeenCalledWith('batchTeamThreadSync: Error', expect.any(Error));
        logErrorSpy.mockRestore();
    });
});
