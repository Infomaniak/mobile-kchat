// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable react/display-name */
/* eslint-disable react/jsx-max-props-per-line */

import {JitsiMeeting, type JitsiRefProps} from '@jitsi/react-native-sdk';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type ComponentProps, type MutableRefObject} from 'react';
import {useIntl} from 'react-intl';
import {ActivityIndicator, FlatList, Platform, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {SafeAreaView, type Edge} from 'react-native-safe-area-context';

import {fetchChannelById, switchToChannelById} from '@actions/remote/channel';
import {fetchConference} from '@actions/remote/conference';
import {postListRef} from '@app/components/post_list/post_list';
import {useServerId} from '@app/context/server';
import {useTheme} from '@app/context/theme';
import {useCollapsibleHeader} from '@app/hooks/header';
import {useMountedRef, useRerender, useTransientRef} from '@app/hooks/utils';
import {getCommonSystemValues} from '@app/queries/servers/system';
import {logError} from '@app/utils/log';
import {changeOpacity, makeStyleSheetFromTheme} from '@app/utils/theme';
import {typography} from '@app/utils/typography';
import {usePermissionsChecker} from '@calls/hooks';
import {AudioMuteButton, ContentContainer, HangupButton, Sound, ToolboxContainer, VideoMuteButton} from '@calls/screens/call_screen/jitsi_components';
import RippleIcon from '@calls/screens/call_screen/ripple_icon';
import NavigationHeader from '@components/navigation_header';
import Image from '@components/profile_picture/image';
import {Screens} from '@constants';
import DatabaseManager from '@database/manager';
import CallManager from '@store/CallManager';
import {isDMorGM as isChannelDMorGM} from '@utils/channel';

import type ChannelModel from '@typings/database/models/servers/channel';
import type ConferenceModel from '@typings/database/models/servers/conference';

export type PassedProps = {
    serverUrl: string;
    kMeetServerUrl: string;
    channelId: string;
    conferenceId: string;
    conferenceJWT: string;
    conferenceURL: string;
    answered: boolean;
    initiator?: 'internal' | 'native';
    userInfo: ComponentProps<typeof JitsiMeeting>['userInfo'];
};

export type InjectedProps = {
    channel?: ChannelModel;
    currentUserId: string;
    micPermissionsGranted: boolean;
    conference: ConferenceModel | undefined;
    participantCount: number;

    // isCurrentUserPresent: boolean;
    hasAtLeastOneParticipantPresent: boolean;
}

export type CallScreenHandle = {
    leaveCall: (leaveInitiator?: 'api' | 'internal' | 'native') => void;
    toggleAudioMuted: (isMuted?: boolean) => void;
    toggleVideoMuted: (isMuted?: boolean) => void;
};

export const callScreenRef = React.createRef<CallScreenHandle>();

type Props = PassedProps & InjectedProps

/**
 * Prevent the conference from being closed by 'leaveCall'
 * handle if the duration is lower than this value
 */
const MINIMUM_CONFERENCE_DURATION = 2000; // ms

const EDGES: Edge[] = ['bottom', 'left', 'right'];

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

const FrozenJitsiMeeting = forwardRef<JitsiRefProps, ComponentProps<typeof JitsiMeeting>>((props, ref) =>
    useMemo(() => (<JitsiMeeting ref={ref} {...props}/>), []));

const CallScreen = ({

    // PassedProps
    channelId,
    conferenceId,
    conferenceJWT,
    conferenceURL,
    answered,
    initiator,
    serverUrl,
    kMeetServerUrl,
    userInfo,

    // InjectedProps
    channel,
    currentUserId,
    micPermissionsGranted,
    conference,
    participantCount,

    // isCurrentUserPresent,
    hasAtLeastOneParticipantPresent,
}: Props) => {
    const {formatMessage} = useIntl();
    const mountedRef = useMountedRef();
    const rerender = useRerender();
    const serverId = useServerId();
    const theme = useTheme();

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
    const isDMorGM = channel ? isChannelDMorGM(channel) : false;

    /**
     * Is the current user the one that initiated the conference
     */
    const isCurrentUserInitiator = !answered;

    /**
     * Ask for microphone permissions
     */
    usePermissionsChecker(micPermissionsGranted);

    /**
     * Display the loading screen if data has not been fully loaded yet
     */
    const shouldDisplayLoadingScreen = typeof channel === 'undefined';

    /**
     * The "Calling..." screen should only be displayed if :
     *  - the current channel is a DM
     *  - the current user is the call initiator (the caller)
     *  - there are no participants in the meeting other than possibly the current user him/herself
     *  - the meeting screen has never been displayed (you cannot go back to the calling screen)
     */
    const shouldDisplayCallingScreen = (
        isDMorGM &&
        isCurrentUserInitiator &&
        !hasAtLeastOneParticipantPresent &&
        jitsiMeetingMountedRef.current === false
    );

    /**
     * iOS must handle calling screen natively
     */
    const shouldDisplayNativeCall = (
        !shouldDisplayLoadingScreen &&
        !shouldDisplayCallingScreen &&
        Platform.OS === 'ios'
    );

    /**
     * Lazily query the called users
     */
    const currentUserIdRef = useTransientRef(currentUserId);
    const callUsersRef = useRef<UserProfile[]>();
    const getCallUsers = useCallback(async () => {
        if (
            typeof callUsersRef.current === 'undefined' &&
            typeof currentUserIdRef.current === 'string'
        ) {
            callUsersRef.current = isDMorGM ? await CallManager.getCalledUsers(serverUrl, channelId, currentUserIdRef.current) : [];
        }

        return callUsersRef.current!;
    }, [isDMorGM]);

    /**
     * Lazily query the callName
     */
    const callNameRef = useRef<string | undefined>(undefined);
    const hasCallName = typeof callNameRef.current === 'string';
    const getCallName = useCallback(async () => {
        if (
            typeof channel !== 'undefined' &&
            typeof callNameRef.current !== 'string' &&
            typeof currentUserIdRef.current === 'string'
        ) {
            // Update value
            callNameRef.current = await CallManager.getCallName(serverUrl, channel, currentUserIdRef.current);
        }

        return callNameRef.current ?? '...';
    }, [channel]);

    /**
     * Unpack the recipient from the lazily queried call users
     */
    const recipient = typeof callUsersRef.current === 'object' ? callUsersRef.current[0] : undefined;

    // Compute the participant count localized string
    const participantCountString = formatMessage(
        {id: 'screen.call.member_count', defaultMessage: '{count} {count, plural, one {member} other {members}}'},
        {count: participantCount || 0},
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
                CallManager.nativeReporters.callEnded(conferenceId);
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
    const eventListeners = useMemo(() => ({
        onConferenceJoined: async () => {
            // Update the jitsiMeetingMountedAtRef date
            jitsiMeetingMountedRef.current = true;
            jitsiMeetingMountedAtRef.current = Date.now();

            // Report that the call started only if the initiator is not native
            //  -> 'internal' initiator means react-native
            if (initiator !== 'native') {
                // Trigger native reporter
                if (Platform.OS === 'android') {
                    CallManager.nativeReporters.android.callStarted(serverId, channelId, await getCallName(), conferenceId);
                }

                // Also report about the audio/video mute status if toggled
                const callbacks = [] as Array<() => void>;
                if (audioMutedRef.current) {
                    callbacks.push(() => {
                        CallManager.nativeReporters.callMuted(conferenceId, true);
                    });
                }
                if (videoMutedRef.current) {
                    callbacks.push(() => {
                        CallManager.nativeReporters.callVideoMuted(conferenceId, true);
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
                CallManager.nativeReporters.callMuted(conferenceId, isMuted);
            }
        },
        onVideoMutedChanged: (isMuted: boolean) => {
            if (
                typeof jitsiMeetingMountedAtRef.current === 'number' &&
                hasUpdatedRef(videoMutedRef, isMuted)
            ) {
                CallManager.nativeReporters.callVideoMuted(conferenceId, isMuted);
            }
        },
        onReadyToClose: () => {
            leaveCallRef.current!('internal');
        },
    }), []);

    // STYLES
    const styles = getStyleSheet(theme);
    const {scrollPaddingTop, scrollValue/*, headerHeight*/} = useCollapsibleHeader<FlatList<string>>(true);
    const paddingTop = useMemo(() => ({flexGrow: 1/*, paddingTop: scrollPaddingTop*/}), [scrollPaddingTop]);
    // const top = useAnimatedStyle(() => ({top: headerHeight.value}));

    // IMPERATIVE HANDLE
    useImperativeHandle(callScreenRef, () => ({leaveCall, toggleAudioMuted, toggleVideoMuted}));

    // EFFECTS
    // Leave/cancel the call on unmount
    useEffect(() => () => {
        leaveCallRef.current!();
    }, []);

    // Fetch and update the current callName
    useEffect(() => {
        if (channel && currentUserId) {
            // Async forced re-render
            // when both calledUsers and callName has been resolved
            Promise.all([getCallUsers(), getCallName()]).then(rerender);
        }
    }, [Boolean(channel && currentUserId)]);

    // Fetch the current channel if necessary
    useEffect(() => {
        if (!channel) {
            fetchChannelById(serverUrl, channelId);
        }
    }, [channel]);

    // Fetch the current conference if it was not received via WS
    useEffect(() => {
        if (!conference) {
            fetchConference(serverUrl, conferenceId);
        }
    }, [conference]);

    /**
     * If the user called but the recipient did not answer
     * the 'conference_deleted' event is fired by the API
     * we still need to leave the call in the UI
     * Also if the current user is present in the meeting but the meeting
     */
    const isConferenceDeleted = typeof conference?.deleteAt === 'number';

    /**
     * Also if the current user is present in the meeting but the meeting is not mounted
     * This means that the user joined the meeting from another device
     */
    // const hasCurrentUserJoinedOnAnotherDevice = (
    //     isCurrentUserPresent &&
    //     jitsiMeetingMountedRef.current === false
    // );

    const hasCurrentUserJoinedOnAnotherDevice = false;

    /**
     * If any of these conditions are true, we must leave the call
     */
    const shouldLeaveCall = isConferenceDeleted || hasCurrentUserJoinedOnAnotherDevice;

    useEffect(() => {
        if (shouldLeaveCall) {
            // Conference deleted via websocket
            leaveCallRef.current!('api');
        }
    }, [shouldLeaveCall]);

    /**
     * Trigger the native iOS calling screen
     */
    useEffect(() => {
        if (shouldDisplayNativeCall) {
            (async () => {
                const callName = await CallManager.getCallName(serverUrl, channel, currentUserId!);
                CallManager.nativeReporters.ios.callStarted(serverUrl, channelId, callName, conferenceId, conferenceJWT, conferenceURL);
            })();
        }
    }, [shouldDisplayNativeCall]);

    if (
        shouldDisplayLoadingScreen ||
        shouldDisplayCallingScreen ||
        shouldDisplayNativeCall
    ) {
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
                    style={styles.flex}
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
                <Sound
                    play={!shouldDisplayLoadingScreen}
                    soundName={isCurrentUserInitiator ? 'outgoingRinging.mp3' : 'ring.mp3'}
                />
            </>
        );
    }

    return (
        <FrozenJitsiMeeting
            ref={jitsiMeetingRef}

            // Ref. https://github.com/jitsi/jitsi-meet/blob/master/config.js
            config={{
                subject: 'kMeet',
                disableModeratorIndicator: true,

                // Start calls with audio muted
                // https://github.com/jitsi/jitsi-meet/blob/0913554af97e91f14b5a63ce8c8579755f1405a7/config.js#L187
                startAudioMuted: 9999,
                startWithAudioMuted: audioMuted,

                // Start calls with video muted
                // https://github.com/jitsi/jitsi-meet/blob/0913554af97e91f14b5a63ce8c8579755f1405a7/config.js#L290
                startVideoMuted: 9999,
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
                'prejoinpage.enabled': !isDMorGM && !isCurrentUserInitiator,

                // Disable breakout-rooms
                'breakout-rooms.enabled': false,

                // 'lobby-mode.enabled': false,
                // 'server-url-change.enabled': false,

                // Disable CallKit
                'call-integration.enabled': false,

                // Disable screensharing on android
                'android.screensharing.enabled': false,

                // Disable live streaming - Same as kMeet
                'live-streaming.enabled': false,

                // Disable video share - Same as kMeet
                'video-share.enabled': false,
            }}
            style={styles.flex}
            room={channelId}
            serverURL={kMeetServerUrl}
            userInfo={userInfo}
        />
    );
};

export default CallScreen;
