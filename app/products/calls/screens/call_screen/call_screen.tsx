// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint max-lines: off */
/* eslint-disable max-nested-callbacks */

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
import {useMountedRef, useTransientRef} from '@app/hooks/utils';
import {calculateExpiryTime} from '@app/screens/custom_status/custom_status';
import {logError} from '@app/utils/log';
import {getUserCustomStatus, getUserTimezone} from '@app/utils/user';
import {debounce} from '@helpers/api/general';
import CallManager from '@store/CallManager';
import {isDMorGM as _isDMorGM} from '@utils/channel';

import type ChannelModel from '@typings/database/models/servers/channel';
import type ConferenceModel from '@typings/database/models/servers/conference';
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
    conference: ConferenceModel | undefined;
    currentUser: UserModel;
    participantCount: number;
}

export type CallScreenHandle = {
    leaveCall: (initiator?: 'native' | 'internal') => void;
    muteCall: (isMuted: boolean) => void;
    muteVideo: (isMuted: boolean) => void;
};

type Props = PassedProps & InjectedProps & { autoUpdateStatus: boolean }
type UserStatus = ReturnType<typeof getUserCustomStatus>

/**
 * Prevent the conference from being closed by 'leaveCall'
 * handle if the duration is lower than this value
 */
const MINIMUM_CONFERENCE_DURATION = 2000; // ms

/**
 * Number of maximum participant usernames to be displayed in Callkit
 * when the users receive a GM call
 *   example for 2 in a GM of 5 users -> "@jean.michel @foo.bar +3"
 */
const MAX_CALLNAME_PARTICIPANT_USERNAMES = 2;

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
            const {reportCallStarted} = NativeModules.CallManagerModule;
            if (typeof reportCallStarted === 'function') {
                reportCallStarted(serverId, channelId, conferenceId, callName);
            }
        } catch (error) {
            logError(error);
        }
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

