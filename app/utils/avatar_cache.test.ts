// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getAvatarCacheId} from './avatar_cache';

describe('utils/avatar_cache/getAvatarCacheId', () => {
    it('should return a stable key scoped to the user and their last picture update', () => {
        expect(getAvatarCacheId('user-1', 1234)).toBe(getAvatarCacheId('user-1', 1234));
        expect(getAvatarCacheId('user-1', 1234)).toContain('user-1');
        expect(getAvatarCacheId('user-1', 1234)).not.toBe(getAvatarCacheId('user-2', 1234));
        expect(getAvatarCacheId('user-1', 1234)).not.toBe(getAvatarCacheId('user-1', 5678));
    });
});
