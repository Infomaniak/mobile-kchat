// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {type ImageSource} from 'expo-image';
import React, {useState, useMemo} from 'react';
import {Grayscale} from 'react-native-color-matrix-image-filters';

import CompassIcon from '@components/compass_icon';
import {ExpoImageAnimated} from '@components/expo_image';
import InitialsFallback from '@components/profile_picture/initials_fallback';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {extractDisplayName, getAvatarColor, getLastPictureUpdate} from '@utils/user';

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
    const contextServerUrl = useServerUrl();
    const serverUrl = url || contextServerUrl;

    const style = getStyleSheet(theme);
    const lastPictureUpdateAt = author ? getLastPictureUpdate(author) : 0;
    const [errorUserId, setErrorUserId] = useState('');
    const fIStyle = useMemo(() => ({
        borderRadius: size / 2,
        height: size,
        width: size,
    }), [size]);

    const imgSource = useMemo(() => {
        if (!author || typeof source === 'string') {
            return undefined;
        }

        const client = NetworkManager.getClient(serverUrl);
        if (!client) {
            return undefined;
        }

        const pictureUrl = client.getProfilePictureUrl(author.id, lastPictureUpdateAt);
        return source ?? {
            uri: new URL(pictureUrl, serverUrl).toString(),
            headers: {
                Authorization: client.getCurrentBearerToken(),
            },
        };
    }, [author, serverUrl, source, lastPictureUpdateAt]);

    const id = useMemo(() => {
        if (author) {
            return `user-${author.id}-${lastPictureUpdateAt}`;
        }
        return undefined;
    }, [author, lastPictureUpdateAt]);

    const currentId = id || '';
    const hasImageError = errorUserId === currentId && errorUserId !== '';

    const handleImageError = () => {
        setErrorUserId(currentId);
    };

    const handleImageLoad = () => {
        setErrorUserId('');
    };

    if (typeof source === 'string') {
        return (
            <CompassIcon
                name={source}
                size={iconSize || size}
                style={style.icon}
            />
        );
    }

    const showFallback = !imgSource || hasImageError;

    if (showFallback) {
        if (!author) {
            return (
                <CompassIcon
                    name='account-outline'
                    size={iconSize || size}
                    style={style.icon}
                />
            );
        }
        const extractedName = extractDisplayName(author);
        const extractedName = extractDisplayName(author);
        const fallbackColor = author?.id ? getAvatarColor(author.id) : undefined;
        return (
            <InitialsFallback
                name={extractedName}
                size={size}
                textColor={fallbackColor ? '#FFFFFF' : style.icon.color}
                backgroundColor={fallbackColor}
            />
        );
    }

    const imageSource = imgSource.uri?.startsWith('file://') ? {uri: imgSource.uri} : imgSource;

    const content = (
        <ExpoImageAnimated
            id={id}
            key={id}
            ref={forwardRef}
            style={fIStyle}
            source={imageSource}
            onError={handleImageError}
            onLoad={handleImageLoad}
        />
    );

    return grayscale ? <Grayscale>{content}</Grayscale> : content;
};

export default Image;
