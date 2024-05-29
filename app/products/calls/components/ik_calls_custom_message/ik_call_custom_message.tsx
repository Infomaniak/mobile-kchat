// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment-timezone';
import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Divider} from 'react-native-elements';
import {z} from 'zod';

import FormattedRelativeTime from '@app/components/formatted_relative_time';
import {useServerUrl} from '@app/context/server';
import CallManager from '@app/store/CallManager';
import {isDarkTheme} from '@app/utils/theme';
import IkCallsParticipantStack from '@calls/components/ik_calls_participant_stack';
import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import FormattedTime from '@components/formatted_time';
import {useTheme} from '@context/theme';
import UserModel from '@typings/database/models/servers/user';
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

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            borderWidth: 0.25,
            borderColor: changeOpacity(theme.centerChannelColor, 0.6),
            borderRadius: 4,
            marginTop: 8,
            marginBottom: 8,
        },
        participantContainer: {
            flexDirection: 'row',
            marginTop: 4,
            marginBottom: 8,
        },
        systemMessageTitle: {
            color: theme.centerChannelColor,
            ...typography('Heading', 200, 'SemiBold'),
        },
        systemMessageDescription: {
            color: theme.centerChannelColor,
            ...typography('Body', 200, 'Regular'),
        },
        iconContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 8,
            marginRight: 8,
        },
        iconMessageContainer: {
            flexDirection: 'row',
            padding: 16,
            paddingTop: 10,
        },
        joinCallContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        joinCallButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            backgroundColor: '#0098FF',
            margin: 8,
            borderRadius: 4,
        },
        joinCallButtonText: {
            color: 'white',
            marginLeft: 15,
            ...typography('Body', 200, 'SemiBold'),
        },
        joinIcon: {
            display: 'flex',
            color: 'white',
            width: 42,
            height: 42,
            textAlign: 'center',
            textAlignVertical: 'center',
            justifyContent: 'center',
            backgroundColor: '#0098FF',
            borderRadius: 4,
            margin: 4,
            padding: 9,
        },
        timeText: {
            ...typography('Body', 75),
            color: changeOpacity(theme.centerChannelColor, 0.64),
        },
        callParticipants: {
            marginTop: 4,
            marginBottom: 8,
        },
    };
});

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

    const channelId = post.channelId;
    const callProps = CallPropsSchema.parse(post.props);
    const {
        conference_id: conferenceId,
        status,
        start_at: startedAt,
        end_at: endedAt,
    } = callProps;

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
     * Compute bold message
     */
    const titleProps = (() => {
        if (status === 'declined') {
            return ({id: 'mobile.calls_call_declined', defaultMessage: 'Call rejected'});
        }
        if (status === 'missed') {
            return ({id: 'mobile.calls_call_missed', defaultMessage: 'Call missed'});
        }
        if (isDM ? (status === 'calling' || status === 'joined') : status !== 'ended') {
            return ({id: 'mobile.calls_call_started', defaultMessage: 'Call started'});
        }
        return ({id: 'mobile.calls_call_ended', defaultMessage: 'Call ended'});
    })();

    /**
     * Compute button message
     */
    const buttonLabelProps = isDM && status === 'missed' ? (
        {id: 'mobile.calls_call_back', defaultMessage: 'Call back'}
    ) : ({id: 'mobile.calls_join_call_short', defaultMessage: 'Join'});

    /**
     * Darken button background
     */
    const backgroundColor = (() => {
        if (status === 'calling' || status === 'joined') {
            return theme.centerChannelBg;
        }
        return isDark ? '#262A30' : '#F0F0F0';
    })();
    const containerStyles = [styles.container, {backgroundColor}];

    let callButton = null;
    if (startedAt && !endedAt) {
        callButton = (
            <View>
                <Divider/>
                <View style={styles.joinCallContainer}>
                    <View/>
                    <TouchableOpacity
                        onPress={() => {
                            CallManager.onCall(serverUrl, channelId, {conferenceId, initiator: 'internal'});
                        }}
                        style={styles.joinCallButton}
                    >
                        <FormattedText
                            style={styles.joinCallButtonText}
                            {...buttonLabelProps}
                        />
                        <CompassIcon
                            name={'phone-in-talk'}
                            size={24}
                            style={styles.joinIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={containerStyles}>
            <View style={styles.iconMessageContainer}>
                <View style={styles.iconContainer}>
                    <KMeetIcon/>
                </View>
                <View>
                    <FormattedText
                        style={styles.systemMessageTitle}
                        {...titleProps}
                    />
                    {
                        !isDM &&
                        typeof channelId === 'string' &&
                        typeof conferenceId === 'string' &&
                        <IkCallsParticipantStack
                            style={styles.callParticipants}
                            channelId={channelId}
                            conferenceId={conferenceId}
                            backgroundColor={backgroundColor}
                        />
                    }
                    <Text style={styles.systemMessageDescription}>
                        {
                            isEventOlderThanAnHour ? (
                                <FormattedTime
                                    style={styles.timeText}
                                    value={eventDate}
                                    isMilitaryTime={isMilitaryTime}
                                    timezone={timezone}
                                />
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
            {callButton}
        </View>
    );
};
