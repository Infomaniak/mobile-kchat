// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {tableSchema} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';

const {DRAFT} = MM_TABLES.SERVER;

export default tableSchema({
    name: DRAFT,
    columns: [
        {name: 'create_at', type: 'number'},
        {name: 'update_at', type: 'number'},
        {name: 'delete_at', type: 'number'},
        {name: 'user_id', type: 'string', isIndexed: true},
        {name: 'channel_id', type: 'string', isIndexed: true},
        {name: 'root_id', type: 'string', isIndexed: true},
        {name: 'files', type: 'string'},
        {name: 'message', type: 'string'},
        {name: 'props', type: 'string'},
        {name: 'metadata', type: 'string', isOptional: true},
        {name: 'priority', type: 'string', isOptional: true},
        {name: 'timestamp', type: 'string', isOptional: true},
    ],
});
