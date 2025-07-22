// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// NOTE : To implement migration, please follow this document
// https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html

import {addColumns, createTable, schemaMigrations} from '@nozbe/watermelondb/Schema/migrations';

import {MM_TABLES} from '@constants/database';

const {TEAM, USAGE, LIMIT, CONFERENCE, CONFERENCE_PARTICIPANT, FILE, CHANNEL_INFO, DRAFT, POST, CHANNEL_MEMBERSHIP} = MM_TABLES.SERVER;

export default schemaMigrations({migrations: [
    {
        toVersion: 7,
        steps: [
            createTable({
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
            }),
            createTable({
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
            }),
            addColumns({
                table: TEAM,
                columns: [
                    {name: 'pack_name', type: 'string'},
                ],
            }),
        ],
    },
    {
        toVersion: 6,
        steps: [
            addColumns({
                table: FILE,
                columns: [
                    {name: 'transcript', type: 'string'},
                ],
            }),
        ],
    },
    {
        toVersion: 5,
        steps: [
            addColumns({
                table: CHANNEL_MEMBERSHIP,
                columns: [
                    {name: 'roles', type: 'string', isOptional: true},
                ],
            }),
        ],
    },
    {
        toVersion: 4,
        steps: [
            createTable({
                name: CONFERENCE,
                columns: [
                    {name: 'url', type: 'string'},
                    {name: 'channel_id', type: 'string', isIndexed: true},
                    {name: 'team_id', type: 'string', isIndexed: true},
                    {name: 'user_id', type: 'string', isIndexed: true},
                    {name: 'create_at', type: 'number'},
                    {name: 'delete_at', type: 'number', isOptional: true},
                ],
            }),
            createTable({
                name: CONFERENCE_PARTICIPANT,
                columns: [
                    {name: 'channel_id', type: 'string', isIndexed: true},
                    {name: 'conference_id', type: 'string', isIndexed: true},
                    {name: 'user_id', type: 'string', isIndexed: true},
                    {name: 'present', type: 'boolean'},
                    {name: 'status', type: 'string'},
                ],
            }),
        ],
    },
    {
        toVersion: 3,
        steps: [
            addColumns({
                table: POST,
                columns: [
                    {name: 'message_source', type: 'string'},
                ],
            }),
        ],
    },
    {
        toVersion: 2,
        steps: [
            addColumns({
                table: CHANNEL_INFO,
                columns: [
                    {name: 'files_count', type: 'number'},
                ],
            }),
            addColumns({
                table: DRAFT,
                columns: [
                    {name: 'metadata', type: 'string', isOptional: true},
                ],
            }),
        ],
    },
]});
