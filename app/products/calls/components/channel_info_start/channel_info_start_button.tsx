// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';
import {Platform} from 'react-native';

import {Screens} from '@app/constants';
import {leaveCall} from '@calls/actions';
import {leaveAndJoinWithAlert, showLimitRestrictedAlert} from '@calls/alerts';
import {useTryCallsFunction} from '@calls/hooks';
import OptionBox from '@components/option_box';
import {allOrientations, dismissAllModalsAndPopToScreen} from '@screens/navigation';
import CallManager from '@store/CallManager';
import {preventDoubleTap} from '@utils/tap';

import type {CallPassedProps} from '../../screens/call_screen/call_screen';
import type {LimitRestrictedInfo} from '@calls/observers';
import type {Options} from 'react-native-navigation';

export interface Props {
    serverUrl: string;
    channelId: string;
    isACallInCurrentChannel: boolean;
    alreadyInCall: boolean;
    dismissChannelInfo: () => void;
    limitRestrictedInfo: LimitRestrictedInfo;
}

const ChannelInfoStartButton = ({
    serverUrl,
    channelId,
    isACallInCurrentChannel,
    alreadyInCall,
    dismissChannelInfo,
    limitRestrictedInfo,
}: Props) => {
    const intl = useIntl();
    const {formatMessage} = intl;
    const isLimitRestricted = limitRestrictedInfo.limitRestricted;

    /**
     * Upon pressing "Start call", dial and join the kMeet
     * Pop the CALL screen
     */
    const onStartCall = useCallback(preventDoubleTap(async () => {
        // Start a new call via API
        const call = await CallManager.startCall(serverUrl, channelId);

        if (call !== null) {
            // Pop the CALL screen
            const title = formatMessage({id: 'mobile.calls_call_screen', defaultMessage: 'Call'});
            const passedProps: CallPassedProps = {
                serverUrl: call.server_url,
                channelId: call.channel_id,
                conferenceId: call.id,
            };
            const options: Options = {
                layout: {
                    backgroundColor: '#000',
                    componentBackgroundColor: '#000',
                    orientation: allOrientations,
                },
                topBar: {
                    background: {color: '#000'},
                    visible: Platform.OS === 'android',
                },
            };
            await dismissAllModalsAndPopToScreen(Screens.CALL, title, passedProps, options);
        }
    }), [channelId, formatMessage, serverUrl]);

    const toggleJoinLeave = useCallback(() => {
        if (alreadyInCall) {
            leaveCall();
        } else if (isLimitRestricted) {
            showLimitRestrictedAlert(limitRestrictedInfo, intl);
        } else {
            leaveAndJoinWithAlert(intl, serverUrl, channelId);
        }

        dismissChannelInfo();
    }, [isLimitRestricted, alreadyInCall, dismissChannelInfo, intl, serverUrl, channelId, isACallInCurrentChannel]);

    const [msgPostfix] = useTryCallsFunction(toggleJoinLeave);

    const joinText = formatMessage({id: 'mobile.calls_join_call', defaultMessage: 'Join call'});
    const startText = formatMessage({id: 'mobile.calls_start_call', defaultMessage: 'Start call'});
    const leaveText = formatMessage({id: 'mobile.calls_leave_call', defaultMessage: 'Leave call'});

    return (
        <OptionBox
            onPress={onStartCall}
            text={startText}
            iconName='phone'
            activeText={joinText + msgPostfix}
            activeIconName='phone-in-talk'
            isActive={isACallInCurrentChannel}
            destructiveText={leaveText}
            destructiveIconName={'phone-hangup'}
            isDestructive={alreadyInCall}
            testID='channel_info.channel_actions.join_start_call.action'
        />
    );
};

export default ChannelInfoStartButton;
