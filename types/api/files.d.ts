// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type FileInfo = {
    id?: string;
    bytesRead?: number;
    channel_id?: string;
    clientId?: string;
    create_at?: number;
    delete_at?: number;
    extension: string;
    failed?: boolean;
    has_preview_image: boolean;
    height: number;
    localPath?: string;
    mime_type: string;
    mini_preview?: string;
    name: string;
    transcript: Transcript;
    post_id: string;
    post_id?: string;
    size: number;
    update_at?: number;
    uri?: string;
    user_id: string;
    width: number;
    is_voice_recording?: boolean;
    postProps?: Record<string, unknown>;
};

type TranscriptSegment = {
    id: number;
    seek: number;
    start: number;
    end: number;
    text: string;
    tokens: number[];
    temperature: number;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
};

type TranscriptWord = {
    word: string;
    start: number;
    end: number;
};

type Transcript = {
    text: string;
    duration: number;
    language: string;
    task: 'transcribe' | 'translate';
    segments: TranscriptSegment[];
    words?: TranscriptWord[];
};

type FilesState = {
    files: Dictionary<FileInfo>;
    fileIdsByPostId: Dictionary<string[]>;
    filePublicLink?: string;
};

type FileUploadResponse = {
    file_infos: FileInfo[];
    client_ids: string[];
};

type FileSearchParams = {
    terms: string;
    is_or_search: boolean;
};
