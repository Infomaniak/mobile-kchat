// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image as ExpoImage, type ImageSource} from 'expo-image';
import React, {useMemo} from 'react';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import Animated from 'react-native-reanimated';

import CompassIcon from '@components/compass_icon';
import {ACCOUNT_OUTLINE_IMAGE} from '@constants/profile';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    author?: UserModel | UserProfile;
    forwardRef?: React.RefObject<any>;
    grayscale?: boolean;
    iconSize?: number;
    size: number;
    source?: ImageSource | string;
    url?: string;
};

const AnimatedImage = Animated.createAnimatedComponent(ExpoImage);

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        icon: {
            color: changeOpacity(theme.centerChannelColor, 0.48),
        },
    };
});

const Image = ({author, forwardRef, grayscale, iconSize, size, source, url}: Props) => {
    const theme = useTheme();
    let serverUrl = useServerUrl();
    serverUrl = url || serverUrl;

    const style = getStyleSheet(theme);
    const fIStyle = useMemo(() => ({
        borderRadius: size / 2,
        backgroundColor: theme.centerChannelBg,
        height: size,
        width: size,
    }), [size, theme.centerChannelBg]);

    if (typeof source === 'string') {
        return (
            <CompassIcon
                name={source}
                size={iconSize || size}
                style={style.icon}
            />
        );
    }

    const image = (() => {
        const client = NetworkManager.getClient(serverUrl);
        if (author && client) {
            let lastPictureUpdate = 0;
            const isBot = ('isBot' in author) ? author.isBot : author.is_bot;
            if (isBot) {
                lastPictureUpdate = ('isBot' in author) ? author.props?.bot_last_icon_update : author.bot_last_icon_update || 0;
            } else {
                lastPictureUpdate = ('lastPictureUpdate' in author) ? author.lastPictureUpdate : author.last_picture_update || 0;
            }

            const pictureUrl = client.getProfilePictureUrl(author.id, lastPictureUpdate);
            const imgSource = source ?? {
                uri: `${serverUrl}${pictureUrl}`,
                headers: {
                    Authorization: client.getCurrentBearerToken(),
                },
            };
            if (imgSource.uri?.startsWith('file://')) {
                return (
                    <AnimatedImage
                        key={pictureUrl}
                        ref={forwardRef}
                        style={fIStyle}
                        source={{uri: imgSource.uri}}
                    />
                );
            }
            return (
                <AnimatedImage
                    key={pictureUrl}
                    ref={forwardRef}
                    style={fIStyle}
                    source={imgSource}
                />
            );
        }
        return (
            <CompassIcon
                name={ACCOUNT_OUTLINE_IMAGE}
                size={iconSize || size}
                style={style.icon}
            />
        );
    })();

    return grayscale ? <Grayscale>{image}</Grayscale> : image;
};

export default Image;
