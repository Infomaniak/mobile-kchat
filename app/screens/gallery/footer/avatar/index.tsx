// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {StyleSheet} from 'react-native';

import Avatar from '@components/avatar';
import {urlSafeBase64Encode} from '@utils/security';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    author?: UserModel;
    overrideIconUrl?: string;
}

const styles = StyleSheet.create({
    avatarContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        margin: 2,
        width: 32,
        height: 32,
    },
    avatar: {
        height: 32,
        width: 32,
    },
    avatarRadius: {
        borderRadius: 18,
    },
});

const GalleryFooterAvatar = ({
    author,
    overrideIconUrl,
}: Props) => {
    const overrideUriId = overrideIconUrl ? `avatar-override-${urlSafeBase64Encode(overrideIconUrl)}` : undefined;

    return (
        <Avatar
            author={author}
            containerStyle={[styles.avatarContainer, styles.avatarRadius]}
            imageStyle={[styles.avatar, styles.avatarRadius]}
            overrideUri={overrideIconUrl}
            overrideUriId={overrideUriId}
            size={32}
            testID='gallery.footer.avatar'
        />
    );
};

export default GalleryFooterAvatar;
