// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment-timezone';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {z} from 'zod';

import {fetchConference, switchToConferenceByChannelId} from '@actions/remote/conference';
import IkCallsParticipantStack from '@calls/components/ik_calls_participant_stack';
import FormattedRelativeTime from '@components/formatted_relative_time';
import FormattedText from '@components/formatted_text';
import FormattedTime from '@components/formatted_time';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useMountedRef} from '@hooks/utils';
import UserModel from '@typings/database/models/servers/user';
import {isTablet} from '@utils/helpers';
import {isDarkTheme, changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';
import {getUserTimezone} from '@utils/user';

import KMeetIcon from './kmeet_icon';

import type PostModel from '@typings/database/models/servers/post';

const CallStatus = z.enum(['calling', 'joined', 'ended', 'missed', 'declined']);

const CallPropsSchema = (() => {
    const baseSchema = {
        url: z.string().url(),
        conference_id: z.string().uuid(),
        start_at: z.number().default(Date.now),
        end_at: z.number().optional(),
    };

    // Status fallback
    return z.
        object({...baseSchema, status: CallStatus.optional()}).
        transform((x) => (typeof x.status === 'undefined' ? {...x, status: typeof x.end_at === 'number' ? 'ended' : 'calling'} : x)).
        pipe(z.object({...baseSchema, status: CallStatus}));
})();

type CallProps = z.infer<typeof CallPropsSchema>

type Props = {
    currentUser?: UserModel;
    isDM: boolean;
    isMilitaryTime: boolean;
    post: PostModel;
};

type PropsInner = Omit<Props, 'post'> & {
    callProps: CallProps;
    channelId: string;
};

const HORIZONTAL_SPACING = 14;
const VERTICAL_SPACING = 9;

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        borderWidth: 0.5,
        borderColor: changeOpacity(theme.centerChannelColor, 0.15),
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 8,
        padding: 16,
    },
    top: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: VERTICAL_SPACING,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: HORIZONTAL_SPACING,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        borderRadius: 8,
        padding: 10,
        marginRight: HORIZONTAL_SPACING,
    },
    title: {
        color: theme.centerChannelColor,
        ...typography('Heading', 200, 'SemiBold'),
    },
    timeText: {
        color: changeOpacity(theme.centerChannelColor, 0.64),
        ...typography('Body', 75),
        marginBottom: 4,
    },
    button: {
        backgroundColor: theme.buttonBg,
        borderRadius: 6,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginLeft: HORIZONTAL_SPACING,
    },
    buttonText: {
        color: 'white',
        ...typography('Body', 200, 'SemiBold'),
    },
    participants: {
        marginTop: 2,
    },
}));

