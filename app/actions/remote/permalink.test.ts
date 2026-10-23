// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import TestHelper from '@test/test_helper';

import {fetchReferencedPost} from './permalink';
import {fetchPostById} from './post';

jest.mock('./post', () => ({
    fetchPostById: jest.fn(),
}));

jest.mock('./post_navigation', () => ({
    jumpToPostInChannel: jest.fn(),
}));

jest.mock('@utils/permalink', () => ({
    displayPermalink: jest.fn(),
}));

describe('actions/remote/permalink/fetchReferencedPost', () => {
    const serverUrl = 'http://localhost:8065';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(fetchPostById).mockResolvedValue({post: TestHelper.fakePost()});
    });

    it('should fetch the referenced post once for a given server and post id', async () => {
        await fetchReferencedPost(serverUrl, 'post-1');
        await fetchReferencedPost(serverUrl, 'post-1');

        expect(fetchPostById).toHaveBeenCalledTimes(1);
        expect(fetchPostById).toHaveBeenCalledWith(serverUrl, 'post-1');
    });

    it('should fetch again for a different post id', async () => {
        await fetchReferencedPost(serverUrl, 'post-2');
        await fetchReferencedPost(serverUrl, 'post-3');

        expect(fetchPostById).toHaveBeenCalledTimes(2);
    });

    it('should not retry the fetch after an error', async () => {
        jest.mocked(fetchPostById).mockResolvedValue({error: new Error('not found')});

        await fetchReferencedPost(serverUrl, 'post-4');
        await fetchReferencedPost(serverUrl, 'post-4');

        expect(fetchPostById).toHaveBeenCalledTimes(1);
    });
});
