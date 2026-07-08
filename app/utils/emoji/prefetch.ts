// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image as ExpoImage} from 'expo-image';
import {Platform} from 'react-native';

import {logDebug} from '@utils/log';
import {urlSafeBase64Encode} from '@utils/security';

import type {Client} from '@client/rest';

export function prefetchCustomEmojiImages(client: Client, emojis: CustomEmoji[]) {
    logDebug(`Prefetching ${emojis.length} custom emoji images`);

    if (Platform.OS === 'android') {
        // Workaround for MOBILE-120: Android expo-image 2.0.7 does not implement
        // ImageModule.prefetchWithSources natively, so we fall back to plain URLs.
        ExpoImage.prefetch(
            emojis.map((ce) => client.getCustomEmojiImageUrl(ce.id)),
            {cachePolicy: 'disk'},
        );
    } else {
        const cachePath = urlSafeBase64Encode(client.apiClient.baseUrl);

        ExpoImage.prefetch(emojis.map((ce) => ({
            uri: client.getCustomEmojiImageUrl(ce.id),
            cachePath,
            cacheKey: `emoji-${ce.name}`,
        })), {cachePolicy: 'disk'});
    }
}
