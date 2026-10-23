// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.

import TurboLogger from '@mattermost/react-native-turbo-log';
import RNUtils from '@mattermost/rnutils';
import {File} from 'expo-file-system';

import {deleteFile} from '@utils/file';

import {buildFeedbackDescription, cleanupLogsAttachment, createLogsAttachment, isPayloadTooLargeError} from './feedback_report';

import type {ReportAProblemMetadata} from '@typings/screens/report_a_problem';

jest.mock('@utils/file', () => ({
    ...jest.requireActual('@utils/file'),
    deleteFile: jest.fn(),
}));

describe('buildFeedbackDescription', () => {
    const metadata: ReportAProblemMetadata = {
        currentUserId: 'user1',
        currentTeamId: 'team1',
        serverVersion: '1.0.0',
        appVersion: '2.0.0',
        appPlatform: 'ios',
    };

    it('should append the metadata block to the user description', () => {
        const result = buildFeedbackDescription('Something is broken', metadata);
        expect(result).toBe('Something is broken\n\n---\nCurrent User ID: user1\nCurrent Team ID: team1\nApp Version: 2.0.0\nApp Platform: ios');
    });

    it('should include app version and app platform in the result', () => {
        const result = buildFeedbackDescription('desc', metadata);
        expect(result).toContain('App Version: 2.0.0');
        expect(result).toContain('App Platform: ios');
    });

    it('should not include the server version in the result', () => {
        const result = buildFeedbackDescription('desc', metadata);
        expect(result).not.toContain('Server Version');
    });
});

describe('createLogsAttachment', () => {
    afterEach(() => {
        const sharedInfo = new File('file:///probe').info();
        sharedInfo.size = 0;
        sharedInfo.exists = true;
    });

    it('should return null when there are no log files', async () => {
        jest.mocked(TurboLogger.getLogPaths).mockResolvedValue([]);
        const result = await createLogsAttachment();
        expect(result).toBeNull();
        expect(RNUtils.createZipFile).not.toHaveBeenCalled();
    });

    it('should return null when getLogPaths rejects', async () => {
        jest.mocked(TurboLogger.getLogPaths).mockRejectedValue(new Error('no logs'));
        const result = await createLogsAttachment();
        expect(result).toBeNull();
        expect(RNUtils.createZipFile).not.toHaveBeenCalled();
    });

    it('should return null when createZipFile rejects', async () => {
        jest.mocked(TurboLogger.getLogPaths).mockResolvedValue(['/path/to/log1']);
        jest.mocked(RNUtils.createZipFile).mockRejectedValue(new Error('zip failed'));
        const result = await createLogsAttachment();
        expect(result).toBeNull();
    });

    it('should return null when createZipFile returns an empty path', async () => {
        jest.mocked(TurboLogger.getLogPaths).mockResolvedValue(['/path/to/log1']);
        jest.mocked(RNUtils.createZipFile).mockResolvedValue('');
        const result = await createLogsAttachment();
        expect(result).toBeNull();
    });

    it('should return null and delete the zip when it exceeds the size limit', async () => {
        jest.mocked(TurboLogger.getLogPaths).mockResolvedValue(['/path/to/log1']);
        jest.mocked(RNUtils.createZipFile).mockResolvedValue('/path/to/logs.zip');

        const sharedInfo = new File('file:///probe').info();
        sharedInfo.size = 33 * 1024 * 1024;

        const result = await createLogsAttachment();
        expect(result).toBeNull();
        expect(deleteFile).toHaveBeenCalledWith('/path/to/logs.zip');
    });

    it('should return a file attachment with a zip uri and file name', async () => {
        jest.mocked(TurboLogger.getLogPaths).mockResolvedValue(['/path/to/log1']);
        jest.mocked(RNUtils.createZipFile).mockResolvedValue('/path/to/logs.zip');

        const result = await createLogsAttachment();
        expect(result).not.toBeNull();
        expect(result!.uri).toBe('file:///path/to/logs.zip');
        expect(result!.fileName).toMatch(/^app-logs-\d+\.zip$/);
        expect(result!.rawPath).toBe('/path/to/logs.zip');
    });
});

describe('cleanupLogsAttachment', () => {
    it('should not throw when called without an attachment', () => {
        expect(() => cleanupLogsAttachment(null)).not.toThrow();
        expect(() => cleanupLogsAttachment(undefined)).not.toThrow();
    });

    it('should delete the zip file of the attachment', () => {
        cleanupLogsAttachment({uri: 'file:///path/to/logs.zip', fileName: 'app-logs-1.zip', rawPath: '/path/to/logs.zip'});
        expect(deleteFile).toHaveBeenCalledWith('/path/to/logs.zip');
    });
});

describe('isPayloadTooLargeError', () => {
    it.each([
        ['HTTP 413: Payload Too Large', true],
        ['HTTP 413: Request Entity Too Large', true],
        ['HTTP 500: The file is too large', true],
        ['upload size exceeds the maximum allowed', true],
        ['HTTP 500: Internal server error', false],
        ['Network request failed', false],
    ])('should detect "%s" as payload too large: %s', (message, expected) => {
        expect(isPayloadTooLargeError(new Error(message))).toBe(expected);
    });

    it('should return false for non-Error values', () => {
        expect(isPayloadTooLargeError('HTTP 413')).toBe(false);
        expect(isPayloadTooLargeError(undefined)).toBe(false);
    });
});
