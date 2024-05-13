// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {withDatabase, withObservables} from '@nozbe/watermelondb/react';

import {observeConfigValue} from '@app/queries/servers/system';
import {observeUser} from '@queries/servers/user';

import PreviewMessage from './preview_message';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

const enhance = withObservables(['previewUserId'], ({database, previewUserId}: WithDatabaseArgs & {post: PostModel; previewUserId: string}) => {
    const siteURL = observeConfigValue(database, 'SiteURL');

    return {
        siteURL,
        user: observeUser(database, previewUserId),
    };
});
export default withDatabase(enhance(PreviewMessage));
