// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import RNUtils from '@mattermost/rnutils';
import {useDatabase} from '@nozbe/watermelondb/react';
import {useEffect, useState} from 'react';
import {PixelRatio, type ImageSourcePropType} from 'react-native';

import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {observeCurrentUser} from '@queries/servers/user';
import {logDebug} from '@utils/log';
import {extractDisplayName, getAvatarColor, getInitialsFromName, getLastPictureUpdate} from '@utils/user';

import type UserModel from '@typings/database/models/servers/user';

// Standard tab icon size on iOS, matching the other tab icons. The selected
// variant is rendered 2pt larger so the ring can be stroked over the avatar's
// edge, like the kDrive tab bar profile icon.
const AVATAR_TAB_ICON_SIZE = 28;
const AVATAR_TAB_SELECTED_ICON_SIZE = AVATAR_TAB_ICON_SIZE + 2;

export type TabAvatarSource = {
    default?: ImageSourcePropType;
    selected?: ImageSourcePropType;
};

// Renders the current user's avatar the way ProfilePicture does (circular
// photo, initials on a colored circle as fallback) into a PNG data URI that
// the native tab bar can use as icon. ringColor draws a selection ring around
// the avatar, matching the selected state of the other tab icons.
const renderAvatarSource = async (user: UserModel, serverUrl: string, size: number, ringColor?: string): Promise<ImageSourcePropType | undefined> => {
    const client = NetworkManager.getClient(serverUrl);
    if (!client) {
        logDebug('[useCurrentUserAvatar] skipping avatar source, no client yet');
        return undefined;
    }

    const pictureUrl = client.getProfilePictureUrl(user.id, getLastPictureUpdate(user));
    try {
        const dataUri = await RNUtils.renderTabAvatar({
            uri: `${serverUrl}${pictureUrl}`,
            headers: {Authorization: client.getCurrentBearerToken()},
            size,
            initials: getInitialsFromName(extractDisplayName(user)),
            backgroundColor: getAvatarColor(user.id),
            ...(ringColor ? {ringColor} : {}),
        });

        if (!dataUri) {
            return undefined;
        }

        // The PNG is rendered at the device pixel density: declare its point
        // size and scale so the tab bar displays it at the standard icon size.
        const scale = PixelRatio.get();
        return {uri: dataUri, width: size, height: size, scale};
    } catch (error) {
        logDebug('[useCurrentUserAvatar] renderTabAvatar failed', error);
        return undefined;
    }
};

// Renders both icon variants: a plain avatar for the unselected state and one
// with a selection ring for the selected state, like the other tab icons. The
// selected variant is applied from the focused route because the native tab
// bar does not reliably swap back from its selected image.
const renderAvatarSources = async (user: UserModel, serverUrl: string, selectedColor?: string): Promise<TabAvatarSource | undefined> => {
    const defaultSource = await renderAvatarSource(user, serverUrl, AVATAR_TAB_ICON_SIZE);
    const selectedSource = selectedColor ? await renderAvatarSource(user, serverUrl, AVATAR_TAB_SELECTED_ICON_SIZE, selectedColor) : undefined;
    if (!defaultSource && !selectedSource) {
        return undefined;
    }

    return {default: defaultSource, selected: selectedSource};
};

const useCurrentUserAvatar = (): TabAvatarSource | undefined => {
    const database = useDatabase();
    const serverUrl = useServerUrl();
    const theme = useTheme();
    const [source, setSource] = useState<TabAvatarSource | undefined>();

    useEffect(() => {
        const subscription = observeCurrentUser(database).subscribe((user?: UserModel) => {
            if (!user) {
                logDebug('[useCurrentUserAvatar] skipping avatar source, no user yet');
                setSource(undefined);
                return;
            }

            renderAvatarSources(user, serverUrl, theme.buttonBg).then(setSource);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [database, serverUrl, theme.buttonBg]);

    return source;
};

export default useCurrentUserAvatar;
