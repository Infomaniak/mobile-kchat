// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Platform} from 'react-native';

import {handleConferenceReceived, handleConferenceUpdatedById} from '@actions/websocket/conference';
import {type PassedProps} from '@calls/screens/call_screen/call_screen';
import {Screens} from '@constants';
import DatabaseManager from '@database/manager';
import {getTranslations, t} from '@i18n';
import NetworkManager from '@managers/network_manager';
import {getChannelById} from '@queries/servers/channel';
import {getConferenceById} from '@queries/servers/conference';
import {getCurrentUserId} from '@queries/servers/system';
import {allOrientations, dismissAllModalsAndPopToScreen} from '@screens/navigation';
import CallManager from '@store/CallManager';
import {isDMorGM as isChannelDMorGM} from '@utils/channel';
import {getFullErrorMessage} from '@utils/errors';
import {logDebug, logError} from '@utils/log';
import {getFullName} from '@utils/user';

import {forceLogoutIfNecessary} from './session';

import type ConferenceModel from '@typings/database/models/servers/conference';
import type {Options} from 'react-native-navigation';

export const fetchConference = async (serverUrl: string, conferenceId: string) => {
    try {
        // Try to get the conference in the local DB
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        let conference: ConferenceModel | undefined;
        if (typeof (conference = await getConferenceById(database, conferenceId)) !== 'undefined') {
            return {conference};
        }

        // Fetch from remote
        const client = NetworkManager.getClient(serverUrl);
        const remoteConference = await client.getCall(conferenceId);

        // Update the local DB
        if (typeof (conference = await handleConferenceReceived(serverUrl, remoteConference)) !== 'undefined') {
            return {conference};
        }

        return {conference};
    } catch (error) {
        logDebug('error on fetchConference', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
        return {error};
    }
};

export const switchToConferenceByChannelId = async (
    serverUrl: string, channelId: string,
    {conferenceId, conferenceJWT, initiator}:
    { conferenceId?: string; conferenceJWT?: string; initiator?: 'native' | 'internal' } = {},
) => {
    /* eslint-disable multiline-ternary */
    try {
        // Start/Answer the call via API
        const call = typeof conferenceId === 'string' ?
            await CallManager.answerCall(serverUrl, conferenceId, channelId) :
            await CallManager.startCall(serverUrl, channelId);
        if (call === null) {
            throw new Error('Call could not be started/answered');
        }

        // If the call is "not answered" (ie. started) the current user
        // is the initiator
        const isCurrentUserInitiator = !call.answered;

        // Ensure that the conference is not deleted
        // this might happen since startCall might actually answer an old call
        // that has been deleted locally, but has not remotely
        await handleConferenceUpdatedById(serverUrl, call.id, {deleteAt: undefined});

        // For iOS, trigger the nativeReporter only
        // and let CallKit do the job 🚀
        if (Platform.OS === 'ios') {
            const database = DatabaseManager.serverDatabases[serverUrl]?.database;
            const [currentUserId, channel] = await Promise.all([
                getCurrentUserId(database!),
                getChannelById(database!, channelId),
            ]);

            if (typeof channel === 'undefined') {
                throw new Error(`Channel not found ${channelId}`);
            }

            // Triggering a call from the UI (ie. initiator === internal) on
            // DMs or GMs will display the "Calling..." screen, so we can't let iOS
            // handle it for now
            const isDMorGM = isChannelDMorGM(channel);
            const shouldDisplayCallingScreen = (
                isDMorGM &&
                isCurrentUserInitiator
            );

            if (!shouldDisplayCallingScreen) {
                const callName = await CallManager.getCallName(serverUrl, channel, currentUserId);
                CallManager.nativeReporters.ios.callStarted(serverUrl, channelId, callName, call.id, conferenceJWT ?? call.jwt ?? '', call.url);

                return;
            }
        }

        // For Android, answer/start the call and switch to the call_screen 🤖
        const client = NetworkManager.getClient(serverUrl);
        const userProfile = await client.getMe();

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
            conferenceURL: call.url,
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
    } catch (err) {
        logError(err);
    }
    /* eslint-enable multiline-ternary */
};
