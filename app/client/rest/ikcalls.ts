// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export type ApiCall = {
    id: string;
    channel_id: string;
    user_id: string;
    create_at: number;
    participants: string[];
    url: string;
    jwt?: string;
}

export interface IKClientCallsMix {
    getIKCalls: () => Promise<[ApiCall]>;
    leaveCall: (conferenceId: string) => Promise<ApiCall>;
    declineCall: (conferenceId: string) => Promise<ApiCall>;
    answerCall: (conferenceId: string) => Promise<ApiCall>;
    startCall: (channelId: string) => Promise<ApiCall>;
}

const IKClientCalls = (superclass: any) => class extends superclass {
    getCallsRoute(): string {
        return `${this.urlVersion}/conferences`;
    }

    getLeaveCallRoute(conferenceId: string): string {
        return `${this.getCallsRoute()}/${conferenceId}/leave`;
    }

    getAnswerCallRoute(conferenceId: string): string {
        return `${this.getCallsRoute()}/${conferenceId}/answer`;
    }

    getDeclineCallRoute(conferenceId: string): string {
        return `${this.getCallsRoute()}/${conferenceId}/decline`;
    }

    getIKCalls = async () => {
        return this.doFetch(
            `${this.getCallsRoute()}`,
            {method: 'get'},
        );
    };
    leaveCall = async (conferenceId: string) => {
        return this.doFetch(
            `${this.getLeaveCallRoute(conferenceId)}`,
            {method: 'post'},
        );
    };
    declineCall = async (conferenceId: string) => {
        return this.doFetch(
            `${this.getDeclineCallRoute(conferenceId)}`,
            {method: 'post'},
        );
    };
    answerCall = async (conferenceId: string) => {
        return this.doFetch(
            `${this.getAnswerCallRoute(conferenceId)}`,
            {method: 'post'},
        );
    };
    startCall = async (channelId: string) => {
        return this.doFetch(
            `${this.getCallsRoute()}`,
            {method: 'post', body: {channel_id: channelId}},
        );
    };
};

export default IKClientCalls;
