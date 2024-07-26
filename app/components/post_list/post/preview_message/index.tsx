// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {observeChannel} from '@app/queries/servers/channel';
import {observeConfigValue} from '@app/queries/servers/system';
import {observeUser} from '@queries/servers/user';

import PreviewMessage from './preview_message';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

const enhance = withObservables(['previewUserId'], ({database, previewUserId, metadata}: WithDatabaseArgs & {post: PostModel; previewUserId: string; metadata: any}) => {
    const siteURL = observeConfigValue(database, 'SiteURL');
    const channel = observeChannel(database, metadata.data.channel_id);
    const channelDisplayName = channel.pipe(
        switchMap((c) => of$(c?.displayName)),
    );
    return {
        siteURL,
        channelDisplayName,
        user: observeUser(database, previewUserId),
    };
});
export default withDatabase(enhance(PreviewMessage));

