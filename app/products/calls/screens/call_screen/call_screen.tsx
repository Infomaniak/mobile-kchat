// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {JitsiMeeting, type JitsiRefProps} from '@jitsi/react-native-sdk';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, type ComponentProps, type RefObject} from 'react';
import {useIntl} from 'react-intl';
import {DeviceEventEmitter, NativeModules, Platform} from 'react-native';

import {updateLocalCustomStatus} from '@actions/local/user';
import {switchToChannelById} from '@actions/remote/channel';
import {unsetCustomStatus, updateCustomStatus} from '@actions/remote/user';
import {CustomStatusDurationEnum, SET_CUSTOM_STATUS_FAILURE} from '@app/constants/custom_status';
import {useServerUrl} from '@app/context/server';
import {calculateExpiryTime} from '@app/screens/custom_status/custom_status';
import {logError} from '@app/utils/log';
import {getUserCustomStatus, getUserTimezone} from '@app/utils/user';
import {debounce} from '@helpers/api/general';
import CallManager from '@store/CallManager';

import type UserModel from '@typings/database/models/servers/user';

export type PassedProps = {
    serverUrl: string;
    channelId: string;
    conferenceId?: string;
    userInfo: ComponentProps<typeof JitsiMeeting>['userInfo'];
};

export type InjectedProps = {
    currentUser: UserModel;
}

type Props = PassedProps & InjectedProps & { autoUpdateStatus: boolean }
type UserStatus = ReturnType<typeof getUserCustomStatus>

const kMeetStatus = {
    emoji: 'kmeet',
    duration: CustomStatusDurationEnum.DONT_CLEAR,
} as Pick<UserCustomStatus, 'emoji' | 'duration'>;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const useTransientRef = <T extends unknown>(value: T): RefObject<T> => {
    const ref = useRef<T>(value);
    ref.current = value;
    return ref;
};

/**
 * Convert possible "duration" status to a specific "date_and_time"
 * used for comparing equality of custom statuses
 * If the status has expired, returns undefined
 */
const asAbsoluteStatus = (status: UserStatus, currentUser: UserModel) => {
    if (typeof status === 'undefined') {
        return undefined;
    }

    const absoluteStatus = ({
        ...status,
        ...(status.duration === CustomStatusDurationEnum.DATE_AND_TIME ? {} : {
            expires_at: calculateExpiryTime(status.duration!, currentUser),
            duration: CustomStatusDurationEnum.DATE_AND_TIME,
        }),
    });

    const hasExpired = (() => {
        if (absoluteStatus.duration === CustomStatusDurationEnum.DONT_CLEAR || !absoluteStatus.duration) {
            return false;
        }

        const expiryTime = moment(absoluteStatus.expires_at);
        const timezone = getUserTimezone(currentUser);
        const currentTime = timezone ? moment.tz(timezone) : moment();
        return currentTime.isSameOrAfter(expiryTime);
    })();

    return hasExpired ? undefined : absoluteStatus;
};

/**
 * Compute custom status equality
 */
const isStatusEqual = (aStatus: UserStatus, bStatus: UserStatus, currentUser: UserModel): boolean => {
    const a = asAbsoluteStatus(aStatus, currentUser);
    const b = asAbsoluteStatus(bStatus, currentUser);

    // One is undefined, the other isn't
    if (typeof a !== typeof b) {
        return false;
    }

    // Both are undefined
    if (
        typeof a === 'undefined' ||
        typeof b === 'undefined'
    ) {
        return true;
    }

    // Same emoji, same text, same expiry
    return (a.emoji === b.emoji && a.text === b.text && a.expires_at === b.expires_at);
};

/**
 * Test if a status is "In a meeting"
 */
const isStatusKMeet = (status: UserStatus): boolean =>
    typeof status !== 'undefined' &&
    status.emoji === kMeetStatus.emoji && (
        status.duration === CustomStatusDurationEnum.DONT_CLEAR ||
        status.duration === null
    );

const CallScreen = ({
    autoUpdateStatus = false,
    channelId,
    conferenceId,
    currentUser,
    serverUrl: kMeetServerUrl,
    userInfo,
}: Props) => {
    const {formatMessage} = useIntl();
    const jitsiMeeting = useRef<JitsiRefProps | null>(null);
    const serverUrl = useServerUrl();

    /**
     * Compare current status and new (arg) status
     * Only update the status if it's not the same
     * Refs are needed to prevent re-creating a new debounced function
     */
    const currentUserRef = useTransientRef<UserModel>(currentUser);
    const doUpdateStatus = useCallback(async (status: UserCustomStatus | undefined) => {
        if (
            /**
             * Compare current status and new (arg) status
             * Only update the status if it's not the same
             */
            !isStatusEqual(status, getUserCustomStatus(currentUserRef.current!), currentUserRef.current!)
        ) {
            const {error} = await (typeof status === 'undefined' ? unsetCustomStatus(serverUrl) : updateCustomStatus(serverUrl, status));
            if (error) {
                DeviceEventEmitter.emit(SET_CUSTOM_STATUS_FAILURE);
                return;
            }

            updateLocalCustomStatus(serverUrl, currentUserRef.current!, status);
        }
    }, [serverUrl]);

    /**
     * Handle setting-up the "In a call" custom status
     * preserve previous status and restore it after ending the call
     */
    const statusBeforeCallRef = useRef<UserStatus>(undefined);
    const updateStatus = useCallback(async () => {
        // Save previous status
        // /!\ This one needs to be absolute since ending the status in 1 hour after the
        // call ended might not be the same time
        statusBeforeCallRef.current = asAbsoluteStatus(getUserCustomStatus(currentUserRef.current!), currentUserRef.current!);

        // Overwrite status with kMeet
        doUpdateStatus({
            ...kMeetStatus,
            text: formatMessage({id: 'custom_status.suggestions.in_a_meeting', defaultMessage: 'In a meeting'}),
        });
    }, [formatMessage]);
    const restoreStatus = useMemo(
        () => debounce(() => {
            // Only restore the previous status if the user did not cleared the "kMeet" status
            // this prevents statuses being restored out of nowhere
            if (isStatusKMeet(getUserCustomStatus(currentUserRef.current!))) {
                doUpdateStatus(statusBeforeCallRef.current);
            }
        }, 2000, true /* Immediate */),
        [doUpdateStatus],
    );

    /**
     * Close the current JitsiMeeting
     * Also trigger the "leaveCall" API
     */
    const leaveCallRef = useTransientRef(() => {
        // Restore previous status
        if (autoUpdateStatus) {
            restoreStatus();
        }

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
    });

    // EFFECTS
    useEffect(() => {
        // Update the status upon mounting the CALL screen
        if (autoUpdateStatus) {
            updateStatus();
        }

        // Leave call on unmount
        return () => {
            leaveCallRef.current!();
        };
    }, []);

    return (
        <JitsiMeeting

            // Ref. https://github.com/jitsi/jitsi-meet/blob/master/config.js
            config={{
                subject: 'kMeet',
                disableModeratorIndicator: true,
            }}

            /**
             * Setup the JitsiMeeting event listeners
             * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#eventlisteners
             */
            eventListeners={{

                // onAudioMutedChanged: (isMuted: boolean) => {
                //     NativeModules.CallManager.mute(isMuted);
                // },
                onReadyToClose: () => {
                    leaveCallRef.current!();
                },
            }}
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

                // Disable CallKit. Maybe only disable on Android ?
                'call-integration.enabled': Platform.OS === 'android',
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
