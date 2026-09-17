// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeLimits} from '@queries/servers/limit';
import {observeScheduledPostById} from '@queries/servers/scheduled_post';
import {observeCurrentTeamId} from '@queries/servers/system';
import {observeUsage} from '@queries/servers/usage';
import {observeCurrentUser} from '@queries/servers/user';

import RescheduledDraft from './reschedule_draft';

import type {WithDatabaseArgs} from '@typings/database/database';

export type RescheduleDraftProps = {
    draftId: string;
}

const enhance = withObservables([], ({database, draftId}: RescheduleDraftProps & WithDatabaseArgs) => {
    const currentUserTimezone = observeCurrentUser(database).pipe(switchMap((u) => of$(u?.timezone)));
    const currentTeamId = observeCurrentTeamId(database);
    const limits = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeLimits(database, teamId) : of$(null))),
    );
    const usage = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeUsage(database, teamId) : of$(null))),
    );

    return {
        currentUserTimezone,
        limits,
        usage,
        draft: observeScheduledPostById(database, draftId),
    };
});

export default withDatabase(enhance(RescheduledDraft));
