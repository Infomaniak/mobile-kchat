// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// NOTE : To implement migration, please follow this document
// https://nozbe.github.io/WatermelonDB/Advanced/Migrations.html

import {
    addColumns,
    createTable,
    schemaMigrations,
    unsafeExecuteSql,
} from '@nozbe/watermelondb/Schema/migrations';

import {MM_TABLES} from '@constants/database';
import {PLAYBOOK_TABLES} from '@playbooks/constants/database';

const {
    CHANNEL,
    CHANNEL_BOOKMARK,
    CONFERENCE,
    CONFERENCE_PARTICIPANT,
    FILE,
    CHANNEL_INFO,
    DRAFT,
    POST,
    MY_CHANNEL,
    CHANNEL_MEMBERSHIP,
    CUSTOM_PROFILE_ATTRIBUTE,
    CUSTOM_PROFILE_FIELD,
    SCHEDULED_POST,
    USAGE,
    LIMIT,
    TEAM,
} = MM_TABLES.SERVER;

const {PLAYBOOK_RUN, PLAYBOOK_CHECKLIST, PLAYBOOK_CHECKLIST_ITEM} = PLAYBOOK_TABLES;

export default schemaMigrations({
    migrations: [
        {
            toVersion: 8,
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
            toVersion: 7, // Ik: equivalent of version 12 of MM
            steps: [
                createTable({
                    name: CHANNEL_BOOKMARK,
                    columns: [
                        {name: 'create_at', type: 'number'},
                        {name: 'update_at', type: 'number'},
                        {name: 'delete_at', type: 'number'},
                        {name: 'channel_id', type: 'string', isIndexed: true},
                        {name: 'owner_id', type: 'string'},
                        {name: 'file_id', type: 'string', isOptional: true},
                        {name: 'display_name', type: 'string'},
                        {name: 'sort_order', type: 'number'},
                        {name: 'link_url', type: 'string', isOptional: true},
                        {name: 'image_url', type: 'string', isOptional: true},
                        {name: 'emoji', type: 'string', isOptional: true},
                        {name: 'type', type: 'string'},
                        {name: 'original_id', type: 'string', isOptional: true},
                        {name: 'parent_id', type: 'string', isOptional: true},
                    ],
                }),
                createTable({
                    name: PLAYBOOK_RUN,
                    columns: [
                        {name: 'playbook_id', type: 'string'},
                        {name: 'name', type: 'string'},
                        {name: 'description', type: 'string'},
                        {name: 'is_active', type: 'boolean', isIndexed: true},
                        {name: 'owner_user_id', type: 'string'},
                        {name: 'team_id', type: 'string'},
                        {name: 'channel_id', type: 'string', isIndexed: true},
                        {name: 'post_id', type: 'string', isOptional: true},
                        {name: 'create_at', type: 'number'},
                        {name: 'end_at', type: 'number'},
                        {name: 'active_stage', type: 'number'},
                        {name: 'active_stage_title', type: 'string'},
                        {name: 'participant_ids', type: 'string'}, // JSON string
                        {name: 'summary', type: 'string'},
                        {name: 'current_status', type: 'string', isIndexed: true},
                        {name: 'last_status_update_at', type: 'number'},
                        {name: 'previous_reminder', type: 'number'},
                        {name: 'items_order', type: 'string'},
                        {name: 'retrospective_enabled', type: 'boolean'},
                        {name: 'retrospective', type: 'string'},
                        {name: 'retrospective_published_at', type: 'number'},
                        {name: 'update_at', type: 'number'},
                    ],
                }),
                createTable({
                    name: PLAYBOOK_CHECKLIST,
                    columns: [
                        {name: 'run_id', type: 'string', isIndexed: true},
                        {name: 'items_order', type: 'string'},
                        {name: 'title', type: 'string'},
                        {name: 'update_at', type: 'number'},
                    ],
                }),
                createTable({
                    name: PLAYBOOK_CHECKLIST_ITEM,
                    columns: [
                        {name: 'checklist_id', type: 'string', isIndexed: true},
                        {name: 'title', type: 'string'},
                        {name: 'state', type: 'string', isIndexed: true},
                        {name: 'state_modified', type: 'number'},
                        {name: 'assignee_id', type: 'string', isOptional: true},
                        {name: 'assignee_modified', type: 'number'},
                        {name: 'command', type: 'string', isOptional: true},
                        {name: 'command_last_run', type: 'number'},
                        {name: 'description', type: 'string'},
                        {name: 'due_date', type: 'number'},
                        {name: 'completed_at', type: 'number'},
                        {name: 'task_actions', type: 'string', isOptional: true}, // JSON string
                        {name: 'update_at', type: 'number'},
                    ],
                }),
                addColumns({
                    table: MY_CHANNEL,
                    columns: [
                        {name: 'last_playbook_runs_fetch_at', type: 'number'},
                    ],
                }),
                createTable({
                    name: CUSTOM_PROFILE_ATTRIBUTE,
                    columns: [
                        {name: 'field_id', type: 'string', isIndexed: true},
                        {name: 'user_id', type: 'string', isIndexed: true},
                        {name: 'value', type: 'string'},
                    ],
                }),
                createTable({
                    name: CUSTOM_PROFILE_FIELD,
                    columns: [
                        {name: 'group_id', type: 'string', isIndexed: true},
                        {name: 'name', type: 'string'},
                        {name: 'type', type: 'string'},
                        {name: 'target_id', type: 'string'},
                        {name: 'target_type', type: 'string'},
                        {name: 'create_at', type: 'number'},
                        {name: 'update_at', type: 'number'},
                        {name: 'delete_at', type: 'number', isOptional: true},
                        {name: 'attrs', type: 'string', isOptional: true},
                    ],
                }),
                addColumns({
                    table: CHANNEL,
                    columns: [
                        {
                            name: 'abac_policy_enforced',
                            type: 'boolean',
                            isOptional: true,
                        },
                    ],
                }),
                addColumns({
                    table: FILE,
                    columns: [{name: 'is_blocked', type: 'boolean'}],
                }),
                createTable({
                    name: SCHEDULED_POST,
                    columns: [
                        {name: 'channel_id', type: 'string', isIndexed: true},
                        {name: 'message', type: 'string'},
                        {name: 'files', type: 'string'},
                        {name: 'root_id', type: 'string', isIndexed: true},
                        {name: 'metadata', type: 'string', isOptional: true},
                        {name: 'create_at', type: 'number'},
                        {name: 'update_at', type: 'number'},
                        {name: 'scheduled_at', type: 'number'},
                        {name: 'processed_at', type: 'number'},
                        {name: 'error_code', type: 'string'},
                    ],
                }),
                addColumns({
                    table: CHANNEL,
                    columns: [
                        {
                            name: 'banner_info',
                            type: 'string',
                            isOptional: true,
                        },
                    ],
                }),
                unsafeExecuteSql(
                    'CREATE INDEX IF NOT EXISTS Post_type ON Post (type);',
                ),
                addColumns({
                    table: DRAFT,
                    columns: [{name: 'update_at', type: 'number'}],
                }),
            ],
        },
        {
            toVersion: 6,
            steps: [
                addColumns({
                    table: FILE,
                    columns: [{name: 'transcript', type: 'string'}],
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
                        {
                            name: 'conference_id',
                            type: 'string',
                            isIndexed: true,
                        },
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
                    columns: [{name: 'message_source', type: 'string'}],
                }),
            ],
        },
        {
            toVersion: 2,
            steps: [
                addColumns({
                    table: CHANNEL_INFO,
                    columns: [{name: 'files_count', type: 'number'}],
                }),
                addColumns({
                    table: DRAFT,
                    columns: [
                        {name: 'metadata', type: 'string', isOptional: true},
                    ],
                }),
            ],
        },
    ],
});
