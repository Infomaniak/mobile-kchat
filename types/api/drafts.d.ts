// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type Draft = {
    id?: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    user_id: string;
    channel_id: string;
    root_id: string;
    message: string;
    props: Record<string, any>;
    file_ids?: string[];
    metadata?: PostMetadata;
    priority?: PostPriority;

    /**
     * Every scheduled draft as a unix timestamp
     */
    timestamp?: number;
};

type DraftWithFiles = Omit<Draft, 'file_ids'> & {files: FileInfo[]};