const CallScreen = ({
    autoUpdateStatus = false,
    channel,
    channelId,
    conference,
    conferenceId,
    conferenceJWT,
    currentUser,
    participantCount,
    initiator,
    serverUrl: kMeetServerUrl,
    userInfo,
}: Props) => {
    const isDMorGM = _isDMorGM(channel);
    const serverId = useServerId();
    const {formatMessage} = useIntl();
    const jitsiMeetingRef = useRef<JitsiRefProps | null>(null);
    const serverUrl = useServerUrl();
    const audioMutedRef = useRef(false);
    const videoMutedRef = useRef(false);
    const leavingRef = useRef(false);
    const conferenceJoinedAtRef = useRef<number | undefined>();
    const mountedRef = useMountedRef();

    /**
     * Is the current user the one that initiated the conference
     */
    const isCurrentUserInitiator = currentUser.id === conference?.userId;

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
        }, 2000, {leading: true, trailing: false}),
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
    const leaveCallRef = useTransientRef((leaveInitiator: 'internal' | 'native' = 'internal') => {
        if (
            mountedRef.current &&
            typeof conferenceJoinedAtRef.current === 'number' &&
            (conferenceJoinedAtRef.current + MINIMUM_CONFERENCE_DURATION) <= Date.now() &&
            hasUpdatedRef(leavingRef, true)
        ) {
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

                if (leaveInitiator === 'internal') {
                    // Notify OS about the end of the call
                    nativeReporters.callEnded(conferenceId);
                }
            }

            if (jitsiMeetingRef.current) {
                jitsiMeetingRef.current.close();
            }
        }
    });
    const leaveCall = (...args: Parameters<CallScreenHandle['leaveCall']>) => {
        leaveCallRef.current!(...args);
    };

    /**
     * Setup the JitsiMeeting event listeners
     * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#eventlisteners
     */
    const participantCountRef = useTransientRef(participantCount);
    const eventListeners = useMemo(() => ({
        onConferenceJoined: () => {
            // Update the conferenceJoinedAtRef date
            conferenceJoinedAtRef.current = Date.now();

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
                    let callName = `~${channel.name}`; // Public / Private channel

                    // Find the target user's username for DM calls
                    if (isDMorGM) {
                        // Current user is not displayed
                        const participantCountOverflow = Math.max(
                            Math.max(0, participantCountRef.current! - 1) - // Current user is not displayed (-1)
                            MAX_CALLNAME_PARTICIPANT_USERNAMES,
                        );

                        // Remove current user from list
                        const users = (await fetchChannelMemberships(serverUrl, channelId, {per_page: MAX_CALLNAME_PARTICIPANT_USERNAMES + 1})).users.
                            filter((user) => user.id !== currentUser.id).
                            slice(0, MAX_CALLNAME_PARTICIPANT_USERNAMES);

                        // Construct callName useing usernames
                        callName = users.map((user) => `@${user.username}`).join(' ');
                        if (participantCountOverflow > 0) {
                            callName = `${callName} +${participantCountOverflow}`;
                        }
                    }

                    // Trigger native reporter
                    nativeReporters.callStarted(serverId, channelId, conferenceId, callName);

                    // Also report about the audio/video mute status if toggled
                    const callbacks = [] as Array<() => void>;
                    if (audioMutedRef.current) {
                        callbacks.push(() => {
                            nativeReporters.callMuted(conferenceId, true);
                        });
                    }
                    if (videoMutedRef.current) {
                        callbacks.push(() => {
                            nativeReporters.callVideoMuted(conferenceId, true);
                        });
                    }

                    // Trigger the update after a delay
                    if (callbacks.length) {
                        setTimeout(() => {
                            for (const callback of callbacks) {
                                callback();
                            }
                        }, 100);
                    }
                }());
            }
        },
        onAudioMutedChanged: (isMuted: boolean) => {
            if (
                typeof conferenceId === 'string' &&
                typeof conferenceJoinedAtRef.current === 'number' &&
                hasUpdatedRef(audioMutedRef, isMuted)
            ) {
                nativeReporters.callMuted(conferenceId, isMuted);
            }
        },
        onVideoMutedChanged: (isMuted: boolean) => {
            if (
                typeof conferenceId === 'string' &&
                typeof conferenceJoinedAtRef.current === 'number' &&
                hasUpdatedRef(videoMutedRef, isMuted)
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
        CallManager.registerCallScreen({leaveCall, muteCall, muteVideo});
    }, []);

    return (
        <JitsiMeeting

            ref={jitsiMeetingRef}

            // Ref. https://github.com/jitsi/jitsi-meet/blob/master/config.js
            config={{
                subject: 'kMeet',
                disableModeratorIndicator: true,

                // Start calls with video muted
                // https://github.com/jitsi/jitsi-meet/blob/0913554af97e91f14b5a63ce8c8579755f1405a7/config.js#L290
                startVideoMuted: 0,
                startWithVideoMuted: false,
            }}

            token={conferenceJWT}

            /**
             * Setup the JitsiMeeting event listeners
             * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-native-sdk#eventlisteners
             */
            eventListeners={eventListeners}

            // Ref. https://github.com/jitsi/jitsi-meet/blob/master/react/features/base/flags/constants.ts
            flags={{

                // Prevent inviting new peoples
                'add-people.enabled': false,
                'invite.enabled': false,
                'invite-dial-in.enabled': false,

                // Do not display meeting name
                'meeting-name.enabled': false,

                /**
                 * For DM channels : Join immediatly like you would when answering a call
                 * For other channels : Ask if the user wants to enable his audio/video, but only if it's not the one that created the conference
                 */
                'prejoinpage.enabled': !isDMorGM && !isCurrentUserInitiator,
                'prejoinpage.hideDisplayName': true,

                // Disable breakout-rooms
                'breakout-rooms.enabled': false,

                // 'lobby-mode.enabled': false,
                // 'server-url-change.enabled': false,

                // Disable CallKit
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
