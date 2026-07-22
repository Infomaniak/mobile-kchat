// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import DatabaseManager from '@database/manager';
import {getChannelById, getMyChannel} from '@queries/servers/channel';
import {getPostById} from '@queries/servers/post';
import {getIsCRTEnabled} from '@queries/servers/thread';
import EphemeralStore from '@store/ephemeral_store';

import {switchToChannelById} from './channel';
import {fetchPostById, fetchPostsAround} from './post';
import {jumpToPostInChannel} from './post_navigation';

import type PostModel from '@typings/database/models/servers/post';

jest.mock('@constants', () => ({
    General: {
        POST_AROUND_CHUNK_SIZE: 10,
    },
}));

jest.mock('@database/manager', () => ({
    __esModule: true,
    default: {
        getServerDatabaseAndOperator: jest.fn(),
    },
}));

jest.mock('@queries/servers/channel', () => ({
    getChannelById: jest.fn(),
    getMyChannel: jest.fn(),
}));

jest.mock('@queries/servers/post', () => ({
    getPostById: jest.fn(),
}));

jest.mock('@queries/servers/thread', () => ({
    getIsCRTEnabled: jest.fn(),
}));

jest.mock('@store/ephemeral_store', () => ({
    __esModule: true,
    default: {
        addLoadingMessagesForChannel: jest.fn(),
        setChannelJumpTarget: jest.fn(),
        stopLoadingMessagesForChannel: jest.fn(),
    },
}));

jest.mock('@utils/errors', () => ({
    getFullErrorMessage: jest.fn((error) => (error instanceof Error ? error.message : String(error))),
}));

jest.mock('@utils/log', () => ({
    logDebug: jest.fn(),
}));

jest.mock('./channel', () => ({
    switchToChannelById: jest.fn(),
}));

jest.mock('./post', () => ({
    fetchPostById: jest.fn(),
    fetchPostsAround: jest.fn(),
}));

const serverUrl = 'https://server.test';
const channelId = 'channel-id';
const teamId = 'team-id';
const postId = 'post-id';
const rootPostId = 'root-post-id';
const database = {name: 'database'};

const mockPostModel = (overrides: Partial<PostModel> = {}) => ({
    channelId,
    createAt: 1000,
    id: postId,
    rootId: '',
    ...overrides,
}) as PostModel;

const mockApiPost = (overrides: Partial<Post> = {}) => ({
    channel_id: channelId,
    create_at: 1000,
    id: postId,
    root_id: '',
    ...overrides,
}) as Post;

describe('jumpToPostInChannel', () => {
    const mockedDatabaseManager = jest.mocked(DatabaseManager);
    const mockedEphemeralStore = jest.mocked(EphemeralStore);
    const mockedFetchPostById = jest.mocked(fetchPostById);
    const mockedFetchPostsAround = jest.mocked(fetchPostsAround);
    const mockedGetChannelById = jest.mocked(getChannelById);
    const mockedGetIsCRTEnabled = jest.mocked(getIsCRTEnabled);
    const mockedGetMyChannel = jest.mocked(getMyChannel);
    const mockedGetPostById = jest.mocked(getPostById);
    const mockedSwitchToChannelById = jest.mocked(switchToChannelById);

    beforeEach(() => {
        mockedDatabaseManager.getServerDatabaseAndOperator.mockReturnValue({database} as unknown as ReturnType<typeof DatabaseManager.getServerDatabaseAndOperator>);
        mockedFetchPostById.mockResolvedValue({post: mockApiPost()});
        mockedFetchPostsAround.mockResolvedValue({posts: [mockApiPost()]});
        mockedGetChannelById.mockResolvedValue({id: channelId, teamId} as never);
        mockedGetIsCRTEnabled.mockResolvedValue(false);
        mockedGetMyChannel.mockResolvedValue({channelId} as never);
        mockedGetPostById.mockResolvedValue(mockPostModel());
        mockedSwitchToChannelById.mockResolvedValue({});
    });

    it('should load posts around a local post and switch to its channel', async () => {
        const result = await jumpToPostInChannel(serverUrl, {postId});

        expect(result.error).toBeUndefined();
        expect(mockedFetchPostById).not.toHaveBeenCalled();
        expect(mockedFetchPostsAround).toHaveBeenCalledWith(serverUrl, channelId, postId, 10, false);
        expect(mockedEphemeralStore.setChannelJumpTarget).toHaveBeenCalledWith(serverUrl, {
            channelId,
            createAt: 1000,
            postId,
        });
        expect(mockedSwitchToChannelById).toHaveBeenCalledWith(serverUrl, channelId, teamId, false, undefined);
    });

    it('should fetch the target post when it is not already stored locally', async () => {
        mockedGetPostById.mockResolvedValue(undefined);
        mockedFetchPostById.mockResolvedValue({post: mockApiPost({create_at: 2000})});

        const result = await jumpToPostInChannel(serverUrl, {
            groupLabel: 'Notification',
            postId,
        });

        expect(result.error).toBeUndefined();
        expect(mockedFetchPostById).toHaveBeenCalledWith(serverUrl, postId, true, 'Notification');
        expect(mockedEphemeralStore.setChannelJumpTarget).toHaveBeenCalledWith(serverUrl, {
            channelId,
            createAt: 2000,
            postId,
        });
        expect(mockedSwitchToChannelById).toHaveBeenCalledWith(serverUrl, channelId, teamId, false, 'Notification');
    });

    it('should jump to the root post for CRT replies', async () => {
        mockedGetIsCRTEnabled.mockResolvedValue(true);
        mockedGetPostById.mockImplementation(async (_database, id) => {
            if (id === postId) {
                return mockPostModel({rootId: rootPostId});
            }

            return mockPostModel({createAt: 3000, id: rootPostId});
        });

        const result = await jumpToPostInChannel(serverUrl, {postId});

        expect(result.error).toBeUndefined();
        expect(mockedFetchPostsAround).toHaveBeenCalledWith(serverUrl, channelId, rootPostId, 10, true);
        expect(mockedEphemeralStore.setChannelJumpTarget).toHaveBeenCalledWith(serverUrl, {
            channelId,
            createAt: 3000,
            postId: rootPostId,
        });
        expect(mockedSwitchToChannelById).toHaveBeenCalledWith(serverUrl, channelId, teamId, false, undefined);
    });

    it('should not set a jump target or switch channel when fetching the surrounding posts fails', async () => {
        const error = new Error('around failed');
        mockedFetchPostsAround.mockResolvedValue({error});

        const result = await jumpToPostInChannel(serverUrl, {postId});

        expect(result.error).toBe(error);
        expect(mockedEphemeralStore.setChannelJumpTarget).not.toHaveBeenCalled();
        expect(mockedSwitchToChannelById).not.toHaveBeenCalled();
        expect(mockedEphemeralStore.stopLoadingMessagesForChannel).toHaveBeenCalledWith(serverUrl, channelId);
    });
});
