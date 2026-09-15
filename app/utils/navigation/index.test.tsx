// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {isValidElement, type ReactElement} from 'react';
import {createIntl} from 'react-intl';
import {Alert} from 'react-native';

import {ITEM_HEIGHT} from '@components/slide_up_panel_item';
import {ServerErrors} from '@constants';
import {STATUS_BAR_HEIGHT} from '@constants/view';
import {DEFAULT_LOCALE, getTranslations} from '@i18n';
import {bottomSheet} from '@screens/navigation';

import {mergeNavigationOptions, alertTeamRemove, alertChannelRemove, alertChannelArchived, alertTeamAddError, openAttachmentOptions} from '.';

jest.mock('@screens/navigation', () => ({
    bottomSheet: jest.fn(),
    navigateToScreen: jest.fn(),
}));

describe('Navigation utils', () => {
    const componentId = 'component-id';
    const options = {topBar: {title: {text: 'Test'}}};
    const displayName = 'Test Display Name';
    const serverError = {server_error_id: ServerErrors.TEAM_MEMBERSHIP_DENIAL_ERROR_ID};
    const genericServerError = {server_error_id: 'api.some_server_error.id', message: 'Generic error message'};
    const intl = createIntl({locale: DEFAULT_LOCALE, messages: getTranslations(DEFAULT_LOCALE)});

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call mergeNavigationOptions without throwing', () => {
        expect(() => mergeNavigationOptions(componentId, options)).not.toThrow();
    });

    it('should display alert when a user is removed from a team', () => {
        alertTeamRemove(displayName, intl);
        expect(Alert.alert).toHaveBeenCalledWith(
            'Removed from team',
            'You have been removed from team Test Display Name.',
            [{style: 'cancel', text: 'OK'}],
        );
    });

    it('should display alert when a user is removed from a channel', () => {
        alertChannelRemove(displayName, intl);
        expect(Alert.alert).toHaveBeenCalledWith(
            'Removed from channel',
            'You have been removed from channel Test Display Name.',
            [{style: 'cancel', text: 'OK'}],
        );
    });

    it('should display alert when a channel is archived', () => {
        alertChannelArchived(displayName, intl);
        expect(Alert.alert).toHaveBeenCalledWith(
            'Archived channel',
            'The channel Test Display Name has been archived.',
            [{style: 'cancel', text: 'OK'}],
        );
    });

    it('should display alert for team add error with default message', () => {
        alertTeamAddError({}, intl);
        expect(Alert.alert).toHaveBeenCalledWith(
            'Error joining a team',
            'There has been an error joining the team',
        );
    });

    it('should display alert for team add error with specific server error message', () => {
        alertTeamAddError(serverError, intl);
        expect(Alert.alert).toHaveBeenCalledWith(
            'Error joining a team',
            'You need to be a member of a linked group to join this team.',
        );
    });

    it('should display alert for team add error with generic error message', () => {
        alertTeamAddError(genericServerError, intl);
        expect(Alert.alert).toHaveBeenCalledWith(
            'Error joining a team',
            'Generic error message',
        );
    });

    describe('openAttachmentOptions', () => {
        it('should open the generic bottom sheet with content preserving the onUploadFiles callback', () => {
            const onUploadFiles = jest.fn();

            openAttachmentOptions({
                onUploadFiles,
                maxFilesReached: false,
                canUploadFiles: true,
                testID: 'test-attachment',
                fileCount: 0,
                maxFileCount: 5,
            });

            expect(bottomSheet).toHaveBeenCalledTimes(1);
            const sheetOptions = jest.mocked(bottomSheet).mock.calls[0][0];
            expect(sheetOptions.snapPoints).toEqual([1, 54 + (4 * ITEM_HEIGHT) + STATUS_BAR_HEIGHT]);

            // The callback must survive as a function (not serialized through route params)
            const element = sheetOptions.renderContent() as ReactElement<{onUploadFiles: () => void}>;
            if (!isValidElement(element)) {
                throw new Error('renderContent did not return a valid element');
            }
            expect(element.props.onUploadFiles).toBe(onUploadFiles);
        });

        it('should account for the attach logs item in snap points', () => {
            openAttachmentOptions({
                onUploadFiles: jest.fn(),
                maxFilesReached: false,
                canUploadFiles: true,
                showAttachLogs: true,
            });

            const sheetOptions = jest.mocked(bottomSheet).mock.calls[0][0];
            expect(sheetOptions.snapPoints).toEqual([1, 54 + (5 * ITEM_HEIGHT) + STATUS_BAR_HEIGHT]);
        });
    });
});
