// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// NOTE : To implement migration, please follow this document
// https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html

// TODO UPSTREAM : double check this part

import {addColumns, createTable, schemaMigrations} from '@nozbe/watermelondb/Schema/migrations';

import {MM_TABLES} from '@constants/database';

const {CONFERENCE, CONFERENCE_PARTICIPANT, FILE, CHANNEL_INFO, DRAFT, POST, CHANNEL_MEMBERSHIP} = MM_TABLES.SERVER;

export default schemaMigrations({migrations: [
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
