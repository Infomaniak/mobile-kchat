// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {Image} from 'react-native';

const iconStyle = {width: 32, height: 32};

const KMeetIcon = () => (
    <Image
        source={require('@assets/images/emojis/kmeet.png')}
        style={iconStyle}
    />
);

export default KMeetIcon;
