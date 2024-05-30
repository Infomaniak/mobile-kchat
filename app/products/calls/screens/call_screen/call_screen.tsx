// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint max-lines: off */

import {JitsiMeeting, type JitsiRefProps} from '@jitsi/react-native-sdk';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, type ComponentProps, type MutableRefObject} from 'react';
import {useIntl} from 'react-intl';
import {DeviceEventEmitter, NativeModules, Platform} from 'react-native';

import {updateLocalCustomStatus} from '@actions/local/user';
import {fetchChannelMemberships, switchToChannelById} from '@actions/remote/channel';
import {unsetCustomStatus, updateCustomStatus} from '@actions/remote/user';
import {CustomStatusDurationEnum, SET_CUSTOM_STATUS_FAILURE} from '@app/constants/custom_status';
import {useServerId, useServerUrl} from '@app/context/server';
import {useTransientRef} from '@app/hooks/utils';
import {calculateExpiryTime} from '@app/screens/custom_status/custom_status';
import {logError} from '@app/utils/log';
import {getUserCustomStatus, getUserTimezone} from '@app/utils/user';
import {debounce} from '@helpers/api/general';
import CallManager from '@store/CallManager';
import {isDMorGM} from '@utils/channel';

import type ChannelModel from '@typings/database/models/servers/channel';
import type UserModel from '@typings/database/models/servers/user';

export type PassedProps = {
    serverUrl: string;
    channelId: string;
    conferenceId?: string;
    conferenceJWT?: string;
    initiator?: 'native' | 'internal';
    userInfo: ComponentProps<typeof JitsiMeeting>['userInfo'];
};

export type InjectedProps = {
    channel: ChannelModel;
    currentUser: UserModel;
}

export type CallScreenHandle = {
  muteCall: (isMuted: boolean) => void;
  muteVideo: (isMuted: boolean) => void;
};

type Props = PassedProps & InjectedProps & { autoUpdateStatus: boolean }
type UserStatus = ReturnType<typeof getUserCustomStatus>

const kMeetStatus = {
    emoji: 'kmeet',
    duration: CustomStatusDurationEnum.DONT_CLEAR,
} as Pick<UserCustomStatus, 'emoji' | 'duration'>;

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

/**
 * Test if setting a new value to a ref would change it
 * returns true if it does, false otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const hasUpdatedRef = <T extends unknown>(ref: MutableRefObject<T>, newValue: T): boolean => {
    if (ref.current !== newValue) {
        ref.current = newValue;
        return true;
    }
    return false;
};

/**
 * Native reporters, notify native/OS about a state change
 */
const nativeReporters = {
    callStarted: (serverId: string, channelId: string, conferenceId: string, callName: string) => {
        try {
            if (Platform.OS === 'ios') { // Only for CallKit
                NativeModules.CallManagerModule.reportCallStarted(serverId, channelId, conferenceId, callName);
            }
        } catch (error) {
            logError(error);
        }
    },
    callEnded: (conferenceId: string) => {
        try {
            if (Platform.OS === 'ios') { // Only for CallKit
                NativeModules.CallManagerModule.reportCallEnded(conferenceId);
            }
        } catch (error) {
            logError(error);
        }
    },
    callMuted: (conferenceId: string, isMuted: boolean) => {
        try {
            if (Platform.OS === 'ios') { // Only for CallKit
                NativeModules.CallManagerModule.reportCallMuted(conferenceId, isMuted);
            }
        } catch (error) {
            logError(error);
        }
    },
    callVideoMuted: (conferenceId: string, isMuted: boolean) => {
        try {
            if (Platform.OS === 'ios') { // Only for CallKit
                NativeModules.CallManagerModule.reportCallVideoMuted(conferenceId, isMuted);
            }
        } catch (error) {
            logError(error);
        }
    },
};

