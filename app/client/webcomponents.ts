// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* global FormData, fetch */

import {logError} from '@utils/log';

const BASE_URL = 'https://welcome.infomaniak.com/api/web-components/1';

export type SendFeedbackClientParams = {
    token: string;
    bucketIdentifier: string;
    type: 'bugs' | 'features';
    subject: string;
    description: string;
    priorityValue: number;
    priorityLabel: string;
    files: Array<{uri: string; type?: string; fileName?: string}>;
    extra?: Record<string, string>;
}

export async function sendFeedbackReport(params: SendFeedbackClientParams) {
    const formData = new FormData();
    formData.append('bucket_identifier', params.bucketIdentifier);
    formData.append('type', params.type);
    formData.append('subject', params.subject);
    formData.append('description', params.description);
    formData.append('priority[value]', String(params.priorityValue));
    formData.append('priority[label]', params.priorityLabel);

    for (const [key, value] of Object.entries(params.extra || {})) {
        formData.append(`extra[${key}]`, value);
    }

    params.files.forEach((file, index) => {
        formData.append(`file_${index}`, {
            uri: file.uri,
            type: file.type || 'application/octet-stream',
            name: file.fileName || `file_${index}`,
        } as any);
    });

    const url = `${BASE_URL}/report`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${params.token}`,
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
    });

    const bodyText = await response.text();

    if (!response.ok) {
        logError(`[WebComponentsClient] HTTP ${response.status}: ${bodyText || response.statusText}`);
        throw new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`);
    }

    try {
        return JSON.parse(bodyText) as { data?: { url: string } };
    } catch (parseError) {
        logError('[WebComponentsClient] Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
    }
}
