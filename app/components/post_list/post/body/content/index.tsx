// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';

import {observeConfigBooleanValue} from '@queries/servers/system';
import {getPermalinkInfoFromMessage} from '@utils/url';

import Content from './content';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

const enhance = withObservables(['post'], ({database, post}: WithDatabaseArgs & {post: PostModel}) => {
    const hasPermalinkEmbed = post.metadata?.embeds?.[0]?.type === 'permalink';

    // Bare permalink messages may carry no embed at all (the server does not recompute
    // embeds for historical posts and the app never refetches them): the client detects
    // them to render the preview from the referenced post.
    const barePermalink = hasPermalinkEmbed ? null : getPermalinkInfoFromMessage(post.message);
    const showPermalinkPreviews = (hasPermalinkEmbed || barePermalink) ? observeConfigBooleanValue(database, 'EnablePermalinkPreviews', false) : of$(false);

    return {
        showPermalinkPreviews,
    };
});

export default withDatabase(enhance(Content));
