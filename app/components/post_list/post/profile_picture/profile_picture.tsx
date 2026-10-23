// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {type ImageSource, Image} from 'expo-image';
import React from 'react';
import {View} from 'react-native';

import CompassIcon from '@components/compass_icon';
import ProfilePictureImage from '@components/profile_picture/image';
import {useServerUrl} from '@context/server';
import NetworkManager from '@managers/network_manager';

import type UserModel from '@typings/database/models/servers/user';

type ProfilePictureProps = {
    author: UserModel | UserProfile | Post | undefined;
    size?: number;
    source?: ImageSource;
};

const AVATAR_MARGIN = {marginRight: 8};

// Accepts a user model (bare permalink previews resolve one from the database) or an
// embedded API post (which carries user_id instead of id and no picture timestamp)
// and renders the shared avatar image with the rotating avatar cache id.
export const ProfilePictureMessage = ({author, size = 30, source}: ProfilePictureProps) => {
    const serverUrl = useServerUrl();

    if (!author) {
        return null;
    }

    const postProps = 'props' in author ? author.props : undefined;
    const overrideIconUrl = typeof postProps?.override_icon_url === 'string' ? postProps.override_icon_url : undefined;
    const fromWebhook = postProps?.from_webhook === 'true';

    if (fromWebhook && overrideIconUrl && !overrideIconUrl.startsWith('/')) {
        return (
            <Image
                key={overrideIconUrl}
                source={{uri: overrideIconUrl}}
                style={[{width: size, height: size, borderRadius: size / 2}, AVATAR_MARGIN]}
            />
        );
    }

    if (fromWebhook && !overrideIconUrl) {
        return (
            <CompassIcon
                name='webhook'
                size={size}
                style={AVATAR_MARGIN}
            />
        );
    }

    if (overrideIconUrl?.startsWith('/')) {
        let client: ReturnType<typeof NetworkManager.getClient>;
        try {
            client = NetworkManager.getClient(serverUrl);
        } catch {
            // No client for this server (e.g. logout in progress): no way to build
            // an authorized request for a server-relative override icon.
            return null;
        }

        return (
            <Image
                key={overrideIconUrl}
                source={{
                    uri: `${serverUrl}${overrideIconUrl}`,
                    headers: {
                        Authorization: client.getCurrentBearerToken(),
                    },
                }}
                style={[{width: size, height: size, borderRadius: size / 2}, AVATAR_MARGIN]}
            />
        );
    }

    const userId = 'user_id' in author && author.user_id ? author.user_id : author.id;

    // Embedded posts carry user_id and none of the profile display fields the shared
    // image reads; the avatar URL and cache id only need the user id and the picture
    // timestamp, which the spread preserves when present.
    return (
        <View style={AVATAR_MARGIN}>
            <ProfilePictureImage
                author={{...author, id: userId} as UserProfile}
                size={size}
                source={source}
            />
        </View>
    );
};

export default ProfilePictureMessage;
