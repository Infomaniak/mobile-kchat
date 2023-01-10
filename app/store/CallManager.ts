// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

//import JitsiMeet from '@philippeweidmann/react-native-jitsimeet';

import {Linking} from 'react-native';

import {ApiCall} from '@client/rest/ikcalls';
import DatabaseManager from '@database/manager';
import {UserModel} from '@database/models/server';
import NetworkManager from '@managers/network_manager';
import {getCurrentUser, getUserById} from '@queries/servers/user';
import {logError} from '@utils/log';

export type WebSocketConferenceAddedEvent = {
    url: string;
    channel_id: string;
    user_id: string;
    team_id: string;
}

export type Call = {
    id: string;
    url: string;
    serverUrl: string;
    channelId: string;
    users: UserModel[];
}

class CallManager {
    currentCall: Call | undefined;
    participatingCalls: { [id: string]: Call } = {};

    fetchCalls = async (serverUrl: string) => {
        const client = NetworkManager.getClient(serverUrl);
        try {
            const apiCalls = await client.getIKCalls();
            for (const apiCall of apiCalls) {
                // eslint-disable-next-line no-await-in-loop
                const call = await this.apiCallToCall(serverUrl, apiCall);
                this.participatingCalls[call.channelId] = call;
            }
        } catch (error) {
            logError(error);
        }
    };

    hangUpCall = async (channelId: string) => {
        if (!this.currentCall || this.currentCall?.channelId !== channelId) {
            return;
        }

        const client = NetworkManager.getClient(this.currentCall.serverUrl);
        try {
            const apiCall = await client.leaveCall(this.currentCall.id);
            this.participatingCalls[channelId] = await this.apiCallToCall(this.currentCall.serverUrl, apiCall);
        } catch (error) {
            logError(error);
        }
        this.currentCall = undefined;
    };

    startCall = async (serverUrl: string, channelId: string) => {
        const client = NetworkManager.getClient(serverUrl);
        try {
            const existingCall = this.participatingCalls[channelId];
            if (existingCall) {
                await this.setCurrentCall(existingCall);
                return;

                /*const callAnswered = await this.answerCall(serverUrl, channelId);
                if (callAnswered) {
                    return;
                }*/
            }

            //couldn't answer call or call doesn't exist anymore
            const apiCall = await client.startCall(channelId);
            const call = await this.apiCallToCall(serverUrl, apiCall);
            this.participatingCalls[channelId] = call;
            await this.setCurrentCall(call);
        } catch (error) {
            logError(error);
        }
    };

    declineCall = async (serverUrl: string, channelId: string) => {
        const client = NetworkManager.getClient(serverUrl);
        try {
            if (this.participatingCalls[channelId]) {
                await client.declineCall(this.participatingCalls[channelId].id);
            }
        } catch (error) {
            logError(error);
        }
    };

    answerCall = async (serverUrl: string, channelId: string) => {
        const client = NetworkManager.getClient(serverUrl);
        try {
            if (this.participatingCalls[channelId]) {
                const apiCall = await client.answerCall(this.participatingCalls[channelId].id);
                const call = await this.apiCallToCall(serverUrl, apiCall);
                this.participatingCalls[channelId] = call;
                await this.setCurrentCall(call);
                return true;
            }
        } catch (error) {
            logError(error);
        }
        return false;
    };

    private setCurrentCall = async (newCurrentCall: Call) => {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(newCurrentCall.serverUrl);
        const currentUser = await getCurrentUser(database);
        if (currentUser) {
            const kMeetCallUrl = newCurrentCall.url + '?username=' + currentUser.username;
            Linking.openURL(kMeetCallUrl);
        }

        /*
        JitsiMeet.hangUp();
        this.currentCall = newCurrentCall;
        const {database} = DatabaseManager.getServerDatabaseAndOperator(newCurrentCall.serverUrl);
        const currentUser = await getCurrentUser(database);
        let currentUserAvatarUrl = '';

        if (currentUser) {
            try {
                const client = NetworkManager.getClient(newCurrentCall.serverUrl);
                currentUserAvatarUrl = client.getProfilePictureUrl(currentUser.id, currentUser.lastPictureUpdate);
            } catch {
                logError('No client for', newCurrentCall.serverUrl);
            }

            showCurrentCallOverlay(currentUser, currentUserAvatarUrl, newCurrentCall);
        }*/
    };

    private apiCallToCall = async (serverUrl: string, apiCall: ApiCall) => {
        const users: UserModel[] = [];
        for (const participant of apiCall.participants) {
            // eslint-disable-next-line no-await-in-loop
            const user = await this.getUser(serverUrl, participant);
            if (user) {
                users.push(user);
            }
        }
        const call: Call = {id: apiCall.id, url: apiCall.url, serverUrl, channelId: apiCall.channel_id, users};
        return call;
    };

    private getUser = async (serverUrl: string, userId: string) => {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const user = await getUserById(database, userId);
        return user;
    };

    handleIncomingCall = async (serverUrl: string, event: WebSocketConferenceAddedEvent) => {
        await this.fetchCalls(serverUrl);

        /*const user = await this.getUser(serverUrl, event.user_id);
        if (user) {
            showIncomingCallPopup(serverUrl, user, event);
        }*/
    };
}

export default new CallManager();
