// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {tableSchema} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';

import type {TableSchemaSpec} from '@nozbe/watermelondb/Schema';

const {CONFERENCE_PARTICIPANT} = MM_TABLES.SERVER;

export const tableSchemaSpec: TableSchemaSpec = {
    name: CONFERENCE_PARTICIPANT,
    columns: [
        {name: 'channel_id', type: 'string', isIndexed: true},
        {name: 'conference_id', type: 'string', isIndexed: true},
        {name: 'user_id', type: 'string', isIndexed: true},
        {name: 'present', type: 'boolean'},
        {name: 'status', type: 'string'},
    ],
};

export default tableSchema(tableSchemaSpec);
