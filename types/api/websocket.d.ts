// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type WebsocketBroadcast = {
    omit_users: Dictionary<boolean>;
    user_id: string;
    channel_id: string;
    team_id: string;
    session_id: string;
}

type WebSocketMessage<T = any> = {
    event: string;
    data: T & WebsocketBroadcast;
}

type ThreadReadChangedData = {
    thread_id: string;
    team_id: string;
    timestamp: number;
    unread_mentions: number;
    unread_replies: number;
};
