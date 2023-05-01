// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import LeaveChannelLabel from '@components/channel_actions/leave_channel_label';
import {General} from '@constants';

import Archive from './archive';
import ConvertPrivate from './convert_private';

import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    channelId: string;
    componentId: AvailableScreens;
    type?: ChannelType;
}

const DestructiveOptions = ({channelId, componentId, type}: Props) => {
    return (
        <>

        </>
    );
};

export default DestructiveOptions;
