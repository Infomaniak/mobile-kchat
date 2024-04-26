// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {withDatabase, withObservables} from '@nozbe/watermelondb/react';

import {observeConfigValue} from '@app/queries/servers/system';
import {observePost} from '@queries/servers/post';
import {observeUser} from '@queries/servers/user';

import PreviewMessage from './preview_message';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';
const enhance = withObservables(['post'], ({post, database}: WithDatabaseArgs & {post: PostModel}) => {
    let previewUserId = null;
    let previewPostId = null;

    if (post.metadata && post.metadata.embeds && post.metadata.embeds.length > 0) {
        previewUserId = post.metadata.embeds[0].data.post.user_id;
        previewPostId = post.metadata.embeds[0].data.post.id;
    }
    const siteURL = observeConfigValue(database, 'SiteURL');

    return {
        user: observeUser(database, previewUserId),
        previewPost: observePost(database, previewPostId),
        siteURL,
    };
});

export default withDatabase(enhance(PreviewMessage));
