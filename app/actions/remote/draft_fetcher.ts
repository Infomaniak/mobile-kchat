// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {omit} from 'lodash';

import {logDebug} from '@app/utils/log';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';

// See LICENSE.txt for license information.
// Infomaniak
export const fetchDrafts = async (serverUrl: string, currentTeamId: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        const drafts = await client.getDrafts(currentTeamId);

        // Flatten all file ids from all drafts
        const fileIds = drafts.reduce((arr, draft) => [...arr, ...draft.file_ids ?? []], [] as string[]);
        const fileInfos = await Promise.all(fileIds.map(client.getFileInfosForFile));

        // Create a byId map
        const fileInfosById = fileInfos.reduce((byId, fileInfo) => {
            if (typeof fileInfo?.id === 'string') {
                byId[fileInfo.id] = fileInfo;
            }
            return byId;
        }, {} as { [k: string]: FileInfo });

        // Replace all fileIds in drafts, to create the draft with files
        const draftWithFiles = drafts.map((draft) => ({
            ...omit(draft, 'file_ids'),
            files: (draft.file_ids ?? []).reduce((files, id) => {
                if (typeof fileInfosById[id] === 'object') {
                    files.push(fileInfosById[id]);
                }
                return files;
            }, [] as FileInfo[]),
        }));

        const operator = DatabaseManager.serverDatabases[serverUrl]?.operator;
        if (!operator) {
            return;
        }

        await operator.handleDrafts({
            drafts: draftWithFiles,
            prepareRecordsOnly: false,
            prune: true,
        });
    } catch (error) {
        logDebug('Error retrieving drafts:', error);
    }
};
