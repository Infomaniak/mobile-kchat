// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image} from 'expo-image';
import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';

import CompassIcon from '@components/compass_icon';
import ProfilePicture from '@components/profile_picture';
import {useServerUrl} from '@context/server';
import NetworkManager from '@managers/network_manager';

import type UserModel from '@typings/database/models/servers/user';

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = {
    enablePostIconOverride: boolean;
    forwardRef?: React.RefObject<any>;
    imageSize?: number;
    user: UserModel;
    userIconOverride?: string;
    isWebHook?: boolean;
}

const DEFAULT_IMAGE_SIZE = 96;

const getStyles = (size?: number) => {
    return StyleSheet.create({
        avatar: {
            borderRadius: 48,
            height: size || DEFAULT_IMAGE_SIZE,
            width: size || DEFAULT_IMAGE_SIZE,
        },
    });
};

const UserProfileAvatar = ({enablePostIconOverride, forwardRef, imageSize, user, userIconOverride, isWebHook}: Props) => {
    const styles = useMemo(() => getStyles(imageSize), [imageSize]);
    const serverUrl = useServerUrl();

    if (enablePostIconOverride && userIconOverride) {
        const token = NetworkManager.getClient(serverUrl).getCurrentBearerToken();
        let source;
        if (userIconOverride.startsWith('http')) {
            source = {uri: userIconOverride, headers: {Authorization: token}};
        } else {
            source = {uri: serverUrl + userIconOverride, headers: {Authorization: token}};
        }
        return (
            <View style={styles.avatar}>
                <AnimatedImage
                    ref={forwardRef}
                    style={styles.avatar}
                    source={source}
                />
            </View>
        );
    } else if (isWebHook) {
        return (
            <CompassIcon
                name='webhook'
                size={DEFAULT_IMAGE_SIZE}
            />
        );
    }

    return (
        <ProfilePicture
            author={user}
            forwardRef={forwardRef}
            showStatus={true}
            size={imageSize || DEFAULT_IMAGE_SIZE}
            statusSize={24}
            testID={`user_profile_avatar.${user.id}.profile_picture`}
        />
    );
};

export default UserProfileAvatar;
