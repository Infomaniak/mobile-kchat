// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {type ImageSource} from 'expo-image';
import React, {useMemo} from 'react';
import {Grayscale} from 'react-native-color-matrix-image-filters';

import CompassIcon from '@components/compass_icon';
import {ExpoImageAnimated} from '@components/expo_image';
import {ACCOUNT_OUTLINE_IMAGE} from '@constants/profile';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {getLastPictureUpdate} from '@utils/user';

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
    const lastPictureUpdate = author ? getLastPictureUpdate(author) : 0;

    const fIStyle = useMemo(() => ({
        borderRadius: size / 2,
        backgroundColor: theme.centerChannelBg,
        height: size,
        width: size,
    }), [size, theme.centerChannelBg]);

    const imgSource = useMemo(() => {
        if (!author || typeof source === 'string') {
            return undefined;
        }

        const client = NetworkManager.getClient(serverUrl);
        if (!client) {
            return undefined;
        }

        const pictureUrl = client.getProfilePictureUrl(author.id, lastPictureUpdate);
        return source ?? {
            uri: new URL(pictureUrl, serverUrl).toString(),
            headers: {
                Authorization: client.getCurrentBearerToken(),
            },
        };
    }, [author, serverUrl, source, lastPictureUpdate]);

    const id = useMemo(() => {
        if (author) {
            return `user-${author.id}-${lastPictureUpdate}`;
        }
        return undefined;
    }, [author, lastPictureUpdate]);

    if (typeof source === 'string') {
        return (
            <CompassIcon
                name={source}
                size={iconSize || size}
                style={style.icon}
            />
        );
    }

    const renderImage = () => {
        if (!imgSource) {
            return (
                <CompassIcon
                    name={ACCOUNT_OUTLINE_IMAGE}
                    size={iconSize || size}
                    style={style.icon}
                />
            );
        }

        const imageSource = imgSource?.uri?.startsWith('file://')? {uri: imgSource.uri}: imgSource;

        return (
            <ExpoImageAnimated
                id={id!}
                key={id}
                ref={forwardRef}
                style={fIStyle}
                source={imageSource}
            />
        );
    };

    const image = renderImage();

    return grayscale ? <Grayscale>{image}</Grayscale> : image;
};

export default Image;
