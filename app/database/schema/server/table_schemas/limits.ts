// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {tableSchema} from '@nozbe/watermelondb';

import {MM_TABLES} from '@constants/database';
const {LIMIT} = MM_TABLES.SERVER;

export default tableSchema({
    name: LIMIT,
    columns: [
        {name: 'boards', type: 'string'},
        {name: 'bots', type: 'number'},
        {name: 'custom_emojis', type: 'number'},
        {name: 'files', type: 'string'},
        {name: 'guests', type: 'number'},
        {name: 'incoming_webhooks', type: 'number'},
        {name: 'integrations', type: 'string'},
        {name: 'members', type: 'number'},
        {name: 'messages', type: 'string'},
        {name: 'outgoing_webhooks', type: 'number'},
        {name: 'private_channels', type: 'number'},
        {name: 'public_channels', type: 'number'},
        {name: 'reminder_custom_date', type: 'boolean'},
        {name: 'scheduled_draft_custom_date', type: 'boolean'},
        {name: 'sidebar_categories', type: 'number'},
        {name: 'storage', type: 'number'},
        {name: 'teams', type: 'string'},
    ],
});
