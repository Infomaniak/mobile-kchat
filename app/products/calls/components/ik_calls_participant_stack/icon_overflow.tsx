// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {type StyleProp, View, type ViewStyle, Text, Platform} from 'react-native';

import IkCallsParticipantStackStatusIcon from '@calls/components/ik_calls_participant_stack/status_icon';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

type IkCallsParticipantStackIconOverflowProps = {
    count: number;
    backgroundColor?: string;
    containerStyle?: StyleProp<ViewStyle>;
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

const IkCallsParticipantStackIconOverflow = ({
    count,
    backgroundColor,
    containerStyle: baseContainerStyle,
    isFirst = true,
    size = 36,
    statusSize = 14,
    statusStyle,
}: IkCallsParticipantStackIconOverflowProps) => {
    const theme = useTheme();

    // Merge static and dynamic styles
    const style = getStyleSheet(theme);
    const viewStyle = useMemo(() => [
        style.container,
        {
            marginLeft: isFirst ? 0 : -6,
            borderRadius: size / 2,
            width: size,
            height: size,
            backgroundColor: '#ADB1BE',
            borderWidth: 1.5,
            borderColor: backgroundColor || theme.centerChannelBg,
        },
        baseContainerStyle,
    ], [style, backgroundColor, baseContainerStyle, size]);

    const countStyle = useMemo(() => [
        style.count,
        {fontSize: Math.floor(14 - (Math.floor(Math.log10(count)) * 1.5))},
    ], [style, count]);

    const iconContainerStyle = useMemo(() => [
        style.iconContainer,
        {
            backgroundColor,
            borderRadius: (statusSize / 2) + 3 + 1.5,
        },
    ], [backgroundColor, statusSize, style]);

    return (
        <View style={viewStyle}>
            <Text style={countStyle}>{'+'}{count}</Text>
            <View style={iconContainerStyle}>
                <IkCallsParticipantStackStatusIcon
                    size={statusSize}
                    style={statusStyle}
                />
            </View>
        </View>
    );
};

export default IkCallsParticipantStackIconOverflow;
