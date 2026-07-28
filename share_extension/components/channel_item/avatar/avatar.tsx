// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View} from 'react-native';

import Avatar from '@components/avatar';
import CompassIcon from '@components/compass_icon';
import {useShareExtensionServerUrl} from '@share/state';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    author?: UserModel;
    theme: Theme;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {marginLeft: 4},
    icon: {
        color: changeOpacity(theme.centerChannelColor, 0.72),
        left: 1,
    },
    image: {
        borderRadius: 12,
        height: 24,
        width: 24,
    },
    archiveOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: changeOpacity(theme.centerChannelBg, 0.72),
    },
}));

const ShareExtensionAvatar = ({author, theme}: Props) => {
    const serverUrl = useShareExtensionServerUrl();
    const style = getStyleSheet(theme);

    const isDeleted = Boolean(author?.deleteAt);

    const archiveOverlay = isDeleted ? (
        <View style={style.archiveOverlay}>
            <CompassIcon
                name='archive-outline'
                size={16}
                style={{color: '#FFFFFF'}}
            />
        </View>
    ) : null;

    return (
        <Avatar
            author={author}
            containerStyle={style.container}
            fallbackChildren={archiveOverlay}
            imageStyle={style.image}
            serverUrl={serverUrl}
            size={24}
            textColor={style.icon.color}
            theme={theme}
            testID='share_extension.channel_item.avatar'
        />
    );
};

export default ShareExtensionAvatar;
