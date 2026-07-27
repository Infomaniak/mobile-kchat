// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {withObservables} from '@nozbe/watermelondb/react';
import {map} from 'rxjs/operators';

import {Preferences} from '@constants';
import {queryPreferencesByCategoryAndName} from '@queries/servers/preference';
import {observeConfigBooleanValue, observeCurrentUserId, observeReportAProblemMetadata} from '@queries/servers/system';

import ReportProblem from './report_problem';

const enhanced = withObservables([], ({database}) => {
    return {
        allowDownloadLogs: observeConfigBooleanValue(database, 'AllowDownloadLogs', true),
        metadata: observeReportAProblemMetadata(database),
        currentUserId: observeCurrentUserId(database),
        attachLogsEnabled: queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.ADVANCED_SETTINGS, Preferences.ATTACH_APP_LOGS).
            observe().
            pipe(map((prefs) => prefs?.[0]?.value === 'true')),
    };
});

export default withDatabase(enhanced(ReportProblem));