const CallScreen = ({
    autoUpdateStatus = false,
    channel,
    channelId,
    conferenceId,
    conferenceJWT,
    currentUser,
    initiator,
    serverUrl: kMeetServerUrl,
    userInfo,
}: Props) => {
    const serverId = useServerId();
    const {formatMessage} = useIntl();
    const jitsiMeetingRef = useRef<JitsiRefProps | null>(null);
    const serverUrl = useServerUrl();
    const audioMutedRef = useRef(false);
    const videoMutedRef = useRef(false);
    const conferenceJoinedRef = useRef(false);

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
    const doUpdateStatusRef = useTransientRef(doUpdateStatus);

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
            if (
                typeof doUpdateStatusRef.current === 'function' &&
                isStatusKMeet(getUserCustomStatus(currentUserRef.current!))
            ) {
                doUpdateStatusRef.current(statusBeforeCallRef.current);
            }
        }, 2000, true /* Immediate */),
        [],
    );

    /**
     * Mute audio/video prevent triggering a callback if
     * the state already matches the newState
     */
    const muteCall = useCallback((isMuted: boolean) => {
        if (
            hasUpdatedRef(audioMutedRef, isMuted) &&
            typeof jitsiMeetingRef.current?.setAudioMuted === 'function'
        ) {
            jitsiMeetingRef.current.setAudioMuted(isMuted);
        }
    }, []);
    const muteVideo = useCallback((isMuted: boolean) => {
        if (
            hasUpdatedRef(videoMutedRef, isMuted) &&
            typeof jitsiMeetingRef.current?.setVideoMuted === 'function'
        ) {
            jitsiMeetingRef.current.setVideoMuted(isMuted);
        }
    }, []);

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
            // Notify the API that the user left the call
            CallManager.leaveCall(serverUrl, conferenceId);

            // Notify CallKit about the end of the call
            nativeReporters.callEnded(conferenceId);
        }

        if (jitsiMeetingRef.current) {
            jitsiMeetingRef.current.close();
        }
    });

    /**
     * Setup the JitsiMeeting event listeners
     * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#eventlisteners
     */
    const eventListeners = useMemo(() => ({
        onConferenceJoined: () => {
            conferenceJoinedRef.current = true;

            if (autoUpdateStatus) {
                updateStatus();
            }

            // Report that the call started only if the initiator is not native
            //  -> 'internal' initiator means react-native
            if (
                initiator !== 'native' &&
                typeof channelId === 'string' &&
                typeof conferenceId === 'string'
            ) {
                (async function getCallName() {
                    let callName = `~${channel.name}`; // GM

                    // Find the target user's username for DM calls
                    if (isDMorGM(channel)) {
                        const {users} = await fetchChannelMemberships(serverUrl, channelId, {per_page: 2});
                        const targetUser = users.find((user) => user.id !== currentUser.id); // eslint-disable-line max-nested-callbacks
                        if (targetUser) {
                            callName = `@${targetUser.username}`; // DM
                        }
                    }

                    nativeReporters.callStarted(serverId, channelId, conferenceId, callName);
                }());
            }
        },
        onAudioMutedChanged: (isMuted: boolean) => {
            if (
                hasUpdatedRef(audioMutedRef, isMuted) &&
                conferenceJoinedRef.current && typeof conferenceId === 'string'
            ) {
                nativeReporters.callMuted(conferenceId, isMuted);
            }
        },
        onVideoMutedChanged: (isMuted: boolean) => {
            if (
                hasUpdatedRef(audioMutedRef, isMuted) &&
                conferenceJoinedRef.current && typeof conferenceId === 'string'
            ) {
                nativeReporters.callVideoMuted(conferenceId, isMuted);
            }
        },
        onReadyToClose: () => {
            leaveCallRef.current!();
        },
    }), []);

    // EFFECTS
    // Register to allow functions from being called by the CallManager
    useEffect(() => {
        CallManager.registerCallScreen({muteCall, muteVideo});
    }, []);

    return (
        <JitsiMeeting

            ref={jitsiMeetingRef}

            // Ref. https://github.com/jitsi/jitsi-meet/blob/master/config.js
            config={{
                subject: 'kMeet',
                disableModeratorIndicator: true,
            }}

            token={conferenceJWT}

            /**
             * Setup the JitsiMeeting event listeners
             * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#eventlisteners
             */
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

                // Disable CallKit. Maybe only disable on Android ?
                'call-integration.enabled': Platform.OS === 'android',
            }}
            style={{flex: 1}}
            room={channelId}
            serverURL={kMeetServerUrl}
            userInfo={userInfo}
        />
    );
};

export default CallScreen;
