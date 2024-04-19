// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DeviceEventEmitter} from 'react-native';

import {updateChannelsDisplayName} from '@actions/local/channel';
import {fetchChannelStats} from '@actions/remote/channel';
import {fetchMe, fetchUsersByIds} from '@actions/remote/user';
import {Events, General, Preferences} from '@constants';
import DatabaseManager from '@database/manager';
import {getTeammateNameDisplaySetting} from '@helpers/api/preference';
import WebsocketManager from '@managers/websocket_manager';
import {getCurrentChannel, queryChannelMembers, queryChannelsByTypes, queryUserChannelsByTypes} from '@queries/servers/channel';
import {queryDisplayNamePreferences} from '@queries/servers/preference';
import {getConfig, getLicense} from '@queries/servers/system';
import {getCurrentUser, getUserById} from '@queries/servers/user';
import {displayUsername, isGuest} from '@utils/user';

import type {Model} from '@nozbe/watermelondb';

export async function handleUserUpdatedEvent(serverUrl: string, msg: WebSocketMessage) {
    const operator = DatabaseManager.serverDatabases[serverUrl]?.operator;
    if (!operator) {
        return;
    }

    const {database} = operator;
    const currentUser = await getCurrentUser(database);
    if (!currentUser) {
        return;
    }

    const user: UserProfile = msg.data.user;
    const modelsToBatch: Model[] = [];
    let userToSave = user;

    if (user.id === currentUser.id) {
        if (user.update_at > (currentUser?.updateAt || 0)) {
            // ESR: 6.5
            if (!user.notify_props || !Object.keys(user.notify_props).length) {
                // Current user is sanitized so we fetch it from the server
                // Need to request me to make sure we don't override with sanitized fields from the
                // websocket event
                const me = await fetchMe(serverUrl, true);
                if (me.user) {
                    userToSave = me.user;
                }
            }

            // Update GMs display name if locale has changed
            if (user.locale !== currentUser.locale) {
                const channels = await queryChannelsByTypes(database, [General.GM_CHANNEL]).fetch();
                if (channels.length) {
                    const {models} = await updateChannelsDisplayName(serverUrl, channels, [user], true);
                    if (models?.length) {
                        modelsToBatch.push(...models);
                    }
                }
            }
        }
    } else {
        const channels = await queryUserChannelsByTypes(database, user.id, [General.DM_CHANNEL, General.GM_CHANNEL]).fetch();

        if (isGuest(user.roles)) {
            const currentChannel = await getCurrentChannel(database);

            if (!currentChannel) {
                return;
            }

            const channelMembers = await queryChannelMembers(database, currentChannel.id);
            const isInChannel = await channelMembers.some((m) => m.userId === user.id);
            const databaseUser = await getUserById(database, user.id);

            if (isInChannel && (!databaseUser || databaseUser.deleteAt !== user.delete_at) && [General.OPEN_CHANNEL, General.PRIVATE_CHANNEL].includes(currentChannel.type as any)) {
                await fetchChannelStats(serverUrl, currentChannel.id);
            }
        }

        if (channels.length) {
            const {models} = await updateChannelsDisplayName(serverUrl, channels, [user], true);
            if (models?.length) {
                modelsToBatch.push(...models);
            }
        }
    }

    const userModel = await operator.handleUsers({users: [userToSave], prepareRecordsOnly: true});
    modelsToBatch.push(...userModel);

    try {
        await operator.batchRecords(modelsToBatch, 'handleUserUpdatedEvent');
    } catch {
        // do nothing
    }
}

export async function handleUserTypingEvent(serverUrl: string, msg: WebSocketMessage) {
    const currentServerUrl = await DatabaseManager.getActiveServerUrl();
    if (currentServerUrl === serverUrl) {
        const database = DatabaseManager.serverDatabases[serverUrl]?.database;
        if (!database) {
            return;
        }

        const license = await getLicense(database);
        const config = await getConfig(database);

        const {users, existingUsers} = await fetchUsersByIds(serverUrl, [msg.data.data.user_id]);
        const user = users?.[0] || existingUsers?.[0];

        const namePreference = await queryDisplayNamePreferences(database, Preferences.NAME_NAME_FORMAT).fetch();
        const teammateDisplayNameSetting = getTeammateNameDisplaySetting(namePreference, config.LockTeammateNameDisplay, config.TeammateNameDisplay, license);
        const currentUser = await getCurrentUser(database);
        const username = displayUsername(user, currentUser?.locale, teammateDisplayNameSetting);
        const data = {
            channelId: msg.data.data.channel_id,
            rootId: msg.data.data.parent_id,
            userId: msg.data.data.user_id,
            username,
            now: Date.now(),
        };
        DeviceEventEmitter.emit(Events.USER_TYPING, data);

        setTimeout(() => {
            DeviceEventEmitter.emit(Events.USER_STOP_TYPING, data);
        }, parseInt(config.TimeBetweenUserTypingUpdatesMilliseconds, 10));
    }
}

export const userTyping = async (serverUrl: string, channelId: string, rootId?: string) => {
    const client = WebsocketManager.getClient(serverUrl);
    const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
    const currentUser = await getCurrentUser(database);

    if (!currentUser) {
        return;
    }

    client?.sendUserTypingEvent(currentUser.id, channelId, rootId);
};

export async function handleStatusChangedEvent(serverUrl: string, msg: WebSocketMessage) {
    const newStatus = msg.data.status;
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const user = await getUserById(database, msg.data.user_id);
        if (!user) {
            throw new Error(`No user for ${serverUrl}`);
        }

        user.prepareStatus(newStatus);
        await operator.batchRecords([user], 'handleStatusChangedEvent');
        return null;
    } catch (error) {
        return {error};
    }
}
