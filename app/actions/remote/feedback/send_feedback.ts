// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* global FormData, fetch */

import {getServerCredentials} from '@init/credentials';
import {logError, logDebug} from '@utils/log';

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
            return {error: new Error('No auth token available') as any};
        }

        const apiUrl = WEB_COMPONENTS_API;

        logDebug('[sendFeedback] === START ===');
        logDebug('[sendFeedback] Token length:', credentials.token.length);
        logDebug('[sendFeedback] Server URL:', params.serverUrl);
        logDebug('[sendFeedback] API URL:', apiUrl);
        logDebug('[sendFeedback] Extra:', JSON.stringify(params.extra));

        // Now POST
        logDebug('[sendFeedback] Subject:', params.subject);
        logDebug('[sendFeedback] Type:', params.type);
        logDebug('[sendFeedback] Priority:', params.priorityLabel);
        logDebug('[sendFeedback] Files count:', params.files.length);

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
        logDebug('[sendFeedback] POST:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${credentials.token}`,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: formData,
        });

        logDebug('[sendFeedback] POST status:', response.status, response.statusText);

        const bodyText = await response.text();
        logDebug('[sendFeedback] POST body:', bodyText);

        if (!response.ok) {
            return {error: new Error(`HTTP ${response.status}: ${bodyText || response.statusText}`), data: null};
        }

        try {
            const result = JSON.parse(bodyText) as { data?: { url: string } };
            return {data: result.data?.url, error: null};
        } catch (parseError) {
            logError('[sendFeedback] Failed to parse response:', parseError);
            return {error: new Error('Invalid response from server'), data: null};
        }
    } catch (error) {
        logError('[sendFeedback] Exception:', error);
        return {error, data: null};
    } finally {
        logDebug('[sendFeedback] === END ===');
    }
};
