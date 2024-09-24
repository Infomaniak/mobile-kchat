// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {isEqual, omit} from 'lodash';

import {generateId} from '@app/utils/general';
import DatabaseManager from '@database/manager';
import {DraftModel} from '@database/models/server';
import NetworkManager from '@managers/network_manager';
import {getDraft} from '@queries/servers/drafts';
import {getCurrentUserId} from '@queries/servers/system';
import {logDebug, logError} from '@utils/log';

import type Model from '@nozbe/watermelondb/Model';

type DraftRemoteResponse = Promise<
    | { success: true; draft: DraftModel | undefined }
    | { success: false; error: unknown }
>;

/**
 * Create a new empty draft
 */
const newEmptyDraft = (): Omit<DraftWithFiles, 'user_id' | 'channel_id' | 'root_id'> => {
    const now = Date.now();

    return {
        create_at: now,
        update_at: now,
        delete_at: 0,
        message: '',
        props: {},
        files: [],
    };
};

/** Make sure that there is at least one usefull property
 * of the draft that is not empty
 */
const isEmptyDraft = (draft: Partial<DraftWithFiles>) => (
    isEqual(draft.files ?? [], []) &&
    ((draft.message ?? '') === '') &&
    (typeof draft.priority === 'undefined')
);

/**
 * Create a new draft:
 *  - Add a new row to the DB so that the update is immediatly visible
 *  - Upsert the draft on the API
 *  - Update the local draft with the API's response data
 */
const createDraft = async (
    serverUrl: string,
    newDraft: Partial<DraftWithFiles> & Pick<Draft, 'channel_id' | 'root_id'>,
    remoteUpdate: boolean,
): DraftRemoteResponse => {
    const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

    // Add all missing properties to the partial draft
    const mergedDraft = {
        ...newEmptyDraft(),
        user_id: await getCurrentUserId(database),
        ...newDraft,
    };

    // If the draft is empty, it's not created
    if (isEmptyDraft(mergedDraft)) {
        return {success: true, draft: undefined};
    }

    // Prepare new records or update DB
    // LOCAL create
    const draft = {...mergedDraft, id: generateId(), create_at: Date.now()};
    const draftModel = await operator.handleDraft({draft, prepareRecordsOnly: false});

    // Trigger the lazy remote update
    if (remoteUpdate) {
        syncRemoteDraft(serverUrl, draft);
    }

    return {success: true, draft: draftModel};
};

/**
 * Delete a draft:
 *  - Remove the row from the DB
 *  - Delete the draft on the API
 */
const deleteDraft = async (serverUrl: string, draft: DraftModel): DraftRemoteResponse => {
    const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
    const client = NetworkManager.getClient(serverUrl);
    logDebug('deleteDraft', draft);

    // LOCAL delete
    draft.prepareDestroyPermanently();
    await operator.batchRecords([draft], 'deleteDraft');

    // REMOTE delete
    await client.deleteDraft(draft.channelId, draft.rootId);

    return {success: true, draft};
};

/**
 * Try to find a draft that matches the newDraft
 * if the new draft is empty, delete it
 * if it does not exists, create a new draft
 * if it does exist, update this draft in place
 */
const syncDraft = async (
    serverUrl: string,
    draft: Partial<DraftWithFiles> & Pick<Draft, 'channel_id' | 'root_id'>,
    remoteUpdate: boolean = true,
): DraftRemoteResponse => {
    const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

    // Try to find a draft that matches the draft
    const draftModel = await getDraft(database, draft.channel_id, draft.root_id);

    // Update existing draft
    if (draftModel) {
        const mergedDraft: DraftWithFiles = {
            ...DraftModel.toDraftWithFile(draftModel),
            ...draft,
        };

        // If all properties of the draft are empty
        // we are actually deleting this draft
        if (isEmptyDraft(mergedDraft)) {
            return deleteDraft(serverUrl, draftModel);
        }

        // Local update
        let updated = false;
        draftModel.prepareUpdate((d) => {
            // Update each column one by one
            // - files
            const newFiles = mergedDraft.files ?? [];
            if (!isEqual(d.files, newFiles)) {
                updated = true;
                d.files = newFiles;
            }

            // - message
            const newMessage = mergedDraft.message ?? '';
            if (d.message !== newMessage) {
                updated = true;
                d.message = newMessage;
            }

            // - priority
            const newPriority = mergedDraft.priority;
            if (!isEqual(d.priority, newPriority)) {
                updated = true;
                d.priority = newPriority;
                d.metadata = {...d.metadata, priority: newPriority};
            }
        });

        // LOCAL update
        await operator.batchRecords([draftModel], 'updateDraft');

        // If no properties were updated cancel the actual process
        if (!updated) {
            return {success: true, draft: draftModel};
        }

        // Trigger the lazy remote update
        if (remoteUpdate) {
            syncRemoteDraft(serverUrl, mergedDraft);
        }

        return {success: true, draft: draftModel};
    }

    // Create a new draft
    return createDraft(serverUrl, draft, remoteUpdate);
};

/**
 * Debounced remote update
 * stack all calls and only fire the last one
 */
