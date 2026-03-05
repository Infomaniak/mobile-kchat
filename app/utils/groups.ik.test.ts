// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {checkUserInOverlappingGroups} from '@actions/remote/groups';
import NetworkManager from '@managers/network_manager';

import {generateGroupAssociationId} from './groups';

jest.mock('@managers/network_manager');

describe('groups utility', () => {
    const mockClient = {
        getGroupsAssociatedToChannel: jest.fn(),
        getAllGroupsAssociatedToMembership: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (NetworkManager.getClient as jest.Mock).mockReturnValue(mockClient);
    });

    describe('generateGroupAssociationId', () => {
        test('should concatenate groupId and otherId with hyphen', () => {
            expect(generateGroupAssociationId('groupId', 'otherId')).toEqual('groupId-otherId');
        });
    });

    describe('checkUserInOverlappingGroups', () => {
        const serverUrl = 'https://example.com';
        const channelId = 'channel-123';
        const userId = 'user-456';

        test('should return false when channel has no groups', async () => {
            mockClient.getGroupsAssociatedToChannel.mockResolvedValue([]);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
            expect(mockClient.getGroupsAssociatedToChannel).toHaveBeenCalledWith(channelId);
            expect(mockClient.getAllGroupsAssociatedToMembership).not.toHaveBeenCalled();
        });

        test('should return false when user has no groups in common with channel', async () => {
            const channelGroups = [
                {id: 'group-1', name: 'Team A', display_name: 'Team A'},
                {id: 'group-2', name: 'Team B', display_name: 'Team B'},
            ];
            const userGroups = [
                {id: 'group-3', name: 'Team C', display_name: 'Team C'},
            ];

            mockClient.getGroupsAssociatedToChannel.mockResolvedValue(channelGroups);
            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue(userGroups);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
        });

        test('should return true when user has at least one group in common with channel', async () => {
            const channelGroups = [
                {id: 'group-1', name: 'Team A', display_name: 'Team A'},
                {id: 'group-2', name: 'Team B', display_name: 'Team B'},
            ];
            const userGroups = [
                {id: 'group-1', name: 'Team A', display_name: 'Team A'},
                {id: 'group-3', name: 'Team C', display_name: 'Team C'},
            ];

            mockClient.getGroupsAssociatedToChannel.mockResolvedValue(channelGroups);
            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue(userGroups);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(true);
        });

        test('should return false and not throw on API error', async () => {
            mockClient.getGroupsAssociatedToChannel.mockRejectedValue(new Error('Network error'));

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
        });

        test('should handle non-array response from getGroupsAssociatedToChannel', async () => {
            mockClient.getGroupsAssociatedToChannel.mockResolvedValue(null);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
        });

        test('should handle non-array response from getAllGroupsAssociatedToMembership', async () => {
            const channelGroups = [{id: 'group-1', name: 'Team A'}];
            mockClient.getGroupsAssociatedToChannel.mockResolvedValue(channelGroups);
            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue(null);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
        });
    });
});
