// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {showOverlay} from '@screens/navigation';

import {showSnackBar} from '.';

describe('snack bar', () => {
    describe('showSnackBar', () => {
        it('should show snackbar with barType', () => {
            showSnackBar({barType: 'MUTE_CHANNEL'});

            expect(showOverlay).toHaveBeenCalledWith('SnackBar', {barType: 'MUTE_CHANNEL'});
        });
    });
});
