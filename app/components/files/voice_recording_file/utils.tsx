// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
export function extractTranscript(file?: { transcript?: string }): string {
    if (!file?.transcript) {
        return '';
    }
    try {
        const transcriptObj = JSON.parse(file.transcript);
        return transcriptObj.text?.trim() || '';
    } catch {
        return '';
    }
}
