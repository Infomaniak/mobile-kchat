// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React from 'react';

import {observeLimits} from '@app/queries/servers/limit';

import UpgradeKsuiteBanner from './ik_upgrade_ksuite_banner';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const limits = observeLimits(database);

    return {
        limits,

    };
});

export default React.memo(withDatabase(enhanced(UpgradeKsuiteBanner)));
