// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import {switchToConferenceByChannelId} from '@actions/remote/conference';
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
}: Props) => {
    const intl = useIntl();
    const {formatMessage} = intl;

    const joinText = formatMessage({id: 'mobile.calls_join_call', defaultMessage: 'Join call'});
    const startText = formatMessage({id: 'mobile.calls_start_call', defaultMessage: 'Start call'});
    const leaveText = formatMessage({id: 'mobile.calls_leave_call', defaultMessage: 'Leave call'});

    return (
        <OptionBox
            onPress={() => {
                switchToConferenceByChannelId(serverUrl, channelId, {initiator: 'internal'});
            }}
            text={startText}
            iconName='phone'
            activeText={joinText}
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
