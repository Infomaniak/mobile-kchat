// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image, type ImageProps} from 'expo-image';
import React from 'react';
import {View} from 'react-native';

import CompassIcon from '@components/compass_icon';
import {ACCOUNT_OUTLINE_IMAGE} from '@constants/profile';
import NetworkManager from '@managers/network_manager';
import {useShareExtensionServerUrl} from '@share/state';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    author?: UserModel;
    theme: Theme;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {marginLeft: 4},
    icon: {
        color: changeOpacity(theme.centerChannelColor, 0.72),
        left: 1,
    },
    image: {
        borderRadius: 12,
        height: 24,
        width: 24,
    },
}));

const Avatar = ({author, theme}: Props) => {
    const serverUrl = useShareExtensionServerUrl();
    const style = getStyleSheet(theme);
    const isBot = author?.isBot || false;
    let pictureUrl = '';

    if (author?.deleteAt) {
        return (
            <CompassIcon
                name='archive-outline'
                style={style.icon}
                size={24}
            />
        );
    }

    let token = null;
    if (author && serverUrl) {
        try {
            const client = NetworkManager.getClient(serverUrl);
            const lastPictureUpdate = (isBot ? author?.props?.bot_last_icon_update as number : author?.lastPictureUpdate) || 0;
            const absoluteUrl = client.getAbsoluteUrl(client.getProfilePictureUrl(author.id, lastPictureUpdate));
            if (typeof absoluteUrl === 'string') {
                pictureUrl = absoluteUrl;
            }

            token = client.getCurrentBearerToken();
        } catch {
            // handle below that the client is not set
        }
    }

    let icon;
    if (pictureUrl && token) {
        const imgSource: ImageProps['source'] = {
            uri: pictureUrl,
            headers: {Authorization: token},
        };
        icon = (
            <Image
                key={pictureUrl}
                style={style.image}
                source={imgSource}
            />
        );
    } else {
        icon = (
            <CompassIcon
                color={changeOpacity(theme.centerChannelColor, 0.72)}
                name={ACCOUNT_OUTLINE_IMAGE}
                size={24}
            />
        );
    }

    return (
        <View style={style.container}>
            {icon}
        </View>
    );
};

export default Avatar;
