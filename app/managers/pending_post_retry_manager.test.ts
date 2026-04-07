// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {testExports} from './pending_post_retry_manager';

const {MAX_RETRIES, BASE_DELAY_MS, BATCH_SIZE, HEALTH_CHECK_TIMEOUT_MS} = testExports;

describe('PendingPostRetryManager Constants', () => {
    it('should have correct MAX_RETRIES value', () => {
        expect(MAX_RETRIES).toBe(5);
    });

    it('should have correct BASE_DELAY_MS value', () => {
        expect(BASE_DELAY_MS).toBe(1000);
    });

    it('should have correct BATCH_SIZE value', () => {
        expect(BATCH_SIZE).toBe(10);
    });

    it('should have correct HEALTH_CHECK_TIMEOUT_MS value', () => {
        expect(HEALTH_CHECK_TIMEOUT_MS).toBe(10000);
    });
});
