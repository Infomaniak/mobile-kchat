// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import OptionBox from '@components/option_box';
import CallManager from '@store/CallManager';
import {preventDoubleTap} from '@utils/tap';

export interface Props {
    serverUrl: string;
    channelId: string;
}

const ChannelInfoStartButton = ({
    serverUrl,
    channelId,
}: Props) => {
    const intl = useIntl();

    const startText = intl.formatMessage({id: 'mobile.calls_start_call', defaultMessage: 'Start call'});

    return (
        <OptionBox
            onPress={preventDoubleTap(() => {
                CallManager.startCall(serverUrl, channelId);
            })}
            text={startText}
            iconName='phone-outline'
            isDestructive={false}
            testID='channel_info.channel_actions.join_start_call.action'
        />
    );
};

export default ChannelInfoStartButton;
