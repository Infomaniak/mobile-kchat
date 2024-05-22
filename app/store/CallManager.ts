// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import ClientError from '@client/rest/error';
import NetworkManager from '@managers/network_manager';
import {logError} from '@utils/log';

import type {ApiCall} from '@app/client/rest/ikcalls';

export type Call = ApiCall & {server_url: string}

/**
 * Extract the kMeet server_url from the ApiCall response
 * add it to the returned object
 */
const withServerUrl = (call: ApiCall): Call => ({
    ...call,
    server_url: call.url.replace(`/${call.channel_id}`, ''),
});

class CallManager {
    startCall = async (serverUrl: string, channelId: string, allowAnswer = true): Promise<Call | null> => {
        try {
            return withServerUrl(await NetworkManager.getClient(serverUrl).startCall(channelId));
        } catch (error) {
            // If this call already exists start a new one
            if (
                allowAnswer &&
                error instanceof ClientError &&
                error?.status_code === 409 &&
                typeof error?.response?.id === 'string'
            ) {
                const conferenceId = error.response.id;
                return this.answerCall(serverUrl, conferenceId);
            }
            logError(error);
        }

        return null;
    };

    answerCall = async (serverUrl: string, conferenceId: string, channelId?: string): Promise<Call | null> => {
        try {
            return withServerUrl(await NetworkManager.getClient(serverUrl).answerCall(conferenceId));
        } catch (error) {
            // Start a new call if this one no longer exists
            if (
                typeof channelId === 'string' &&
                error instanceof ClientError &&
                error?.status_code === 404
            ) {
                return this.startCall(serverUrl, channelId, false);
            }
            logError(error);
        }

        return null;
    };

    leaveCall = async (serverUrl: string, conferenceId: string): Promise<Call | null> => {
        try {
            return withServerUrl(await NetworkManager.getClient(serverUrl).leaveCall(conferenceId));
        } catch (error) {
            // logError(error);
            return null;
        }
    };
}

export default new CallManager();
