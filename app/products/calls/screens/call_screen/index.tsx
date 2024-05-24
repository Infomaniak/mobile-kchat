// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {JitsiMeeting, type JitsiRefProps} from '@jitsi/react-native-sdk';
import React, {useCallback, useEffect, useRef, type ComponentProps} from 'react';

import {switchToChannelById} from '@actions/remote/channel';
import {useServerUrl} from '@app/context/server';
import CallManager from '@store/CallManager';

export type Props = {
    serverUrl: string;
    channelId: string;
    conferenceId?: string;
    userInfo: ComponentProps<typeof JitsiMeeting>['userInfo'];
};

const CallScreen = ({
    serverUrl: kMeetServerUrl,
    channelId,
    userInfo,
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
