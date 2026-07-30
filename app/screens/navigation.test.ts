// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Preferences, Screens} from '@constants';
import {isTablet} from '@utils/helpers';

import {openAttachmentOptions, openUserProfileModal} from './navigation';

import type {IntlShape} from 'react-intl';

jest.mock('@utils/helpers', () => ({
    ...jest.requireActual('@utils/helpers'),
    isTablet: jest.fn(),
}));

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

const mockNavigateToScreen = jest.fn();
jest.mock('expo-router', () => ({
    router: {
        push: mockNavigateToScreen,
        replace: jest.fn(),
        back: jest.fn(),
        dismiss: jest.fn(),
        dismissAll: jest.fn(),
        dismissTo: jest.fn(),
        canGoBack: jest.fn(() => false),
        canDismiss: jest.fn(() => false),
        setParams: jest.fn(),
    },
    useNavigation: () => ({
        addListener: jest.fn().mockReturnValue(jest.fn()),
        setOptions: jest.fn(),
    }),
}));

function expectNavigateToScreenCalledWith(screen: string, _props?: Record<string, unknown>) {
    expect(mockNavigateToScreen).toHaveBeenCalledWith(
        expect.objectContaining({pathname: expect.stringContaining(screen)}),
        expect.any(Object),
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

describe('openAttachmentOptions', () => {
    const mockOnUploadFiles = jest.fn();
    const props = {
        onUploadFiles: mockOnUploadFiles,
        maxFilesReached: false,
        canUploadFiles: true,
        testID: 'test-attachment',
        fileCount: 0,
        maxFileCount: 5,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(isTablet).mockReturnValue(false);
    });

    it('should call navigateToScreen with correct parameters on non-tablet', () => {
        openAttachmentOptions(props);

        expectNavigateToScreenCalledWith(Screens.ATTACHMENT_OPTIONS, props);
    });

    it('should call navigateToScreen with correct parameters on tablet', () => {
        jest.mocked(isTablet).mockReturnValue(true);

        openAttachmentOptions(props);

        expectNavigateToScreenCalledWith(Screens.ATTACHMENT_OPTIONS, props);
    });

    it('should handle optional props correctly', () => {
        const minimalProps = {
            onUploadFiles: mockOnUploadFiles,
            maxFilesReached: true,
            canUploadFiles: false,
        };

        openAttachmentOptions(minimalProps);

        expectNavigateToScreenCalledWith(Screens.ATTACHMENT_OPTIONS, minimalProps);
    });
});