const syncRemoteDraft = (
    async (serverUrl: string, draft: DraftWithFiles) => {
        const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const client = NetworkManager.getClient(serverUrl);

        logDebug('syncRemoteDraft - Starting remote sync for draft:', draft);

        try {
            // REMOTE update
            const remoteDraft = await client.upsertDraft(
                DraftModel.toDraft(draft),
            );

            const remoteDraftWithFiles = {
                ...omit(remoteDraft, 'file_ids'),
                files: draft.files ?? [],
            };

            // LOCAL sync
            // Find the matching local draft in DB
            const channelId = remoteDraftWithFiles.channel_id;
            const rootId = remoteDraftWithFiles.root_id;
            const localDraft = await getDraft(database, channelId, rootId);

            // If no matching local draft is found, create a new one
            if (localDraft) {
                logDebug('syncRemoteDraft - Matching local draft found:', localDraft);

                // We replace localdraft current id with remote Draft id
                if (draft.id !== remoteDraftWithFiles.id) {
                    const models: Model[] = [

                        // Duplicate with new id
                        await operator.handleDraft({
                            draft: {...DraftModel.toDraftWithFile(localDraft),
                                id: remoteDraftWithFiles.id},
                            prepareRecordsOnly: true,
                        }),

                        // remove previous draft
                        localDraft.prepareDestroyPermanently(),
                    ];
                    await operator.batchRecords(models, 'updateSyncDraft');
                }
            } else {
                await operator.handleDraft({draft: remoteDraftWithFiles, prepareRecordsOnly: false});
            }
        } catch (error) {
            logError('syncRemoteDraft - Error during remote sync:', error);
        }
    }
);

export async function updateDraftFile(serverUrl: string, channelId: string, rootId: string, file: FileInfo): DraftRemoteResponse {
    logDebug('updateDraftFile', file);
    try {
        // Get the existing draft
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const draft = await getDraft(database, channelId, rootId);
        if (!draft) {
            return {success: false, error: 'no draft'};
        }

        // Find the related file we want to update
        const i = draft.files.findIndex((v) => v.clientId === file.clientId);
        if (i === -1) {
            return {success: false, error: 'file not found'};
        }

        // Update the files
        file.is_voice_recording = draft.files[i].is_voice_recording;
        const files = [...draft.files]; // We create a new list to make sure we re-render the draft input.
        files[i] = file;

        return syncDraft(serverUrl, {
            channel_id: channelId,
            root_id: rootId,
            files,
        });
    } catch (error) {
        logError('Failed updateDraftFile', error);
        return {success: false, error};
    }
}

export async function removeDraftFile(serverUrl: string, channelId: string, rootId: string, clientId: string): DraftRemoteResponse {
    logDebug('removeDraftFile - Removing file with clientId:', clientId);

    try {
        // Get the existing draft
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const draft = await getDraft(database, channelId, rootId);
        if (!draft) {
            logError('removeDraftFile - No draft found for file removal.');
            return {success: false, error: 'no draft'};
        }

        // Find the related file we want to delete
        const i = draft.files.findIndex((v) => v.clientId === clientId);
        if (i === -1) {
            logError('removeDraftFile - File not found in draft.');
            return {success: false, error: 'file not found'};
        }

        // Update the files
        const files = draft.files.filter((v, index) => index !== i);

        return syncDraft(serverUrl, {
            channel_id: channelId,
            root_id: rootId,
            files,
        });
    } catch (error) {
        logError('Failed to remove draft file', error);
        return {success: false, error};
    }
}

export async function updateDraftMessage(serverUrl: string, channelId: string, rootId: string, message: string): DraftRemoteResponse {
    logDebug('updateDraftMessage');
    try {
        return syncDraft(serverUrl, {
            channel_id: channelId,
            root_id: rootId,
            message,
        });
    } catch (error) {
        logError('Failed to update draft message', error);
        return {success: false, error};
    }
}

export async function addFilesToDraft(serverUrl: string, channelId: string, rootId: string, newFiles: FileInfo[], remoteUpdate = false): DraftRemoteResponse {
    logDebug('addFilesToDraft - New files:', newFiles);
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const draft = await getDraft(database, channelId, rootId);

        // Update/create the files
        const files = draft ? [...draft.files, ...newFiles] : newFiles;
        logDebug('addFilesToDraft - Files to be added to the draft:', files);

        return syncDraft(serverUrl, {
            channel_id: channelId,
            root_id: rootId,
            files,
        }, remoteUpdate);
    } catch (error) {
        logError('Failed to add files to draft', error);
        return {success: false, error};
    }
}

export const removeDraft = async (serverUrl: string, channelId: string, rootId = ''): DraftRemoteResponse => {
    logDebug('removeDraft');
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const draft = await getDraft(database, channelId, rootId);

        return draft ? deleteDraft(serverUrl, draft) : {success: true, draft: undefined};
    } catch (error) {
        logError('Failed removeDraft', error);
        return {success: false, error};
    }
};

export async function updateDraftPriority(serverUrl: string, channelId: string, rootId: string, priority: PostPriority): DraftRemoteResponse {
    logDebug('updateDraftPriority');
    try {
        return syncDraft(serverUrl, {
            channel_id: channelId,
            root_id: rootId,
            priority,
        });
    } catch (error) {
        logError('Failed updateDraftPriority', error);
        return {success: false, error};
    }
}
