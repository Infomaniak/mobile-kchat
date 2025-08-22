// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {distinctUntilChanged, map} from '@nozbe/watermelondb/utils/rx';

import {observeLimits} from '@queries/servers/limit';
import {queryAnnouncementBarVisibilityPreference} from '@queries/servers/preference';
import {observeCurrentPackName} from '@queries/servers/team';
import {observeUsage} from '@queries/servers/usage';
import {observeCurrentUser} from '@queries/servers/user';
import {isSystemAdmin} from '@utils/user';

import AlmostFullStorageAnnouncementBar from './almost_full_storage_announcement_bar';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const currentPackName = observeCurrentPackName(database);
    const isAdmin = observeCurrentUser(database).pipe(
        map((user) => isSystemAdmin(user?.roles || '')),
        distinctUntilChanged(),
    );
    const limits = observeLimits(database);
    const usage = observeUsage(database);
    const visibility = queryAnnouncementBarVisibilityPreference(database);

    return {
        currentPackName,
        limits,
        usage,
        visibility,
        isAdmin,
    };
});

export default withDatabase(enhanced(AlmostFullStorageAnnouncementBar));

