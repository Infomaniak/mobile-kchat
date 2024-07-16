// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';

import {switchToConferenceByChannelId} from '@actions/remote/conference';
import {showLimitRestrictedAlert} from '@calls/alerts';
import Loading from '@components/loading';
import OptionBox, {OPTIONS_HEIGHT} from '@components/option_box';
import {useTheme} from '@context/theme';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {LimitRestrictedInfo} from '@calls/observers';

export interface Props {
    serverUrl: string;
    channelId: string;
    isACallInCurrentChannel: boolean;
    alreadyInCall: boolean;
    dismissChannelInfo: () => void;
    limitRestrictedInfo: LimitRestrictedInfo;
    otherParticipants: boolean;
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
    isACallInCurrentChannel,
    alreadyInCall,
    dismissChannelInfo,
    limitRestrictedInfo,
    otherParticipants,
}: Props) => {
    const intl = useIntl();
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const isLimitRestricted = limitRestrictedInfo.limitRestricted;
    const [connecting, setConnecting] = useState(false);

    const starting = intl.formatMessage({id: 'mobile.calls_starting', defaultMessage: 'Starting...'});
    const joining = intl.formatMessage({id: 'mobile.calls_joining', defaultMessage: 'Joining...'});

    const tryJoin = useCallback(async () => {
        if (alreadyInCall) {
            // TODO
            // CallManager.leaveCallScreen();
        } else if (isLimitRestricted) {
            showLimitRestrictedAlert(limitRestrictedInfo, intl);
            dismissChannelInfo();
        } else {
            setConnecting(true);

            await switchToConferenceByChannelId(serverUrl, channelId, {initiator: 'internal'});
            setConnecting(false);
            dismissChannelInfo();
        }
    }, [isLimitRestricted, alreadyInCall, dismissChannelInfo, intl, serverUrl, channelId, isACallInCurrentChannel, otherParticipants]);

    const joinText = intl.formatMessage({id: 'mobile.calls_join_call', defaultMessage: 'Join call'});
    const startText = intl.formatMessage({id: 'mobile.calls_start_call', defaultMessage: 'Start call'});
    const leaveText = intl.formatMessage({id: 'mobile.calls_leave_call', defaultMessage: 'Leave call'});
    const text = isACallInCurrentChannel ? joinText : startText;
    const icon = isACallInCurrentChannel ? 'phone-in-talk' : 'phone';

    if (connecting) {
        return (
            <Loading
                color={theme.buttonBg}
                size={'small'}
                footerText={isACallInCurrentChannel ? joining : starting}
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
            isActive={isACallInCurrentChannel}
            destructiveText={leaveText}
            destructiveIconName={'phone-hangup'}
            isDestructive={alreadyInCall}
            testID='channel_info.channel_actions.join_start_call.action'
        />
    );
};

export default ChannelInfoStartButton;
