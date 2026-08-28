// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeLimits} from '@queries/servers/limit';
import {observeCurrentTeamId} from '@queries/servers/system';
import {observeUsage} from '@queries/servers/usage';
import {observeCurrentUser} from '@queries/servers/user';

import IKReminder, {type PredefinedTimestamp} from './ik_reminder';

export type {PredefinedTimestamp};

import type {WithDatabaseArgs} from '@typings/database/database';
import type {AvailableScreens} from '@typings/screens/navigation';

export type IKReminderProps = {
    componentId?: AvailableScreens;
    postId: string;
    postpone?: boolean;
    postponePostId?: string;
}

type EnhancedProps = WithDatabaseArgs & IKReminderProps;

const enhanced = withObservables([], ({database}: EnhancedProps) => {
    const currentUser = observeCurrentUser(database);
    const currentTeamId = observeCurrentTeamId(database);
    const limits = currentTeamId.pipe(switchMap((teamId) => (teamId ? observeLimits(database, teamId) : of$(null))));
    const usage = currentTeamId.pipe(switchMap((teamId) => (teamId ? observeUsage(database, teamId) : of$(null))));

    return {
        currentUser,
        limits,
        usage,
    };
});

export default withDatabase(enhanced(IKReminder));
