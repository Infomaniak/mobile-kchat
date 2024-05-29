// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {mergeMap} from 'rxjs/operators';

import {observeChannel} from '@app/queries/servers/channel';
import CallScreen from '@calls/screens/call_screen/call_screen';
import {observeCurrentUserId} from '@queries/servers/system';
import {observeUser} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables(['channelId'], ({channelId, database: db}: WithDatabaseArgs & { channelId: string }) => {
    const channel = observeChannel(db, channelId);
    const currentUserId = observeCurrentUserId(db);
    const currentUser = currentUserId.pipe(mergeMap((userId) => observeUser(db, userId)));

    return {channel, currentUser};
});

export default withDatabase(enhance(CallScreen));
