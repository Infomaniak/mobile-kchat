// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {Image as RNImage} from 'react-native';
import FastImage, {type Source} from 'react-native-fast-image';
import Animated from 'react-native-reanimated';

import CompassIcon from '@app/components/compass_icon';
import {useServerUrl} from '@context/server';
import NetworkManager from '@managers/network_manager';

import type {Client} from '@client/rest';

type ProfilePictureProps = {
    author: any;
    source?: Source;
}
const AnimatedImage = Animated.createAnimatedComponent(RNImage);

export const ProfilePictureMessage = ({author, source}: ProfilePictureProps) => {
    let client: Client | undefined;
    const serverUrl = useServerUrl();

    try {
        client = NetworkManager.getClient(serverUrl);
    } catch {
        // handle below that the client is not set
    }
    if (author && client) {
        let pictureUrl = null;

        if (author.props && author.props.override_icon_url?.startsWith('/')) {
            pictureUrl = author.props.override_icon_url;
        } else if (author.props && author.props.from_webhook && author.props.override_icon_url == null) {
            return (
                <CompassIcon
                    name='webhook'
                    size={32}
                />
            );
        } else {
            pictureUrl = client.getProfilePictureUrl(author.user_id, 0);
        }

        const imgSource = source ?? {
            uri: `${serverUrl}${pictureUrl}`,
            headers: {
                Authorization: client.getCurrentBearerToken(),
            },
        };
        if (imgSource.uri?.startsWith('file://')) {
            return (
                <AnimatedImage
                    key={pictureUrl}
                    source={{uri: imgSource.uri}}
                />
            );
        }

        return (
            <FastImage
                key={pictureUrl}
                source={imgSource}
                style={{width: 30, height: 30, borderRadius: 50, marginRight: 8}}
            />
        );
    }
    return null;
};

export default ProfilePictureMessage;
