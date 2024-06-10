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
    answerCall: (conferenceId: string) => Promise<ApiCall>;
    cancelCall: (conferenceId: string) => Promise<ApiCall>;
    declineCall: (conferenceId: string) => Promise<ApiCall>;
    leaveCall: (conferenceId: string) => Promise<ApiCall>;
    startCall: (channelId: string) => Promise<ApiCall>;
}

const IKClientCalls = (superclass: any) => class extends superclass {
    // Routes
    getCallsRoute = (suffix?: string): string =>
        `${this.urlVersion}/conferences${suffix || ''}`;
    getCallRoute = (suffix?: string) => (conferenceId: string) =>
        this.getCallsRoute(`/${conferenceId}${suffix || ''}`);

    getAnswerCallRoute = this.getCallRoute('/answer');
    getCancelCallRoute = this.getCallRoute('/cancel');
    getDeclineCallRoute = this.getCallRoute('/decline');
    getLeaveCallRoute = this.getCallRoute('/leave');

    // Queries
    getIKCalls = () => this.doFetch(`${this.getCallsRoute()}`, {method: 'get'});
    answerCall = (conferenceId: string) =>
        this.doFetch(`${this.getAnswerCallRoute(conferenceId)}`, {method: 'post'});
    cancelCall = (conferenceId: string) =>
        this.doFetch(`${this.getCancelCallRoute(conferenceId)}`, {method: 'post'});
    declineCall = (conferenceId: string) =>
        this.doFetch(`${this.getDeclineCallRoute(conferenceId)}`, {method: 'post'});
    leaveCall = (conferenceId: string) =>
        this.doFetch(`${this.getLeaveCallRoute(conferenceId)}`, {method: 'post'});
    startCall = (channelId: string) =>
        this.doFetch(`${this.getCallsRoute()}`, {method: 'post', body: {channel_id: channelId}});
};

export default IKClientCalls;
