// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type CallAnsweredEvent = {
    serverId: string;
    channelId: string;
}

type CallEndedEvent = {
    serverId: string;
    conferenceId: string;
}

type CallMutedEvent = {
    isMuted: boolean;
}
