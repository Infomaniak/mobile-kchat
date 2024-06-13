// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {handleConferenceReceived} from '@actions/websocket/conference';

import type ClientBase from './base';

export interface IKClientCallsMix {
    startCall: (channelId: string) => Promise<Conference>;
    getCall: (conferenceId: string) => Promise<Conference>;
    answerCall: (conferenceId: string) => Promise<Conference>;
    cancelCall: (conferenceId: string) => Promise<Conference>;
    declineCall: (conferenceId: string) => Promise<Conference>;
    leaveCall: (conferenceId: string) => Promise<Conference>;
}

const IKClientCalls = <TBase extends Constructor<ClientBase>>(superclass: TBase) => class extends superclass {
    // Routes
    getCallsRoute = (suffix?: string): string =>
        `${this.urlVersion}/conferences${suffix || ''}`;
    getCallRouteCurry = (suffix?: string) => (conferenceId: string) =>
        this.getCallsRoute(`/${conferenceId}${suffix || ''}`);

    getCallRoute = this.getCallRouteCurry('/');
    getAnswerCallRoute = this.getCallRouteCurry('/answer');
    getCancelCallRoute = this.getCallRouteCurry('/cancel');
    getDeclineCallRoute = this.getCallRouteCurry('/decline');
    getLeaveCallRoute = this.getCallRouteCurry('/leave');

    // Queries
    getCall = async (conferenceId: string, update = true) => {
        const conference = await this.doFetch(`${this.getCallRoute(conferenceId)}`, {method: 'get'});
        if (update) {
            // Update the local DB
            handleConferenceReceived(this.apiClient.baseUrl, conference);
        }

        return conference;
    };

    startCall = (channelId: string) =>
        this.doFetch(`${this.getCallsRoute()}`, {method: 'post', body: {channel_id: channelId}});
    answerCall = (conferenceId: string) =>
        this.doFetch(`${this.getAnswerCallRoute(conferenceId)}`, {method: 'post'});
    cancelCall = (conferenceId: string) =>
        this.doFetch(`${this.getCancelCallRoute(conferenceId)}`, {method: 'post'});
    declineCall = (conferenceId: string) =>
        this.doFetch(`${this.getDeclineCallRoute(conferenceId)}`, {method: 'post'});
    leaveCall = (conferenceId: string) =>
        this.doFetch(`${this.getLeaveCallRoute(conferenceId)}`, {method: 'post'});
};

export default IKClientCalls;
