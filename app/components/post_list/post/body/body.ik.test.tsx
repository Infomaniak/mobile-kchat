// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Preferences, Screens} from '@constants';
import {PostTypes} from '@constants/post';
import {renderWithIntlAndTheme} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import Body from './body';

import type PostModel from '@typings/database/models/servers/post';

jest.mock('@components/files/voice_recording_file/remote_playback', () => {
    const {Text} = require('react-native');
    return {
        __esModule: true,
        // eslint-disable-next-line react/jsx-no-literals
        default: () => <Text testID='remote-playback'>RemotePlayback</Text>,
    };
});

jest.mock('@components/files', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

jest.mock('./acknowledgements', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

jest.mock('./add_members', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

jest.mock('./content', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

jest.mock('./failed', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

jest.mock('./message', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

jest.mock('./reactions', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

jest.mock('@playbooks/components/status_update_post', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

const baseProps = {
    appsEnabled: false,
    hasFiles: false,
    hasReactions: false,
    highlight: false,
    highlightReplyBar: false,
    isEphemeral: false,
    isJumboEmoji: false,
    isPendingOrFailed: false,
    isPostAddChannelMember: false,
    location: Screens.CHANNEL,
    searchPatterns: undefined,
    showAddReaction: false,
    theme: Preferences.THEMES.denim,
};

function fakePostModel(overrides?: Partial<PostModel>): PostModel {
    const post = TestHelper.fakePost();
    return {
        ...post,
        deleteAt: 0,
        rootId: '',
        ...overrides,
    } as unknown as PostModel;
}

describe('Body - IK voice message feature', () => {
    it('should render RemotePlayback when voiceMessageEnabled is true and post type is VOICE_MESSAGE', () => {
        const post = fakePostModel({type: PostTypes.VOICE_MESSAGE as Post['type'], message: ''});

        const {getByTestId} = renderWithIntlAndTheme(
            <Body
                {...baseProps}
                post={post}
                voiceMessageEnabled={true}
            />,
        );

        expect(getByTestId('remote-playback')).toBeTruthy();
    });

    it('should not render RemotePlayback when voiceMessageEnabled is false', () => {
        const post = fakePostModel({type: PostTypes.VOICE_MESSAGE as Post['type'], message: ''});

        const {queryByTestId} = renderWithIntlAndTheme(
            <Body
                {...baseProps}
                post={post}
                voiceMessageEnabled={false}
            />,
        );

        expect(queryByTestId('remote-playback')).toBeNull();
    });

    it('should not render RemotePlayback for regular post even when voiceMessageEnabled is true', () => {
        const post = fakePostModel({message: 'hello'});

        const {queryByTestId} = renderWithIntlAndTheme(
            <Body
                {...baseProps}
                post={post}
                voiceMessageEnabled={true}
            />,
        );

        expect(queryByTestId('remote-playback')).toBeNull();
    });
});