const IkCallsCustomMessageInner = ({currentUser, isDM, isMilitaryTime, callProps, channelId}: PropsInner) => {
    const theme = useTheme();
    const isDark = isDarkTheme(theme);
    const timezone = getUserTimezone(currentUser);
    const serverUrl = useServerUrl();
    const styles = getStyleSheet(theme);
    const isTabletDevice = isTablet();

    const {
        conference_id: conferenceId,
        status,
        start_at: startedAt,
        end_at: endedAt,
    } = callProps;
    const isActive = (status === 'calling' || status === 'joined');

    /**
     * Compute if the time difference is bellow 1 hour
     * display a relative time if it is
     */
    const eventDate = endedAt || startedAt;
    const isEventOlderThanAnHour = useMemo(
        () => Math.abs(moment.
            tz(eventDate, timezone).
            diff(moment.tz(timezone), 'minutes')) > 60,
        [eventDate, timezone],
    );

    /**
     * Styles
     */
    const iconBackgroundColor = isDark ? '#262A30' : '#FAFAFA';
    const backgroundColor = (() => {
        if (isActive) {
            return theme.centerChannelBg;
        }
        return isDark ? '#2A2E35' : '#F5F5F5';
    })();
    const containerStyles = [styles.container, {backgroundColor}];
    const iconContainerStyles = [styles.iconContainer, {backgroundColor: iconBackgroundColor}];

    /**
     * We cannot display the regular participant count if the
     * conference ended less than 60s ago, since moment will write a very long string
     */
    const [maxInlineParticipantCount, setMaxInlineParticipantCount] = useState(3);
    const isActiveRef = useRef(isActive);
    const isMountedRef = useMountedRef();
    useEffect(
        () => {
            if (!isActive && isActiveRef.current) {
                isActiveRef.current = true;
                setMaxInlineParticipantCount(2);
                setTimeout(() => {
                    if (isMountedRef.current) {
                        setMaxInlineParticipantCount(3);
                    }
                }, 1000 * 60);
            } else {
                isActiveRef.current = isActive;
            }
        }, [isActive],
    );

    /**
     * If the conference is active, make sure we have
     * the list of participants by fetching it from API
     */
    useEffect(() => {
        if (isActive) {
            fetchConference(serverUrl, conferenceId);
        }
    }, []);

    /**
     * Only allow answering call if it's a missed DM
     * or if the call is still in progress
     */
    const isCallInProgress = startedAt && !endedAt;
    const isMissedDMCall = isDM && status === 'missed';
    let callText = null;
    if (isCallInProgress) {
        callText = (
            <FormattedText
                id='mobile.calls_join_call_short'
                style={styles.buttonText}
                defaultMessage='Join'
            />
        );
    } else if (isMissedDMCall) {
        callText = (
            <FormattedText
                id='mobile.calls_call_back'
                style={styles.buttonText}
                defaultMessage='Call back'
            />
        );
    }

    /**
     * Wrap text with button
     */
    const callButton = callText === null ? null : (
        <TouchableOpacity
            onPress={() => {
                switchToConferenceByChannelId(serverUrl, channelId, {conferenceId, initiator: 'internal'});
            }}
            style={styles.button}
        >
            {callText}
        </TouchableOpacity>
    );

    let participantStack = null;
    if (
        typeof channelId === 'string' &&
        typeof conferenceId === 'string'
    ) {
        participantStack = (
            <IkCallsParticipantStack
                style={styles.participants}
                channelId={channelId}
                conferenceId={conferenceId}
                backgroundColor={backgroundColor}
                maxDisplayedCount={(callButton || isTabletDevice) ? 5 : maxInlineParticipantCount}
            />
        );
    }

    return (
        <View style={containerStyles}>

            <View style={styles.top}>
                <View style={styles.left}>
                    <View style={iconContainerStyles}>
                        <KMeetIcon/>
                    </View>
                    <View>
                        {
                            (() => {
                                if (status === 'declined') {
                                    return (
                                        <FormattedText
                                            id='mobile.calls_call_declined'
                                            style={styles.title}
                                            defaultMessage='Call rejected'
                                        />
                                    );
                                }
                                if (status === 'missed') {
                                    return (
                                        <FormattedText
                                            id='mobile.calls_call_missed'
                                            style={styles.title}
                                            defaultMessage='Call missed'
                                        />
                                    );
                                }
                                if (isDM ? (status === 'calling' || status === 'joined') : status !== 'ended') {
                                    return (
                                        <FormattedText
                                            id='mobile.calls_call_started'
                                            style={styles.title}
                                            defaultMessage='Call started'
                                        />
                                    );
                                }
                                return (
                                    <FormattedText
                                        id='mobile.calls_call_ended'
                                        style={styles.title}
                                        defaultMessage='Call ended'
                                    />
                                );
                            })()
                        }
                        <Text style={styles.timeText}>
                            {
                                isEventOlderThanAnHour ? (
                                    <>
                                        {
                                            (() => {
                                                if (status === 'declined') {
                                                    return (
                                                        <FormattedText
                                                            id='mobile.calls_declined_at'
                                                            style={styles.timeText}
                                                            defaultMessage='Rejected at'
                                                        />
                                                    );
                                                }
                                                if (status === 'missed') {
                                                    return (
                                                        <FormattedText
                                                            id='mobile.calls_missed_at'
                                                            style={styles.timeText}
                                                            defaultMessage='Missed at'
                                                        />
                                                    );
                                                }
                                                if (isDM ? (status === 'calling' || status === 'joined') : status !== 'ended') {
                                                    return (
                                                        <FormattedText
                                                            id='mobile.calls_started_at'
                                                            style={styles.timeText}
                                                            defaultMessage='Started at'
                                                        />
                                                    );
                                                }
                                                return (
                                                    <FormattedText
                                                        id='mobile.calls_ended_at'
                                                        style={styles.timeText}
                                                        defaultMessage='Ended at'
                                                    />
                                                );
                                            })()
                                        }
                                        {' '}
                                        <FormattedTime
                                            style={styles.timeText}
                                            value={eventDate}
                                            isMilitaryTime={isMilitaryTime}
                                            timezone={timezone}
                                        />
                                    </>
                                ) : (
                                    <FormattedRelativeTime
                                        style={styles.timeText}
                                        value={endedAt || startedAt}
                                        updateIntervalInSeconds={1}
                                        timezone={timezone}
                                    />
                                )
                            }
                        </Text>
                    </View>
                </View>
                <View style={styles.right}>
                    {(!callButton || isTabletDevice) && participantStack}
                    {isTabletDevice && callButton}
                </View>
            </View>

            {
                callButton && !isTabletDevice &&
                <View style={styles.bottom}>
                    {participantStack}
                    {callButton}
                </View>
            }

        </View>
    );
};

export const IkCallsCustomMessage = ({post, ...props}: Props) => {
    const channelId = post.channelId;
    const callProps = CallPropsSchema.safeParse(post.props);

    if (callProps.success) {
        return (
            <IkCallsCustomMessageInner
                channelId={channelId}
                callProps={callProps.data}
                {...props}
            />
        );
    }

    return null;
};
