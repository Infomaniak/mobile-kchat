// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* global FormData, fetch */

import {BASE_SERVER_URL} from '@client/rest/constants';
import {getServerCredentials} from '@init/credentials';
import {logError, logDebug} from '@utils/log';

const isPreprod = BASE_SERVER_URL.includes('preprod');
const WEB_COMPONENTS_API = isPreprod
    ? 'https://welcome.preprod.dev.infomaniak.ch/api/web-components/1'
    : 'https://welcome.infomaniak.com/api/web-components/1';

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

        logDebug('[sendFeedback] === START ===');
        logDebug('[sendFeedback] Token:', credentials.token); // Full token for curl testing
        logDebug('[sendFeedback] Token length:', credentials.token.length);
        logDebug('[sendFeedback] User ID:', credentials.userId);
        logDebug('[sendFeedback] Server URL:', params.serverUrl);
        logDebug('[sendFeedback] API URL:', WEB_COMPONENTS_API);
        logDebug('[sendFeedback] Bucket identifier:', params.bucketIdentifier);
        logDebug('[sendFeedback] Type:', params.type);
        logDebug('[sendFeedback] Subject:', params.subject);
        logDebug('[sendFeedback] Description:', params.description);
        logDebug('[sendFeedback] Priority value:', params.priorityValue);
        logDebug('[sendFeedback] Priority label:', params.priorityLabel);
        logDebug('[sendFeedback] Extra:', JSON.stringify(params.extra));
        logDebug('[sendFeedback] Files count:', params.files.length);

        // D'abord testons le GET buckets pour voir si l'auth marche
        const bucketsUrl = `${WEB_COMPONENTS_API}/report?route=kchat&project=kchat`;
        logDebug('[sendFeedback] Test GET:', bucketsUrl);
        
        const testResponse = await fetch(bucketsUrl, { // eslint-disable-line no-undef
            method: 'GET',
            headers: {
                Authorization: `Bearer ${credentials.token}`,
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        
        const testBody = await testResponse.text();
        logDebug('[sendFeedback] GET status:', testResponse.status);
        logDebug('[sendFeedback] GET body:', testBody);

        // Maintenant le POST
        const formData = new FormData(); // eslint-disable-line no-undef
        formData.append('bucket_identifier', params.bucketIdentifier);
        formData.append('type', params.type);
        formData.append('subject', params.subject);
        formData.append('description', params.description);
        formData.append('priority[value]', String(params.priorityValue));
        formData.append('priority[label]', params.priorityLabel);

        for (const [key, value] of Object.entries(params.extra || {})) {
            formData.append(`extra[${key}]`, value);
        }

        const url = `${WEB_COMPONENTS_API}/report`;
        
        logDebug('[sendFeedback] POST:', url);

        const response = await fetch(url, { // eslint-disable-line no-undef
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

        const result = JSON.parse(bodyText) as { data?: { url: string } };
        return {data: result.data?.url, error: null};
    } catch (error) {
        logError('[sendFeedback] Exception:', error);
        return {error, data: null};
    } finally {
        logDebug('[sendFeedback] === END ===');
    }
};
