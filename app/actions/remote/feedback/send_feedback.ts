// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* global FormData, fetch */

import {getServerCredentials} from '@init/credentials';
import {logError, logInfo} from '@utils/log';

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
            logError('[sendFeedback] No auth token available');
            return {error: new Error('No auth token available') as any};
        }

        const apiUrl = WEB_COMPONENTS_API;

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

        const url = `${apiUrl}/report`;
        logInfo('[sendFeedback] Sending feedback report...');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${credentials.token}`,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
        });

        const bodyText = await response.text();

        if (!response.ok) {
            logError(`[sendFeedback] HTTP ${response.status}: ${bodyText || response.statusText}`);
            return {error: new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`), data: null};
        }

        try {
            const result = JSON.parse(bodyText) as { data?: { url: string } };
            logInfo('[sendFeedback] Feedback sent successfully:', result.data?.url || 'no URL');
            return {data: result.data?.url, error: null};
        } catch (parseError) {
            logError('[sendFeedback] Failed to parse response:', parseError);
            return {error: new Error('Invalid response from server'), data: null};
        }
    } catch (error) {
        logError('[sendFeedback] Exception:', error);
        return {error, data: null};
    }
};
