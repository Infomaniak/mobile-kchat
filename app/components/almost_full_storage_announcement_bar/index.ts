// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withObservables} from '@nozbe/watermelondb/react';
import {distinctUntilChanged, map} from '@nozbe/watermelondb/utils/rx';

import {observeCurrentPackName} from '@app/queries/servers/team';
import {observeCRTUserPreferenceDisplay} from '@app/queries/servers/thread';
import {observeCurrentUser} from '@app/queries/servers/user';
import {isSystemAdmin} from '@app/utils/user';
import {withServerUrl} from '@context/server';

import AlmostFullStorageAnnouncementBar from './almost_full_storage_announcement_bar';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const currentPackName = observeCurrentPackName(database);
    const isAdmin = observeCurrentUser(database).pipe(
        map((user) => isSystemAdmin(user?.roles || '')),
        distinctUntilChanged(),
    );

    // const visibility = observeCRTUserPreferenceDisplay;

    return {
        currentPackName,

        // visibility,
        isAdmin,
    };
});

export default withServerUrl(enhanced(AlmostFullStorageAnnouncementBar));

