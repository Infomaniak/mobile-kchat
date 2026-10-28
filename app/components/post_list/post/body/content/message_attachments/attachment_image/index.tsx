// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {type ImageLoadEventData} from 'expo-image';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import Animated from 'react-native-reanimated';

import FileIcon from '@components/files/file_icon';
import ProgressiveImage from '@components/progressive_image';
import {GalleryInit} from '@context/gallery';
import {useIsTablet} from '@hooks/device';
import {useGalleryItem} from '@hooks/gallery';
import {lookupMimeType} from '@utils/file';
import {openGalleryAtIndex} from '@utils/gallery';
import {isGifTooLarge, calculateDimensions, getViewPortWidth} from '@utils/images';
import {urlSafeBase64Encode} from '@utils/security';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {extractFilenameFromUrl, isValidUrl} from '@utils/url';

import type {GalleryItemType} from '@typings/screens/gallery';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        attachmentMargin: {
            marginTop: 2.5,
            marginLeft: 2.5,
            marginBottom: 5,
            marginRight: 5,
        },
        container: {marginTop: 5},
        imageContainer: {
            borderColor: changeOpacity(theme.centerChannelColor, 0.1),
            borderWidth: 1,
            borderRadius: 2,
            flex: 1,
        },
        image: {
            alignItems: 'center',
            borderRadius: 3,
            justifyContent: 'center',
            marginVertical: 1,
        },
    };
});

export type Props = {
    imageMetadata?: PostImage;
    imageUrl: string;
    layoutWidth?: number;
    location: string;
    postId: string;
    theme: Theme;
}

// Server-provided dimensions are optional (e.g. signed external URLs have no
// entry in metadata.images): render a bounded box and adopt the real aspect
// ratio once the image has loaded.
const FALLBACK_ATTACHMENT_IMAGE_DIMENSIONS = {height: 200, width: 200};

type MeasuredDimensions = {height: number; width: number};

// Tagged with the URL it belongs to so a stale measurement from a previous
// image never drives the box after the attachment image URL changes.
type MeasuredImage = MeasuredDimensions & {url: string};

const AttachmentImage = ({imageUrl, imageMetadata, layoutWidth, location, postId, theme}: Props) => {
    const galleryIdentifier = `${postId}-AttachmentImage-${location}`;
    const [error, setError] = useState(false);
    const [measured, setMeasured] = useState<MeasuredImage | null>(null);
    const fileId = useRef<string | null>(null);
    if (fileId.current === null) {
        fileId.current = `uid-${urlSafeBase64Encode(imageUrl)}`;
    }
    const isTablet = useIsTablet();
    const imageWidth = imageMetadata?.width;
    const imageHeight = imageMetadata?.height;
    const activeMeasured = measured?.url === imageUrl ? measured : null;
    const viewportWidth = layoutWidth || getViewPortWidth(false, isTablet, true);
    let dimensions: MeasuredDimensions;
    if (imageWidth && imageHeight) {
        dimensions = calculateDimensions(imageHeight, imageWidth, viewportWidth);
    } else {
        dimensions = activeMeasured ? calculateDimensions(activeMeasured.height, activeMeasured.width, viewportWidth) : FALLBACK_ATTACHMENT_IMAGE_DIMENSIONS;
    }
    const {height, width} = dimensions;
    const style = getStyleSheet(theme);
    const progressiveImageStyle = useMemo(() => ({width, height}), [width, height]);

    const onError = useCallback(() => {
        setError(true);
    }, []);

    const onImageLoad = useCallback((event: ImageLoadEventData) => {
        const {height: measuredHeight, width: measuredWidth} = event.source;
        if (measuredWidth > 0 && measuredHeight > 0) {
            setMeasured({height: measuredHeight, width: measuredWidth, url: imageUrl});
        }
    }, [imageUrl]);

    const onPress = () => {
        const item: GalleryItemType = {
            id: fileId.current || '',
            postId,
            uri: imageUrl,
            width: imageWidth ?? activeMeasured?.width ?? width,
            height: imageHeight ?? activeMeasured?.height ?? height,
            name: extractFilenameFromUrl(imageUrl) || 'attachmentImage.png',
            mime_type: lookupMimeType(imageUrl) || 'image/png',
            type: 'image',
            lastPictureUpdate: 0,
            cacheKey: fileId.current || '',
        };
        openGalleryAtIndex(galleryIdentifier, 0, [item]);
    };

    const {ref, onGestureEvent, styles} = useGalleryItem(
        galleryIdentifier,
        0,
        onPress,
    );

    if (error || !isValidUrl(imageUrl) || isGifTooLarge(imageMetadata)) {
        return (
            <View style={[style.imageContainer, {height, borderWidth: 1, borderColor: changeOpacity(theme.centerChannelColor, 0.2)}]}>
                <View style={[style.image, {width, height}]}>
                    <FileIcon
                        failed={true}
                    />
                </View>
            </View>
        );
    }

    return (
        <GalleryInit galleryIdentifier={galleryIdentifier}>
            <Animated.View style={[styles, style.container, {width}]}>
                <TouchableWithoutFeedback onPress={onGestureEvent}>
                    <Animated.View testID={`attachmentImage-${fileId}`}>
                        <ProgressiveImage
                            forwardRef={ref}
                            id={fileId.current}
                            key={`${width}x${height}`}
                            imageStyle={style.attachmentMargin}
                            imageUri={imageUrl}
                            onError={onError}
                            onImageLoad={onImageLoad}
                            contentFit='contain'
                            style={progressiveImageStyle}
                            theme={theme}
                        />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Animated.View>
        </GalleryInit>
    );
};

export default AttachmentImage;
