// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {type StyleProp, View, type ViewStyle, Text, Platform} from 'react-native';

import IkCallsParticipantStackStatusIcon from '@calls/components/ik_calls_participant_stack/status_icon';
import Image from '@components/profile_picture/image';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type ConferenceParticipantModel from '@app/database/models/server/conference_participant';
import type UserModel from '@typings/database/models/servers/user';

type IkCallsParticipantStackIconProps = {
    participant: (ConferenceParticipantModel & { user?: UserModel }) | number;
    backgroundColor?: string;
    containerStyle?: StyleProp<ViewStyle>;
    iconSize?: number;
    isFirst?: boolean;
    size?: number;
    statusSize?: number;
    statusStyle?: StyleProp<ViewStyle>;
};

const STATUS_BUFFER = Platform.select({
    ios: 3,
    default: 2,
});

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        count: {
            color: theme.centerChannelBg,
            ...typography('Heading', 200, 'SemiBold'),
        },
        iconContainer: {
            position: 'absolute',
            bottom: -STATUS_BUFFER,
            right: -STATUS_BUFFER,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: theme.centerChannelBg,
            backgroundColor: theme.centerChannelBg,
        },
    };
});

const IkCallsParticipantStackIcon = ({
    participant,
    backgroundColor,
    containerStyle: baseContainerStyle,
    iconSize,
    isFirst = true,
    size = 36,
    statusSize = 14,
    statusStyle,
}: IkCallsParticipantStackIconProps) => {
    const theme = useTheme();
    const serverUrl = useServerUrl();

    // Merge static and dynamic styles
    const style = getStyleSheet(theme);
    const viewStyle = useMemo(() => [
        style.container,
        {
            marginLeft: isFirst ? 0 : -6,
            borderRadius: size / 2,
            width: size,
            height: size,
            backgroundColor,

            ...typeof participant === 'number' ? ({
                backgroundColor: '#ADB1BE',
                borderWidth: 1.5,
                borderColor: backgroundColor || theme.centerChannelBg,
            }) : {},
        },
        baseContainerStyle,
    ], [style, backgroundColor, baseContainerStyle, participant, size]);

    const countStyle = useMemo(() => [
        style.count,
        {fontSize: typeof participant === 'number' ? Math.floor(14 - (Math.floor(Math.log10(participant)) * 1.5)) : undefined},
    ], [style, participant]);

    const iconContainerStyle = useMemo(() => [
        style.iconContainer,
        {
            backgroundColor,
            borderRadius: (statusSize / 2) + 3 + 1.5,
        },
    ], [backgroundColor, statusSize, style]);

    return (
        <View style={viewStyle}>

            {
                typeof participant === 'number' ? (
                    <Text style={countStyle}>{'+'}{participant}</Text>
                ) : (
                    <Image
                        author={participant.user}
                        iconSize={iconSize}
                        size={size - 3}
                        url={serverUrl}
                    />
                )
            }

            <View style={iconContainerStyle}>
                <IkCallsParticipantStackStatusIcon
                    participant={participant}
                    size={statusSize}
                    style={statusStyle}
                />
            </View>

        </View>
    );
};

export default IkCallsParticipantStackIcon;
