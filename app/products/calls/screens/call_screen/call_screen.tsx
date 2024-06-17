// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint max-lines: off */
/* eslint-disable max-nested-callbacks */

import {JitsiMeeting, type JitsiRefProps} from '@jitsi/react-native-sdk';
import moment from 'moment';
import React, {useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type ComponentProps, type MutableRefObject} from 'react';
import {useIntl} from 'react-intl';
import {ActivityIndicator, DeviceEventEmitter, FlatList, NativeModules, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {useAnimatedStyle} from 'react-native-reanimated';
import {SafeAreaView, type Edge} from 'react-native-safe-area-context';

import {updateLocalCustomStatus} from '@actions/local/user';
import {fetchChannelMemberships, switchToChannelById} from '@actions/remote/channel';
import {fetchConference} from '@actions/remote/conference';
import {unsetCustomStatus, updateCustomStatus} from '@actions/remote/user';
import {postListRef} from '@app/components/post_list/post_list';
import {CustomStatusDurationEnum, SET_CUSTOM_STATUS_FAILURE} from '@app/constants/custom_status';
import {useServerId} from '@app/context/server';
import {useTheme} from '@app/context/theme';
import {useCollapsibleHeader} from '@app/hooks/header';
import {useMountedRef, useRerender, useTransientRef} from '@app/hooks/utils';
import {fetchConferenceHasAtLeastOneParticipantPresent} from '@app/queries/servers/conference';
import {getCommonSystemValues} from '@app/queries/servers/system';
import {calculateExpiryTime} from '@app/screens/custom_status/custom_status';
import {logError} from '@app/utils/log';
import {changeOpacity, makeStyleSheetFromTheme} from '@app/utils/theme';
import {typography} from '@app/utils/typography';
import {getUserCustomStatus, getUserTimezone} from '@app/utils/user';
import {usePermissionsChecker} from '@calls/hooks';
import {AudioMuteButton, ContentContainer, HangupButton, OutgoingRinging, ToolboxContainer, VideoMuteButton} from '@calls/screens/call_screen/jitsi_components';
import RippleIcon from '@calls/screens/call_screen/ripple_icon';
import NavigationHeader from '@components/navigation_header';
import Image from '@components/profile_picture/image';
import {General, Screens} from '@constants';
import DatabaseManager from '@database/manager';
import {debounce, noop} from '@helpers/api/general';
import CallManager from '@store/CallManager';
import {isDMorGM as isChannelDMorGM} from '@utils/channel';

import type ChannelModel from '@typings/database/models/servers/channel';
import type ConferenceModel from '@typings/database/models/servers/conference';
import type UserModel from '@typings/database/models/servers/user';

export type PassedProps = {
    serverUrl: string;
    kMeetServerUrl: string;
    channelId: string;
    conferenceId: string;
    conferenceJWT: string;
    answered: boolean;
    initiator?: 'internal' | 'native';
    userInfo: ComponentProps<typeof JitsiMeeting>['userInfo'];
};

export type InjectedProps = {
    channel?: ChannelModel;
    conference: ConferenceModel | undefined;
    currentUser: UserModel;
    currentUserId: string;
    micPermissionsGranted: boolean;
    participantCount: number;

    // hasAtLeastOneParticipantPresent: boolean;
}

export type CallScreenHandle = {
    leaveCall: (leaveInitiator?: 'api' | 'internal' | 'native') => void;
    toggleAudioMuted: (isMuted?: boolean) => void;
    toggleVideoMuted: (isMuted?: boolean) => void;
};

export const callScreenRef = React.createRef<CallScreenHandle>();

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

const EDGES: Edge[] = ['bottom', 'left', 'right'];

const kMeetStatus = {
    emoji: 'kmeet',
    duration: CustomStatusDurationEnum.DONT_CLEAR,
} as Pick<UserCustomStatus, 'emoji' | 'duration'>;

/**
 * Global styles
 */
const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
    flex: {flex: 1},
    wrapper: {flex: 1},
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },

    /** Recipient avatar */
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    /** Button text */
    buttonText: {
        color: changeOpacity(theme.buttonColor, 0.72),
        ...typography('Body', 75, 'SemiBold'),
    },
    unavailableText: {
        color: changeOpacity(theme.buttonColor, 0.32),
    },

    /** Mute audio/video buttons */
    mute: {
        alignSelf: 'stretch',
        alignItems: 'center',
        gap: 4,
        padding: 24,
        backgroundColor: theme.onlineIndicator,
        borderRadius: 20,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 20,
        marginBottom: 20,
    },
    muteMuted: {
        backgroundColor: changeOpacity(theme.buttonColor, 0.12),
    },
    muteIcon: {
        color: theme.buttonColor,
    },
}));

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
 * Test if there is at least one participant present in the conference
 * only necessary for DMs
 * HACK ugly hack to prevent android from crashing
 */
