// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {extractAtMentionedUsernames} from './user';

describe('extractAtMentionedUsernames', () => {
    it('should extract mentioned usernames from message and attachments', () => {
        const posts = [{
            message: 'hi @user1 check this',
            props: {attachments: [{pretext: 'look @user2', text: 'and @user3'}]},
        }, {message: 'no mention here'}] as Post[];

        expect([...extractAtMentionedUsernames(posts)]).toEqual(['user1', 'user2', 'user3']);
    });

    it('should skip special mentions and the excluded username', () => {
        const posts = [{message: '@channel @here @all @excluded @realuser'}] as Post[];

        const result = extractAtMentionedUsernames(posts, 'excluded');

        expect(result.has('channel')).toBe(false);
        expect(result.has('here')).toBe(false);
        expect(result.has('all')).toBe(false);
        expect(result.has('excluded')).toBe(false);
        expect([...result]).toEqual(['realuser']);
    });

    it('should lowercase usernames and deduplicate', () => {
        const posts = [{message: '@User1 @USER1 @user1'}] as Post[];

        expect([...extractAtMentionedUsernames(posts)]).toEqual(['user1']);
    });
});
