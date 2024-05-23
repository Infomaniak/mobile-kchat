// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {mergeMap} from 'rxjs/operators';

import CallScreen from '@calls/screens/call_screen/call_screen';
import {observeCurrentUserId} from '@queries/servers/system';
import {observeUser} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables([], ({database: datab}: WithDatabaseArgs) => {
    const currentUserId = observeCurrentUserId(datab);
    const currentUser = currentUserId.pipe(mergeMap((userId) => observeUser(datab, userId)));

    return {currentUser};
});

export default withDatabase(enhance(CallScreen));
