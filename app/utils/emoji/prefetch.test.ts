// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image as ExpoImage} from 'expo-image';
import {Platform} from 'react-native';

import {logDebug} from '@utils/log';
import {urlSafeBase64Encode} from '@utils/security';

import {prefetchCustomEmojiImages} from './prefetch';

import type {Client} from '@client/rest';

jest.mock('expo-image', () => ({
    Image: {
        prefetch: jest.fn(() => Promise.resolve()),
    },
}));

jest.mock('@utils/log');

describe('prefetchCustomEmojiImages', () => {
    const mockClient = {
        apiClient: {
            baseUrl: 'https://example.com',
        },
        getCustomEmojiImageUrl: jest.fn((id) => `url/${id}`),
    } as unknown as Client;

    const emojis = [
        {id: 'emoji1', name: 'emoji_name1'},
        {id: 'emoji2', name: 'emoji_name2'},
    ] as CustomEmoji[];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should prefetch custom emoji images on iOS', () => {
        Platform.OS = 'ios';

        prefetchCustomEmojiImages(mockClient, emojis);
        const cachePath = urlSafeBase64Encode(mockClient.apiClient.baseUrl);
        const expectedResults = [{
            uri: 'url/emoji1',
            cacheKey: 'emoji-emoji_name1',
            cachePath,
        }, {
            uri: 'url/emoji2',
            cacheKey: 'emoji-emoji_name2',
            cachePath,
        }];

        expect(logDebug).toHaveBeenCalledWith('Prefetching 2 custom emoji images');
        expect(ExpoImage.prefetch).toHaveBeenCalledWith(expectedResults, {cachePolicy: 'disk'});
    });

    it('should fallback to plain urls on Android', () => {
        Platform.OS = 'android';

        prefetchCustomEmojiImages(mockClient, emojis);
        const expectedSources = [{uri: 'url/emoji1'}, {uri: 'url/emoji2'}];

        expect(logDebug).toHaveBeenCalledWith('Prefetching 2 custom emoji images');
        expect(ExpoImage.prefetch).toHaveBeenCalledWith(expectedSources, {cachePolicy: 'disk'});
    });

    it('should not break the calling flow when prefetch rejects', async () => {
        Platform.OS = 'ios';
        const error = new Error('prefetchWithSources is not available');
        (ExpoImage.prefetch as jest.Mock).mockRejectedValueOnce(error);

        prefetchCustomEmojiImages(mockClient, emojis);
        await Promise.resolve();
        await Promise.resolve();

        expect(logDebug).toHaveBeenCalledWith('prefetchCustomEmojiImages: failed to prefetch images', String(error));
    });
});