const useHasAtLeastOneParticipantPresent = (() => {
    const INTERVAL = 1000; // ms
    const TIMER = 1000; // ms

    return (isDM: boolean, serverUrl: string, conferenceId: string, currentUserId: string) => {
        const [hasAtLeastOneParticipantPresent, setHasAtLeastOneParticipantPresent] = useState<boolean | undefined>(isDM ? false : undefined);
        useEffect(() => {
            if (isDM) {
                let interval: NodeJS.Timeout | null = null;
                const database = DatabaseManager.serverDatabases[serverUrl]?.database;

                const clean = () => {
                    if (typeof interval === 'number') {
                        clearInterval(interval);
                        interval = null;
                    }
                };

                // Poll database until we get the response that we want
                interval = setInterval(async () => {
                    if (await fetchConferenceHasAtLeastOneParticipantPresent(database!, conferenceId, currentUserId)) {
                        setTimeout(() => {
                            setHasAtLeastOneParticipantPresent(true);
                        }, TIMER);
                        clean();
                    }
                }, INTERVAL);
                return clean;
            }

            return noop;
        }, []);

        return hasAtLeastOneParticipantPresent;
    };
})();

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
    currentUserId,
    micPermissionsGranted,
    participantCount,

    // hasAtLeastOneParticipantPresent,
    answered,
    initiator,
    serverUrl,
    kMeetServerUrl,
    userInfo,
}: Props) => {
    const {formatMessage} = useIntl();
    const mountedRef = useMountedRef();
    const rerender = useRerender();
    const serverId = useServerId();
    const theme = useTheme();

    /**
     * Ask for microphone permissions
     */
    usePermissionsChecker(micPermissionsGranted);

    /**
     * Keep reference of whenever we have mounted the <JitsiMeeting />
     * component and it's imperative handle
     */
    const jitsiMeetingRef = useRef<JitsiRefProps | null>(null);
    const jitsiMeetingMountedRef = useRef(false);
    const jitsiMeetingMountedAtRef = useRef<number | undefined>();

    /**
     * Audio/Video muted state can be altered before entering the <JitsiMeeting />
     * call component, we need to be able to both report it's state change and update the
     * "Calling..." screen interface
     */
    const [audioMuted, setAudioMuted] = useState(false);
    const [videoMuted, setVideoMuted] = useState(true); // Start with video muted
    const audioMutedRef = useTransientRef(audioMuted);
    const videoMutedRef = useTransientRef(videoMuted);

    /**
     * Mute/Unmute audio
     * Can be called with no args to toggle/untoggle current state
     */
    const toggleAudioMuted = useCallback((isMuted?: unknown) => {
        const nextState = typeof isMuted === 'boolean' ? isMuted : !audioMutedRef.current;

        // If the <JitsiMeeting /> component has already been mounted,
        // we can use the imperative handle instead of calling a "setState"
        if (jitsiMeetingMountedRef.current) {
            if (
                // Prevent triggering a callback if the current state already matches the next state
                // removing the next time would cause an infinite loop between the native interface
                // that would report the audio muted and the <JitsiMeeting /> component that
                // would report an internal state change
                hasUpdatedRef(audioMutedRef, nextState) &&
                typeof jitsiMeetingRef.current?.setAudioMuted === 'function'
            ) {
                jitsiMeetingRef.current.setAudioMuted(nextState);
            }
        } else if (audioMutedRef.current !== nextState) {
            setAudioMuted(nextState);
        }
    }, []);

    /**
     * Mute/Unmute video
     * Can be called with no args to toggle/untoggle current state
     */
    const toggleVideoMuted = useCallback((isMuted?: unknown) => {
        const nextState = typeof isMuted === 'boolean' ? isMuted : !videoMutedRef.current;

        // If the <JitsiMeeting /> component has already been mounted,
        // we can use the imperative handle instead of calling a "setState"
        if (jitsiMeetingMountedRef.current) {
            if (
                // Prevent triggering a callback if the current state already matches the next state
                // removing the next time would cause an infinite loop between the native interface
                // that would report the video muted and the <JitsiMeeting /> component that
                // would report an internal state change
                hasUpdatedRef(videoMutedRef, nextState) &&
                typeof jitsiMeetingRef.current?.setVideoMuted === 'function'
            ) {
                jitsiMeetingRef.current.setVideoMuted(nextState);
            }
        } else if (videoMutedRef.current !== nextState) {
            setVideoMuted(nextState);
        }
    }, []);

    /**
     * Is the current channel a DM or GM, will be false
     * for public and private channels
     */
    const isDM = channel?.type === General.DM_CHANNEL;
    const isDMorGM = channel ? isChannelDMorGM(channel) : false;

    /**
     * Is the current user the one that initiated the conference
     */
    const isCurrentUserInitiator = !answered;

    /**
     * We should be using the observable hasAtLeastOneParticipantPresent instead
     * HACK ugly hack to prevent android from crashing
     */
    const hasAtLeastOneParticipantPresent = useHasAtLeastOneParticipantPresent(isDM, serverUrl, conferenceId, currentUserId);

    /**
     * Display the loading screen if the conference has not been loaded yet
     */
    const shouldDisplayLoadingScreen = !conference;

    /**
     * The "Calling..." screen should only be displayed if :
     *  - the current channel is a DM
     *  - the current user is the call initiator (the caller)
     *  - there are no participants in the meeting other than possibly the current user him/herself
     *  - the meeting screen has never been displayed (you cannot go back to the calling screen)
     */
    const shouldDisplayCallingScreen = (
        isDM &&
        isCurrentUserInitiator &&
        !hasAtLeastOneParticipantPresent &&
        jitsiMeetingMountedRef.current === false
    );

    /**
     * Lazily query the called users
     */
    const callUsersRef = useRef<UserProfile[]>();
    const getCallUsers = useCallback(async () => {
        if (typeof callUsersRef.current === 'undefined') {
            // Find the recipients for DM or GM calls
            if (isDMorGM) {
                // Remove current user from list
                callUsersRef.current = (await fetchChannelMemberships(serverUrl, channelId, {per_page: MAX_CALLNAME_PARTICIPANT_USERNAMES + 1})).users.
                    filter((user) => user.id !== currentUserId).
                    slice(0, MAX_CALLNAME_PARTICIPANT_USERNAMES);
            } else {
                callUsersRef.current = [];
            }
        }

        return callUsersRef.current!;
    }, [channelId]);

    /**
     * Lazily query the callName
     */
    const callNameRef = useRef<string | undefined>(undefined);
    const hasCallName = typeof callNameRef.current === 'string';
    const getCallName = useCallback(async (forceRerender = false) => {
        if (typeof channel === 'undefined') {
            return '...';
        }

        if (typeof callNameRef.current !== 'string') {
            let callName = `~${channel.name}`; // Public / Private channel

            // Find the target user's username for DM calls
            if (isDMorGM) {
                // Current user is not displayed
                const participantCountOverflow = Math.max(
                    Math.max(0, participantCountRef.current! - 1) - // Current user is not displayed (-1)
                    MAX_CALLNAME_PARTICIPANT_USERNAMES,
                );

                // Remove current user from list
                const users = await getCallUsers();

                // Construct callName useing usernames
                callName = users.map((user) => `@${user.username}`).join(' ');
                if (participantCountOverflow > 0) {
                    callName = `${callName} +${participantCountOverflow}`;
                }
            }

            callNameRef.current = callName;
        }

        // Forced update
        if (forceRerender) {
            rerender();
        }

        return callNameRef.current;
    }, [channel]);

    /**
     * Unpack the recipient from the lazily queried call users
     */
    const recipient = typeof callUsersRef.current === 'object' ? callUsersRef.current[0] : undefined;

    // Compute the participant count localized string
    const participantCountString = formatMessage(
        {id: 'screen.call.member_count', defaultMessage: '{count} {count, plural, one {member} other {members}}'},
        {count: participantCount},
    );

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
     * Close the current JitsiMeeting
     * Also trigger the "leaveCall" API
     */
    const leavingRef = useRef(false);
    const leaveCallRef = useTransientRef((leaveInitiator: 'api' | 'internal' | 'native' = 'internal') => {
        const isUserInsideCall = jitsiMeetingMountedRef.current;

        if (
            mountedRef.current &&
            leavingRef.current === false &&
            (

                // Call was not answered OR
                !isUserInsideCall ||

                // Call has not been started for long-enought
                // (this also prevents the simulator from immediatly closing because native handlers do not exists)
                (
                    typeof jitsiMeetingMountedAtRef.current === 'number' &&
                    (jitsiMeetingMountedAtRef.current + MINIMUM_CONFERENCE_DURATION) <= Date.now()
                )
            ) &&
            hasUpdatedRef(leavingRef, true)
        ) {
            // Restore previous status
            if (autoUpdateStatus) {
                restoreStatus();
            }

            // Remove the call screen, and in some situations it needs to be removed twice before actually being removed
            Navigation.pop(Screens.CALL).catch(() => null);
            Navigation.pop(Screens.CALL).catch(() => null);

            // Return back to the channel where this meeting has been started
            const database = DatabaseManager.serverDatabases[serverUrl]?.database;
            if (typeof database !== 'undefined') {
                getCommonSystemValues(database).then((system) => {
                    if (system.currentChannelId === channelId) {
                        // Scroll to end of post list
                        const scrollToEnd = postListRef.current?.scrollToEnd;
                        if (typeof scrollToEnd === 'function') {
                            scrollToEnd();
                        }
                    } else {
                        // Go to this kMeet's related channel
                        switchToChannelById(serverUrl, channelId);
                    }
                });
            }

            if (leaveInitiator !== 'native') {
                // Notify OS about the end of the call
                nativeReporters.callEnded(conferenceId);
            }

            if (typeof jitsiMeetingRef.current?.close === 'function') {
                // Terminate the <JitsiMeeting />
                try {
                    jitsiMeetingRef.current.close();
                } catch (e) {
                    logError('JitsiMeeting could not be closed', e);
                }
            }

            // Only notify the backend, if it's not the backend that notified us!
            if (leaveInitiator !== 'api') {
                if (isUserInsideCall) {
                    // Call has been left by user
                    CallManager.leaveCall(serverUrl, conferenceId);
                } else {
                    // User canceled the call before it even started!
                    CallManager.cancelCall(serverUrl, conferenceId);
                }
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
        onConferenceJoined: async () => {
            // Update the jitsiMeetingMountedAtRef date
            jitsiMeetingMountedRef.current = true;
            jitsiMeetingMountedAtRef.current = Date.now();

            if (autoUpdateStatus) {
                updateStatus();
            }

            // Report that the call started only if the initiator is not native
            //  -> 'internal' initiator means react-native
            if (initiator !== 'native') {
                // Trigger native reporter
                nativeReporters.callStarted(serverId, channelId, conferenceId, await getCallName());

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
            }
        },
        onAudioMutedChanged: (isMuted: boolean) => {
            if (
                typeof jitsiMeetingMountedAtRef.current === 'number' &&
                hasUpdatedRef(audioMutedRef, isMuted)
            ) {
                nativeReporters.callMuted(conferenceId, isMuted);
            }
        },
        onVideoMutedChanged: (isMuted: boolean) => {
            if (
                typeof jitsiMeetingMountedAtRef.current === 'number' &&
                hasUpdatedRef(videoMutedRef, isMuted)
            ) {
                nativeReporters.callVideoMuted(conferenceId, isMuted);
            }
        },
        onReadyToClose: () => {
            leaveCallRef.current!('internal');
        },
    }), []);

    // STYLES
    const styles = getStyleSheet(theme);
    const {scrollPaddingTop, scrollValue, headerHeight} = useCollapsibleHeader<FlatList<string>>(true);
    const paddingTop = useMemo(() => ({flexGrow: 1/*, paddingTop: scrollPaddingTop*/}), [scrollPaddingTop]);
    const top = useAnimatedStyle(() => ({top: headerHeight.value}));

    // IMPERATIVE HANDLE
    useImperativeHandle(callScreenRef, () => ({leaveCall, toggleAudioMuted, toggleVideoMuted}));

    // EFFECTS
    useEffect(() => {
        // Fetch and update the current conference if it was not received via WS
        if (!conference) {
            fetchConference(serverUrl, conferenceId);
        }

        // Fetch the current call name
        getCallName(true); // Async forced re-render

        return () => {
            // Leave/cancel the call on unmount
            leaveCallRef.current!();
        };
    }, []);

    /**
     * If the user called but the recipient did not answer
     * the 'conference_deleted' event is fired by the API
     * we still need to leave the call in the UI
     */
    const isConferenceDeleted = typeof conference?.deleteAt === 'number';
    useEffect(() => {
        if (isConferenceDeleted) {
            // Conference deleted via websocket
            leaveCallRef.current!('api');
        }
    }, [isConferenceDeleted]);

    if (shouldDisplayLoadingScreen || shouldDisplayCallingScreen) {
        return (
            <>
                <NavigationHeader
                    isLargeTitle={true}
                    showBackButton={true}
                    onBackPress={eventListeners.onReadyToClose}
                    hasSearch={false}
                    title={formatMessage({id: 'screen.call.calling', defaultMessage: 'Call in progress'})}
                    subtitle={hasCallName ? `${callNameRef.current}${isDMorGM ? '' : ` (${participantCountString})`}` : '...'}
                    scrollValue={scrollValue}
                />
                <SafeAreaView
                    style={[styles.flex, top]}
                    edges={EDGES}
                >
                    <View style={paddingTop}>
                        {/* Recipient avatar */}
                        <View style={styles.container}>
                            {
                                (shouldDisplayLoadingScreen || typeof recipient === 'undefined') ? (
                                    <ActivityIndicator
                                        color='white'
                                        size='large'
                                    />
                                ) : (
                                    <>
                                        <RippleIcon/>
                                        <Image
                                            author={recipient}
                                            iconSize={48}
                                            size={178}
                                            url={serverUrl}
                                        />
                                    </>
                                )
                            }
                        </View>

                        {/* Toolbox buttons */}
                        {
                            !shouldDisplayLoadingScreen &&

                            // <ContentContainer aspectRatio={isWide ? 'wide' : 'narrow'}>
                            <ContentContainer>
                                <ToolboxContainer>
                                    <AudioMuteButton
                                        audioMuted={audioMuted}
                                        disabled={!micPermissionsGranted}
                                        onPress={toggleAudioMuted}
                                    />
                                    <VideoMuteButton
                                        videoMuted={videoMuted}
                                        disabled={false}
                                        onPress={toggleVideoMuted}
                                    />
                                    <HangupButton
                                        onPress={() => {
                                            leaveCall('internal');
                                        }}
                                    />
                                </ToolboxContainer>
                            </ContentContainer>
                        }
                    </View>
                </SafeAreaView>

                {/* Trigger ringtone */}
                <OutgoingRinging play={!shouldDisplayLoadingScreen}/>
            </>
        );
    }

    return (
        <JitsiMeeting
            ref={jitsiMeetingRef}

            // Ref. https://github.com/jitsi/jitsi-meet/blob/master/config.js
            config={{
                subject: 'kMeet',
                disableModeratorIndicator: true,

                // Start calls with audio muted
                // https://github.com/jitsi/jitsi-meet/blob/0913554af97e91f14b5a63ce8c8579755f1405a7/config.js#L187
                startAudioMuted: 0,
                startWithAudioMuted: audioMuted,

                // Start calls with video muted
                // https://github.com/jitsi/jitsi-meet/blob/0913554af97e91f14b5a63ce8c8579755f1405a7/config.js#L290
                startVideoMuted: 0,
                startWithVideoMuted: videoMuted,
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
                'prejoinpage.enabled': !isDM && !isCurrentUserInitiator,
                'prejoinpage.hideDisplayName': true,

                // Disable breakout-rooms
                'breakout-rooms.enabled': false,

                // 'lobby-mode.enabled': false,
                // 'server-url-change.enabled': false,

                // Disable CallKit
                'call-integration.enabled': false,
            }}
            style={{flex: 1}}
            room={channelId}
            serverURL={kMeetServerUrl}
            userInfo={userInfo}
        />
    );
};

export default CallScreen;
