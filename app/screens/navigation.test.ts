// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {router} from 'expo-router';

import {Preferences, Screens} from '@constants';

import {openUserProfileModal} from './navigation';

import type {IntlShape} from 'react-intl';

jest.mock('@components/compass_icon', () => {
    function CompassIcon() {
        return null;
    }
    CompassIcon.getImageSourceSync = jest.fn().mockReturnValue({});
    return {
        __esModule: true,
        default: CompassIcon,
    };
});

function expectNavigateToScreenCalledWith(screen: string, _props?: Record<string, unknown>) {
    expect(router.push).toHaveBeenCalledWith(
        expect.objectContaining({pathname: expect.stringContaining(screen)}),
    );
}

describe('openUserProfileModal', () => {
    const intl = {
        formatMessage: jest.fn(({defaultMessage}) => defaultMessage),
    } as unknown as IntlShape;
    const theme = Preferences.THEMES.denim;
    const props = {
        userId: 'user123',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should navigate to user profile screen', () => {
        openUserProfileModal(intl, theme, props);
        expectNavigateToScreenCalledWith(Screens.USER_PROFILE, props);
    });

    it('should navigate to user profile screen with screenToDismiss', async () => {
        const screenToDismiss = Screens.BOTTOM_SHEET;
        await openUserProfileModal(intl, theme, props, screenToDismiss);
        expectNavigateToScreenCalledWith(Screens.USER_PROFILE, props);
    });
});
