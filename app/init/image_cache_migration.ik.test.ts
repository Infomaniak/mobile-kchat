// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Image} from 'expo-image';

import {storeImageCacheMigrationVersion} from '@actions/app/global';
import {getImageCacheMigrationVersion} from '@queries/app/global';

import ImageCacheMigration from './image_cache_migration';

jest.mock('expo-image', () => ({
    Image: {
        clearDiskCache: jest.fn(() => Promise.resolve()),
    },
}));

jest.mock('@actions/app/global', () => ({
    storeImageCacheMigrationVersion: jest.fn(() => Promise.resolve()),
}));

jest.mock('@queries/app/global', () => ({
    getImageCacheMigrationVersion: jest.fn(() => Promise.resolve(0)),
}));

describe('ImageCacheMigration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should clear disk cache and store migration flag when migration has not been done', async () => {
        jest.mocked(getImageCacheMigrationVersion).mockResolvedValue(0);

        await ImageCacheMigration.init();

        expect(getImageCacheMigrationVersion).toHaveBeenCalled();
        expect(Image.clearDiskCache).toHaveBeenCalled();
        expect(storeImageCacheMigrationVersion).toHaveBeenCalledWith(1);
    });

    it('should not clear disk cache when migration has already been done', async () => {
        jest.mocked(getImageCacheMigrationVersion).mockResolvedValue(1);

        await ImageCacheMigration.init();

        expect(getImageCacheMigrationVersion).toHaveBeenCalled();
        expect(Image.clearDiskCache).not.toHaveBeenCalled();
        expect(storeImageCacheMigrationVersion).not.toHaveBeenCalled();
    });

    it('should not throw when getImageCacheMigrationVersion fails', async () => {
        jest.mocked(getImageCacheMigrationVersion).mockRejectedValue(new Error('DB error'));

        await expect(ImageCacheMigration.init()).resolves.toBeUndefined();

        expect(Image.clearDiskCache).not.toHaveBeenCalled();
        expect(storeImageCacheMigrationVersion).not.toHaveBeenCalled();
    });

    it('should not throw when clearDiskCache fails', async () => {
        jest.mocked(getImageCacheMigrationVersion).mockResolvedValue(0);
        jest.mocked(Image.clearDiskCache).mockRejectedValue(new Error('Cache clear failed'));

        await expect(ImageCacheMigration.init()).resolves.toBeUndefined();

        expect(storeImageCacheMigrationVersion).not.toHaveBeenCalled();
    });

    it('should not throw when storeImageCacheMigrationVersion fails', async () => {
        jest.mocked(getImageCacheMigrationVersion).mockResolvedValue(0);
        jest.mocked(storeImageCacheMigrationVersion).mockRejectedValue(new Error('Store failed'));

        await expect(ImageCacheMigration.init()).resolves.toBeUndefined();

        expect(Image.clearDiskCache).toHaveBeenCalled();
    });

    it('should call clearDiskCache before storeImageCacheMigrationVersion', async () => {
        jest.mocked(getImageCacheMigrationVersion).mockResolvedValue(0);
        const callOrder: string[] = [];
        jest.mocked(Image.clearDiskCache).mockImplementation(() => {
            callOrder.push('clearDiskCache');
            return Promise.resolve(true);
        });
        jest.mocked(storeImageCacheMigrationVersion).mockImplementation((): ReturnType<typeof storeImageCacheMigrationVersion> => {
            callOrder.push('storeMigrationDone');
            return Promise.resolve([]);
        });

        await ImageCacheMigration.init();

        expect(callOrder).toEqual(['clearDiskCache', 'storeMigrationDone']);
    });
});
