// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {NativeModules, Platform} from 'react-native';

const {PostRetry} = NativeModules;

/**
 * Enqueue a background work request to retry pending posts.
 * On Android, this uses WorkManager to schedule a retry when network is available.
 * On iOS, this is a no-op (background retry is handled differently).
 */
export const enqueuePostRetry = (): void => {
    if (Platform.OS === 'android' && PostRetry) {
        PostRetry.enqueueRetryWork();
    }
};
