// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withObservables} from '@nozbe/watermelondb/react';
import React, {useMemo} from 'react';
import {type StyleProp, View, type ViewStyle, Platform} from 'react-native';
import {of as of$} from 'rxjs';

import IkCallsParticipantStackStatusIcon from '@calls/components/ik_calls_participant_stack/status_icon';
import Image from '@components/profile_picture/image';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

import type ConferenceParticipantModel from '@database/models/server/conference_participant';
import type UserModel from '@typings/database/models/servers/user';

type IkCallsParticipantStackIconProps = {
    participant: ConferenceParticipantModel;
    user?: UserModel;
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
    user,
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
        },
        baseContainerStyle,
    ], [style, backgroundColor, baseContainerStyle, size]);

    const iconContainerStyle = useMemo(() => [
        style.iconContainer,
        {
            backgroundColor,
            borderRadius: (statusSize / 2) + 3 + 1.5,
        },
    ], [backgroundColor, statusSize, style]);

    return (
        <View style={viewStyle}>

            <Image
                author={user}
                iconSize={iconSize}
                size={size - 3}
                url={serverUrl}
                grayscale={!participant.present}
            />

            <View style={iconContainerStyle}>
                <IkCallsParticipantStackStatusIcon
                    status={participant.status}
                    size={statusSize}
                    style={statusStyle}
                />
            </View>

        </View>
    );
};

const enhance = withObservables(['participant'], ({participant}: {
    participant: ConferenceParticipantModel;
}) => ({
    participant,
    user: participant.user || of$(undefined),
}));
export default enhance(IkCallsParticipantStackIcon);
