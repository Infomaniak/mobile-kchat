// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import streamingStore from '@agents/store/streaming_store';

import {handleAgentPostUpdate} from './index';

import type {PostUpdateWebsocketMessage} from '@agents/types';

// Mock the streaming store
jest.mock('@agents/store/streaming_store', () => ({
    __esModule: true,
    default: {
        handleWebSocketMessage: jest.fn(),
    },
}));

const broadcast = {
    omit_users: {},
    user_id: 'user123',
    channel_id: 'channel123',
    team_id: 'team123',
    session_id: '',
};

describe('handleAgentPostUpdate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call streamingStore.handleWebSocketMessage with message data', () => {
        const messageData: PostUpdateWebsocketMessage = {
            post_id: 'post123',
            next: 'Hello world',
            control: 'start',
        };

        const msg: WebSocketMessage<PostUpdateWebsocketMessage> = {
            event: 'custom_mattermost-ai_postupdate',
            data: {...messageData, ...broadcast},
        };

        handleAgentPostUpdate(msg);

        expect(streamingStore.handleWebSocketMessage).toHaveBeenCalledTimes(1);
        expect(streamingStore.handleWebSocketMessage).toHaveBeenCalledWith(msg.data);
    });

    it('should return early when data is undefined', () => {
        const msg = {
            event: 'custom_mattermost-ai_postupdate',
            data: undefined,
        };

        handleAgentPostUpdate(msg as unknown as WebSocketMessage<PostUpdateWebsocketMessage>);

        expect(streamingStore.handleWebSocketMessage).not.toHaveBeenCalled();
    });

    it('should return early when data is null', () => {
        const msg = {
            event: 'custom_mattermost-ai_postupdate',
            data: null,
        };

        handleAgentPostUpdate(msg as unknown as WebSocketMessage<PostUpdateWebsocketMessage>);

        expect(streamingStore.handleWebSocketMessage).not.toHaveBeenCalled();
    });
});
