// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';

import ProfilePicture from '@components/profile_picture';
import {useServerUrl} from '@context/server';
import NetworkManager from '@managers/network_manager';

import type UserModel from '@typings/database/models/servers/user';

// @ts-expect-error FastImage does work with Animated.createAnimatedComponent
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

type Props = {
    enablePostIconOverride: boolean;
    forwardRef?: React.RefObject<any>;
    imageSize?: number;
    user: UserModel;
    userIconOverride?: string;
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

const UserProfileAvatar = ({enablePostIconOverride, forwardRef, imageSize, user, userIconOverride}: Props) => {
    const styles = useMemo(() => getStyles(imageSize), [imageSize]);
    const serverUrl = useServerUrl();

    if (enablePostIconOverride && userIconOverride) {
        const token = NetworkManager.getClient(serverUrl).getCurrentBearerToken();
        const source = {uri: serverUrl + userIconOverride, headers: {Authorization: token}};
        return (
            <View style={styles.avatar}>
                <AnimatedFastImage

                    // @ts-expect-error TS expects old type ref
                    ref={forwardRef}
                    style={styles.avatar}
                    source={source}
                />
            </View>
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
