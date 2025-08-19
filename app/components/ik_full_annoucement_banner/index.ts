// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {distinctUntilChanged, map} from '@nozbe/watermelondb/utils/rx';

import {observeLimits} from '@app/queries/servers/limit';
import {observeCurrentPackName} from '@app/queries/servers/team';
import {observeUsage} from '@app/queries/servers/usage';
import {observeCurrentUser} from '@app/queries/servers/user';
import {isSystemAdmin} from '@app/utils/user';

import FullStorageAnnouncementBar from './full_storage_announcement_bar';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const currentPackName = observeCurrentPackName(database);

    const isAdmin = observeCurrentUser(database).pipe(
        map((user) => isSystemAdmin(user?.roles || '')),
        distinctUntilChanged(),
    );
    const limits = observeLimits(database);
    const usage = observeUsage(database);

    return {
        limits,
        usage,
        currentPackName,
        isAdmin,
    };
});

export default withDatabase(enhanced(FullStorageAnnouncementBar));

