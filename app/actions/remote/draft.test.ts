// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable max-lines */

import DatabaseManager from '@database/manager';

import {
    updateDraftFile,
    removeDraftFile,
    updateDraftMessage,
    addFilesToDraft,
    removeDraft,
    updateDraftPriority,
} from './draft';

import type ServerDataOperator from '@database/operator/server_data_operator';

let operator: ServerDataOperator;
const serverUrl = 'baseHandler.test.com';
const channelId = 'id1';
const teamId = 'tId1';
const testDate = Date.now();
const userId = 'uId1';
const channel: Channel = {
    id: channelId,
    team_id: teamId,
    total_msg_count: 0,
} as Channel;
const fileInfo: FileInfo = {
    id: 'fileid',
    clientId: 'clientid',
    localPath: 'path1',
} as FileInfo;
const draft: DraftWithFiles = {
    channel_id: channel.id,
    message: 'test',
    root_id: '',
    create_at: testDate,
    update_at: testDate,
    delete_at: 0,
    user_id: userId,
    props: {},
    files: [],
};

beforeEach(async () => {
    await DatabaseManager.init([serverUrl]);
    operator = DatabaseManager.serverDatabases[serverUrl]!.operator;
});

afterEach(async () => {
    await DatabaseManager.destroyServerDatabase(serverUrl);
});

describe('updateDraftFile', () => {
    it('handle not found database', async () => {
        const result = await updateDraftFile('foo', channelId, '', fileInfo);
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBeTruthy();
        }
    });

    it('handle no draft', async () => {
        const result = await updateDraftFile(serverUrl, channelId, '', fileInfo);
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBe('no draft');
        }
    });

    it('handle no file', async () => {
        await operator.handleDrafts({drafts: [draft], prepareRecordsOnly: false});

        const result = await updateDraftFile(serverUrl, channelId, '', fileInfo);
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBe('file not found');
        }
    });
});

describe('removeDraftFile', () => {
    it('handle not found database', async () => {
        const result = await removeDraftFile('foo', channelId, '', '');
        expect(result.success).toBeFalsy();
    });

    it('handle no draft', async () => {
        const result = await removeDraftFile(serverUrl, channelId, '', 'clientid');
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBe('no draft');
        }
    });

    it('handle no file', async () => {
        await operator.handleDrafts({drafts: [draft], prepareRecordsOnly: false});

        const result = await removeDraftFile(serverUrl, channelId, '', 'clientid');
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBeTruthy();
            expect(result.error).toBe('file not found');
        }
    });

    it('remove draft file, no message', async () => {
        await operator.handleDrafts({drafts: [{...draft, message: ''}], prepareRecordsOnly: false});

        const result = await removeDraftFile(serverUrl, channelId, '', 'clientid');
        expect(result.success).toBeFalsy();
        if (result.success) {
            expect(result.draft).toBeDefined();
        }
    });
});

describe('updateDraftMessage', () => {
    it('handle not found database', async () => {
        const result = await updateDraftMessage('foo', channelId, '', 'newmessage');
        expect(result.success).toBeFalsy();
        if (!result.success) {
            expect(result.error).toBeDefined();
        }
    });

    it('update draft message, blank message, no draft', async () => {
        const result = await updateDraftMessage(serverUrl, channelId, '', '');
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeUndefined();
        }
    });

    it('update draft message, no draft', async () => {
        const result = await updateDraftMessage(serverUrl, channelId, '', 'newmessage');
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeDefined();
        }
    });
});

describe('addFilesToDraft', () => {
    it('handle not found database', async () => {
        const result = await addFilesToDraft('foo', channelId, '', []);
        expect(result.success).toBeFalsy();
    });

    it('add draft files, no draft', async () => {
        const result = await addFilesToDraft(serverUrl, channelId, '', [fileInfo]);
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeDefined();
        }
    });

    it('add draft files', async () => {
        await operator.handleDrafts({drafts: [draft], prepareRecordsOnly: false});

        const result = await addFilesToDraft(serverUrl, channelId, '', [fileInfo]);
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeDefined();
            if (typeof result.draft !== 'undefined') {
                expect(result.draft.files.length).toBe(1);
            }
        }
    });
});

describe('removeDraft', () => {
    it('handle not found database', async () => {
        const result = await removeDraft('foo', channelId, '');
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeUndefined();
        }
    });

    it('handle no draft', async () => {
        const result = await removeDraft(serverUrl, channelId, '');
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeUndefined();
        }
    });

    it('remove draft', async () => {
        await operator.handleDrafts({drafts: [draft], prepareRecordsOnly: false});

        const result = await removeDraft(serverUrl, channelId, '');
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeDefined();
        }
    });
});

describe('updateDraftPriority', () => {
    const postPriority: PostPriority = {
        priority: 'urgent',
    } as PostPriority;

    it('handle not found database', async () => {
        const result = await updateDraftPriority('foo', channelId, '', postPriority);
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeDefined();
        }
    });

    it('handle no draft', async () => {
        const result = await updateDraftPriority(serverUrl, channelId, '', postPriority);

        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeDefined();
            if (typeof result.draft !== 'undefined') {
                expect(result.draft.priority).toBe(postPriority.priority);
                expect(result.draft.metadata?.priority?.priority).toBe(postPriority.priority);
            }
        }
    });

    it('update draft priority', async () => {
        await operator.handleDrafts({drafts: [draft], prepareRecordsOnly: false});

        const result = await updateDraftPriority(serverUrl, channelId, '', postPriority);
        expect(result.success).toBeTruthy();
        if (result.success) {
            expect(result.draft).toBeDefined();
            if (typeof result.draft !== 'undefined') {
                expect(result.draft.priority).toBe(postPriority.priority);
                expect(result.draft.metadata?.priority?.priority).toBe(postPriority.priority);
            }
        }
    });
});

