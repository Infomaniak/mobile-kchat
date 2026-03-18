// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';

import {switchToConferenceByChannelId} from '@actions/remote/conference';
import Loading from '@components/loading';
import OptionBox, {OPTIONS_HEIGHT} from '@components/option_box';
import {useTheme} from '@context/theme';
import {usePreventDoubleTap} from '@hooks/utils';
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

    // const joining = intl.formatMessage({id: 'mobile.calls_joining', defaultMessage: 'Joining...'});

    // const toggleJoinLeave = useCallback(async () => {
    //     if (alreadyInCall) {
    //         await leaveCallConfirmation(intl, otherParticipants, isAdmin, isHost, serverUrl, channelId, dismissChannelInfo);
    //     } else if (isLimitRestricted) {
    //         showLimitRestrictedAlert(limitRestrictedInfo, intl);
    //         dismissChannelInfo();
    //     } else {
    //         setJoiningMsg(isACallInCurrentChannel ? joining : starting);
    //         setConnecting(true);

    //         await leaveAndJoinWithAlert(intl, serverUrl, channelId);
    //         setConnecting(false);
    //         dismissChannelInfo();
    //     }
    // }, [
    //     alreadyInCall,
    //     isLimitRestricted,
    //     intl,
    //     otherParticipants,
    //     isAdmin,
    //     isHost,
    //     serverUrl,
    //     channelId,
    //     dismissChannelInfo,
    //     limitRestrictedInfo,
    //     isACallInCurrentChannel,
    //     joining,
    //     starting,
    // ]);

    // const [tryJoin, msgPostfix] = useTryCallsFunction(toggleJoinLeave);
    const onPress = usePreventDoubleTap(tryJoin);

    // const joinText = intl.formatMessage({id: 'mobile.calls_join_call', defaultMessage: 'Join call'});
    // const startText = intl.formatMessage({id: 'mobile.calls_start_call', defaultMessage: 'Start call'});
    // const leaveText = intl.formatMessage({id: 'mobile.calls_leave_call', defaultMessage: 'Leave call'});
    // const text = isACallInCurrentChannel ? joinText + msgPostfix : startText + msgPostfix;
    // const icon = isACallInCurrentChannel ? 'phone-in-talk' : 'phone';

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
            onPress={onPress}
            text={text}
            iconName='phone'
            testID='channel_info.channel_actions.join_start_call.action'
        />
    );
};

export default ChannelInfoStartButton;
