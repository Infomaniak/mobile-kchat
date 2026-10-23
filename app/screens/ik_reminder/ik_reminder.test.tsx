// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {renderWithIntlAndTheme} from '@test/intl-test-helper';

import IKReminder from './ik_reminder';

jest.mock('@gorhom/bottom-sheet', () => {
    const actual = jest.requireActual('@gorhom/bottom-sheet');
    const {ScrollView} = jest.requireActual('react-native');

    return {...actual, BottomSheetScrollView: ScrollView};
});

jest.mock('@context/server', () => ({
    useServerUrl: jest.fn().mockReturnValue('https://server.test'),
}));

jest.mock('@hooks/device', () => ({
    useIsTablet: jest.fn().mockReturnValue(false),
}));

jest.mock('@hooks/usage', () => ({
    useGetUsageDeltas: jest.fn().mockReturnValue({reminder_custom_date: -1}),
}));

jest.mock('@managers/network_manager', () => ({
    __esModule: true,
    default: {getClient: jest.fn()},
}));

jest.mock('@screens/bottom_sheet', () => ({
    __esModule: true,
    default: ({renderContent}: {renderContent: () => React.ReactNode}) => renderContent(),
}));

jest.mock('@screens/navigation', () => ({
    dismissBottomSheet: jest.fn(),
    openAsBottomSheet: jest.fn(),
}));

describe('IKReminder', () => {
    it('should display the reminder sheet options in French', () => {
        const {getByText} = renderWithIntlAndTheme(
            <IKReminder postId='post-id-1'/>,
            {locale: 'fr'},
        );

        expect(getByText('Rappel')).toBeTruthy();
        expect(getByText('30 min')).toBeTruthy();
        expect(getByText('1 heure')).toBeTruthy();
        expect(getByText('2 heures')).toBeTruthy();
        expect(getByText('Demain')).toBeTruthy();
        expect(getByText('Lundi')).toBeTruthy();
        expect(getByText('Personnalisé')).toBeTruthy();
    });
});
