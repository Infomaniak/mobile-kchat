// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment-timezone';
import React, {useEffect, useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {z} from 'zod';

import {fetchConference, switchToConferenceByChannelId} from '@actions/remote/conference';
import FormattedRelativeTime from '@app/components/formatted_relative_time';
import {useServerUrl} from '@app/context/server';
import {isDarkTheme} from '@app/utils/theme';
import IkCallsParticipantStack from '@calls/components/ik_calls_participant_stack';
import FormattedText from '@components/formatted_text';
import FormattedTime from '@components/formatted_time';
import {useTheme} from '@context/theme';
import UserModel from '@typings/database/models/servers/user';
import {isTablet} from '@utils/helpers';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';
import {getUserTimezone} from '@utils/user';

import KMeetIcon from './kmeet_icon';

import type PostModel from '@typings/database/models/servers/post';

const CallStatus = z.enum(['calling', 'joined', 'ended', 'missed', 'declined']);
type CallStatus = z.infer<typeof CallStatus>

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
type CallPropsSchema = z.infer<typeof CallPropsSchema>

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
        ...typography('Body', 100),
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

export const IkCallsCustomMessage = ({currentUser, isDM, isMilitaryTime, post}: {
    currentUser?: UserModel;
    isDM: boolean;
    isMilitaryTime: boolean;
    post: PostModel;
}) => {
    const theme = useTheme();
    const isDark = isDarkTheme(theme);
    const timezone = getUserTimezone(currentUser);
    const serverUrl = useServerUrl();
    const styles = getStyleSheet(theme);
    const isTabletDevice = isTablet();

    const channelId = post.channelId;
    const callProps = CallPropsSchema.parse(post.props);
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
     * If the conference is active, make sure we have
     * the list of participants by fetching it from API
     */
    useEffect(() => {
        if (isActive) {
            fetchConference(serverUrl, conferenceId);
        }
    }, []);

    let callButton = null;
    if (startedAt && !endedAt) {
        callButton = (
            <TouchableOpacity
                onPress={() => {
                    switchToConferenceByChannelId(serverUrl, channelId, {conferenceId, initiator: 'internal'});
                }}
                style={styles.button}
            >
                {
                    isDM && status === 'missed' ? (
                        <FormattedText
                            id='mobile.calls_call_back'
                            style={styles.buttonText}
                            defaultMessage='Call back'
                        />
                    ) : (
                        <FormattedText
                            id='mobile.calls_join_call_short'
                            style={styles.buttonText}
                            defaultMessage='Join'
                        />
                    )
                }
            </TouchableOpacity>
        );
    }

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
                maxDisplayedCount={(callButton || isTabletDevice) ? 5 : 3}
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
