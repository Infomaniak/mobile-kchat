// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {General} from '@constants';
import {observeChannel} from '@queries/servers/channel';
import {observeConfigValue} from '@queries/servers/system';
import {observeUser} from '@queries/servers/user';

import PreviewMessage from './preview_message';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

const enhance = withObservables(['previewUserId', 'metadata'], ({database, previewUserId, metadata}: WithDatabaseArgs & {post: PostModel; previewUserId: string; metadata: PostPreviewMetadata}) => {
    const siteURL = observeConfigValue(database, 'SiteURL');
    let channel;
    let channelDisplayName;
    if (metadata.channel_id && metadata.channel_type === General.DM_CHANNEL) {
        channel = observeChannel(database, metadata.channel_id);
        channelDisplayName = channel.pipe(
            switchMap((c) => of$(c?.displayName)),
        );
    } else {
        channelDisplayName = of$(metadata.channel_display_name);
    }

    return {
        siteURL,
        channelDisplayName,
        user: observeUser(database, previewUserId),
    };
});
export default withDatabase(enhance(PreviewMessage));

