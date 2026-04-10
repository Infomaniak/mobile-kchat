// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Permissions} from '@constants';
import {SYSTEM_IDENTIFIERS} from '@constants/database';
import DatabaseManager from '@database/manager';
import {renderWithEverything} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import ChannelListHeader from './header';

import ChannelListHeaderIndex from './index';

import type ServerDataOperator from '@database/operator/server_data_operator';
import type {Database} from '@nozbe/watermelondb';

jest.mock('./header');
jest.mocked(ChannelListHeader).mockImplementation((props) => {
    return React.createElement('ChannelListHeader', {
        testID: 'channel-list-header',
        ...props,
    });
});

describe('IK - Invite People Feature Disabled', () => {
    const serverUrl = 'server-url';
    const currentUserId = 'current-user-id';
    const currentTeamId = 'current-team-id';
    const teamDisplayName = 'Team Display Name';

    let database: Database;
    let operator: ServerDataOperator;

    beforeEach(async () => {
        await DatabaseManager.init([serverUrl]);
        const serverDatabaseAndOperator = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        database = serverDatabaseAndOperator.database;
        operator = serverDatabaseAndOperator.operator;
    });

    afterEach(() => {
        DatabaseManager.destroyServerDatabase(serverUrl);
        jest.clearAllMocks();
    });

    it('canInvitePeople is always false even with ADD_USER_TO_TEAM permission', async () => {
        const team = TestHelper.fakeTeam({id: currentTeamId, display_name: teamDisplayName});
        const user = TestHelper.fakeUser({id: currentUserId, roles: 'system_user'});

        await operator.handleTeam({teams: [team], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user], prepareRecordsOnly: false});
        await operator.handleSystem({
            systems: [
                {id: SYSTEM_IDENTIFIERS.CURRENT_TEAM_ID, value: currentTeamId},
                {id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: currentUserId},
            ],
            prepareRecordsOnly: false,
        });
        await operator.handleMyTeam({
            myTeams: [{id: currentTeamId, roles: 'team_user'}],
            prepareRecordsOnly: false,
        });
        await operator.handleRole({
            roles: [
                {id: 'system_user', name: 'system_user', permissions: [Permissions.ADD_USER_TO_TEAM]},
                {id: 'team_user', name: 'team_user', permissions: []},
            ],
            prepareRecordsOnly: false,
        });

        const {getByTestId} = renderWithEverything(<ChannelListHeaderIndex/>, {database});
        const component = getByTestId('channel-list-header');
        expect(component.props.canInvitePeople).toBe(false);
    });

    it('canInvitePeople is always false even with all invite permissions', async () => {
        const team = TestHelper.fakeTeam({id: currentTeamId, display_name: teamDisplayName});
        const user = TestHelper.fakeUser({id: currentUserId, roles: 'system_user'});

        await operator.handleTeam({teams: [team], prepareRecordsOnly: false});
        await operator.handleUsers({users: [user], prepareRecordsOnly: false});
        await operator.handleSystem({
            systems: [
                {id: SYSTEM_IDENTIFIERS.CURRENT_TEAM_ID, value: currentTeamId},
                {id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID, value: currentUserId},
            ],
            prepareRecordsOnly: false,
        });
        await operator.handleMyTeam({
            myTeams: [{id: currentTeamId, roles: 'team_user'}],
            prepareRecordsOnly: false,
        });
        await operator.handleRole({
            roles: [
                {id: 'system_user', name: 'system_user', permissions: [Permissions.ADD_USER_TO_TEAM, Permissions.INVITE_GUEST]},
                {id: 'team_user', name: 'team_user', permissions: []},
            ],
            prepareRecordsOnly: false,
        });
        await operator.handleConfigs({
            configs: [{id: 'EnableGuestAccounts', value: 'true'}],
            configsToDelete: [],
            prepareRecordsOnly: false,
        });

        const {getByTestId} = renderWithEverything(<ChannelListHeaderIndex/>, {database});
        const component = getByTestId('channel-list-header');
        expect(component.props.canInvitePeople).toBe(false);
    });
});
