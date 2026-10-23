// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View} from 'react-native';

import ProfilePictureImage from '@components/profile_picture/image';
import {renderWithIntl} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import ProfilePictureMessage from './profile_picture';

jest.mock('@components/profile_picture/image', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(ProfilePictureImage).mockImplementation(() =>
    React.createElement(View, {testID: 'profile-picture-image'}, null),
);

describe('ProfilePictureMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should pass the user id and picture timestamp of an embedded post to the shared avatar image', () => {
        const post = TestHelper.fakePost({
            id: 'post-id-1',
            user_id: 'author-user',
        });

        renderWithIntl(<ProfilePictureMessage author={post}/>);

        expect(ProfilePictureImage).toHaveBeenCalledTimes(1);
        const props = jest.mocked(ProfilePictureImage).mock.calls[0][0];
        expect(props.author?.id).toBe('author-user');
        expect(props.size).toBe(30);
    });

    it('should keep the database user id when a user model is provided', () => {
        const user = TestHelper.fakeUserModel({id: 'author-user', lastPictureUpdate: 1234});

        renderWithIntl(<ProfilePictureMessage author={user}/>);

        expect(ProfilePictureImage).toHaveBeenCalledTimes(1);
        const props = jest.mocked(ProfilePictureImage).mock.calls[0][0];
        expect(props.author?.id).toBe('author-user');
    });

    it('should render the webhook icon for a webhook post without an override icon', () => {
        const post = TestHelper.fakePost({
            user_id: 'author-user',
            props: {from_webhook: 'true'},
        });

        const {queryByTestId} = renderWithIntl(<ProfilePictureMessage author={post}/>);

        expect(ProfilePictureImage).not.toHaveBeenCalled();
        expect(queryByTestId('profile-picture-image')).toBeNull();
    });

    it('should render nothing without an author', () => {
        const {queryByTestId} = renderWithIntl(<ProfilePictureMessage author={undefined}/>);

        expect(ProfilePictureImage).not.toHaveBeenCalled();
        expect(queryByTestId('profile-picture-image')).toBeNull();
    });
});
