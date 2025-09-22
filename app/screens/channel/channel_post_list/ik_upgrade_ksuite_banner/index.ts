// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import React from 'react';
import {of as of$} from 'rxjs';

import {observeLimits} from '@queries/servers/limit';
import {observeCurrentTeamId} from '@queries/servers/system';
import {observeCurrentPackName} from '@queries/servers/team';

import UpgradeKsuiteBanner from './ik_upgrade_ksuite_banner';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const currentPackName = observeCurrentPackName(database);
    const currentTeamId = observeCurrentTeamId(database);
    const limits = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeLimits(database, teamId) : of$(null))),
    );

    return {
        limits,
        currentPackName,
    };
});

export default React.memo(withDatabase(enhanced(UpgradeKsuiteBanner)));
