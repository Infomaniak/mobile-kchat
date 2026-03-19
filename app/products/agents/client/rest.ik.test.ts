// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import clientAgents from './rest';

describe('ClientAgents - Rewrite (no agentId)', () => {
    const mockDoFetch = jest.fn();

    const BaseClass = class {
        doFetch = mockDoFetch;
        urlVersion = '/api/v4';
    };
    const Client = clientAgents(BaseClass);
    const client = new Client();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getRewrittenMessage', () => {
        it('should send message, action and custom_prompt without agent_id', async () => {
            mockDoFetch.mockResolvedValue({rewritten_text: 'Improved text'});

            const result = await client.getRewrittenMessage('Hello', 'improve_writing', undefined);

            expect(mockDoFetch).toHaveBeenCalledWith(
                '/api/v4/posts/rewrite',
                {
                    method: 'post',
                    body: {
                        message: 'Hello',
                        action: 'improve_writing',
                        custom_prompt: undefined,
                    },
                },
                true,
            );
            expect(result).toBe('Improved text');
        });

        it('should not include agent_id in the request body', async () => {
            mockDoFetch.mockResolvedValue({rewritten_text: 'Fixed text'});

            await client.getRewrittenMessage('Test msg', 'fix_spelling');

            const callBody = mockDoFetch.mock.calls[0][1].body;
            expect(callBody).not.toHaveProperty('agent_id');
        });

        it('should pass custom_prompt for custom action', async () => {
            mockDoFetch.mockResolvedValue({rewritten_text: 'Custom result'});

            await client.getRewrittenMessage('My message', 'custom', 'Make it formal');

            const callBody = mockDoFetch.mock.calls[0][1].body;
            expect(callBody).toEqual({
                message: 'My message',
                action: 'custom',
                custom_prompt: 'Make it formal',
            });
        });

        it('should handle plain text response when rewritten_text is undefined', async () => {
            mockDoFetch.mockResolvedValue('Plain text response');

            const result = await client.getRewrittenMessage('Hello', 'shorten');

            expect(result).toBe('Plain text response');
        });

        it('should only accept 3 parameters (no agentId)', () => {
            // getRewrittenMessage signature: (message, action?, customPrompt?) => Promise<string>
            expect(client.getRewrittenMessage.length).toBeLessThanOrEqual(3);
        });
    });
});
