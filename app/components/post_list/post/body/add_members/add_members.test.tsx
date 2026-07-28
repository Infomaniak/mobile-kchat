// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Preferences, Screens} from '@constants';
import {renderWithIntlAndTheme} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import ChannelMemberMention from './add_members';

import type PostModel from '@typings/database/models/servers/post';

jest.mock('@components/markdown/at_mention', () => {
    const {Text: RNText} = require('react-native');
    return {
        __esModule: true,
        default: ({mentionName}: {mentionName: string}) => <RNText>{'@'}{mentionName}</RNText>,
    };
});

function fakePostModel(overrides?: Partial<PostModel>): PostModel {
    const post = TestHelper.fakePost();
    return {
        ...post,
        deleteAt: 0,
        rootId: '',
        ...overrides,
    } as unknown as PostModel;
}

const baseProps = {
    location: Screens.CHANNEL,
    theme: Preferences.THEMES.denim,
};

describe('ChannelMemberMention', () => {
    it('should render add member actions for normal add_channel_member prop', () => {
        const post = fakePostModel({
            props: {
                add_channel_member: {
                    post_id: 'post1',
                    not_in_channel_usernames: ['alice'],
                    not_in_channel_user_ids: ['user1'],
                },
            },
        });

        const {getByText} = renderWithIntlAndTheme(
            <ChannelMemberMention
                {...baseProps}
                post={post}
                channelType='P'
            />,
        );

        expect(getByText('add them to this private channel')).toBeTruthy();
    });

    it('should not render links in ask mode for public channel', () => {
        const post = fakePostModel({
            props: {
                ask_add_channel_member: {
                    post_id: 'post1',
                    not_in_channel_usernames: ['alice'],
                    not_in_channel_user_ids: ['user1'],
                },
            },
        });

        const {queryByText} = renderWithIntlAndTheme(
            <ChannelMemberMention
                {...baseProps}
                post={post}
                channelType='O'
            />,
        );

        expect(queryByText('add them to the channel')).toBeNull();
    });

    it('should render ask admin message for ask mode in private channel', () => {
        const post = fakePostModel({
            props: {
                ask_add_channel_member: {
                    post_id: 'post1',
                    not_in_channel_usernames: ['alice'],
                    not_in_channel_user_ids: ['user1'],
                },
            },
        });

        const {getByText} = renderWithIntlAndTheme(
            <ChannelMemberMention
                {...baseProps}
                post={post}
                channelType='P'
            />,
        );

        expect(getByText(/private channel/)).toBeTruthy();
    });

    it('should render groups message in ask mode', () => {
        const post = fakePostModel({
            props: {
                ask_add_channel_member: {
                    post_id: 'post1',
                    not_in_channel_usernames: ['alice'],
                    not_in_channel_user_ids: ['user1'],
                    not_in_groups_usernames: ['bob'],
                },
            },
        });

        const {getAllByText} = renderWithIntlAndTheme(
            <ChannelMemberMention
                {...baseProps}
                post={post}
                channelType='P'
            />,
        );

        const messages = getAllByText(/private channel/);
        expect(messages.length).toBe(2);
    });
});
