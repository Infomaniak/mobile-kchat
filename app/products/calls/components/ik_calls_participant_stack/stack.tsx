// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, TouchableOpacity, View, type StyleProp, type ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import IkCallsParticipantStackIcon from '@calls/components/ik_calls_participant_stack/icon';
import IkCallsParticipantStackIconOverflow from '@calls/components/ik_calls_participant_stack/icon_overflow';
import IkCallsParticipantStackList from '@calls/components/ik_calls_participant_stack/list';
import {useFetchParticipantUsers} from '@calls/components/ik_calls_participant_stack/list/list';
import FormattedText from '@components/formatted_text';
import Loading from '@components/loading';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {TITLE_HEIGHT} from '@screens/bottom_sheet/content';
import {bottomSheet} from '@screens/navigation';
import {bottomSheetSnapPoint} from '@utils/helpers';
import {preventDoubleTap} from '@utils/tap';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type ConferenceParticipantModel from '@database/models/server/conference_participant';

const ROW_HEIGHT = 40;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 8,
    },
    loadingContainer: {
        margin: 8,
    },
});

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {flexDirection: 'row'},
    listHeader: {marginBottom: 12},
    listHeaderText: {
        color: theme.centerChannelColor,
        ...typography('Heading', 600, 'SemiBold'),
    },
}));

export const IkCallsParticipantStack = ({
    backgroundColor,
    channelId,
    conferenceId,
    participants,
    participantCount,
    maxDisplayedCount = 3,
    style: baseContainerStyle,
}: {
    backgroundColor: string;
    channelId: string;
    conferenceId: string;
    participants: ConferenceParticipantModel[];
    participantCount: number;
    maxDisplayedCount?: number;
    style?: StyleProp<ViewStyle>;
}) => {
    const {bottom} = useSafeAreaInsets();
    const {formatMessage} = useIntl();
    const isTablet = useIsTablet();
    const theme = useTheme();
    const style = getStyleSheet(theme);

    const showParticipantList = useCallback(preventDoubleTap(() => {
        const renderContent = () => (
            <>
                {!isTablet && (
                    <View style={style.listHeader}>
                        <FormattedText
                            id='mobile.call_participants.header'
                            defaultMessage={'Call Participants'}
                            style={style.listHeaderText}
                        />
                    </View>
                )}
                <IkCallsParticipantStackList
                    channelId={channelId}
                    conferenceId={conferenceId}
                    location={Screens.CHANNEL}
                    rowHeight={ROW_HEIGHT}
                />
            </>
        );

        const snapPoints: Array<string | number> = [1, bottomSheetSnapPoint(Math.min(participantCount, 5), ROW_HEIGHT, bottom) + TITLE_HEIGHT];
        if (participantCount > 5) {
            snapPoints.push('80%');
        }

        bottomSheet({
            closeButtonId: 'close-call-participant-list',
            renderContent,
            initialSnapIndex: 1,
            snapPoints,
            title: formatMessage({id: 'mobile.call_participants.header', defaultMessage: 'Call Participants'}),
            theme,
        });
    }), [bottom, channelId, conferenceId, isTablet, participantCount, style]);

    // EFFECTS
    const loading = useFetchParticipantUsers(participants);

    return participants.length === 0 ? null : (
        <TouchableOpacity
            onPress={showParticipantList}
            style={baseContainerStyle}
        >
            <View style={styles.container}>
                {
                    loading ? (
                        <Loading containerStyle={styles.loadingContainer}/>
                    ) : (
                        <>
                            {participants.map((participant, i) => (
                                <IkCallsParticipantStackIcon
                                    key={participant.id}
                                    isFirst={i === 0}
                                    backgroundColor={backgroundColor}
                                    participant={participant}
                                />
                            ))}
                            {
                                participantCount > maxDisplayedCount &&
                                <IkCallsParticipantStackIconOverflow
                                    key='overflow'
                                    isFirst={false}
                                    backgroundColor={backgroundColor}
                                    count={participantCount - maxDisplayedCount}
                                />
                            }
                        </>
                    )
                }
            </View>
        </TouchableOpacity>
    );
};
