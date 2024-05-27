// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {type StyleProp, View, type ViewStyle, Platform, Text} from 'react-native';

import CompassIcon from '@app/components/compass_icon';
import Image from '@components/profile_picture/image';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type ConferenceParticipantModel from '@app/database/models/server/conference_participant';
import type UserModel from '@typings/database/models/servers/user';
import type {Source} from 'react-native-fast-image';

type IkCallsParticipantIconProps = {
    participant: (ConferenceParticipantModel & { user?: UserModel }) | number;
    backgroundColor: string;
    containerStyle?: StyleProp<ViewStyle>;
    iconSize?: number;
    isFirst: boolean;
    size: number;
    source?: Source | string;
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
        icon: {

            // color: '#FFFFFF',
            color: theme.centerChannelBg,
        },
        statusWrapper: {
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
        status: {
            padding: 2,
        },
    };
});

const IkCallsParticipantIcon = ({
    participant,
    backgroundColor,
    containerStyle: baseContainerStyle,
    iconSize,
    isFirst,
    size = 64,
    source,
    statusSize = 14,
    statusStyle: baseStatusStyle,
}: IkCallsParticipantIconProps) => {
    const theme = useTheme();
    const serverUrl = useServerUrl();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Find the proper way to do that
    const status = participant?._raw?.status as ConferenceParticipantModel['status'] | undefined;

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
                borderColor: backgroundColor,
            }) : {},
        },
        baseContainerStyle,
    ], [style, backgroundColor, baseContainerStyle, participant, size]);

    const countStyle = useMemo(() => [
        style.count,
        {fontSize: typeof participant === 'number' ? Math.floor(14 - (Math.floor(Math.log10(participant)) * 1.5)) : undefined},
    ], [style, participant]);

    const statusWrapperStyle = useMemo(() => [
        style.statusWrapper,
        {borderRadius: (statusSize / 2) + 3 + 1.5},
    ], [style, statusSize]);

    const statusStyle = useMemo(() => ([
        style.status,
        {
            backgroundColor: (() => {
                if (typeof status === 'undefined') {
                    return undefined;
                }
                if (status === 'approved') {
                    return theme.onlineIndicator;
                }
                if (status === 'denied') {
                    return theme.dndIndicator;
                }
                return '#ADB1BE';
            })(),
        },
        baseStatusStyle,
    ]), [style, status, theme, statusSize, baseStatusStyle]);

    const iconStyle = useMemo(() => [
        style.icon,
        {fontSize: statusSize},
    ], [style, statusSize]);

    // Compute status icon
    const iconName = (() => {
        if (typeof status === 'undefined') {
            return null;
        }
        if (status === 'approved') {
            return 'check';
        }
        if (status === 'denied') {
            return 'close';
        }
        return 'help';
    })();

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
                        source={source}
                        url={serverUrl}
                    />
                )
            }

            {
                iconName &&
                <View style={statusWrapperStyle}>
                    <View style={statusStyle}>
                        <CompassIcon
                            name={iconName}
                            style={iconStyle}
                        />
                    </View>
                </View>
            }
        </View>
    );
};

export default IkCallsParticipantIcon;
