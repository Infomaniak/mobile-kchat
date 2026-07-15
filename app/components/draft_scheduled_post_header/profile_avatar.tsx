// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {StyleSheet} from 'react-native';

import Avatar from '@components/avatar';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    author: UserModel;
}

const styles = StyleSheet.create({
    avatarContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: 20,
        height: 20,
    },
    avatar: {
        height: 20,
        width: 20,
    },
    avatarRadius: {
        borderRadius: 18,
    },
});

const ProfileAvatar = ({
    author,
}: Props) => {
    return (
        <Avatar
            author={author}
            containerStyle={[styles.avatarContainer, styles.avatarRadius]}
            imageStyle={[styles.avatar, styles.avatarRadius]}
            size={20}
            testID='draft_scheduled_post.profile_avatar'
        />
    );
};

export default ProfileAvatar;
