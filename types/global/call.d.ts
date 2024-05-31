// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type CallAnsweredEvent = {
    serverId: string;
    channelId: string;
    conferenceJWT: string;
}

type CallEndedEvent = {}

type CallMutedEvent = {
    isMuted: 'true' | 'false';
}

type CallVideoMutedEvent = CallMutedEvent
