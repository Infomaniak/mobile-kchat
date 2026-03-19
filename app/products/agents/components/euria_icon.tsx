// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Image} from 'react-native';

const euriaAnimated = require('@assets/images/euria_animated.gif');

type Props = {
    size?: number;
};

const EuriaIcon = ({size = 18}: Props) => (
    <Image
        source={euriaAnimated}
        style={{width: size, height: size}}
    />
);

export default EuriaIcon;
