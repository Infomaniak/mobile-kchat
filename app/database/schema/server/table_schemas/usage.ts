// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {tableSchema} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';
const {USAGE} = MM_TABLES.SERVER;

export default tableSchema({
    name: USAGE,
    columns: [
        {name: 'custom_emojis', type: 'number'},
        {name: 'guests', type: 'number'},
        {name: 'incoming_webhooks', type: 'number'},
        {name: 'members', type: 'number'},
        {name: 'outgoing_webhooks', type: 'number'},
        {name: 'pending_guests', type: 'number'},
        {name: 'private_channels', type: 'number'},
        {name: 'public_channels', type: 'number'},
        {name: 'sidebar_categories', type: 'number'},
        {name: 'storage', type: 'number'},
    ],
});

