// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {z} from 'zod';

import {handleConferenceDeletedById} from '@actions/websocket/conference';
import {callScreenRef} from '@calls/screens/call_screen/call_screen';
import ClientError from '@client/rest/error';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import {logError} from '@utils/log';

// OS events
export const CallAnsweredEvent = z.object({
    serverId: z.string().uuid(),
    channelId: z.string().uuid(),
    conferenceJWT: z.string().min(1),
});
export type CallAnsweredEvent = z.infer<typeof CallAnsweredEvent>;

export const CallEndedEvent = z.object({
    serverId: z.string().uuid(),
    conferenceId: z.string().uuid(),
});
export type CallEndedEvent = z.infer<typeof CallEndedEvent>;

export const CallMutedEvent = z.object({isMuted: z.enum(['true', 'false'])});
export type CallMutedEvent = z.infer<typeof CallMutedEvent>;

export const CallVideoMutedEvent = CallMutedEvent;
export type CallVideoMutedEvent = z.infer<typeof CallVideoMutedEvent>;

class CallManager {
    startCall = async (serverUrl: string, channelId: string, allowAnswer = true): Promise<Conference & { answered: boolean; server_url: string } | null> => {
        try {
            const call = await NetworkManager.getClient(serverUrl).startCall(channelId);

            return {
                ...call,
                answered: false,
                server_url: call.url.replace(`/${call.channel_id}`, ''),
            };
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

    answerCall = async (serverUrl: string, conferenceId: string, channelId?: string) => {
        try {
            const call = await NetworkManager.getClient(serverUrl).answerCall(conferenceId);

            return {
                ...call,
                answered: true,
                server_url: call.url.replace(`/${call.channel_id}`, ''),
            };
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

    /**
     * Try to leave the current call screen,
     * if unavailable decline the call via API
     */
    leaveCallScreen = async (
        {serverId, conferenceId}: CallEndedEvent,
        initiator: 'api' | 'internal' | 'native' = 'native',
    ): Promise<void> => {
        const leaveCall = callScreenRef.current?.leaveCall;
        if (typeof leaveCall === 'function') {
            leaveCall(initiator);
        } else {
            const serverUrl = await DatabaseManager.getServerUrlFromIdentifier(serverId);
            if (typeof serverUrl === 'string') {
                this.declineCall(serverUrl, conferenceId);
            }
        }
    };

    handleCallTermination = (method: 'cancelCall' | 'declineCall' | 'leaveCall') => async (serverUrl: string, conferenceId: string): Promise<Conference | null> => {
        try {
            // Delete the conference localy by updating it's 'delete_at' column
            handleConferenceDeletedById(serverUrl, conferenceId);

            // Notify backend about left call
            return await NetworkManager.getClient(serverUrl)[method](conferenceId);
        } catch (error) {
            // logError(error);
            return null;
        }
    };

    cancelCall = this.handleCallTermination('cancelCall');
    declineCall = this.handleCallTermination('declineCall');
    leaveCall = this.handleCallTermination('leaveCall');

    /**
     * Propagate state change via imperative handle
     */
    toggleAudioMuted = (isMuted?: boolean) => {
        const toggleAudioMuted = callScreenRef.current?.toggleAudioMuted;
        if (typeof toggleAudioMuted === 'function') {
            toggleAudioMuted(isMuted);
        }
    };
    toggleVideoMuted = (isMuted?: boolean) => {
        const toggleVideoMuted = callScreenRef.current?.toggleVideoMuted;
        if (typeof toggleVideoMuted === 'function') {
            toggleVideoMuted(isMuted);
        }
    };
}

export default new CallManager();
