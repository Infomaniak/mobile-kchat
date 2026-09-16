// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fireEvent, screen} from '@testing-library/react-native';
import React from 'react';

import {renderWithIntlAndTheme} from '@test/intl-test-helper';

import UserProfileEmail from './label_email';

jest.mock('@react-native-clipboard/clipboard', () => ({
    setString: jest.fn(),
}));

const mockSetString = require('@react-native-clipboard/clipboard').setString as jest.Mock;

jest.mock('@utils/snack_bar', () => ({
    showSnackBar: jest.fn(),
}));

const mockShowSnackBar = require('@utils/snack_bar').showSnackBar as jest.Mock;

describe('UserProfileEmail', () => {
    const baseProps = {
        description: 'user@example.com',
        testID: 'test-email',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render email text correctly', () => {
        renderWithIntlAndTheme(
            <UserProfileEmail {...baseProps}/>,
        );

        expect(screen.getByText('user@example.com')).toBeTruthy();
        expect(screen.getByTestId('test-email.email')).toBeTruthy();
    });

    it('should copy email to clipboard when pressed', () => {
        renderWithIntlAndTheme(
            <UserProfileEmail {...baseProps}/>,
        );

        fireEvent.press(screen.getByTestId('test-email.email'));

        expect(mockSetString).toHaveBeenCalledTimes(1);
        expect(mockSetString).toHaveBeenCalledWith('user@example.com');
    });

    it('should show copied snackbar when pressed', () => {
        renderWithIntlAndTheme(
            <UserProfileEmail {...baseProps}/>,
        );

        fireEvent.press(screen.getByTestId('test-email.email'));

        expect(mockShowSnackBar).toHaveBeenCalledTimes(1);
        expect(mockShowSnackBar).toHaveBeenCalledWith(
            expect.objectContaining({barType: 'TEXT_COPIED'}),
        );
    });
});
