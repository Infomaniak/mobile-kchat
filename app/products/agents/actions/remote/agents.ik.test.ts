// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import NetworkManager from '@managers/network_manager';

import {rewriteMessage} from './agents';

const mockGetRewrittenMessage = jest.fn();

jest.mock('@managers/network_manager', () => ({
    getClient: jest.fn(),
}));

describe('rewriteMessage (no agentId)', () => {
    const serverUrl = 'https://server.test';

    beforeEach(() => {
        jest.clearAllMocks();
        (NetworkManager.getClient as jest.Mock).mockReturnValue({
            getRewrittenMessage: mockGetRewrittenMessage,
        });
    });

    it('should call getRewrittenMessage without agentId', async () => {
        mockGetRewrittenMessage.mockResolvedValue('Improved text');

        const result = await rewriteMessage(serverUrl, 'Hello world', 'improve_writing', undefined);

        expect(mockGetRewrittenMessage).toHaveBeenCalledWith('Hello world', 'improve_writing', undefined);
        expect(mockGetRewrittenMessage).toHaveBeenCalledTimes(1);

        // Verify only 3 args passed (no agentId)
        expect(mockGetRewrittenMessage.mock.calls[0]).toHaveLength(3);
        expect(result).toEqual({rewrittenText: 'Improved text'});
    });

    it('should pass custom prompt for custom action', async () => {
        mockGetRewrittenMessage.mockResolvedValue('Formal text');

        const result = await rewriteMessage(serverUrl, 'Hey', 'custom', 'Make it formal');

        expect(mockGetRewrittenMessage).toHaveBeenCalledWith('Hey', 'custom', 'Make it formal');
        expect(result).toEqual({rewrittenText: 'Formal text'});
    });

    it('should return error on failure', async () => {
        mockGetRewrittenMessage.mockRejectedValue(new Error('Network error'));

        const result = await rewriteMessage(serverUrl, 'Test', 'shorten', undefined);

        expect(result.error).toBeDefined();
        expect(result.rewrittenText).toBeUndefined();
    });
});
