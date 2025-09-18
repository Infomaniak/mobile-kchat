// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {getDisplayNamePreferenceAsBool} from '@helpers/api/preference';
import {observeLimits} from '@queries/servers/limit';
import {queryDisplayNamePreferences} from '@queries/servers/preference';
import {observeCurrentTeamId} from '@queries/servers/system';
import {observeUsage} from '@queries/servers/usage';
import {ScheduledPostCoreOptions} from '@screens/scheduled_post_options/core_options/core_options';

const enhance = withObservables([], ({database}) => {
    const preferences = queryDisplayNamePreferences(database).observeWithColumns(['value']);
    const isMilitaryTime = preferences.pipe(map((prefs) => getDisplayNamePreferenceAsBool(prefs, 'use_military_time')));
    const currentTeamId = observeCurrentTeamId(database);
    const limits = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeLimits(database, teamId) : of$(null))),
    );
    const usage = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeUsage(database, teamId) : of$(null))),
    );

    return {
        usage,
        limits,
        isMilitaryTime,
    };
});

export default withDatabase(enhance(ScheduledPostCoreOptions));
