// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import SnackBarStore from '@store/snackbar_store';

import {showSnackBar} from '.';

jest.mock('@store/snackbar_store', () => ({
    __esModule: true,
    default: {
        show: jest.fn(),
    },
}));

describe('snack bar', () => {
    describe('showSnackBar', () => {
        it('should show snackbar with barType', () => {
            showSnackBar({barType: 'MUTE_CHANNEL'});

            expect(SnackBarStore.show).toHaveBeenCalledWith({barType: 'MUTE_CHANNEL'});
        });
    });
});
