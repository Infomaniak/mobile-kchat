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
        const PER_PAGE = 60;

        test('should return false when user has no groups', async () => {
            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue([]);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
            expect(mockClient.getAllGroupsAssociatedToMembership).toHaveBeenCalledWith(userId);
            expect(mockClient.getGroupsAssociatedToChannel).not.toHaveBeenCalled();
        });

        test('should return false when channel has no groups', async () => {
            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue([{id: 'group-1'}]);
            mockClient.getGroupsAssociatedToChannel.mockResolvedValue([]);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
            expect(mockClient.getGroupsAssociatedToChannel).toHaveBeenCalledWith(channelId, '', 0, PER_PAGE);
        });

        test('should return false when user has no group in common with channel', async () => {
            const userGroups = [{id: 'group-3', name: 'Team C'}];
            const channelGroups = [
                {id: 'group-1', name: 'Team A'},
                {id: 'group-2', name: 'Team B'},
            ];

            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue(userGroups);
            mockClient.getGroupsAssociatedToChannel.mockResolvedValue(channelGroups);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
            expect(mockClient.getGroupsAssociatedToChannel).toHaveBeenCalledWith(channelId, '', 0, PER_PAGE);
        });

        test('should return true when user has at least one group in common with channel', async () => {
            const userGroups = [
                {id: 'group-1', name: 'Team A'},
                {id: 'group-3', name: 'Team C'},
            ];
            const channelGroups = [
                {id: 'group-1', name: 'Team A'},
                {id: 'group-2', name: 'Team B'},
            ];

            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue(userGroups);
            mockClient.getGroupsAssociatedToChannel.mockResolvedValue(channelGroups);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(true);
        });

        test('should return false and not throw when getAllGroupsAssociatedToMembership throws', async () => {
            mockClient.getAllGroupsAssociatedToMembership.mockRejectedValue(new Error('Network error'));

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
            expect(mockClient.getGroupsAssociatedToChannel).not.toHaveBeenCalled();
        });

        test('should return false and not throw when getGroupsAssociatedToChannel throws', async () => {
            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue([{id: 'group-1'}]);
            mockClient.getGroupsAssociatedToChannel.mockRejectedValue(new Error('Network error'));

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
        });

        test('should handle non-array response from getAllGroupsAssociatedToMembership', async () => {
            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue(null);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
            expect(mockClient.getGroupsAssociatedToChannel).not.toHaveBeenCalled();
        });

        test('should handle non-array response from getGroupsAssociatedToChannel', async () => {
            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue([{id: 'group-1'}]);
            mockClient.getGroupsAssociatedToChannel.mockResolvedValue(null);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
        });

        test('should paginate and find a match on the second page', async () => {
            const userGroups = [{id: 'group-match'}];

            // Page 0: full page (60 groups), no match
            const page0 = Array.from({length: PER_PAGE}, (_, i) => ({id: `group-p0-${i}`}));

            // Page 1: partial page with a matching group
            const page1 = [{id: 'group-other'}, {id: 'group-match'}];

            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue(userGroups);
            mockClient.getGroupsAssociatedToChannel.
                mockResolvedValueOnce(page0).
                mockResolvedValueOnce(page1);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(true);
            expect(mockClient.getGroupsAssociatedToChannel).toHaveBeenCalledTimes(2);
            expect(mockClient.getGroupsAssociatedToChannel).toHaveBeenNthCalledWith(1, channelId, '', 0, PER_PAGE);
            expect(mockClient.getGroupsAssociatedToChannel).toHaveBeenNthCalledWith(2, channelId, '', 1, PER_PAGE);
        });

        test('should paginate through all pages and return false when no match found', async () => {
            const userGroups = [{id: 'group-not-there'}];

            // Page 0: full page, no match → continues
            const page0 = Array.from({length: PER_PAGE}, (_, i) => ({id: `group-p0-${i}`}));

            // Page 1: partial page (last page), no match → stops
            const page1 = [{id: 'group-p1-0'}, {id: 'group-p1-1'}];

            mockClient.getAllGroupsAssociatedToMembership.mockResolvedValue(userGroups);
            mockClient.getGroupsAssociatedToChannel.
                mockResolvedValueOnce(page0).
                mockResolvedValueOnce(page1);

            const result = await checkUserInOverlappingGroups(serverUrl, channelId, userId);

            expect(result).toBe(false);
            expect(mockClient.getGroupsAssociatedToChannel).toHaveBeenCalledTimes(2);
            expect(mockClient.getGroupsAssociatedToChannel).toHaveBeenNthCalledWith(2, channelId, '', 1, PER_PAGE);
        });
    });
});
