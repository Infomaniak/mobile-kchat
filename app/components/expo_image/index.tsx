// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image, ImageBackground, type ImageBackgroundProps, type ImageProps, type ImageSource} from 'expo-image';
import React, {forwardRef, useMemo} from 'react';
import Animated from 'react-native-reanimated';

import {useServerUrl} from '@context/server';
import NetworkManager from '@managers/network_manager';
import {urlSafeBase64Encode} from '@utils/security';

type ExpoImagePropsWithId = ImageProps & {id: string};
type ExpoImagePropsMemoryOnly = ImageProps & {cachePolicy: 'memory'; id?: string};
type ExpoImageProps = ExpoImagePropsWithId | ExpoImagePropsMemoryOnly;

type ExpoImageBackgroundPropsWithId = ImageBackgroundProps & {id: string};
type ExpoImageBackgroundPropsMemoryOnly = ImageBackgroundProps & {cachePolicy: 'memory'; id?: string};
type ExpoImageBackgroundProps = ExpoImageBackgroundPropsWithId | ExpoImageBackgroundPropsMemoryOnly;

function isImageSource(source: unknown): source is ImageSource {
    return typeof source === 'object' && source !== null && !Array.isArray(source) && !('nativeRefType' in source);
}

function shouldAttachServerAuthHeaders(uri: string | undefined, serverUrl: string) {
    if (!uri) {
        return false;
    }

    try {
        const requestUrl = new URL(uri);
        const serverBaseUrl = new URL(serverUrl);

        if (requestUrl.origin !== serverBaseUrl.origin) {
            return false;
        }

        return requestUrl.pathname.startsWith('/api/v4/');
    } catch {
        // On any parsing error, do not attach auth headers
        return false;
    }
}

const ExpoImage = forwardRef<Image, ExpoImageProps>(({id, ...props}, ref) => {
    const serverUrl = useServerUrl();
    const requestHeaders = useMemo(() => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            return client.getRequestHeaders('GET');
        } catch {
            return undefined;
        }
    }, [serverUrl]);

    /**
     * SECURITY NOTE: cachePath uses base64 encoding for URL safety, NOT encryption.
     * Server URLs are not considered sensitive information, and this encoding is purely
     * for filesystem path compatibility (avoiding special characters in directory names).
     */
    const cachePath = useMemo(() => urlSafeBase64Encode(serverUrl), [serverUrl]);
    const source: ImageProps['source'] = useMemo(() => {
        if (typeof props.source === 'number') {
            return props.source;
        }

        const sourceObj = isImageSource(props.source) ? props.source : undefined;
        const sourceHeaders = shouldAttachServerAuthHeaders(sourceObj?.uri, serverUrl) && requestHeaders ? {...requestHeaders, ...sourceObj?.headers} : sourceObj?.headers;
        delete sourceHeaders?.Accept;

        // Only add cacheKey and cachePath if id is provided (i.e., not memory-only caching)
        if (id && sourceObj) {
            return {
                ...sourceObj,
                headers: sourceHeaders,
                cacheKey: id,
                cachePath,
            };
        }

        if (sourceObj) {
            return {
                ...sourceObj,
                headers: sourceHeaders,
            };
        }

        return props.source;
    }, [id, props.source, cachePath, requestHeaders, serverUrl]);

    // Process placeholder to add cachePath and cacheKey if it has a uri
    const placeholder: ImageProps['placeholder'] = useMemo(() => {
        if (!props.placeholder || typeof props.placeholder === 'number' || typeof props.placeholder === 'string') {
            return props.placeholder;
        }

        const placeholderObj = isImageSource(props.placeholder) ? props.placeholder : undefined;
        const placeholderHeaders = shouldAttachServerAuthHeaders(placeholderObj?.uri, serverUrl) && requestHeaders ? {...requestHeaders, ...placeholderObj?.headers} : placeholderObj?.headers;
        delete placeholderHeaders?.Accept;

        // If placeholder has a uri and id is provided, add cachePath and cacheKey
        if (placeholderObj?.uri && id) {
            return {
                ...placeholderObj,
                headers: placeholderHeaders,
                cacheKey: `${id}-thumb`,
                cachePath,
            };
        }

        if (placeholderObj) {
            return {
                ...placeholderObj,
                headers: placeholderHeaders,
            };
        }

        return props.placeholder;
    }, [props.placeholder, id, cachePath, requestHeaders, serverUrl]);

    return (
        <Image
            ref={ref}
            {...props}
            source={source}
            placeholder={placeholder}
        />
    );
});
ExpoImage.displayName = 'ExpoImage';

const ExpoImageBackground = ({id, ...props}: ExpoImageBackgroundProps) => {
    const serverUrl = useServerUrl();
    const cachePath = useMemo(() => urlSafeBase64Encode(serverUrl), [serverUrl]);
    const source: ImageBackgroundProps['source'] = useMemo(() => {
        if (typeof props.source === 'number') {
            return props.source;
        }

        const sourceObj = isImageSource(props.source) ? props.source : undefined;

        // Only add cacheKey and cachePath if id is provided (i.e., not memory-only caching)
        if (id && sourceObj) {
            return {
                ...sourceObj,
                cacheKey: id,
                cachePath,
            };
        }

        return props.source;
    }, [id, props.source, cachePath]);

    // Process placeholder to add cachePath and cacheKey if it has a uri
    const placeholder: ImageBackgroundProps['placeholder'] = useMemo(() => {
        if (!props.placeholder || typeof props.placeholder === 'number' || typeof props.placeholder === 'string') {
            return props.placeholder;
        }

        const placeholderObj = isImageSource(props.placeholder) ? props.placeholder : undefined;

        // If placeholder has a uri and id is provided, add cachePath and cacheKey
        if (placeholderObj?.uri && id) {
            return {
                ...placeholderObj,
                cacheKey: `${id}-thumb`,
                cachePath,
            };
        }

        return props.placeholder;
    }, [props.placeholder, id, cachePath]);

    return (
        <ImageBackground
            {...props}
            source={source}
            placeholder={placeholder}
        >
            {props.children}
        </ImageBackground>
    );
};

const ExpoImageAnimated = Animated.createAnimatedComponent(ExpoImage);

export {
    ExpoImageAnimated,
    ExpoImageBackground,
};

export default ExpoImage;
