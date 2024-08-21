// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {field, json} from '@nozbe/watermelondb/decorators';
import Model, {type Associations} from '@nozbe/watermelondb/Model';

import {MM_TABLES} from '@constants/database';
import {identity, safeParseJSON} from '@utils/helpers';

import type DraftModelInterface from '@typings/database/models/servers/draft';

const {CHANNEL, DRAFT, POST} = MM_TABLES.SERVER;

/**
 * The Draft model represents  the draft state of messages in Direct/Group messages and in channels
 */
export default class DraftModel extends Model implements DraftModelInterface {
    /** table (name) : Draft */
    static table = DRAFT;

    /** associations : Describes every relationship to this table. */
    static associations: Associations = {

        /** A DRAFT can belong to only one CHANNEL  */
        [CHANNEL]: {type: 'belongs_to', key: 'channel_id'},

        /** A DRAFT is associated to only one POST */
        [POST]: {type: 'belongs_to', key: 'root_id'},
    };

    /** create_at : The creation date for this draft */
    @field('create_at') createAt!: number;

    /** update_at : The creation date for this draft */
    @field('update_at') updateAt!: number;

    /** delete_at : The deletion date for this draft */
    @field('delete_at') deleteAt!: number;

    /** user_id : The user id of the user that owns this draft */
    @field('user_id') userId!: string;

    /** channel_id : The foreign key pointing to the channel in which the draft was made */
    @field('channel_id') channelId!: string;

    /** root_id : The root_id will be empty most of the time unless the draft relates to a draft reply of a thread */
    @field('root_id') rootId!: string;

    /** message : The draft message */
    @field('message') message!: string;

    /** props : Additional attributes for this props */
    @json('props', safeParseJSON) props!: any;

    /** files : The files field will hold an array of file objects that have not yet been uploaded and persisted within the FILE table */
    @json('files', safeParseJSON) files!: FileInfo[];

    /** metadata : Draft's post acknowledgements, embeds, emojis, etc... */
    @json('metadata', identity) metadata?: PostMetadata;

    /** priority : Draft's post priority */
    @json('priority', identity) priority?: PostPriority;

    /** timestamp : Every scheduled draft as a unix timestamp */
    @field('timestamp') timestamp?: number;

    toApi = async (): Promise<Draft> => ({
        id: this.id,
        create_at: this.createAt,
        update_at: this.updateAt,
        delete_at: this.deleteAt,
        user_id: this.userId,
        channel_id: this.channelId,
        root_id: this.rootId,
        message: this.message,
        props: this.props,
        file_ids: this.files.reduce<string[]>((acc, curr) => {
            if (curr.id) {
                acc.push(curr.id);
            }
            return acc;
        }, []),
        metadata: (this.metadata ? this.metadata : {}) as PostMetadata,
        priority: this.priority,
        timestamp: this.timestamp,
    });
}
