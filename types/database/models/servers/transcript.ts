// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
export type Transcript = {
    transcript: {
        segments: Array<{
            start: number;
            text: string;
        }>;
    };
};
export type TranscriptData = {
    segments: Array<{
        text: string;
        start: number;
    }>;
};
