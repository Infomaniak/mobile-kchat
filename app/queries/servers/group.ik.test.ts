// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q, type Database} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';
import DatabaseManager from '@database/manager';

import {updateGroupMemberCount} from './group';

import type ServerDataOperator from '@database/operator/server_data_operator';
import type GroupModel from '@typings/database/models/servers/group';

const BASE_GROUP: Group = {
    id: 'group-1',
    name: 'test-group',
    display_name: 'Test Group',
    source: 'custom',
    remote_id: '',
    description: '',
    member_count: 5,
    allow_reference: true,
    create_at: 0,
    update_at: 0,
    delete_at: 0,
};

describe('updateGroupMemberCount', () => {
    const serverUrl = 'baseHandler.test.com';
    let database: Database;
    let operator: ServerDataOperator;

    beforeEach(async () => {
        await DatabaseManager.init([serverUrl]);
        ({database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl));
    });

    afterEach(async () => {
        await DatabaseManager.destroyServerDatabase(serverUrl);
    });

    const getGroup = async (id: string) => {
        const records = await database.collections.
            get<GroupModel>(MM_TABLES.SERVER.GROUP).
            query(Q.where('id', id)).
            fetch();
        return records[0];
    };

    it('should increment member count by a positive delta', async () => {
        await operator.handleGroups({groups: [BASE_GROUP], prepareRecordsOnly: false});

        await updateGroupMemberCount(database, 'group-1', 3);

        const group = await getGroup('group-1');
        expect(group.memberCount).toBe(8);
    });

    it('should decrement member count by a negative delta', async () => {
        await operator.handleGroups({groups: [BASE_GROUP], prepareRecordsOnly: false});

        await updateGroupMemberCount(database, 'group-1', -2);

        const group = await getGroup('group-1');
        expect(group.memberCount).toBe(3);
    });

    it('should not go below 0 when delta would make count negative', async () => {
        const groupWithLowCount = {...BASE_GROUP, member_count: 1};
        await operator.handleGroups({groups: [groupWithLowCount], prepareRecordsOnly: false});

        await updateGroupMemberCount(database, 'group-1', -10);

        const group = await getGroup('group-1');
        expect(group.memberCount).toBe(0);
    });

    it('should do nothing when the group does not exist', async () => {
        await expect(updateGroupMemberCount(database, 'non-existent', 1)).resolves.not.toThrow();
    });
});
