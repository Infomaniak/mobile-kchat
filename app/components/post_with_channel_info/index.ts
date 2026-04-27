// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeIsChannelAutotranslated, observeMyChannel} from '@queries/servers/channel';
import {observePostSaved} from '@queries/servers/post';
import {observeIsCRTEnabled} from '@queries/servers/thread';

import PostWithChannelInfo from './post_with_channel_info';

import type {WithDatabaseArgs} from '@typings/database/database';
import type MyChannelModel from '@typings/database/models/servers/my_channel';
import type PostModel from '@typings/database/models/servers/post';

type OwnProps = {
    post: PostModel;
    skipSavedPostsHighlight?: boolean;
} & WithDatabaseArgs;

const enhance = withObservables(['post', 'skipSavedPostsHighlight'], ({database, post, skipSavedPostsHighlight}: OwnProps) => {
    const myChannel = observeMyChannel(database, post.channelId);
    return {
        isCRTEnabled: observeIsCRTEnabled(database),
        isSaved: skipSavedPostsHighlight ? of$(false) : observePostSaved(database, post.id),
        isChannelAutotranslated: observeIsChannelAutotranslated(database, post.channelId),
        isChannelMember: myChannel.pipe(
            switchMap((mc: MyChannelModel | undefined) => of$(mc !== undefined)),
        ),
    };
});

export default withDatabase(enhance(PostWithChannelInfo));
