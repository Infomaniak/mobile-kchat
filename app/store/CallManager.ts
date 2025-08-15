// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {NativeModules} from 'react-native';
import {z} from 'zod';

import {fetchChannelMemberships} from '@actions/remote/channel';
import {handleConferenceDeletedById} from '@actions/websocket/conference';
import {callScreenRef} from '@calls/screens/call_screen/call_screen';
import ClientError from '@client/rest/error';
import {General} from '@constants';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import {isDMorGM as isChannelDMorGM} from '@utils/channel';
import {logError} from '@utils/log';

import type ChannelModel from '@typings/database/models/servers/channel';

// OS events
export const CallAnsweredEvent = z.object({
    serverId: z.string().uuid(),
    channelId: z.string().uuid(),
    conferenceJWT: z.string().min(1),
});
export type CallAnsweredEventData = z.infer<typeof CallAnsweredEvent>;

export const CallEndedEvent = z.object({
    serverId: z.string().uuid(),
    conferenceId: z.string().uuid(),
});
export type CallEndedEventData = z.infer<typeof CallEndedEvent>;

export const CallMutedEvent = z.object({isMuted: z.enum(['true', 'false'])});
export type CallMutedEventData = z.infer<typeof CallMutedEvent>;

export const CallVideoMutedEvent = CallMutedEvent;
export type CallVideoMutedEventData = z.infer<typeof CallVideoMutedEvent>;

class CallManager {
    /**
     * Number of maximum participant usernames to be displayed in Callkit
     * when the users receive a GM call
     *   example for 2 in a GM of 5 users -> "@jean.michel @foo.bar +3"
     */
    MAX_CALLNAME_PARTICIPANT_USERNAMES = 5;

    /**
     * Native reporters, notify native/OS about a state change
     */
    nativeReporters = {
        android: {
            callStarted: (serverId: string, channelId: string, callName: string, conferenceId?: string) => {
                try {
                    const {reportCallStarted} = NativeModules.CallManagerModule;
                    if (typeof reportCallStarted === 'function') {
                        reportCallStarted(serverId, channelId, conferenceId, callName);
                    }
                } catch (error) {
                    logError(error);
                }
            },
        },
        ios: {
            callStarted: (serverId: string, channelId: string, callName: string, conferenceId: string, conferenceJWT: string, conferenceURL: string) => {
                try {
                    const {reportCallStarted} = NativeModules.CallManagerModule;
                    if (typeof reportCallStarted === 'function') {
                        reportCallStarted(serverId, channelId, callName, conferenceId, conferenceJWT, conferenceURL);
                    }
                } catch (error) {
                    logError(error);
                }
            },
        },

        callEnded: (conferenceId: string) => {
            try {
                const {reportCallEnded} = NativeModules.CallManagerModule;
                if (typeof reportCallEnded === 'function') {
                    reportCallEnded(conferenceId);
                }
            } catch (error) {
                logError(error);
            }
        },
        callMuted: (conferenceId: string, isMuted: boolean) => {
            try {
                const {reportCallMuted} = NativeModules.CallManagerModule;
                if (typeof reportCallMuted === 'function') {
                    reportCallMuted(conferenceId, isMuted);
                }
            } catch (error) {
                logError(error);
            }
        },
        callVideoMuted: (conferenceId: string, isMuted: boolean) => {
            try {
                const {reportCallVideoMuted} = NativeModules.CallManagerModule;
                if (typeof reportCallVideoMuted === 'function') {
                    reportCallVideoMuted(conferenceId, isMuted);
                }
            } catch (error) {
                logError(error);
            }
        },
    };

    /**
     * Start a new call, fallback to answering if it already exists on this channel
     */
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

    /**
     * Answer an existing call by conferenceId
     */
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
        {serverId, conferenceId}: CallEndedEventData,
        initiator: 'api' | 'internal' | 'native' = 'native',
    ): Promise<void> => {
        const leaveCall = callScreenRef.current?.leaveCall;
        if (typeof leaveCall === 'function') {
            leaveCall(initiator);
        } else {
            const serverUrl = await DatabaseManager.getServerUrlFromIdentifier(serverId);
            if (typeof serverUrl === 'string') {
                this.leaveCall(serverUrl, conferenceId);
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

    /**
     * Resolve list of called users
     */
    getCalledUsers = async (serverUrl: string, channelId: string, currentUserId: string) => {
        // Add one since current user might be in list
        const recipients = (await fetchChannelMemberships(serverUrl, channelId, {})).users;

        // Move bots to end of list
        recipients.sort(
            (a, b) => {
                if (a.is_bot) {
                    return b.is_bot ? 0 : 1;
                }
                return b.is_bot ? -1 : 0;
            },
        );

        // Remove current user from list
        return (recipients.length > 1 ? recipients.filter((user) => user.id !== currentUserId) : recipients);
    };

    /**
     * Construct the callName for CallKit
     */
    getCallName = async (serverUrl: string, channel: ChannelModel, currentUserId: string, limit = 2) => {
        // Public / Private channel
        const isDMorGM = channel ? isChannelDMorGM(channel) : false;
        if (!isDMorGM) {
            return `~${channel.name}`;
        }

        // Query the called users (current user is filtered-out)
        const users = await this.getCalledUsers(serverUrl, channel.id, currentUserId);

        // If it's a DM the callName is the recipient with an "@"
        const isDM = channel?.type === General.DM_CHANNEL;
        if (isDM) {
            const recipient = users[0]?.username ?? 'kMeet';
            return `@${recipient}`;
        }

        // Construct callName by joining usernames
        const usernames = users.slice(0, limit).map((user) => `${user.username}`).join(', ');
        const overflow = users.length > limit ? ` (+${users.length - limit})` : '';
        return `#${usernames}${overflow}`;
    };
}

export default new CallManager();
