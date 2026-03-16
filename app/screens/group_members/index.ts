// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';

import {observeGroup, observeGroupMembersForGroup} from '@queries/servers/group';

import GroupMembers from './group_members';

import type {WithDatabaseArgs} from '@typings/database/database';

type OwnProps = {
    groupId: string;
};

const enhanced = withObservables(['groupId'], ({groupId, database}: OwnProps & WithDatabaseArgs) => ({
    group: observeGroup(database, groupId),
    members: observeGroupMembersForGroup(database, groupId),
}));

export default withDatabase(enhanced(GroupMembers));
