// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image, ImageBackground, type ImageContentFit, type ImageStyle} from 'expo-image';
import React, {type ReactNode, useEffect, useState} from 'react';
import {ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle} from 'react-native';
import Animated from 'react-native-reanimated';

import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = ProgressiveImageProps & {
    children?: ReactNode | ReactNode[];
    forwardRef?: React.RefObject<any>;
    id: string;
    imageStyle?: StyleProp<ImageStyle>;
    isBackgroundImage?: boolean;
    onError: () => void;
    contentFit?: ImageContentFit;
    style?: StyleProp<ViewStyle>;
    tintDefaultSource?: boolean;
};

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        defaultImageContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
        },
        defaultImageTint: {
            flex: 1,
            tintColor: changeOpacity(theme.centerChannelColor, 0.2),
        },
    };
});

const ProgressiveImage = ({
    children, defaultSource, forwardRef, id, imageStyle, imageUri, inViewPort, isBackgroundImage,
    onError, contentFit = 'contain', style = {}, thumbnailUri, tintDefaultSource,
}: Props) => {
    const [showHighResImage, setShowHighResImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    useEffect(() => {
        if (inViewPort) {
            setShowHighResImage(inViewPort);
        }
    }, [inViewPort]);

    const serverUrl = useServerUrl();
    const token = NetworkManager.getClient(serverUrl).getCurrentBearerToken();
    const headers = {Authorization: token};
    const imgSource = {uri: imageUri, headers};
    const thumbnailSource = {uri: thumbnailUri, headers};
    const showImage = showHighResImage || !thumbnailUri;

    const dismissLoader = () => {
        setLoading(false);
    };

    if (isBackgroundImage && imageUri) {
        return (
            <View style={[styles.defaultImageContainer, style]}>
                <ImageBackground
                    key={id}
                    source={imgSource}
                    contentFit='cover'
                    style={[StyleSheet.absoluteFill, imageStyle as StyleProp<ViewStyle>]}
                >
                    {children}
                </ImageBackground>
            </View>
        );
    }

    if (defaultSource) {
        return (
            <View style={[styles.defaultImageContainer, style]}>
                <AnimatedImage
                    ref={forwardRef}
                    source={{...defaultSource, headers}}
                    style={[
                        StyleSheet.absoluteFill,
                        imageStyle,
                        tintDefaultSource ? styles.defaultImageTint : null,
                    ]}
                    contentFit={contentFit}
                    onError={onError}
                    nativeID={`image-${id}`}
                    recyclingKey={`image-${id}`}
                    onLoad={dismissLoader}
                />
            </View>
        );
    }
    return (
        <Animated.View style={[styles.defaultImageContainer, style]}>
            {loading &&
            <ActivityIndicator
                size='small'
                color={theme.centerChannelColor}
            />}
            <Image
                ref={forwardRef}
                placeholder={thumbnailSource}
                placeholderContentFit='cover'
                nativeID={`image-${id}`}
                recyclingKey={`image-${id}`}
                testID='progressive_image.highResImage'
                transition={300}
                style={[StyleSheet.absoluteFill, imageStyle]}
                source={(showImage) ? {uri: imageUri} : undefined}
                autoplay={true}
                onLoad={dismissLoader}
                onError={onError}
            />
        </Animated.View>
    );
};

export default ProgressiveImage;
