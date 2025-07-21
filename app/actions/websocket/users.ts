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
import {customProfileAttributeId} from '@utils/custom_profile_attribute';
import {logError} from '@utils/log';

import type {Model} from '@nozbe/watermelondb';
import type {CustomProfileField} from '@typings/api/custom_profile_attributes';

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

        const currentChannel = await getCurrentChannel(database);
        if (currentChannel && [General.OPEN_CHANNEL, General.PRIVATE_CHANNEL].includes(currentChannel.type as any)) {
            const databaseUser = await getUserById(database, user.id);
            const channelMembers = await queryChannelMembers(database, currentChannel.id);
            const isInChannel = await channelMembers.some((m) => m.userId === user.id);

            if (isInChannel &&
                (!databaseUser || databaseUser.deleteAt !== user.delete_at || isGuest(databaseUser.roles) !== isGuest(user.roles))) {
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

const handleUserActionEvent = (action: 'typing' | 'recording') => async (serverUrl: string, msg: WebSocketMessage) => {
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

        const namePreference = await queryDisplayNamePreferences(database, Preferences.NAME_NAME_FORMAT)?.fetch();
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
        DeviceEventEmitter.emit(action === 'typing' ? Events.USER_TYPING : Events.USER_RECORDING, data);

        setTimeout(() => {
            DeviceEventEmitter.emit(action === 'typing' ? Events.USER_STOP_TYPING : Events.USER_STOP_RECORDING, data);
        }, parseInt(config.TimeBetweenUserTypingUpdatesMilliseconds, 10));
    }
};
export const handleUserTypingEvent = handleUserActionEvent('typing');
export const handleUserRecordingEvent = handleUserActionEvent('recording');

export const userTyping = async (actionType: 'typing' | 'recording' | 'stop', serverUrl: string, channelId: string, rootId?: string) => {
    const client = WebsocketManager.getClient(serverUrl);
    const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
    const currentUser = await getCurrentUser(database);

    if (!currentUser) {
        return;
    }

    switch (actionType) {
        case 'typing':
            client?.sendUserTypingEvent(currentUser.id, channelId, rootId);
            break;
        case 'recording':
            client?.sendUserRecordingEvent(currentUser.id, channelId, rootId);
            break;
        case 'stop':
            client?.stopRecordingEvent();
            break;
        default:
            throw new Error('Invalid action type');
    }
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

export async function handleCustomProfileAttributesValuesUpdatedEvent(serverUrl: string, msg: WebSocketMessage) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        const {user_id, values} = msg.data;
        const attributesForDatabase = Object.entries(values).map(([fieldId, value]) => ({
            id: customProfileAttributeId(fieldId, user_id),
            field_id: fieldId,
            user_id,
            value: value as string,
        }));

        try {
            await operator.handleCustomProfileAttributes({
                attributes: attributesForDatabase,
                prepareRecordsOnly: false,
            });
        } catch (error) {
            logError('Error handling custom profile attributes values updated event', error);
        }
    } catch (error) {
        logError('Error getting the operator for the custom profile attributes values updated event', error);
    }

}

export async function handleCustomProfileAttributesFieldUpdatedEvent(serverUrl: string, msg: WebSocketMessage) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        const {field} = msg.data;

        try {
            await operator.handleCustomProfileFields({
                fields: [field],
                prepareRecordsOnly: false,
            });
        } catch (error) {
            logError('Error handling custom profile attributes field updated event', error);
        }
    } catch (error) {
        logError('Error getting the operator for the custom profile field updated event', error);
    }

}

export async function handleCustomProfileAttributesFieldDeletedEvent(serverUrl: string, msg: WebSocketMessage) {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        const {field_id} = msg.data;

        try {
            // Delete the field from the database
            const fieldForDatabase: CustomProfileField = {
                id: field_id,
                group_id: '',
                name: '',
                type: '',
                target_id: '',
                target_type: '',
                create_at: 0,
                update_at: 0,
                delete_at: Date.now(),
                attrs: {},
            };

            await operator.handleCustomProfileFields({
                fields: [fieldForDatabase],
                prepareRecordsOnly: false,
            });
        } catch (error) {
            logError('Error handling custom profile field deleted event', error);
        }
    } catch (error) {
        logError('Error getting the operator for the custom profile field deleted event', error);
    }
}
