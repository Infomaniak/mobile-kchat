// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {distinctUntilChanged, map, switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {observeLimits} from '@queries/servers/limit';
import {queryAnnouncementBarVisibilityPreference} from '@queries/servers/preference';
import {observeCurrentTeamId} from '@queries/servers/system';
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
    const currentTeamId = observeCurrentTeamId(database);
    const limits = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeLimits(database, teamId) : of$(null))),
    );
    const usage = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeUsage(database, teamId) : of$(null))),
    );
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

