// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {useIntl} from 'react-intl';

import {leaveCall} from '@calls/actions';
import {leaveAndJoinWithAlert, showLimitRestrictedAlert} from '@calls/alerts';
import {useOnCall, useTryCallsFunction} from '@calls/hooks';
import OptionBox from '@components/option_box';

import type {LimitRestrictedInfo} from '@calls/observers';

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
    const onCall = useOnCall();
    const {formatMessage} = intl;
    const isLimitRestricted = limitRestrictedInfo.limitRestricted;

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
            onPress={() => {
                onCall(channelId);
            }}
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
