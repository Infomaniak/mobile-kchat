// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment-timezone';
import React, {type ComponentProps} from 'react';

import DateTimeSelector from '@components/data_time_selector';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {renderWithEverything} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import RescheduledDraft from './reschedule_draft';

import type {Database} from '@nozbe/watermelondb';
import type ScheduledPostModel from '@typings/database/models/servers/scheduled_post';

jest.mock('@actions/remote/scheduled_post', () => ({
    updateScheduledPost: jest.fn().mockResolvedValue({scheduledPost: {} as ScheduledPost, error: undefined}),
}));

jest.mock('@utils/snack_bar', () => ({
    showSnackBar: jest.fn(),
}));

jest.mock('@screens/navigation', () => ({
    buildNavigationButton: jest.fn().mockReturnValue({
        id: 'reschedule-draft',
        testID: 'reschedule_draft.save.button',
        showAsAction: 'always',
    }),
    dismissModal: jest.fn(),
    setButtons: jest.fn(),
    navigateBack: jest.fn(),
    openAsBottomSheet: jest.fn(),
}));

jest.mock('@context/server', () => ({
    useServerUrl: jest.fn(),
}));

jest.mock('@components/data_time_selector', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(DateTimeSelector).mockImplementation(
    (props: ComponentProps<typeof DateTimeSelector>) => React.createElement('DateTimeSelector', {testID: 'custom_date_time_picker', ...props}),
);

jest.mock('@hooks/android_back_handler', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockSetOptions = jest.fn();
const mockRemoveListener = jest.fn();
const mockAddListener = jest.fn(() => mockRemoveListener);
const mockNavigation = {
    setOptions: mockSetOptions,
    addListener: mockAddListener,
};

jest.mock('expo-router', () => ({
    useNavigation: jest.fn(() => mockNavigation),
}));

const SERVER_URL = 'https://appv1.mattermost.com';

describe('RescheduledDraft', () => {
    let database: Database;

    const mockDraft = {
        scheduledAt: moment().add(1, 'day').valueOf(),
        toApi: jest.fn().mockResolvedValue({
            scheduled_at: moment().add(1, 'day').valueOf(),
        }),
    } as unknown as ScheduledPostModel;

    function getBaseProps(): ComponentProps<typeof RescheduledDraft> {
        return {
            componentId: Screens.RESCHEDULE_DRAFT,
            closeButtonId: 'close-button-id',
            currentUserTimezone: {
                useAutomaticTimezone: true,
                automaticTimezone: 'America/New_York',
                manualTimezone: '',
            },
            draft: mockDraft,
            limits: {} as ComponentProps<typeof RescheduledDraft>['limits'],
            usage: {} as ComponentProps<typeof RescheduledDraft>['usage'],
        };
    }

    beforeAll(async () => {
        const server = await TestHelper.setupServerDatabase();
        database = server.database;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(useServerUrl).mockReturnValue(SERVER_URL);
    });

    it('should render correctly', () => {
        const props = getBaseProps();
        const {getByTestId} = renderWithEverything(
            <RescheduledDraft {...props}/>, {database},
        );

        expect(getByTestId('edit_post.screen')).toBeTruthy();
    });

    it('should pass the draft scheduledAt time and render correctly', () => {
        const scheduledTime = moment().add(3, 'days').valueOf();
        const draftWithScheduledTime = {
            ...mockDraft,
            scheduledAt: scheduledTime,
        } as unknown as ScheduledPostModel;

        const props = getBaseProps();
        props.draft = draftWithScheduledTime;

        const {getByTestId} = renderWithEverything(
            <RescheduledDraft {...props}/>,
            {database},
        );

        expect(getByTestId('edit_post.screen')).toBeTruthy();
    });

    it('should render correctly with different timezone', () => {
        const scheduledTime = moment.tz('2024-12-25 14:30', 'Asia/Tokyo').valueOf();
        const draftWithScheduledTime = {
            ...mockDraft,
            scheduledAt: scheduledTime,
        } as unknown as ScheduledPostModel;

        const props = getBaseProps();
        props.draft = draftWithScheduledTime;
        props.currentUserTimezone = {
            useAutomaticTimezone: true,
            automaticTimezone: 'Asia/Tokyo',
            manualTimezone: '',
        };

        const {getByTestId} = renderWithEverything(
            <RescheduledDraft {...props}/>,
            {database},
        );

        expect(getByTestId('edit_post.screen')).toBeTruthy();
    });
});
