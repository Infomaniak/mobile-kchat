// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchGroupsForChannel, fetchGroupsForMember, fetchGroupsForTeam} from '@actions/remote/groups';
import DatabaseManager from '@database/manager';
import {deleteGroupChannelById, deleteGroupMembershipById, deleteGroupTeamById, updateGroupMemberCount} from '@queries/servers/group';
import {generateGroupAssociationId} from '@utils/groups';
import {logError} from '@utils/log';

type WebsocketGroupMessage = WebSocketMessage<{
    group?: Group;
}>

type WebsocketGroupMemberMessage = WebSocketMessage<{
    group_member?: GroupMembership;
}>

type WebsocketGroupTeamMessage = WebSocketMessage<{
    group_team?: GroupTeam;
}>

type WebsocketGroupChannelMessage = WebSocketMessage<{
    group_channel?: GroupChannel;
}>

// IK: custom WS events for channel groups have a different payload
type WebsocketChannelGroupAddedMessage = WebSocketMessage<{
    group: Group;
    channel_id: string;
}>

type WebsocketChannelGroupRemovedMessage = WebSocketMessage<{
    group_id: string;
    channel_id: string;
}>

type WSMessage = WebsocketGroupMessage | WebsocketGroupMemberMessage | WebsocketGroupTeamMessage | WebsocketGroupChannelMessage

const handleError = (serverUrl: string, e: unknown, msg: WSMessage) => {
    logError(`Group WS: ${msg.event}`, e, msg);

    const {team_id, channel_id, user_id} = msg.data;

    if (team_id) {
        fetchGroupsForTeam(serverUrl, msg.data.team_id);
    }
    if (channel_id) {
        fetchGroupsForChannel(serverUrl, msg.data.channel_id);
    }
    if (user_id) {
        fetchGroupsForMember(serverUrl, msg.data.user_id);
    }
};

export async function handleGroupReceivedEvent(serverUrl: string, msg: WebsocketGroupMessage) {
    let group: Group;

    try {
        if (msg?.data?.group) {
            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            group = msg.data.group;
            operator.handleGroups({groups: [group], prepareRecordsOnly: false});
        }
    } catch (e) {
        handleError(serverUrl, e, msg);
    }
}

export async function handleGroupMemberAddEvent(serverUrl: string, msg: WebsocketGroupMemberMessage) {
    let groupMember: GroupMembership;

    try {
        if (msg?.data?.group_member) {
            const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            groupMember = msg.data.group_member;
            const group = {id: groupMember.group_id};

            await operator.handleGroupMembershipsForMember({userId: groupMember.user_id, groups: [group], prepareRecordsOnly: false});
            await updateGroupMemberCount(database, groupMember.group_id, 1);
        }
    } catch (e) {
        handleError(serverUrl, e, msg);
    }
}

export async function handleGroupMemberDeleteEvent(serverUrl: string, msg: WebsocketGroupMemberMessage) {
    let groupMember: GroupMembership;

    try {
        if (msg?.data?.group_member) {
            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            groupMember = msg.data.group_member;
            const associationId = generateGroupAssociationId(groupMember.group_id, groupMember.user_id);

            await deleteGroupMembershipById(database, associationId);
            await updateGroupMemberCount(database, groupMember.group_id, -1);
        }
    } catch (e) {
        handleError(serverUrl, e, msg);
    }
}

export async function handleGroupTeamAssociatedEvent(serverUrl: string, msg: WebsocketGroupTeamMessage) {
    let groupTeam: GroupTeam;

    try {
        if (msg?.data?.group_team) {
            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            groupTeam = msg.data.group_team;
            const group = {id: groupTeam.group_id};

            operator.handleGroupTeamsForTeam({teamId: groupTeam.team_id, groups: [group], prepareRecordsOnly: false});
        }
    } catch (e) {
        handleError(serverUrl, e, msg);
    }
}

export async function handleGroupTeamDissociateEvent(serverUrl: string, msg: WebsocketGroupTeamMessage) {
    let groupTeam: GroupTeam;

    try {
        if (msg?.data?.group_team) {
            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            groupTeam = msg.data.group_team;

            await deleteGroupTeamById(database, generateGroupAssociationId(groupTeam.group_id, groupTeam.team_id));
        }
    } catch (e) {
        handleError(serverUrl, e, msg);
    }
}

export async function handleGroupChannelAssociatedEvent(serverUrl: string, msg: WebsocketGroupChannelMessage) {
    let groupChannel: GroupChannel;

    try {
        if (msg?.data?.group_channel) {
            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            groupChannel = msg.data.group_channel;
            const group = {id: groupChannel.group_id};

            operator.handleGroupChannelsForChannel({channelId: groupChannel.channel_id, groups: [group], prepareRecordsOnly: false});
        }
    } catch (e) {
        handleError(serverUrl, e, msg);
    }
}

export async function handleGroupChannelDissociateEvent(serverUrl: string, msg: WebsocketGroupChannelMessage) {
    let groupChannel: GroupChannel;

    try {
        if (msg?.data?.group_channel) {
            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            groupChannel = msg.data.group_channel;

            await deleteGroupChannelById(database, generateGroupAssociationId(groupChannel.group_id, groupChannel.channel_id));
        }
    } catch (e) {
        handleError(serverUrl, e, msg);
    }
}

// IK: custom WS events — payload differs from standard MM group_channel events
export async function handleChannelGroupAddedEvent(serverUrl: string, msg: WebsocketChannelGroupAddedMessage) {
    try {
        if (msg?.data?.group && msg?.data?.channel_id) {
            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            const group: Group = msg.data.group;

            await operator.handleGroups({groups: [group], prepareRecordsOnly: false});
            await operator.handleGroupChannelsForChannel({channelId: msg.data.channel_id, groups: [{id: group.id}], prepareRecordsOnly: false});
        }
    } catch (e) {
        logError('Group WS: channel_group_added', e, msg);
        fetchGroupsForChannel(serverUrl, msg.data.channel_id);
    }
}

export async function handleChannelGroupRemovedEvent(serverUrl: string, msg: WebsocketChannelGroupRemovedMessage) {
    try {
        if (msg?.data?.group_id && msg?.data?.channel_id) {
            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

            await deleteGroupChannelById(database, generateGroupAssociationId(msg.data.group_id, msg.data.channel_id));
        }
    } catch (e) {
        logError('Group WS: channel_group_removed', e, msg);
        fetchGroupsForChannel(serverUrl, msg.data.channel_id);
    }
}
