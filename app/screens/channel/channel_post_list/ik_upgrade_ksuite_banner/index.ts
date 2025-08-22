// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React from 'react';

import {observeLimits} from '@queries/servers/limit';
import {observeCurrentPackName} from '@queries/servers/team';

import UpgradeKsuiteBanner from './ik_upgrade_ksuite_banner';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const limits = observeLimits(database);
    const currentPackName = observeCurrentPackName(database);

    return {
        limits,
        currentPackName,
    };
});

export default React.memo(withDatabase(enhanced(UpgradeKsuiteBanner)));
