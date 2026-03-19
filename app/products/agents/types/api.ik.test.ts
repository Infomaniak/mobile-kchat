// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {RewriteRequest, RewriteResponse} from './api';

describe('Rewrite types (no agent_id)', () => {
    it('should accept RewriteRequest without agent_id', () => {
        const request: RewriteRequest = {
            message: 'Hello',
            action: 'improve_writing',
            custom_prompt: 'Make it formal',
        };

        expect(request.message).toBe('Hello');
        expect(request.action).toBe('improve_writing');
        expect(request.custom_prompt).toBe('Make it formal');
        expect(request).not.toHaveProperty('agent_id');
    });

    it('should accept minimal RewriteRequest with only message', () => {
        const request: RewriteRequest = {
            message: 'Hello',
        };

        expect(request.message).toBe('Hello');
        expect(Object.keys(request)).toEqual(['message']);
    });

    it('should have rewritten_text in RewriteResponse', () => {
        const response: RewriteResponse = {
            rewritten_text: 'Improved text',
        };

        expect(response.rewritten_text).toBe('Improved text');
    });
});
