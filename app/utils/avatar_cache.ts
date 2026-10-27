// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Avatars are cached by expo-image under this key. An immutable key pins a corrupted
// cache entry forever: if the server ever answers its default placeholder image for a
// profile picture request, the bad bytes keep being served as a successful load and no
// error handling kicks in. The key therefore includes a coarse time bucket computed
// once per app session, so a bad entry self-heals on the next app start (within a day)
// at the cost of one avatar re-download per user per day.
//
// Rotation adds a new disk entry per user per day; accumulation stays bounded because
// every per-path SDImageCache behind expo-image (including custom cachePath caches)
// registers for background transitions and purges entries older than maxDiskAge
// (1 week by default) on each one. Entries also live under Caches/, so the OS may
// evict them under disk pressure regardless.
const AVATAR_CACHE_BUCKET_MS = 24 * 60 * 60 * 1000;
const cacheBucket = Math.floor(Date.now() / AVATAR_CACHE_BUCKET_MS);

export const getAvatarCacheId = (userId: string, lastPictureUpdate: number) => {
    return `user-${userId}-${lastPictureUpdate}-${cacheBucket}`;
};
