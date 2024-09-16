// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {AppState, type AppStateStatus} from 'react-native';

import {updateDraftFile} from '@actions/remote/draft';
import {uploadFile} from '@actions/remote/file';
import {logDebug, logWarning} from '@app/utils/log';
import {PROGRESS_TIME_TO_STORE} from '@constants/files';
import {getFullErrorMessage} from '@utils/errors';

import type {ClientResponse, ClientResponseError} from '@mattermost/react-native-network-client';

type FileHandler = {
    [clientId: string]: {
        cancel?: () => void;
        fileInfo: FileInfo;
        serverUrl: string;
        channelId: string;
        rootId: string;
        lastTimeStored: number;
        onError: Array<(msg: string) => void>;
        onProgress: Array<(p: number, b: number) => void>;
    };
}

class DraftUploadManager {
    private handlers: FileHandler = {};
    private previousAppState: AppStateStatus;

    constructor() {
        this.previousAppState = AppState.currentState;
        AppState.addEventListener('change', this.onAppStateChange);
    }

    public prepareUpload = (
        serverUrl: string,
        file: FileInfo,
        channelId: string,
        rootId: string,
        skipBytes = 0,
    ) => {
        logDebug(`[DraftUploadManager] Preparing upload for file ${file.clientId} on server ${serverUrl}`);

        this.handlers[file.clientId!] = {
            fileInfo: file,
            serverUrl,
            channelId,
            rootId,
            lastTimeStored: 0,
            onError: [],
            onProgress: [],
        };

        const onProgress = (progress: number, bytesRead?: number | null | undefined) => {
            logDebug(`[DraftUploadManager] Progress for file ${file.clientId}: ${progress}% (${bytesRead} bytes read)`);
            this.handleProgress(file.clientId!, progress, bytesRead || 0);
        };

        const onComplete = (response: ClientResponse) => {
            logDebug(`[DraftUploadManager] Upload complete for file ${file.clientId}. Response code: ${response.code}`);
            this.handleComplete(response, file.clientId!);
        };

        const onError = (response: ClientResponseError) => {
            const message = response.message || 'Unknown error';
            logDebug(`[DraftUploadManager] Upload error for file ${file.clientId}: ${message}`);
            this.handleError(message, file.clientId!);
        };

        const {error, cancel} = uploadFile(serverUrl, file, channelId, onProgress, onComplete, onError, skipBytes);
        if (error) {
            logDebug(`[DraftUploadManager] Error initiating upload for file ${file.clientId}: ${getFullErrorMessage(error)}`);
            this.handleError(getFullErrorMessage(error), file.clientId!);
            return;
        }
        this.handlers[file.clientId!].cancel = cancel;
    };
    public cancel = (clientId: string) => {
        if (this.handlers[clientId]?.cancel) {
            this.handlers[clientId].cancel?.();
            delete this.handlers[clientId];
        }
    };

    public isUploading = (clientId: string) => {
        return Boolean(this.handlers[clientId]);
    };

    public registerProgressHandler = (clientId: string, callback: (progress: number, bytes: number) => void) => {
        if (!this.handlers[clientId]) {
            return null;
        }

        this.handlers[clientId].onProgress.push(callback);
        return () => {
            if (!this.handlers[clientId]) {
                return;
            }

            this.handlers[clientId].onProgress = this.handlers[clientId].onProgress.filter((v) => v !== callback);
        };
    };

    public registerErrorHandler = (clientId: string, callback: (errMessage: string) => void) => {
        if (!this.handlers[clientId]) {
            return null;
        }

        this.handlers[clientId].onError.push(callback);
        return () => {
            if (!this.handlers[clientId]) {
                return;
            }

            this.handlers[clientId].onError = this.handlers[clientId].onError.filter((v) => v !== callback);
        };
    };

    private handleProgress = (clientId: string, progress: number, bytes: number) => {
        const h = this.handlers[clientId];
        if (!h) {
            logWarning(`[DraftUploadManager] No handler found for file ${clientId} on progress update`);
            return;
        }

        h.fileInfo.bytesRead = bytes;
        logDebug(`[DraftUploadManager] Storing progress for file ${clientId}: ${progress}%`);
        h.onProgress.forEach((c) => c(progress, bytes));
        if (AppState.currentState !== 'active' && h.lastTimeStored + PROGRESS_TIME_TO_STORE < Date.now()) {
            updateDraftFile(h.serverUrl, h.channelId, h.rootId, this.handlers[clientId].fileInfo);
            h.lastTimeStored = Date.now();
            logDebug(`[DraftUploadManager] Progress stored locally for file ${clientId}`);
        }
    };

    private handleComplete = (response: ClientResponse, clientId: string) => {
        logDebug(`[DraftUploadManager] Handling complete for file ${clientId}`);
        const h = this.handlers[clientId];
        if (!h) {
            logWarning(`[DraftUploadManager] No handler found for file ${clientId} on completion`);
            return;
        }

        if (response.code !== 201) {
            logDebug(`[DraftUploadManager] Failed to upload file ${clientId}: ${response.data?.message || 'Unknown error'}`);
            this.handleError((response.data?.message as string | undefined) || 'Failed to upload the file: unknown error', clientId);
            return;
        }

        if (!response.data) {
            logDebug(`[DraftUploadManager] No data received on upload completion for file ${clientId}`);
            this.handleError('Failed to upload the file: no data received', clientId);
            return;
        }

        const data = response.data.file_infos as FileInfo[] | undefined;
        if (!data?.length) {
            logDebug(`[DraftUploadManager] No file info received in response for file ${clientId}`);
            this.handleError('Failed to upload the file: no data received', clientId);
            return;
        }

        delete this.handlers[clientId];
        const fileInfo = data[0];
        fileInfo.clientId = h.fileInfo.clientId;
        fileInfo.localPath = h.fileInfo.localPath;

        logDebug(`[DraftUploadManager] Successfully uploaded file ${clientId}`);
        updateDraftFile(h.serverUrl, h.channelId, h.rootId, fileInfo);
    };

    private handleError = (errorMessage: string, clientId: string) => {
        logDebug(`[DraftUploadManager] Handling error for file ${clientId}: ${errorMessage}`);
        const h = this.handlers[clientId];
        if (!h) {
            logWarning(`[DraftUploadManager] No handler found for file ${clientId} on error`);
            return;
        }

        delete this.handlers[clientId];

        h.onError.forEach((c) => c(errorMessage));

        const fileInfo = {...h.fileInfo};
        fileInfo.failed = true;
        updateDraftFile(h.serverUrl, h.channelId, h.rootId, fileInfo);
    };

    private onAppStateChange = async (appState: AppStateStatus) => {
        if (appState !== 'active' && this.previousAppState === 'active') {
            await this.storeProgress();
        }

        this.previousAppState = appState;
    };

    private storeProgress = async () => {
        for (const h of Object.values(this.handlers)) {
            // eslint-disable-next-line no-await-in-loop
            await updateDraftFile(h.serverUrl, h.channelId, h.rootId, h.fileInfo);
            h.lastTimeStored = Date.now();
        }
    };
}

export default new DraftUploadManager();

export const exportedForTesting = {
    DraftUploadManager,
};
