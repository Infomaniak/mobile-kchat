// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {Model} from '@nozbe/watermelondb';
import type {Associations} from '@nozbe/watermelondb/Model';

/**
 * The Draft model represents  the draft state of messages in Direct/Group messages and in channels
 */
declare class DraftModel extends Model {
    /** table (name) : Draft */
    static table: string;

    /** associations : Describes every relationship to this table. */
    static associations: Associations;

    /** create_at : The timestamp to when this post was first created */
    createAt: number;

    /** delete_at : The timestamp to when this post was last archived/deleted */
    deleteAt: number;

    /** update_at : The timestamp to when this post was last updated on the server */
    updateAt: number;

    userId: string;

    /** channel_id : The foreign key pointing to the channel in which the draft was made */
    channelId: string;

    /** root_id : The root_id will be empty most of the time unless the draft relates to a draft reply of a thread */
    rootId: string;

    /** message : The draft message */
    message: string;

    props: any;

    /** files : The files field will hold an array of files object that have not yet been uploaded and persisted within the FILE table */
    files: FileInfo[];

    metadata?: PostMetadata;

    priority?: PostPriority;

    timestamp?: number;
}

export default DraftModel;
