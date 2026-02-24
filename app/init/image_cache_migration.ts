// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image} from 'expo-image';

import {storeImageCacheMigrationVersion} from '@actions/app/global';
import {getImageCacheMigrationVersion} from '@queries/app/global';

const IMAGE_CACHE_MIGRATION_VERSION = 1;

class ImageCacheMigrationSingleton {
    /**
     * Versioned migration: Clear expo-image cache to fix cacheKey collision issue.
     * Increment IMAGE_CACHE_MIGRATION_VERSION to trigger the migration again on next app start.
     */
    async init() {
        try {
            const version = await getImageCacheMigrationVersion();
            if (version < IMAGE_CACHE_MIGRATION_VERSION) {
                await Image.clearDiskCache();
                await storeImageCacheMigrationVersion(IMAGE_CACHE_MIGRATION_VERSION);
            }
        } catch {
            // Ignore migration errors - not critical for app startup
        }
    }
}

const ImageCacheMigration = new ImageCacheMigrationSingleton();
export default ImageCacheMigration;
