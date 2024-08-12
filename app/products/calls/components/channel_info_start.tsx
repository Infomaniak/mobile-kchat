// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';

import {switchToConferenceByChannelId} from '@actions/remote/conference';
import Loading from '@components/loading';
import OptionBox, {OPTIONS_HEIGHT} from '@components/option_box';
import {useTheme} from '@context/theme';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

export interface Props {
    serverUrl: string;
    channelId: string;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        alignItems: 'center',
        backgroundColor: changeOpacity(theme.buttonBg, 0.08),
        borderRadius: 4,
        flex: 1,
        maxHeight: OPTIONS_HEIGHT,
        justifyContent: 'center',
        minWidth: 60,
        paddingTop: 12,
        paddingBottom: 10,
    },
    text: {
        color: theme.buttonBg,
        paddingTop: 3,
        width: '100%',
        textAlign: 'center',
        ...typography('Body', 50, 'SemiBold'),
    },
}));

const ChannelInfoStartButton = ({
    serverUrl,
    channelId,
}: Props) => {
    const intl = useIntl();
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const [connecting, setConnecting] = useState(false);

    const tryJoin = useCallback(async () => {
        setConnecting(true);
        await switchToConferenceByChannelId(serverUrl, channelId, {initiator: 'internal'});
        setConnecting(false);
    }, [serverUrl, channelId]);

    const text = intl.formatMessage({id: 'mobile.calls_start_call', defaultMessage: 'Start call'});
    const starting = intl.formatMessage({id: 'mobile.calls_starting', defaultMessage: 'Starting...'});
    const leaveText = intl.formatMessage({id: 'mobile.calls_leave_call', defaultMessage: 'Leave call'});
    const icon = 'phone';

    if (connecting) {
        return (
            <Loading
                color={theme.buttonBg}
                size={'small'}
                footerText={starting}
                containerStyle={styles.container}
                footerTextStyles={styles.text}
            />
        );
    }

    return (
        <OptionBox
            onPress={preventDoubleTap(tryJoin)}
            text={text}
            iconName={icon}
            activeText={text}
            activeIconName={icon}
            isActive={false}
            destructiveText={leaveText}
            destructiveIconName={'phone-hangup'}
            isDestructive={false}
            testID='channel_info.channel_actions.join_start_call.action'
        />
    );
};

export default ChannelInfoStartButton;
