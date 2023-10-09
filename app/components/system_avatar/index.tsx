// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Image} from 'react-native';

import {View as ViewConstants} from '@constants';

const SystemAvatar = () => {
    return (
        <Image
            style={{width: ViewConstants.PROFILE_PICTURE_SIZE, height: ViewConstants.PROFILE_PICTURE_SIZE}}
            source={require('@assets/images/icon.png')}
        />
    );
};

export default SystemAvatar;
