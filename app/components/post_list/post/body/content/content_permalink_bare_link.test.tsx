// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View} from 'react-native';

import {fetchReferencedPost} from '@actions/remote/permalink';
import Markdown from '@components/markdown';
import ProfilePicture from '@components/post_list/post/profile_picture/profile_picture';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import DatabaseManager from '@database/manager';
import {renderWithEverything, waitFor} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import EnhancedContent from '.';

import type ServerDataOperator from '@database/operator/server_data_operator';
import type {Database} from '@nozbe/watermelondb';
import type PostModel from '@typings/database/models/servers/post';

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

const serverUrl = 'http://permalink-bare-link.test';
const referencedPostId = '018f6d0a-1234-4abc-9def-0123456789ab';
const barePermalinkMessage = `https://permalink-bare.link.test/myteam/pl/${referencedPostId}`;

const ThemedContent = (props: Omit<React.ComponentProps<typeof EnhancedContent>, 'theme'>) => {
    const theme = useTheme();
    return (
        <EnhancedContent
            {...props}
            theme={theme}
        />
    );
};

describe('Content - bare permalink message without embeds', () => {
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

        const authorUser = TestHelper.fakeUser({id: 'author-user', username: 'testauthor'});
        await operator.handleUsers({users: [authorUser], prepareRecordsOnly: false});

        await operator.handleChannel({
            channels: [TestHelper.fakeChannel({
                id: 'channel-id',
                name: 'boris_trombert',
                display_name: 'boris.trombert (vous)',
                type: 'D',
            })],
            prepareRecordsOnly: false,
        });
    });

    afterEach(async () => {
        await DatabaseManager.destroyServerDatabase(serverUrl);
    });

    const createBarePermalinkPost = async (message: string) => {
        const models = await operator.handlePosts({
            actionType: 'POSTS.RECEIVED_NEW',
            order: ['referencing-post'],
            posts: [TestHelper.fakePost({
                id: 'referencing-post',
                channel_id: 'channel-id',
                user_id: 'current-user',
                message,
                metadata: {embeds: []},
            })],
            prepareRecordsOnly: true,
        });
        await operator.batchRecords(models, 'test');
        return database.get<PostModel>('Post').find('referencing-post');
    };

    const renderContent = (post: PostModel) => {
        return renderWithEverything(
            <ThemedContent
                post={post}
                isReplyPost={false}
                location={Screens.CHANNEL}
            />,
            {database, serverUrl},
        );
    };

    it('should render the preview card from the local post when the message is a bare permalink without embeds', async () => {
        await operator.handlePosts({
            actionType: 'POSTS.RECEIVED_NEW',
            order: [referencedPostId],
            posts: [TestHelper.fakePost({
                id: referencedPostId,
                channel_id: 'channel-id',
                user_id: 'author-user',
                message: 'Linked message content',
                create_at: 1234567890000,
                edit_at: 0,
                metadata: {embeds: []},
            })],
            prepareRecordsOnly: true,
        }).then((models) => operator.batchRecords(models, 'test-referenced'));
        const post = await createBarePermalinkPost(barePermalinkMessage);

        const {getByTestId, getByText} = renderContent(post);

        await waitFor(() => expect(getByTestId('permalink-preview-container')).toBeTruthy());
        expect(getByText('Linked message content')).toBeTruthy();
        expect(getByText('~testauthor')).toBeTruthy();
        expect(fetchReferencedPost).not.toHaveBeenCalled();
    });

    it('should request the referenced post when a bare permalink message references a post missing from the database', async () => {
        const post = await createBarePermalinkPost(barePermalinkMessage);

        renderContent(post);

        await waitFor(() => expect(fetchReferencedPost).toHaveBeenCalledTimes(1));
        expect(fetchReferencedPost).toHaveBeenCalledWith(serverUrl, referencedPostId);
    });

    it('should request the referenced post for a bare permalink on a server deployed under a subpath', async () => {
        const post = await createBarePermalinkPost(`https://permalink-bare.link.test/subpath/myteam/pl/${referencedPostId}`);

        renderContent(post);

        await waitFor(() => expect(fetchReferencedPost).toHaveBeenCalledTimes(1));
        expect(fetchReferencedPost).toHaveBeenCalledWith(serverUrl, referencedPostId);
    });

    it('should not render a preview when the message is not a bare permalink and has no embeds', async () => {
        const post = await createBarePermalinkPost(`look at this https://permalink-bare.link.test/myteam/pl/${referencedPostId}`);

        const {queryByTestId} = renderContent(post);

        expect(queryByTestId('permalink-preview-container')).toBeNull();
        expect(fetchReferencedPost).not.toHaveBeenCalled();
    });
});
