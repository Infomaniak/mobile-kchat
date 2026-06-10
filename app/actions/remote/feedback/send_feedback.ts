// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {sendFeedbackReport, type SendFeedbackClientParams} from '@client/webcomponents';
import {getServerCredentials} from '@init/credentials';
import {logError, logInfo} from '@utils/log';

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

        const clientParams: SendFeedbackClientParams = {
            token: credentials.token,
            ...params,
        };

        logInfo('[sendFeedback] Sending feedback report...');
        const result = await sendFeedbackReport(clientParams);
        logInfo('[sendFeedback] Feedback sent successfully:', result.data?.url || 'no URL');

        return {data: result.data?.url, error: null};
    } catch (error) {
        logError('[sendFeedback] Exception:', error);
        return {error, data: null};
    }
};
