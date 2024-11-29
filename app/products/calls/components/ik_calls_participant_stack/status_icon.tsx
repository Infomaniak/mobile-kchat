// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {type StyleProp, View, type ViewStyle} from 'react-native';

import CompassIcon from '@components/compass_icon';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

import type ConferenceParticipantModel from '@database/models/server/conference_participant';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        icon: {

            // color: '#FFFFFF',
            color: theme.centerChannelBg,
        },
    };
});

const IkCallsParticipantStackStatusIcon = ({
    status,
    size = 14,
    padding = 2,
    style: baseStyle = {},
}: {
    status?: ConferenceParticipantModel['status'];
    size?: number;
    padding?: number;
    style?: StyleProp<ViewStyle>;
}) => {
    const theme = useTheme();

    // Merge static and dynamic styles
    const style = getStyleSheet(theme);
    const containerStyle = useMemo(() => ([
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
            borderRadius: size / 2,
            padding,
        },
        baseStyle,
    ]), [baseStyle, padding, size, status, theme]);

    const iconStyle = useMemo(() => [
        style.icon,
        {fontSize: size - (padding * 2)},
    ], [padding, size, style.icon]);

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

    return iconName ? (
        <View style={containerStyle}>
            <CompassIcon
                name={iconName}
                style={iconStyle}
            />
        </View>
    ) : null;
};

export default IkCallsParticipantStackStatusIcon;
