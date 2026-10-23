// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View} from 'react-native';

import {fetchReferencedPost} from '@actions/remote/permalink';
import Markdown from '@components/markdown';
import ProfilePicture from '@components/post_list/post/profile_picture/profile_picture';
import {Screens} from '@constants';
import DatabaseManager from '@database/manager';
import {renderWithEverything, waitFor} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import EnhancedPermalinkPreview from './index';

import type ServerDataOperator from '@database/operator/server_data_operator';
import type {Database} from '@nozbe/watermelondb';

jest.mock('@actions/remote/permalink', () => ({
    __esModule: true,
    openPermalinkInChannel: jest.fn(),
    fetchReferencedPost: jest.fn(),
}));

jest.mock('@components/markdown', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(Markdown).mockImplementation((props) =>
    React.createElement('Text', {testID: 'markdown'}, props.value),
);

jest.mock('@components/post_list/post/profile_picture/profile_picture', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(ProfilePicture).mockImplementation(() =>
    React.createElement(View, {testID: 'profile-picture'}, null),
);

const serverUrl = 'http://permalink-cross-channel.test';

const buildEmbedData = (referencedPostId: string): PermalinkEmbedData => ({
    post_id: referencedPostId,
    post: TestHelper.fakePost({
        id: referencedPostId,
        user_id: 'author-user',
        message: 'Linked message from another channel',
        create_at: 1234567890000,
        edit_at: 0,
        props: {},
        metadata: {embeds: []},
    }),
    team_name: 'test-team',
    channel_display_name: 'Source Channel',
    channel_type: 'O',
    channel_id: 'source-channel',
});

describe('PermalinkPreview - referenced post missing from local database', () => {
    let database: Database;
    let operator: ServerDataOperator;

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

        // The author of the referenced post: only its id is known through the embed data
        const authorUser = TestHelper.fakeUser({id: 'author-user', username: 'testauthor'});
        await operator.handleUsers({users: [authorUser], prepareRecordsOnly: false});
    });

    afterEach(async () => {
        await DatabaseManager.destroyServerDatabase(serverUrl);
    });

    const renderEnhanced = (embedData: PermalinkEmbedData) => {
        return renderWithEverything(
            <EnhancedPermalinkPreview
                embedData={embedData}
                location={Screens.CHANNEL}
            />,
            {database, serverUrl},
        );
    };

    it('should render the preview card from embed data when the referenced post is not in the local database', async () => {
        const {getByTestId, getByText} = renderEnhanced(buildEmbedData('cross-channel-post-1'));

        await waitFor(() => expect(getByTestId('permalink-preview-container')).toBeTruthy());
        expect(getByText('Linked message from another channel')).toBeTruthy();
    });

    it('should request the referenced post once when it is not in the local database', async () => {
        const embedData = buildEmbedData('cross-channel-post-2');
        const {rerender} = renderEnhanced(embedData);
        rerender(
            <EnhancedPermalinkPreview
                embedData={embedData}
                location={Screens.CHANNEL}
            />,
        );

        await waitFor(() => expect(fetchReferencedPost).toHaveBeenCalledTimes(1));
        expect(fetchReferencedPost).toHaveBeenCalledWith(serverUrl, 'cross-channel-post-2');
    });

    it('should not request the referenced post when it is already in the local database', async () => {
        const referencedPost = TestHelper.fakePost({
            id: 'cross-channel-post-4',
            user_id: 'author-user',
            message: 'Linked message from another channel',
            create_at: 1234567890000,
            edit_at: 0,
            props: {},
            metadata: {embeds: []},
        });
        const models = await operator.handlePosts({
            actionType: 'POSTS.RECEIVED_NEW',
            order: [referencedPost.id],
            posts: [referencedPost],
            prepareRecordsOnly: true,
        });
        await operator.batchRecords(models, 'test');

        const {getByTestId} = renderEnhanced(buildEmbedData('cross-channel-post-4'));

        // Wait for the card to render from the database record before asserting
        // that no fetch was requested (a late fetch would otherwise go unnoticed).
        await waitFor(() => expect(getByTestId('permalink-preview-container')).toBeTruthy());
        expect(fetchReferencedPost).not.toHaveBeenCalled();
    });
});
