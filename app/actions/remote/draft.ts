// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {isEqual} from 'lodash';

import DatabaseManager from '@database/manager';
import {DraftModel} from '@database/models/server';
import NetworkManager from '@managers/network_manager';
import {getDraft} from '@queries/servers/drafts';
import {getCurrentUserId} from '@queries/servers/system';
import {logError} from '@utils/log';

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

/**
 * Create a new draft:
 *  - Add a new row to the DB so that the update is immediatly visible
 *  - Upsert the draft on the API
 *  - Update the local draft with the API's response data
 */
const createDraft = async (
    serverUrl: string,
    newDraft: Partial<DraftWithFiles> & Pick<Draft, 'channel_id' | 'root_id'>,
): DraftRemoteResponse => {
    const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
    const client = NetworkManager.getClient(serverUrl);

    // Add all missing properties to the partial draft
    const mergedDraft = {
        ...newEmptyDraft(),
        user_id: await getCurrentUserId(database),
        ...newDraft,
    };

    // Make sure that there is at least one usefull property
    // of the draft that is not empty
    const allPropertiesAreEmpty = (
        isEqual(newDraft.files ?? [], []) &&
        ((newDraft.message ?? '') === '') &&
        (typeof newDraft.priority === 'undefined')
    );

    // If the draft is empty, it's not created
    if (allPropertiesAreEmpty) {
        return {success: true, draft: undefined};
    }

    // Prepare new records or update DB
    // LOCAL create
    const draft = await operator.handleDraft({draft: mergedDraft, prepareRecordsOnly: false});

    // REMOTE create
    client.upsertDraft(mergedDraft);

    return {success: true, draft};
};

/**
 * Delete a draft:
 *  - Remove the row from the DB
 *  - Delete the draft on the API
 */
const deleteDraft = async (serverUrl: string, draft: DraftModel): DraftRemoteResponse => {
    const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
    const client = NetworkManager.getClient(serverUrl);

    // LOCAL delete
    await draft.destroyPermanently();
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
): DraftRemoteResponse => {
    const {operator, database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
    const client = NetworkManager.getClient(serverUrl);

    // Try to find a draft that matches the draft
    const existingDraftModel = await getDraft(database, draft.channel_id, draft.root_id);

    // Update existing draft
    if (existingDraftModel) {
        // Local update
        let updated = false;
        let allPropertiesAreEmpty = true;
        existingDraftModel.prepareUpdate((d) => {
            // Update each column one by one
            // - files
            const newFiles = draft.files ?? [];
            if (!isEqual(d.files, newFiles)) {
                updated = true;
                d.files = newFiles;
                allPropertiesAreEmpty &&= isEqual(newFiles, []);
            }

            // - message
            const newMessage = draft.message ?? '';
            if (d.message !== draft.message) {
                updated = true;
                d.message = newMessage;
                allPropertiesAreEmpty &&= newMessage === '';
            }

            // - priority
            if (isEqual(d.priority, draft.priority)) {
                updated = true;
                d.priority = draft.priority;
                d.metadata = {...d.metadata, priority: draft.priority};
                allPropertiesAreEmpty &&= (typeof draft.priority === 'undefined');
            }
        });

        // If all properties of the draft are empty
        // we are actually deleting this draft
        const shouldDelete = allPropertiesAreEmpty;
        if (shouldDelete) {
            return deleteDraft(serverUrl, existingDraftModel);
        }

        // If no properties were updated cancel the actual process
        if (!updated) {
            return {success: true, draft: existingDraftModel};
        }

        // LOCAL update
        await operator.batchRecords([existingDraftModel], 'updateDraft');

        // REMOTE update
        const remoteDraft = await client.upsertDraft(await DraftModel.toApi(existingDraftModel));

        // LOCAL sync
        const models: Model[] = [existingDraftModel.prepareDestroyPermanently()];
        const updatedDraftModel = await operator.handleDraft({
            draft: {...remoteDraft, files: draft.files ?? []},
            prepareRecordsOnly: true,
        });
        models.push(updatedDraftModel);

        await operator.batchRecords(models, 'updateSyncDraft');

        return {success: true, draft: updatedDraftModel};
    }

    // Create a new draft
    return createDraft(serverUrl, draft);
};

export async function updateDraftFile(serverUrl: string, channelId: string, rootId: string, file: FileInfo): DraftRemoteResponse {
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
    try {
        // Get the existing draft
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const draft = await getDraft(database, channelId, rootId);
        if (!draft) {
            return {success: false, error: 'no draft'};
        }

        // Find the related file we want to delete
        const i = draft.files.findIndex((v) => v.clientId === clientId);
        if (i === -1) {
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
        logError('Failed removeDraftFile', error);
        return {success: false, error};
    }
}

export async function updateDraftMessage(serverUrl: string, channelId: string, rootId: string, message: string): DraftRemoteResponse {
    try {
        return syncDraft(serverUrl, {
            channel_id: channelId,
            root_id: rootId,
            message,
        });
    } catch (error) {
        logError('Failed updateDraftMessage', error);
        return {success: false, error};
    }
}

export async function addFilesToDraft(serverUrl: string, channelId: string, rootId: string, newFiles: FileInfo[]): DraftRemoteResponse {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const draft = await getDraft(database, channelId, rootId);

        // Update/create the files
        const files = draft ? [...draft.files, ...newFiles] : newFiles;

        return syncDraft(serverUrl, {
            channel_id: channelId,
            root_id: rootId,
            files,
        });
    } catch (error) {
        logError('Failed addFilesToDraft', error);
        return {success: false, error};
    }
}

export const removeDraft = async (serverUrl: string, channelId: string, rootId = ''): DraftRemoteResponse => {
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
