// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Platform} from 'react-native';

import {Screens} from '@app/constants';
import {getFullName} from '@app/utils/user';
import ClientError from '@client/rest/error';
import {getTranslations, t} from '@i18n';
import NetworkManager from '@managers/network_manager';
import {allOrientations, dismissAllModalsAndPopToScreen} from '@screens/navigation';
import {logError} from '@utils/log';

import type {ApiCall} from '@app/client/rest/ikcalls';
import type {PassedProps} from '@calls/screens/call_screen/call_screen';
import type {JitsiRefProps} from '@jitsi/react-native-sdk';
import type {MutableRefObject} from 'react';
import type {Options} from 'react-native-navigation';

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
    jitsiMeetingRef: MutableRefObject<JitsiRefProps | null> = {current: null};
    registerJitsiMeeting = (jitsiMeeting: JitsiRefProps | null) => {
        this.jitsiMeetingRef.current = jitsiMeeting;
    };

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

    declineCall = async (serverUrl: string, conferenceId: string): Promise<void> => {
        try {
            await NetworkManager.getClient(serverUrl).declineCall(conferenceId);
        } catch (error) {
            logError(error);
        }
    };

    leaveCall = async (serverUrl: string, conferenceId: string): Promise<Call | null> => {
        try {
            return withServerUrl(await NetworkManager.getClient(serverUrl).leaveCall(conferenceId));
        } catch (error) {
            // logError(error);
            return null;
        }
    };

    muteCall = (isMuted: boolean) => {
        const jitsiMeeting = this.jitsiMeetingRef.current;
        if (
            jitsiMeeting !== null &&
            typeof jitsiMeeting.setAudioMuted === 'function'
        ) {
            jitsiMeeting.setAudioMuted(isMuted);
        } else {
            logError(`Could not ${isMuted ? '' : 'un'}mute, JitsiMeeting not found`);
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
        {conferenceId, conferenceJWT}: { conferenceId?: string; conferenceJWT?: string } = {},
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
                // Setup CALL screen props
                // - title
                const translations = getTranslations(userProfile.locale);
                const title = translations[t('mobile.calls_call_screen')] || 'Call';

                // - passedProps
                const passedProps: PassedProps = {
                    serverUrl: call.server_url,
                    channelId: call.channel_id,
                    conferenceId: call.id,
                    conferenceJWT,

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
                        visible: Platform.OS === 'android',
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
