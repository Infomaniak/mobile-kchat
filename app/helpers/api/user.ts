// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {General} from '@constants';
import {MENTIONS_REGEX} from '@constants/autocomplete';
import {isMessageAttachmentArray} from '@utils/message_attachment';

export const extractAtMentionedUsernames = (posts: Post[], excludeUsername?: string) => {
    const mentionedUsernames = new Set<string>();

    const findMentionedUsernames = (text?: string) => {
        if (!text || !text.includes('@')) {
            return;
        }

        let match;
        while ((match = MENTIONS_REGEX.exec(text)) !== null) {
            const lowercaseMatch = match[1].toLowerCase();

            if (General.SPECIAL_MENTIONS.has(lowercaseMatch)) {
                continue;
            }

            if (lowercaseMatch === excludeUsername) {
                continue;
            }

            mentionedUsernames.add(lowercaseMatch);
        }
    };

    for (const post of posts) {
        // These correspond to the fields searched by getMentionsEnabledFields on the server
        findMentionedUsernames(post.message);

        const attachments = isMessageAttachmentArray(post.props?.attachments) ? post.props.attachments : undefined;
        if (attachments) {
            for (const attachment of attachments) {
                findMentionedUsernames(attachment.pretext);
                findMentionedUsernames(attachment.text);
            }
        }
    }

    return mentionedUsernames;
};
