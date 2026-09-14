// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image as ExpoImage} from 'expo-image';
import {Platform} from 'react-native';

import {logDebug} from '@utils/log';
import {urlSafeBase64Encode} from '@utils/security';

import type {Client} from '@client/rest';

// expo-image's prefetch rejects on some Android builds when the native
// ImageModule.prefetchWithSources method is missing (MOBILE-549): catch the
// rejection so prefetching never breaks the calling flow.
const prefetch = (sources: Parameters<typeof ExpoImage.prefetch>[0]) => {
    ExpoImage.prefetch(sources, {cachePolicy: 'disk'}).catch((error: unknown) => {
        logDebug('prefetchCustomEmojiImages: failed to prefetch images', String(error));
    });
};

export function prefetchCustomEmojiImages(client: Client, emojis: CustomEmoji[]) {
    logDebug(`Prefetching ${emojis.length} custom emoji images`);

    if (Platform.OS === 'android') {
        // Workaround for MOBILE-120: Android expo-image does not implement
        // ImageModule.prefetchWithSources natively, so we fall back to plain URLs.
        prefetch(emojis.map((ce) => ({uri: client.getCustomEmojiImageUrl(ce.id)})));
    } else {
        const cachePath = urlSafeBase64Encode(client.apiClient.baseUrl);

        prefetch(emojis.map((ce) => ({
            uri: client.getCustomEmojiImageUrl(ce.id),
            cachePath,
            cacheKey: `emoji-${ce.name}`,
        })));
    }
}
