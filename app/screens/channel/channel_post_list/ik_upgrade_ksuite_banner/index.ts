// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React from 'react';

import {observeCurrentPackName, observeCurrentTeam} from '@app/queries/servers/team';

import UpgradeKsuiteBanner from './ik_upgrade_ksuite_banner';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const currentPackName = observeCurrentPackName(database);
    const currentTeam = observeCurrentTeam(database);
    return {
        currentPackName,
        currentTeam,
    };
});

export default React.memo(withDatabase(enhanced(UpgradeKsuiteBanner)));
