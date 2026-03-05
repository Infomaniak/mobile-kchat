// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database, Q} from '@nozbe/watermelondb';
import {of as of$} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {MM_TABLES} from '@constants/database';
import {sanitizeLikeString} from '@helpers/database';
import {generateGroupAssociationId} from '@utils/groups';

import type GroupModel from '@typings/database/models/servers/group';
import type GroupChannelModel from '@typings/database/models/servers/group_channel';
import type GroupMembershipModel from '@typings/database/models/servers/group_membership';
import type GroupTeamModel from '@typings/database/models/servers/group_team';
import type UserModel from '@typings/database/models/servers/user';

const {SERVER: {GROUP, GROUP_CHANNEL, GROUP_MEMBERSHIP, GROUP_TEAM, USER}} = MM_TABLES;

export const queryGroupsByName = (database: Database, name: string) => {
    return database.collections.get<GroupModel>(GROUP).query(
        Q.where('name', Q.like(`%${sanitizeLikeString(name)}%`)),
    );
};

export const queryGroupsByNames = (database: Database, names: string[]) => {
    return database.collections.get<GroupModel>(GROUP).query(
        Q.where('name', Q.oneOf(names)),
    );
};

export const queryGroupsByNameInTeam = (database: Database, name: string, teamId: string) => {
    return database.collections.get<GroupModel>(GROUP).query(
        Q.on(GROUP_TEAM, 'team_id', teamId),
        Q.where('name', Q.like(`%${sanitizeLikeString(name)}%`)),
    );
};

export const queryGroupsByNameInChannel = (database: Database, name: string, channelId: string) => {
    return database.collections.get<GroupModel>(GROUP).query(
        Q.on(GROUP_CHANNEL, 'channel_id', channelId),
        Q.where('name', Q.like(`%${sanitizeLikeString(name)}%`)),
    );
};

export const queryGroupChannelForChannel = (database: Database, channelId: string) => {
    return database.collections.get<GroupChannelModel>(GROUP_CHANNEL).query(
        Q.where('channel_id', channelId),
    );
};

export const queryGroupsForChannel = (database: Database, channelId: string) => {
    return database.collections.get<GroupModel>(GROUP).query(
        Q.on(GROUP_CHANNEL, 'channel_id', channelId),
    );
};

export const observeGroupsForChannel = (database: Database, channelId: string) => {
    return queryGroupsForChannel(database, channelId).observe();
};

export const queryGroupMembershipForMember = (database: Database, userId: string) => {
    return database.collections.get<GroupMembershipModel>(GROUP_MEMBERSHIP).query(
        Q.where('user_id', userId),
    );
};

export const queryGroupTeamForTeam = (database: Database, teamId: string) => {
    return database.collections.get<GroupTeamModel>(GROUP_TEAM).query(
        Q.where('team_id', teamId),
    );
};

export const deleteGroupMembershipById = (database: Database, id: string) => {
    return database.write(async () => {
        const model = await database.collections.get<GroupMembershipModel>(GROUP_MEMBERSHIP).find(id);
        return model.destroyPermanently();
    });
};

export const deleteGroupMembershipByGroupAndUser = async (database: Database, groupId: string, userId: string) => {
    const records = await database.collections.get<GroupMembershipModel>(GROUP_MEMBERSHIP).query(
        Q.where('group_id', groupId),
        Q.where('user_id', userId),
    ).fetch();
    if (!records.length) {
        return;
    }
    await database.write(async () => {
        await database.batch(...records.map((r) => r.prepareDestroyPermanently()));
    });
};

export const deleteGroupTeamById = (database: Database, id: string) => {
    return database.write(async () => {
        const model = await database.collections.get<GroupTeamModel>(GROUP_TEAM).find(id);
        return model.destroyPermanently();
    });
};

export const deleteGroupChannelById = (database: Database, id: string) => {
    return database.write(async () => {
        const model = await database.collections.get<GroupChannelModel>(GROUP_CHANNEL).find(id);
        return model.destroyPermanently();
    });
};

export const updateGroupMemberCount = async (database: Database, groupId: string, delta: number) => {
    const records = await database.collections.get<GroupModel>(GROUP).query(Q.where('id', groupId)).fetch();
    if (!records.length) {
        return;
    }
    await database.write(async () => {
        await records[0].update((g) => {
            g.memberCount = Math.max(0, (g.memberCount || 0) + delta);
        });
    });
};

export const observeGroup = (database: Database, groupId: string) => {
    return database.collections.get<GroupModel>(GROUP).
        query(Q.where('id', groupId)).
        observeWithColumns(['display_name', 'name', 'member_count']).
        pipe(map((models) => models[0]));
};

export const observeGroupMembersForGroup = (database: Database, groupId: string) => {
    return database.collections.get<GroupMembershipModel>(GROUP_MEMBERSHIP).
        query(Q.where('group_id', groupId)).
        observe().
        pipe(
            switchMap((memberships) => {
                if (!memberships.length) {
                    return of$<UserModel[]>([]);
                }
                const userIds = memberships.map((m) => m.userId);
                return database.collections.get<UserModel>(USER).
                    query(Q.where('id', Q.oneOf(userIds)), Q.sortBy('username', Q.asc)).
                    observe();
            }),
        );
};

export const queryGroupMembershipsForGroup = (database: Database, groupId: string) => {
    return database.collections.get<GroupMembershipModel>(GROUP_MEMBERSHIP).query(
        Q.where('group_id', groupId),
    );
};

/**
 * Adds new group memberships to the DB for a given page of members.
 * Only inserts records that don't already exist — never deletes.
 * Used during pagination (intermediate pages) to avoid removing members
 * that haven't been fetched yet in subsequent pages.
 */
export const upsertGroupMembershipsForGroup = async (database: Database, groupId: string, userIds: string[]) => {
    const collection = database.collections.get<GroupMembershipModel>(GROUP_MEMBERSHIP);
    const existing = await queryGroupMembershipsForGroup(database, groupId).fetch();
    const existingSet = new Set(existing.map((m) => m.userId));

    const toCreate = userIds.filter((uid) => !existingSet.has(uid)).map((uid) =>
        collection.prepareCreate((record) => {
            record._raw.id = generateGroupAssociationId(groupId, uid);
            record.groupId = groupId;
            record.userId = uid;
        }),
    );

    if (!toCreate.length) {
        return;
    }

    await database.write(async () => {
        await database.batch(...toCreate);
    });
};

/**
 * Full sync of group memberships against the complete list of member IDs.
 * Adds missing records and removes records no longer present in the incoming list.
 * Called on the last pagination page once all member IDs have been accumulated,
 * to ensure the local DB exactly reflects the server state.
 */
export const syncGroupMembershipsForGroup = async (database: Database, groupId: string, userIds: string[]) => {
    const collection = database.collections.get<GroupMembershipModel>(GROUP_MEMBERSHIP);
    const existing = await queryGroupMembershipsForGroup(database, groupId).fetch();

    const incomingSet = new Set(userIds);
    const existingMap = new Map(existing.map((m) => [m.userId, m]));

    const toCreate = userIds.filter((uid) => !existingMap.has(uid)).map((uid) =>
        collection.prepareCreate((record) => {
            record._raw.id = generateGroupAssociationId(groupId, uid);
            record.groupId = groupId;
            record.userId = uid;
        }),
    );
    const toDelete = existing.filter((m) => !incomingSet.has(m.userId)).map((m) => m.prepareDestroyPermanently());

    const batch = [...toCreate, ...toDelete];
    if (!batch.length) {
        return;
    }

    await database.write(async () => {
        await database.batch(...batch);
    });
};
