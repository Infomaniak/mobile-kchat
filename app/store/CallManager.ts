// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {handleConferenceDeletedById, handleConferenceUpdatedById} from '@actions/websocket/conference';
import {Screens} from '@app/constants';
import {getFullName} from '@app/utils/user';
import ClientError from '@client/rest/error';
import DatabaseManager from '@database/manager';
import {getTranslations, t} from '@i18n';
import NetworkManager from '@managers/network_manager';
import {allOrientations, dismissAllModalsAndPopToScreen} from '@screens/navigation';
import {logError} from '@utils/log';

import type {ApiCall} from '@app/client/rest/ikcalls';
import type {CallScreenHandle, PassedProps} from '@calls/screens/call_screen/call_screen';
import type {MutableRefObject} from 'react';
import type {Options} from 'react-native-navigation';

class CallManager {
    callScreenRef: MutableRefObject<CallScreenHandle | null> = {current: null};
    registerCallScreen = (callScreen: CallScreenHandle | null) => {
        this.callScreenRef.current = callScreen;
    };

    startCall = async (serverUrl: string, channelId: string, allowAnswer = true): Promise<ApiCall & { answered: boolean; server_url: string } | null> => {
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
        const leaveCall = this.callScreenRef.current?.leaveCall;
        if (typeof leaveCall === 'function') {
            leaveCall(initiator);
        } else {
            const serverUrl = await DatabaseManager.getServerUrlFromIdentifier(serverId);
            if (typeof serverUrl === 'string') {
                this.declineCall(serverUrl, conferenceId);
            }
        }
    };

    handleCallTermination = (method: 'cancelCall' | 'declineCall' | 'leaveCall') => async (serverUrl: string, conferenceId: string): Promise<ApiCall | null> => {
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
        const toggleAudioMuted = this.callScreenRef.current?.toggleAudioMuted;
        if (typeof toggleAudioMuted === 'function') {
            toggleAudioMuted(isMuted);
        }
    };
    toggleVideoMuted = (isMuted?: boolean) => {
        const toggleVideoMuted = this.callScreenRef.current?.toggleVideoMuted;
        if (typeof toggleVideoMuted === 'function') {
            toggleVideoMuted(isMuted);
        }
    };

    /**
     * Triggers a "Join/Start call" on a kMeet
     *  -> Answer/Start the kMeet
     *  -> Pop the CALL screen
     *
     * If the conferenceId is know it should
     * be passed as an arg to trigger a "Join call" instead of a "Start call"
     */
    onCall = async (
        serverUrl: string, channelId: string,
        {conferenceId, conferenceJWT, initiator}:
        { conferenceId?: string; conferenceJWT?: string; initiator?: 'native' | 'internal' } = {},
    ) => {
        /* eslint-disable multiline-ternary */
        try {
            const client = NetworkManager.getClient(serverUrl);
            const [userProfile, call] = await Promise.all([

                // Get current user profile
                await client.getMe(),

                // Start/Answer the call via API
                typeof conferenceId === 'string' ?
                    await this.answerCall(serverUrl, conferenceId, channelId) :
                    await this.startCall(serverUrl, channelId),
            ]);

            if (call !== null) {
                // Ensure that the conference is not deleted
                // this might happen since startCall might actually answer an old call
                // that has been deleted locally, but has not remotely
                await handleConferenceUpdatedById(serverUrl, call.id, {deleteAt: undefined});

                // Setup CALL screen props
                // - title
                const translations = getTranslations(userProfile.locale);
                const title = translations[t('mobile.calls_call_screen')] || 'Call';

                // - passedProps
                const passedProps: PassedProps = {
                    serverUrl,
                    kMeetServerUrl: call.server_url,
                    channelId: call.channel_id,
                    conferenceId: call.id,
                    conferenceJWT: conferenceJWT ?? call.jwt ?? '',
                    answered: call.answered,
                    initiator,

                    /**
                     * Compute the JitsiMeeting `userInfo`
                     * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#userinfo
                     */
                    userInfo: {
                        avatarURL: typeof userProfile.public_picture_url === 'string' ?
                            userProfile.public_picture_url : // Public picture if available
                            /**
                             * API proxied image if not
                             * Ref. app/components/profile_picture/image.tsx
                             */
                            (() => {
                                const lastPictureUpdate = ('lastPictureUpdate' in userProfile) ?
                                    (userProfile.lastPictureUpdate as number) :
                                    userProfile.last_picture_update || 0;

                                const pictureUrl = client.getProfilePictureUrl(userProfile.id, lastPictureUpdate);

                                return `${serverUrl}${pictureUrl}`;
                            })(),
                        displayName: getFullName(userProfile),
                        email: userProfile.email,
                    },
                };

                // - options
                const options: Options = {
                    layout: {
                        backgroundColor: '#000',
                        componentBackgroundColor: '#000',
                        orientation: allOrientations,
                    },
                    topBar: {
                        background: {color: '#000'},

                        // visible: Platform.OS === 'android',
                        visible: false,
                    },
                };

                // Pop the CALL screen
                await dismissAllModalsAndPopToScreen(Screens.CALL, title, passedProps, options);
            }
        } catch (err) {
            logError(err);
        }
        /* eslint-enable multiline-ternary */
    };
}

export default new CallManager();
