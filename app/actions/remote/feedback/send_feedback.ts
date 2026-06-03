// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getServerCredentials} from '@init/credentials';
import {logError} from '@utils/log';

const WEB_COMPONENTS_API = 'https://welcome.infomaniak.com/api/web-components/1';

export type SendFeedbackParams = {
    serverUrl: string;
    bucketIdentifier: string;
    type: 'bugs' | 'features';
    subject: string;
    description: string;
    priorityValue: number;
    priorityLabel: string;
    files: Array<{uri: string; type?: string; fileName?: string}>;
    extra?: Record<string, string>;
}

export const sendFeedback = async (params: SendFeedbackParams) => {
    try {
        const credentials = await getServerCredentials(params.serverUrl);
        if (!credentials?.token) {
            return {error: new Error('No OAuth token available') as any};
        }

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

        const response = await fetch(`${WEB_COMPONENTS_API}/report`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${credentials.token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            return {error: new Error(`HTTP ${response.status}: ${response.statusText}`), data: undefined};
        }

        const result = await response.json() as { data?: { url: string } };
        return {data: result.data?.url, error: undefined};
    } catch (error) {
        logError('[sendFeedback]', error);
        return {error, data: undefined};
    }
};
