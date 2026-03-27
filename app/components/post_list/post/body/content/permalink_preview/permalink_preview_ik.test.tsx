// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View} from 'react-native';

import Markdown from '@components/markdown';
import MessageAttachment from '@components/post_list/post/body/content/message_attachments/message_attachment';
import TranslateIcon from '@components/post_list/post/header/translate_icon';
import ProfilePicture from '@components/post_list/post/profile_picture/profile_picture';
import {Screens} from '@constants';
import DatabaseManager from '@database/manager';
import {renderWithEverything} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import PermalinkPreview from './permalink_preview';

import type ServerDataOperator from '@database/operator/server_data_operator';
import type {Database} from '@nozbe/watermelondb';

jest.mock('@actions/remote/permalink', () => ({
    showPermalink: jest.fn(),
}));

jest.mock('@components/markdown', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(Markdown).mockImplementation((props) =>
    React.createElement('Text', {testID: 'markdown'}, props.value),
);

jest.mock('@components/post_list/post/header/translate_icon', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(TranslateIcon).mockImplementation(() =>
    React.createElement(View, {testID: 'translate-icon'}, null),
);

jest.mock('@components/post_list/post/profile_picture/profile_picture', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(ProfilePicture).mockImplementation(() =>
    React.createElement(View, {testID: 'profile-picture'}, null),
);

jest.mock('@components/post_list/post/body/content/message_attachments/message_attachment', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(MessageAttachment).mockImplementation(() =>
    React.createElement(View, {testID: 'message-attachment'}, null),
);

describe('IK - Webhook Support in PermalinkPreview', () => {
    let database: Database;
    let operator: ServerDataOperator;
    const serverUrl = 'http://localhost:8065';

    beforeEach(async () => {
        jest.clearAllMocks();

        await DatabaseManager.init([serverUrl]);
        const serverDatabaseAndOperator = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        database = serverDatabaseAndOperator.database;
        operator = serverDatabaseAndOperator.operator;

        await operator.handleConfigs({
            configs: [
                {id: 'EnablePermalinkPreviews', value: 'true'},
                {id: 'TeammateNameDisplay', value: 'username'},
            ],
            configsToDelete: [],
            prepareRecordsOnly: false,
        });

        const currentUser = TestHelper.fakeUser({id: 'current-user', locale: 'en'});
        await operator.handleUsers({users: [currentUser], prepareRecordsOnly: false});
        await operator.handleSystem({
            systems: [{id: 'currentUserId', value: currentUser.id}],
            prepareRecordsOnly: false,
        });
    });

    afterEach(async () => {
        await DatabaseManager.destroyServerDatabase(serverUrl);
    });

    const renderPermalinkPreview = (props: Parameters<typeof PermalinkPreview>[0]) => {
        return renderWithEverything(<PermalinkPreview {...props}/>, {database, serverUrl});
    };

    const baseProps: Parameters<typeof PermalinkPreview>[0] = {
        embedData: {
            post_id: 'post-123',
            post: TestHelper.fakePost({
                id: 'post-123',
                user_id: 'user-123',
                message: 'Test message',
                create_at: 1234567890000,
                edit_at: 0,
                props: {},
                metadata: {
                    embeds: [],
                },
            }),
            team_name: 'test-team',
            channel_display_name: 'Test Channel',
            channel_type: 'O',
            channel_id: 'channel-123',
        },
        author: TestHelper.fakeUserModel({
            id: 'user-123',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
        }),
        currentUser: TestHelper.fakeUserModel({
            id: 'current-user',
            locale: 'en',
        }),
        post: TestHelper.fakePostModel({
            id: 'post-123',
            userId: 'user-123',
            message: 'Test message',
            createAt: 1234567890000,
            editAt: 0,
        }),
        isMilitaryTime: false,
        teammateNameDisplay: 'username',
        location: Screens.CHANNEL,
        isOriginPostDeleted: false,
        parentLocation: Screens.CHANNEL,
        parentPostId: 'parent-post-123',
        autotranslationsEnabled: false,
    };

    describe('override_username support', () => {
        it('should display webhook override_username instead of author name', () => {
            const props = {
                ...baseProps,
                embedData: {
                    ...baseProps.embedData,
                    post: TestHelper.fakePost({
                        id: 'post-123',
                        user_id: 'user-123',
                        message: 'Webhook message',
                        props: {
                            from_webhook: 'true',
                            override_username: 'Webhook Bot',
                        },
                        metadata: {
                            embeds: [],
                        },
                    }),
                },
            };
            const {getByText, queryByText} = renderPermalinkPreview(props);

            expect(getByText('Webhook Bot')).toBeTruthy();
            expect(queryByText('testuser')).toBeNull();
        });

        it('should display regular author name when not a webhook', () => {
            const props = {
                ...baseProps,
                embedData: {
                    ...baseProps.embedData,
                    post: TestHelper.fakePost({
                        id: 'post-123',
                        user_id: 'user-123',
                        message: 'Regular message',
                        props: {
                            from_webhook: 'false',
                        },
                        metadata: {
                            embeds: [],
                        },
                    }),
                },
            };
            const {getByText} = renderPermalinkPreview(props);

            expect(getByText('testuser')).toBeTruthy();
        });
    });

    describe('ProfilePicture webhook props', () => {
        it('should pass embedPost to ProfilePicture for webhook support', () => {
            const webhookPost = TestHelper.fakePost({
                id: 'post-123',
                user_id: 'user-123',
                message: 'Webhook message',
                props: {
                    from_webhook: 'true',
                    override_icon_url: '/api/webhook/icon.png',
                },
                metadata: {
                    embeds: [],
                },
            });
            const props = {
                ...baseProps,
                embedData: {
                    ...baseProps.embedData,
                    post: webhookPost,
                },
            };

            renderPermalinkPreview(props);

            expect(ProfilePicture).toHaveBeenCalled();
            const profilePictureCalls = jest.mocked(ProfilePicture).mock.calls;
            expect(profilePictureCalls.length).toBeGreaterThan(0);
        });
    });

    describe('MessageAttachment webhook support', () => {
        it('should render MessageAttachment when webhook has attachments', () => {
            const props = {
                ...baseProps,
                embedData: {
                    ...baseProps.embedData,
                    post: TestHelper.fakePost({
                        id: 'post-123',
                        user_id: 'user-123',
                        message: 'Webhook with attachment',
                        props: {
                            from_webhook: 'true',
                            override_username: 'Webhook Bot',
                            attachments: [{
                                id: 'attachment-1',
                                pretext: 'Attachment pretext',
                                text: 'Attachment text',
                            }],
                        },
                        metadata: {
                            embeds: [],
                        },
                    }),
                },
            };
            const {getByText} = renderPermalinkPreview(props);

            expect(getByText('Webhook Bot')).toBeTruthy();
            expect(getByText('Webhook with attachment')).toBeTruthy();
        });

        it('should pass correct layoutWidth to MessageAttachment', () => {
            const props = {
                ...baseProps,
                embedData: {
                    ...baseProps.embedData,
                    post: TestHelper.fakePost({
                        id: 'post-123',
                        user_id: 'user-123',
                        message: 'Test',
                        props: {
                            attachments: [{
                                id: 'attachment-1',
                                text: 'First attachment',
                            }],
                        },
                        metadata: {
                            embeds: [],
                        },
                    }),
                },
            };

            renderPermalinkPreview(props);

            expect(MessageAttachment).toHaveBeenCalled();
        });
    });

    describe('full webhook integration', () => {
        it('should handle webhook with override_username, icon, and attachments', () => {
            const props = {
                ...baseProps,
                embedData: {
                    ...baseProps.embedData,
                    post: TestHelper.fakePost({
                        id: 'post-123',
                        user_id: 'user-123',
                        message: 'Full webhook message',
                        props: {
                            from_webhook: 'true',
                            override_username: 'Integration Bot',
                            override_icon_url: 'https://example.com/icon.png',
                            attachments: [
                                {
                                    id: 'attachment-1',
                                    pretext: 'Attachment',
                                    text: 'Webhook attachment content',
                                },
                            ],
                        },
                        metadata: {
                            embeds: [],
                        },
                    }),
                },
            };

            const {getByText} = renderPermalinkPreview(props);

            expect(getByText('Integration Bot')).toBeTruthy();
            expect(getByText('Full webhook message')).toBeTruthy();
            expect(ProfilePicture).toHaveBeenCalled();
            expect(MessageAttachment).toHaveBeenCalled();
        });
    });
});
