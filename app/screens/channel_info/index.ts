// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {distinctUntilChanged, switchMap, combineLatestWith} from 'rxjs/operators';

import {withServerUrl} from '@context/server';
import {observeCurrentChannel} from '@queries/servers/channel';
import {observeCanAddBookmarks} from '@queries/servers/channel_bookmark';
import {observeCanManageChannelMembers, observeCanManageChannelSettings} from '@queries/servers/role';
import {
    observeConfigBooleanValue,
    observeConfigValue,
} from '@queries/servers/system';
import {observeIsCRTEnabled} from '@queries/servers/thread';
import {observeCurrentUser} from '@queries/servers/user';
import {isMinimumServerVersion} from '@utils/helpers';

import ChannelInfo from './channel_info';

import type {WithDatabaseArgs} from '@typings/database/database';

type Props = WithDatabaseArgs & {
    serverUrl: string;
}

const enhanced = withObservables([], ({database}: Props) => {
    const channel = observeCurrentChannel(database);
    const type = channel.pipe(switchMap((c) => of$(c?.type)));
    const channelId = channel.pipe(switchMap((c) => of$(c?.id || '')));
    const currentUser = observeCurrentUser(database);
    const serverVersion = observeConfigValue(database, 'Version');

    const canManageMembers = currentUser.pipe(
        combineLatestWith(channelId),
        switchMap(([u, cId]) => (u ? observeCanManageChannelMembers(database, cId, u) : of$(false))),
        distinctUntilChanged(),
    );

    const canManageSettings = currentUser.pipe(
        combineLatestWith(channelId),
        switchMap(([u, cId]) => (u ? observeCanManageChannelSettings(database, cId, u) : of$(false))),
        distinctUntilChanged(),
    );

    const isGuestUser = currentUser.pipe(
        switchMap((u) => (u ? of$(u.isGuest) : of$(false))),
        distinctUntilChanged(),
    );

    const isConvertGMFeatureAvailable = serverVersion.pipe(
        switchMap((version) => of$(isMinimumServerVersion(version || '', 9, 1))),
    );

    const isBookmarksEnabled = observeConfigBooleanValue(database, 'FeatureFlagChannelBookmarks');

    const canAddBookmarks = channelId.pipe(
        switchMap((cId) => {
            return observeCanAddBookmarks(database, cId);
        }),
    );

    return {
        type,
        canAddBookmarks,
        canManageMembers,
        canManageSettings,
        isBookmarksEnabled,
        isCRTEnabled: observeIsCRTEnabled(database),
        isGuestUser,
        isConvertGMFeatureAvailable,
    };
});

export default withDatabase(withServerUrl(enhanced(ChannelInfo)));
