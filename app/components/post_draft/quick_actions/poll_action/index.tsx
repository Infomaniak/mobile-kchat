// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet} from 'react-native';

import {executeCommand} from '@actions/remote/command';
import CompassIcon from '@components/compass_icon';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {ICON_SIZE} from '@constants/post_draft';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {changeOpacity} from '@utils/theme';

type Props = {
    testID?: string;
    channelId: string;
};

const style = StyleSheet.create({
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
});

export default function Poll({
    testID,
    channelId,
}: Props) {
    const intl = useIntl();
    const theme = useTheme();
    const serverUrl = useServerUrl();

    const iconName = 'chart-bar';
    const iconColor = changeOpacity(theme.centerChannelColor, 0.64);

    const onPress = useCallback(() => {
        executeCommand(serverUrl, intl, '/poll', channelId);
    }, [executeCommand]);

    return (
        <TouchableWithFeedback
            testID={testID}
            onPress={onPress}
            style={style.icon}
            type={'opacity'}
        >
            <CompassIcon
                color={iconColor}
                name={iconName}
                size={ICON_SIZE}
            />
        </TouchableWithFeedback>
    );
}
