// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {switchMap, combineLatestWith, map, distinctUntilChanged, shareReplay} from 'rxjs/operators';

import {DEFAULT_LOCALE} from '@i18n';
import {observeCurrentTeamId, observeOnlyUnreads} from '@queries/servers/system';
import {observeCurrentUser} from '@queries/servers/user';

import Categories from './categories';
import {observeFlattenedCategories} from './helpers/observe_flattened_categories';

import type {WithDatabaseArgs} from '@typings/database/database';

type Props = WithDatabaseArgs & {
    isTablet: boolean;
};

const enhanced = withObservables(['isTablet'], ({database, isTablet}: Props) => {
    const currentTeamId = observeCurrentTeamId(database);
    const currentUser = observeCurrentUser(database);
    const onlyUnreads = observeOnlyUnreads(database);

    const categoriesData = currentUser.pipe(
        combineLatestWith(onlyUnreads, currentTeamId),

        // Only rebuild observeFlattenedCategories when meaningful params change.
        // currentUser emits for any field change (timezone, last_active_at, etc.) — guard against that.
        distinctUntilChanged(([prevUser, prevUnreads, prevTeamId], [currUser, currUnreads, currTeamId]) =>
            prevUser?.id === currUser?.id &&
            prevUser?.locale === currUser?.locale &&
            prevUnreads === currUnreads &&
            prevTeamId === currTeamId,
        ),
        switchMap(([user, isOnlyUnreads, teamId]) => {
            return observeFlattenedCategories(
                database,
                user?.id || '',
                user?.locale || DEFAULT_LOCALE,
                isTablet,
                isOnlyUnreads,
                teamId,
            );
        }),

        // Share a single subscription between flattenedItems and unreadChannelIds
        // to avoid executing the full chain twice.
        shareReplay(1),
    );

    const flattenedItems = categoriesData.pipe(map((data) => data.items));
    const unreadChannelIds = categoriesData.pipe(map((data) => data.unreadChannelIds));

    return {
        flattenedItems,
        unreadChannelIds,
        onlyUnreads,
    };
});

export default withDatabase(enhanced(Categories));
