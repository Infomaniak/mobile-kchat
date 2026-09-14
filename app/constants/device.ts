// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Platform} from 'react-native';

import {isTablet} from '@utils/helpers';

export const isAndroidEdgeToEdge = Platform.OS === 'android' && Platform.Version >= 30;
export const isEdgeToEdge = Platform.OS === 'ios' || isAndroidEdgeToEdge;

export default {
    isAndroidEdgeToEdge,
    isEdgeToEdge,
    IS_TABLET: isTablet(),
    PUSH_NOTIFY_ANDROID_REACT_NATIVE: 'android_rn',
    PUSH_NOTIFY_APPLE_REACT_NATIVE: 'apple_rn',
};
