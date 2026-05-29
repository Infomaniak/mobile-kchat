// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {showOverlay} from '@screens/navigation';

import {showBoRPostErrorSnackbar} from '.';

describe('snack bar', () => {
    describe('showBoRPostErrorSnackbar', () => {
        it('should show snackbar', () => {
            showBoRPostErrorSnackbar();

            expect(showOverlay).toHaveBeenCalledWith('SnackBar', {
                barType: 'BOR_POST_EXPIRED',
            });
        });

        it('should show custom message when provided', () => {
            showBoRPostErrorSnackbar('custom message');

            expect(showOverlay).toHaveBeenCalledWith('SnackBar', {
                barType: 'BOR_POST_EXPIRED',
                customMessage: 'custom message',
            });
        });
    });
});
