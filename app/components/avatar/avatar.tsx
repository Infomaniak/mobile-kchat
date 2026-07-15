// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useMemo, useState} from 'react';
import {type ImageStyle, type StyleProp, View, type ViewStyle} from 'react-native';

import {buildAbsoluteUrl} from '@actions/remote/file';
import {buildProfileImageUrlFromUser} from '@actions/remote/user';
import ExpoImage from '@components/expo_image';
import InitialsFallback from '@components/profile_picture/initials_fallback';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {extractDisplayName, getAvatarColor, getLastPictureUpdate} from '@utils/user';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    author?: UserModel | UserProfile;
    containerStyle?: StyleProp<ViewStyle>;
    fallbackChildren?: React.ReactNode;
    forceFallback?: boolean;
    imageStyle?: StyleProp<ImageStyle>;
    overrideUri?: string;
    overrideUriId?: string;
    serverUrl?: string;
    size: number;
    testID?: string;
    textColor?: string;
    theme?: Theme;
}

const Avatar = ({
    author,
    containerStyle,
    fallbackChildren,
    forceFallback = false,
    imageStyle,
    overrideUri,
    overrideUriId,
    serverUrl: serverUrlProp,
    size,
    testID,
    textColor,
    theme: themeProp,
}: Props) => {
    const serverUrl = useServerUrl();
    const resolvedServerUrl = serverUrlProp || serverUrl;
    const theme = useTheme();

    const [errorUserId, setErrorUserId] = useState('');

    const lastPictureUpdate = author ? getLastPictureUpdate(author) : 0;
    const id = author
        ? `user-${author.id}-${lastPictureUpdate}`
        : (overrideUriId || 'avatar');

    const hasImageError = errorUserId === id && errorUserId !== '';

    useEffect(() => {
        setErrorUserId('');
    }, [author?.id, lastPictureUpdate, overrideUri]);

    const {headers, uri} = useMemo(() => {
        if (overrideUri) {
            return {headers: undefined, uri: buildAbsoluteUrl(resolvedServerUrl, overrideUri)};
        }

        if (!author) {
            return {headers: undefined, uri: undefined};
        }

        const profileUri = buildProfileImageUrlFromUser(resolvedServerUrl, author);
        const absoluteUri = buildAbsoluteUrl(resolvedServerUrl, profileUri);

        let authHeaders: {Authorization: string} | undefined;
        try {
            const client = NetworkManager.getClient(resolvedServerUrl);
            authHeaders = {Authorization: client.getCurrentBearerToken()};
        } catch {
            // Client may not be available in share extension
        }

        return {headers: authHeaders, uri: absoluteUri};
    }, [author, overrideUri, resolvedServerUrl]);

    const handleImageError = () => {
        setErrorUserId(id);
    };

    const showImage = uri && !hasImageError && !forceFallback;
    const extractedName = extractDisplayName(author);
    const fallbackColor = author?.id ? getAvatarColor(author.id) : undefined;
    const fallbackTextColor = fallbackColor ? '#FFFFFF' : textColor;

    const containerStyles: StyleProp<ViewStyle> = useMemo(() => {
        if (fallbackChildren) {
            return [containerStyle, {position: 'relative'}];
        }
        return containerStyle;
    }, [containerStyle, fallbackChildren]);

    return (
        <View
            style={containerStyles}
            testID={testID}
        >
            {showImage ? (
                <>
                    <ExpoImage
                        id={id}
                        source={headers ? {headers, uri} : {uri}}
                        style={[{borderRadius: size / 2, height: size, width: size}, imageStyle]}
                        onError={handleImageError}
                    />
                    {fallbackChildren}
                </>
            ) : (
                <InitialsFallback
                    name={extractedName}
                    size={size}
                    testID={testID ? `${testID}.fallback` : undefined}
                    textColor={fallbackTextColor}
                    backgroundColor={fallbackColor}
                    theme={themeProp || theme}
                >
                    {fallbackChildren}
                </InitialsFallback>
            )}
        </View>
    );
};

export default Avatar;
