// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {switchMap, combineLatestWith} from 'rxjs/operators';

import {Preferences} from '@constants';
import {getPreferenceValue} from '@helpers/api/preference';
import {queryCategoriesByTeamIds} from '@queries/servers/categories';
import {observeAllMyChannelNotifyProps} from '@queries/servers/channel';
import {queryPreferencesByCategoryAndName, querySidebarPreferences} from '@queries/servers/preference';
import {observeConfigBooleanValue, observeCurrentChannelId, observeCurrentTeamId, observeOnlyUnreads} from '@queries/servers/system';

import Categories from './categories';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PreferenceModel from '@typings/database/models/servers/preference';

const enhanced = withObservables(
    [],
    ({database}: WithDatabaseArgs) => {
        const currentTeamId = observeCurrentTeamId(database);
        const categories = currentTeamId.pipe(switchMap((ctid) => queryCategoriesByTeamIds(database, [ctid]).observeWithColumns(['sort_order'])));

        const unreadsOnTopUserPreference = querySidebarPreferences(database, Preferences.CHANNEL_SIDEBAR_GROUP_UNREADS).
            observeWithColumns(['value']).
            pipe(
                switchMap((prefs: PreferenceModel[]) => of$(getPreferenceValue<string>(prefs, Preferences.CATEGORIES.SIDEBAR_SETTINGS, Preferences.CHANNEL_SIDEBAR_GROUP_UNREADS))),
            );

        const unreadsOnTopServerPreference = observeConfigBooleanValue(database, 'ExperimentalGroupUnreadChannels');

        const unreadsOnTop = unreadsOnTopServerPreference.pipe(
            combineLatestWith(unreadsOnTopUserPreference),
            switchMap(([s, u]) => {
                if (!u) {
                    return of$(s);
                }

                return of$(u !== 'false');
            }),
        );

        // Ik change : these preferences are identical for every category, so observe them once here
        // and share the stable observables with each CategoryBody instead of running the same
        // queries (and reloading observers) once per category
        const manuallyClosedPrefs$ = of$(queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.DIRECT_CHANNEL_SHOW, undefined, 'false').
            observeWithColumns(['value']).
            pipe(
                combineLatestWith(queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.GROUP_CHANNEL_SHOW, undefined, 'false').observeWithColumns(['value'])),
                switchMap(([dms, gms]) => of$(dms.concat(gms))),
            ));

        const autoclosePrefs$ = of$(queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.CHANNEL_APPROXIMATE_VIEW_TIME, undefined).
            observeWithColumns(['value']).
            pipe(
                combineLatestWith(queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.CHANNEL_OPEN_TIME, undefined).observeWithColumns(['value'])),
                switchMap(([viewTimes, openTimes]) => of$(viewTimes.concat(openTimes))),
            ));

        // Ik change : written on every channel switch, so observe these once at this level instead
        // of once per category header/body to avoid re-querying the same tables N times per switch
        const currentChannelId$ = of$(observeCurrentChannelId(database));
        const notifyPropsByChannelId$ = of$(observeAllMyChannelNotifyProps(database));

        return {
            categories,
            onlyUnreads: observeOnlyUnreads(database),
            unreadsOnTop,
            manuallyClosedPrefs$,
            autoclosePrefs$,
            currentChannelId$,
            notifyPropsByChannelId$,
        };
    });

export default withDatabase(enhanced(Categories));
