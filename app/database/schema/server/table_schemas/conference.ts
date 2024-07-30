// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {tableSchema} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';

import type {TableSchemaSpec} from '@nozbe/watermelondb/Schema';

const {CONFERENCE} = MM_TABLES.SERVER;

export const tableSchemaSpec: TableSchemaSpec = {
    name: CONFERENCE,
    columns: [
        {name: 'url', type: 'string'},
        {name: 'channel_id', type: 'string', isIndexed: true},
        {name: 'team_id', type: 'string', isIndexed: true},
        {name: 'user_id', type: 'string', isIndexed: true},
        {name: 'create_at', type: 'number'},
        {name: 'delete_at', type: 'number', isOptional: true},
    ],
};

export default tableSchema(tableSchemaSpec);
