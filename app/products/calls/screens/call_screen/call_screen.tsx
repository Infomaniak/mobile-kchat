// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {JitsiMeeting, type JitsiRefProps} from '@jitsi/react-native-sdk';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';

import {switchToChannelById} from '@actions/remote/channel';
import {useServerUrl} from '@app/context/server';
import NetworkManager from '@managers/network_manager';
import CallManager from '@store/CallManager';
import {getFullName} from '@utils/user';

import type UserModel from '@typings/database/models/servers/user';

// Props injected by decorators
export type CallInjectedProps = {
    currentUser?: UserModel;
};

// Props passed by goToScreen()
export type CallPassedProps = {
    serverUrl?: string;
    channelId?: string;
    conferenceId?: string;
};

export type Props = CallPassedProps & CallInjectedProps;

const CallScreen = ({
    serverUrl: kMeetServerUrl,
    channelId,
    currentUser,
    conferenceId,
}: Props) => {
    const jitsiMeeting = useRef<JitsiRefProps | null>(null);
    const serverUrl = useServerUrl();

    /**
     * Close the current JitsiMeeting
     * Also trigger the "leaveCall" API
     */
    const leaveCall = useCallback(() => {
        // Return back to the channel where this meeting has been started
        if (typeof channelId === 'string') {
            switchToChannelById(serverUrl, channelId);
        }

        if (typeof conferenceId === 'string') {
            CallManager.leaveCall(serverUrl, conferenceId);
        }

        if (jitsiMeeting.current) {
            jitsiMeeting.current.close();
        }
    }, [channelId, conferenceId, serverUrl]);

    /**
     * Setup the JitsiMeeting event listeners
     * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#eventlisteners
     */
    const eventListeners = {

        /** Close the meeting and the call screen */
        onReadyToClose: leaveCall,
    };

    useEffect(() => {
        // Leave call on unmount
        return leaveCall;
    }, [leaveCall]);

    /**
     * Compute the JitsiMeeting `userInfo`
     * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#userinfo
     */
    const userInfo = useMemo(
        () =>
            (typeof currentUser === 'undefined' ? undefined : {

                // - avatarURL
                // Ref. app/components/profile_picture/image.tsx
                avatarURL: (() => {
                    const client = NetworkManager.getClient(serverUrl);
                    const lastPictureUpdate =
                              (currentUser.isBot ? currentUser.props?.bot_last_icon_update : currentUser.lastPictureUpdate) || 0;
                    const pictureUrl = client.getProfilePictureUrl(
                        currentUser.id,
                        lastPictureUpdate,
                    );

                    return `${serverUrl}${pictureUrl}`;
                })(),

                // - displayName
                displayName: getFullName(currentUser),

                // - email
                email: currentUser.email,
            }),
        [currentUser],
    );

    // This should not happend as those props are passed by
    // clicking on the "(Join) Call" button
    if (typeof kMeetServerUrl !== 'string' || typeof channelId !== 'string') {
        return null;
    }

    return (
        <JitsiMeeting
            config={{

                // Ref. https://github.com/jitsi/jitsi-meet/blob/master/config.js
                subject: 'kMeet',
                disableModeratorIndicator: true,
            }}
            eventListeners={eventListeners}
            flags={{

                // Prevent inviting new peoples
                'add-people.enabled': false,
                'invite.enabled': false,
                'invite-dial-in.enabled': false,

                // Do not display meeting name
                'meeting-name.enabled': false,

                // Auto-join without having to type display name
                'prejoinpage.enabled': false,

                // Disable breakout-rooms
                'breakout-rooms.enabled': false,

                // 'lobby-mode.enabled': false,
                // 'server-url-change.enabled': false,
            }}
            ref={jitsiMeeting}
            style={{flex: 1}}
            room={channelId}
            serverURL={kMeetServerUrl}
            userInfo={userInfo}
        />
    );
};

export default CallScreen;
