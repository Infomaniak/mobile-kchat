// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/**
 * Tests Infomaniak specifiques: Recherche dans les canaux publics sans etre membre
 * Ref: !1463 (webapp)
 */

import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import TestHelper from '@test/test_helper';

import {fetchMissingChannelsFromPosts} from './post';

jest.mock('@managers/network_manager');

const serverUrl = 'ik-search-test.com';
let operator: any;

const user1 = TestHelper.fakeUser();
const channel1 = TestHelper.fakeChannel({id: 'channel1'});
const channel2 = TestHelper.fakeChannel({id: 'channel2'});

const post1 = TestHelper.fakePost({channel_id: channel1.id, user_id: user1.id});
const post2 = TestHelper.fakePost({channel_id: channel2.id, user_id: user1.id});

const mockClient = {
    getChannel: jest.fn((id: string) => Promise.resolve({id, name: 'channel' + id, type: 'O'})),
    getMyChannelMember: jest.fn((id: string) => Promise.resolve({
        id: user1.id + '-' + id,
        user_id: user1.id,
        channel_id: id,
        roles: '',
        msg_count: 0,
        mention_count: 0,
    })),
};

beforeAll(() => {
    // @ts-ignore
    NetworkManager.getClient = jest.fn(() => mockClient);
});

beforeEach(async () => {
    await DatabaseManager.init([serverUrl]);
    operator = DatabaseManager.serverDatabases[serverUrl]!.operator;
    jest.clearAllMocks();
});

afterEach(async () => {
    await DatabaseManager.destroyServerDatabase(serverUrl);
});

describe('IK: Search in public channels without membership', () => {
    it('fetchMissingChannelsFromPosts - handles 404 on getMyChannelMember gracefully', async () => {
        // Arrange: API retourne 404 quand l'utilisateur n'est pas membre
        mockClient.getMyChannelMember.mockRejectedValueOnce({status_code: 404, message: 'not found'});

        // Act
        const result = await fetchMissingChannelsFromPosts(serverUrl, [post1]);

        // Assert: Ne doit pas crasher, doit retourner le canal sans membership
        expect(result.error).toBeUndefined();
        expect(result.channels).toBeDefined();
        expect(result.channels?.length).toBe(1);
        expect(result.channels?.[0].id).toBe(channel1.id);
        expect(result.channelMemberships).toBeDefined();
        expect(result.channelMemberships?.length).toBe(0);
    });

    it('fetchMissingChannelsFromPosts - rethrows non-404 errors', async () => {
        // Arrange: Erreur reseau (pas 404)
        mockClient.getMyChannelMember.mockRejectedValueOnce(new Error('network error'));

        // Act
        const result = await fetchMissingChannelsFromPosts(serverUrl, [post1]);

        // Assert: Doit propager l'erreur
        expect(result.error).toBeDefined();
    });

    it('fetchMissingChannelsFromPosts - handles mixed membership results', async () => {
        // Arrange: Membre du canal 1, pas membre du canal 2
        mockClient.getMyChannelMember
            .mockResolvedValueOnce({
                id: `${user1.id}-${channel1.id}`,
                user_id: user1.id,
                channel_id: channel1.id,
                roles: '',
                msg_count: 100,
                mention_count: 0,
            })
            .mockRejectedValueOnce({status_code: 404, message: 'not found'});

        // Act
        const result = await fetchMissingChannelsFromPosts(serverUrl, [post1, post2]);

        // Assert: 2 canaux mais 1 seul membership
        expect(result.error).toBeUndefined();
        expect(result.channels?.length).toBe(2);
        expect(result.channelMemberships?.length).toBe(1);
        expect(result.channelMemberships?.[0].channel_id).toBe(channel1.id);
    });

    it('fetchMissingChannelsFromPosts - handles multiple 404s', async () => {
        // Arrange: Non-membre de plusieurs canaux
        mockClient.getMyChannelMember
            .mockRejectedValueOnce({status_code: 404, message: 'not found'})
            .mockRejectedValueOnce({status_code: 404, message: 'not found'});

        // Act
        const result = await fetchMissingChannelsFromPosts(serverUrl, [post1, post2]);

        // Assert: Tous les canaux sont retournes sans memberships
        expect(result.error).toBeUndefined();
        expect(result.channels?.length).toBe(2);
        expect(result.channelMemberships?.length).toBe(0);
    });
});
