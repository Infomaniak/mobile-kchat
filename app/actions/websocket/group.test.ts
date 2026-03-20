// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchGroupsForChannel, fetchGroupsForMember, fetchGroupsForTeam} from '@actions/remote/groups';
import DatabaseManager from '@database/manager';
import {deleteGroupChannelById, deleteGroupMembershipById, deleteGroupTeamById} from '@queries/servers/group';
import {generateGroupAssociationId} from '@utils/groups';

import {
    handleGroupReceivedEvent,
    handleGroupMemberAddEvent,
    handleGroupMemberDeleteEvent,
    handleGroupTeamAssociatedEvent,
    handleGroupTeamDissociateEvent,
    handleGroupChannelAssociatedEvent,
    handleGroupChannelDissociateEvent,
    handleChannelGroupAddedEvent,
    handleChannelGroupRemovedEvent,
} from './group';

jest.mock('@actions/remote/groups');
jest.mock('@database/manager');
jest.mock('@queries/servers/group');
jest.mock('@utils/groups');
jest.mock('@utils/log');

describe('WebSocket Group Actions', () => {
    const serverUrl = 'baseHandler.test.com';
    const groupId = 'group-id';
    const userId = 'user-id';
    const teamId = 'team-id';
    const channelId = 'channel-id';

    beforeEach(async () => {
        jest.clearAllMocks();
        await DatabaseManager.init([serverUrl]);
        DatabaseManager.serverDatabases[serverUrl] = {
            operator: {
                handleGroups: jest.fn(),
                handleGroupMembershipsForMember: jest.fn(),
                handleGroupTeamsForTeam: jest.fn(),
                handleGroupChannelsForChannel: jest.fn(),
            },
        } as any;
        DatabaseManager.getServerDatabaseAndOperator = jest.fn().mockReturnValue({
            database: {},
            operator: {
                handleGroups: jest.fn(),
                handleGroupMembershipsForMember: jest.fn(),
                handleGroupTeamsForTeam: jest.fn(),
                handleGroupChannelsForChannel: jest.fn(),
            },
        });
    });

    describe('handleGroupReceivedEvent', () => {
        it('should handle group received successfully', async () => {
            const msg = {
                data: {
                    group: {id: groupId},
                },
            } as WebSocketMessage;

            await handleGroupReceivedEvent(serverUrl, msg);

            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(operator.handleGroups).toHaveBeenCalledWith({
                groups: [{id: groupId}],
                prepareRecordsOnly: false,
            });
        });
    });

    describe('handleGroupMemberAddEvent', () => {
        it('should handle group member add successfully', async () => {
            const msg = {
                data: {
                    group_member: {
                        group_id: groupId,
                        user_id: userId,
                    },
                },
            } as WebSocketMessage;

            await handleGroupMemberAddEvent(serverUrl, msg);

            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(operator.handleGroupMembershipsForMember).toHaveBeenCalledWith({
                userId,
                groups: [{id: groupId}],
                prepareRecordsOnly: false,
            });
        });
    });

    describe('handleGroupMemberDeleteEvent', () => {
        it('should handle group member delete successfully', async () => {
            const msg = {
                data: {
                    group_member: {
                        group_id: groupId,
                        user_id: userId,
                    },
                },
            } as WebSocketMessage;

            jest.mocked(generateGroupAssociationId).mockReturnValue('association-id');

            await handleGroupMemberDeleteEvent(serverUrl, msg);

            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(deleteGroupMembershipById).toHaveBeenCalledWith(database, 'association-id');
        });
    });

    describe('handleGroupTeamAssociatedEvent', () => {
        it('should handle group team association successfully', async () => {
            const msg = {
                data: {
                    group_team: {
                        group_id: groupId,
                        team_id: teamId,
                    },
                },
            } as WebSocketMessage;

            await handleGroupTeamAssociatedEvent(serverUrl, msg);

            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(operator.handleGroupTeamsForTeam).toHaveBeenCalledWith({
                teamId,
                groups: [{id: groupId}],
                prepareRecordsOnly: false,
            });
        });
    });

    describe('handleGroupTeamDissociateEvent', () => {
        it('should handle group team dissociation successfully', async () => {
            const msg = {
                data: {
                    group_team: {
                        group_id: groupId,
                        team_id: teamId,
                    },
                },
            } as WebSocketMessage;

            jest.mocked(generateGroupAssociationId).mockReturnValue('association-id');

            await handleGroupTeamDissociateEvent(serverUrl, msg);

            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(deleteGroupTeamById).toHaveBeenCalledWith(database, 'association-id');
        });
    });

    describe('handleGroupChannelAssociatedEvent', () => {
        it('should handle group channel association successfully', async () => {
            const msg = {
                data: {
                    group_channel: {
                        group_id: groupId,
                        channel_id: channelId,
                    },
                },
            } as WebSocketMessage;

            await handleGroupChannelAssociatedEvent(serverUrl, msg);

            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(operator.handleGroupChannelsForChannel).toHaveBeenCalledWith({
                channelId,
                groups: [{id: groupId}],
                prepareRecordsOnly: false,
            });
        });
    });

    describe('handleGroupChannelDissociateEvent', () => {
        it('should handle group channel dissociation successfully', async () => {
            const msg = {
                data: {
                    group_channel: {
                        group_id: groupId,
                        channel_id: channelId,
                    },
                },
            } as WebSocketMessage;

            jest.mocked(generateGroupAssociationId).mockReturnValue('association-id');

            await handleGroupChannelDissociateEvent(serverUrl, msg);

            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(deleteGroupChannelById).toHaveBeenCalledWith(database, 'association-id');
        });
    });

    describe('handleChannelGroupAddedEvent', () => {
        it('should upsert the group and create the group-channel association', async () => {
            const group = {id: groupId, name: 'group-name', display_name: 'Group Name'};
            const msg = {
                data: {group, channel_id: channelId},
            } as unknown as WebSocketMessage;

            await handleChannelGroupAddedEvent(serverUrl, msg);

            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(operator.handleGroups).toHaveBeenCalledWith({groups: [group], prepareRecordsOnly: false});
            expect(operator.handleGroupChannelsForChannel).toHaveBeenCalledWith({
                channelId,
                groups: [{id: groupId}],
                prepareRecordsOnly: false,
                appendOnly: true,
            });
        });

        it('should do nothing when group or channel_id is missing', async () => {
            const msg = {data: {}} as WebSocketMessage;

            await handleChannelGroupAddedEvent(serverUrl, msg);

            expect(DatabaseManager.getServerDatabaseAndOperator).not.toHaveBeenCalled();
        });

        it('should fallback to fetchGroupsForChannel on error', async () => {
            const group = {id: groupId, name: 'group-name'};
            const msg = {data: {group, channel_id: channelId}} as unknown as WebSocketMessage;

            const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            (operator.handleGroups as jest.Mock).mockRejectedValue(new Error('DB error'));

            await handleChannelGroupAddedEvent(serverUrl, msg);

            expect(fetchGroupsForChannel).toHaveBeenCalledWith(serverUrl, channelId);
        });
    });

    describe('handleChannelGroupRemovedEvent', () => {
        it('should delete the group-channel association', async () => {
            const msg = {
                data: {group_id: groupId, channel_id: channelId},
            } as unknown as WebSocketMessage;

            jest.mocked(generateGroupAssociationId).mockReturnValue('association-id');

            await handleChannelGroupRemovedEvent(serverUrl, msg);

            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            expect(generateGroupAssociationId).toHaveBeenCalledWith(groupId, channelId);
            expect(deleteGroupChannelById).toHaveBeenCalledWith(database, 'association-id');
        });

        it('should do nothing when group_id or channel_id is missing', async () => {
            const msg = {data: {}} as WebSocketMessage;

            await handleChannelGroupRemovedEvent(serverUrl, msg);

            expect(DatabaseManager.getServerDatabaseAndOperator).not.toHaveBeenCalled();
        });

        it('should fallback to fetchGroupsForChannel on error', async () => {
            const msg = {
                data: {group_id: groupId, channel_id: channelId},
            } as unknown as WebSocketMessage;

            jest.mocked(generateGroupAssociationId).mockReturnValue('association-id');
            (deleteGroupChannelById as jest.Mock).mockRejectedValue(new Error('DB error'));

            await handleChannelGroupRemovedEvent(serverUrl, msg);

            expect(fetchGroupsForChannel).toHaveBeenCalledWith(serverUrl, channelId);
        });
    });

    describe('error handling', () => {
        beforeEach(() => {
            // IK: Make all DB operations throw to trigger error handling
            const throwingOperator = {
                handleGroups: jest.fn().mockRejectedValue(new Error('DB error')),
                handleGroupMembershipsForMember: jest.fn().mockRejectedValue(new Error('DB error')),
                handleGroupTeamsForTeam: jest.fn().mockRejectedValue(new Error('DB error')),
                handleGroupChannelsForChannel: jest.fn().mockRejectedValue(new Error('DB error')),
            };
            DatabaseManager.getServerDatabaseAndOperator = jest.fn().mockReturnValue({
                database: {},
                operator: throwingOperator,
            });
            (deleteGroupMembershipById as jest.Mock).mockRejectedValue(new Error('DB error'));
            (deleteGroupTeamById as jest.Mock).mockRejectedValue(new Error('DB error'));
            (deleteGroupChannelById as jest.Mock).mockRejectedValue(new Error('DB error'));
        });

        it('should handle errors and fetch groups on failure', async () => {
            // Override to throw synchronously so non-awaited handlers also catch
            DatabaseManager.getServerDatabaseAndOperator = jest.fn().mockImplementation(() => {
                throw new Error('DB error');
            });

            const msg = {
                event: '',
                data: {
                    group: {id: groupId},
                    team_id: teamId,
                    channel_id: channelId,
                    user_id: userId,
                },
            } as WebSocketMessage;

            await handleGroupReceivedEvent(serverUrl, msg);

            expect(fetchGroupsForTeam).toHaveBeenCalledWith(serverUrl, teamId);
            expect(fetchGroupsForChannel).toHaveBeenCalledWith(serverUrl, channelId);
            expect(fetchGroupsForMember).toHaveBeenCalledWith(serverUrl, userId);
        });

        // IK: only handlers with awaited DB calls trigger error handling
        // handleGroupMemberDeleteEvent, handleGroupTeamDissociateEvent, handleGroupChannelDissociateEvent
        // and handleGroupMemberAddEvent use await, so their errors are caught
        it('should handle DB errors on awaited handlers', async () => {
            const msg = {
                event: '',
                data: {
                    group_member: {group_id: groupId, user_id: userId},
                    group_team: {group_id: groupId, team_id: teamId},
                    group_channel: {group_id: groupId, channel_id: channelId},
                    team_id: teamId,
                },
            } as WebSocketMessage;

            await handleGroupMemberAddEvent(serverUrl, msg);
            await handleGroupMemberDeleteEvent(serverUrl, msg);
            await handleGroupTeamDissociateEvent(serverUrl, msg);
            await handleGroupChannelDissociateEvent(serverUrl, msg);

            expect(fetchGroupsForTeam).toHaveBeenCalledWith(serverUrl, teamId);
            expect(fetchGroupsForTeam).toHaveBeenCalledTimes(4);
        });

        it('should handle missing data', async () => {
            const msg = {
                event: '',
                broadcast: {
                    team_id: teamId,
                },
                data: {},
            } as WebSocketMessage;

            await handleGroupReceivedEvent(serverUrl, msg);
            await handleGroupMemberAddEvent(serverUrl, msg);
            await handleGroupMemberDeleteEvent(serverUrl, msg);
            await handleGroupTeamAssociatedEvent(serverUrl, msg);
            await handleGroupTeamDissociateEvent(serverUrl, msg);
            await handleGroupChannelAssociatedEvent(serverUrl, msg);
            await handleGroupChannelDissociateEvent(serverUrl, msg);

            expect(DatabaseManager.getServerDatabaseAndOperator).not.toHaveBeenCalled();
        });
    });
});
