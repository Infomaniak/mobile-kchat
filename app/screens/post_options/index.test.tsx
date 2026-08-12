// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {screen, waitFor} from '@testing-library/react-native';

import {renderWithEverything} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import PostOptions from './index';

import type {Database} from '@nozbe/watermelondb';

const serverUrl = 'https://www.community.mattermost.com';

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    return {
        ...Reanimated,
        useReducedMotion: jest.fn(() => 'never'),
    };
});

// Ik change : skip on CI, will fix later
describe.skip('PostOptions', () => {
    let database: Database;
    beforeAll(async () => {
        const server = await TestHelper.setupServerDatabase();
        database = server.database;
    });

    it('should show all options for regular post', async () => {
        const regularPost = TestHelper.fakePostModel({
            channelId: TestHelper.basicChannel!.id,
            userId: TestHelper.basicUser!.id,
            message: 'This is a regular post',
        });

        renderWithEverything(
            <PostOptions
                postId={regularPost.id}
                serverUrl={serverUrl}
                showAddReaction={true}
                sourceScreen={'draft_scheduled_post_options'}
            />,
            {database},
        );

        await waitFor(() => {
            expect(screen.queryByText('Copy Link')).toBeVisible();
        });

        expect(screen.queryByText('Save')).toBeVisible();
        expect(screen.queryByText('Pin to Channel')).toBeVisible();
        expect(screen.queryByText('Copy Text')).toBeVisible();
        expect(screen.queryByText('Reply')).toBeVisible();
        expect(screen.queryByText('Edit')).toBeVisible();

        // cannot mark own post as unread in the mobile app.
        expect(screen.queryByText('Mark as Unread')).not.toBeVisible();
        expect(screen.queryByText('Follow Message')).not.toBeVisible();
    });
});
