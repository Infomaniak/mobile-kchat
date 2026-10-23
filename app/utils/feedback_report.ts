// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import TurboLogger from '@mattermost/react-native-turbo-log';
import RNUtils from '@mattermost/rnutils';
import {File} from 'expo-file-system';

import {deleteFile, pathWithPrefix} from '@utils/file';
import {logDebug} from '@utils/log';
import {metadataToString} from '@utils/share_logs';

import type {ReportAProblemMetadata} from '@typings/screens/report_a_problem';

const DESCRIPTION_SEPARATOR = '\n\n---\n';
const MAX_LOG_ATTACHMENT_SIZE = 32 * 1024 * 1024;

const DESCRIPTION_METADATA_KEYS = ['currentUserId', 'currentTeamId', 'appVersion', 'appPlatform'] as const;

export type LogsAttachment = {
    uri: string;
    fileName: string;
    rawPath: string;
};

export function buildFeedbackDescription(description: string, metadata: ReportAProblemMetadata): string {
    const blockMetadata = Object.fromEntries(
        DESCRIPTION_METADATA_KEYS.map((key) => [key, metadata[key]]),
    );
    return `${description}${DESCRIPTION_SEPARATOR}${metadataToString(blockMetadata)}`;
}

export const createLogsAttachment = async (): Promise<LogsAttachment | null> => {
    let logPaths: string[];
    try {
        logPaths = await TurboLogger.getLogPaths();
    } catch (error) {
        logDebug('[feedback_report] Failed to read app log paths', error);
        return null;
    }

    if (!logPaths.length) {
        logDebug('[feedback_report] No app log files available');
        return null;
    }

    let rawPath: string;
    try {
        rawPath = await RNUtils.createZipFile(logPaths);
    } catch (error) {
        logDebug('[feedback_report] Failed to zip app logs', error);
        return null;
    }

    if (!rawPath) {
        logDebug('[feedback_report] createZipFile returned empty path');
        return null;
    }

    try {
        const zipUri = pathWithPrefix('file://', rawPath);
        const info = new File(zipUri).info();
        if (!info.exists) {
            logDebug('[feedback_report] Zip file does not exist after creation');
            deleteFile(rawPath);
            return null;
        }

        if ((info.size ?? 0) > MAX_LOG_ATTACHMENT_SIZE) {
            logDebug(`[feedback_report] App logs zip too large (${info.size} bytes), skipping attachment`);
            deleteFile(rawPath);
            return null;
        }

        return {
            uri: zipUri,
            fileName: `app-logs-${Date.now()}.zip`,
            rawPath,
        };
    } catch (error) {
        logDebug('[feedback_report] Failed to inspect app logs zip', error);
        deleteFile(rawPath);
        return null;
    }
};

export const cleanupLogsAttachment = (attachment?: LogsAttachment | null) => {
    if (attachment) {
        deleteFile(attachment.rawPath);
    }
};

export const isPayloadTooLargeError = (error: unknown): boolean => {
    if (!(error instanceof Error)) {
        return false;
    }

    if (/\b413\b/.test(error.message)) {
        return true;
    }

    return /payload too large|entity too large|request too large|file is too large|exceeds the maximum/i.test(error.message);
};
