// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {combineLatest, Observable, of as of$} from 'rxjs';
import {distinctUntilChanged, switchMap, combineLatestWith} from 'rxjs/operators';

import {observeIsCallsEnabledInChannel} from '@calls/observers';
import {General, Permissions} from '@constants';
import {withServerUrl} from '@context/server';
import {observeCurrentChannel} from '@queries/servers/channel';
import {observeCanManageChannelMembers, observeCanManageChannelSettings, observePermissionForChannel, observePermissionForTeam} from '@queries/servers/role';
import {
    observeConfigValue,
    observeCurrentChannelId,
} from '@queries/servers/system';
import {observeCurrentTeam} from '@queries/servers/team';
import {observeIsCRTEnabled} from '@queries/servers/thread';
import {observeCurrentUser} from '@queries/servers/user';
import {isDefaultChannel} from '@utils/channel';

import ChannelInfo from './channel_info';

import type {Database} from '@nozbe/watermelondb';
import type {WithDatabaseArgs} from '@typings/database/database';
import type ChannelModel from '@typings/database/models/servers/channel';
import type UserModel from '@typings/database/models/servers/user';

type Props = WithDatabaseArgs & {
    serverUrl: string;
}

const observeHasChannelSettingsActions = (
    database: Database,
    serverUrl: string,
    channelId: Observable<string>,
    channel: Observable<ChannelModel | undefined>,
    currentUser: Observable<UserModel | undefined>,
    type: Observable<ChannelType | undefined>,
) => {
    const canManageSettings = currentUser.pipe(
        combineLatestWith(channelId),
        switchMap(([u, cId]) => (u ? observeCanManageChannelSettings(database, cId, u) : of$(false))),
        distinctUntilChanged(),
    );

    const isGuestUser = currentUser.pipe(
        switchMap((u) => (u ? of$(u.isGuest) : of$(false))),
        distinctUntilChanged(),
    );

    const isConvertGMFeatureAvailable = observeConfigValue(database, 'Version').pipe(
        switchMap(() => of$(true)),
    );

    const team = observeCurrentTeam(database);
    const isArchived = channel.pipe(switchMap((c) => of$((c?.deleteAt || 0) > 0)));
    const canLeave = channel.pipe(
        combineLatestWith(currentUser),
        switchMap(([ch, u]) => {
            const isDC = isDefaultChannel(ch);
            return of$(!isDC || (isDC && u?.isGuest));
        }),
    );

    const canConvert = channel.pipe(
        combineLatestWith(currentUser),
        switchMap(([ch, u]) => {
            if (!ch || !u || isDefaultChannel(ch)) {
                return of$(false);
            }
            if (ch.type !== General.OPEN_CHANNEL) {
                return of$(false);
            }
            return observePermissionForChannel(database, ch, u, Permissions.CONVERT_PUBLIC_CHANNEL_TO_PRIVATE, false);
        }),
    );

    const canArchive = channel.pipe(
        combineLatestWith(currentUser, canLeave, isArchived, type),
        switchMap(([ch, u, leave, archived, chType]) => {
            if (
                chType === General.DM_CHANNEL || chType === General.GM_CHANNEL ||
                !ch || !u || !leave || archived
            ) {
                return of$(false);
            }

            if (chType === General.OPEN_CHANNEL) {
                return observePermissionForChannel(database, ch, u, Permissions.DELETE_PUBLIC_CHANNEL, true);
            }

            return observePermissionForChannel(database, ch, u, Permissions.DELETE_PRIVATE_CHANNEL, true);
        }),
    );

    const canUnarchive = team.pipe(
        combineLatestWith(currentUser, isArchived, type),
        switchMap(([t, u, archived, chType]) => {
            if (
                chType === General.DM_CHANNEL || chType === General.GM_CHANNEL ||
                !t || !u || !archived
            ) {
                return of$(false);
            }

            return observePermissionForTeam(database, t, u, Permissions.MANAGE_TEAM, false);
        }),
    );

    const convertGMOptionAvailable = combineLatest([isConvertGMFeatureAvailable, type, isGuestUser]).pipe(
        switchMap(([available, chType, guest]) => of$(available && chType === General.GM_CHANNEL && !guest)),
    );

    // Check if any channel_settings action is available
    const hasChannelSettingsActions = combineLatest([
        canManageSettings,
        canConvert,
        canArchive,
        canUnarchive,

        // canEnableDisableCalls,
        convertGMOptionAvailable,
    ]).pipe(
        switchMap(([manageSettings, convert, archive, unarchive, convertGM]) => {
            return of$(
                manageSettings || // Channel info
                convert || // Convert to private
                archive || unarchive || // Archive channel
                convertGM, // Convert GM to channel
            );
        }),
    );

    return hasChannelSettingsActions;
};

const enhanced = withObservables([], ({serverUrl, database}: Props) => {
    const channel = observeCurrentChannel(database);
    const type = channel.pipe(switchMap((c) => of$(c?.type)));
    const channelId = channel.pipe(switchMap((c) => of$(c?.id || '')));

    const currentUser = observeCurrentUser(database);

    const isCallsEnabledInChannel = observeIsCallsEnabledInChannel(observeCurrentChannelId(database), channel);

    const canManageMembers = currentUser.pipe(
        combineLatestWith(channelId),
        switchMap(([u, cId]) => (u ? observeCanManageChannelMembers(database, cId, u) : of$(false))),
        distinctUntilChanged(),
    );

    return {
        type,
        isCallsEnabledInChannel,
        canManageMembers,
        isCRTEnabled: observeIsCRTEnabled(database),
        hasChannelSettingsActions: observeHasChannelSettingsActions(database, serverUrl, channelId, channel, currentUser, type),
    };
});

export default withDatabase(withServerUrl(enhanced(ChannelInfo)));
