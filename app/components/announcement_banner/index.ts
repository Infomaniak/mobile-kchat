// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$, combineLatest} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeConfigBooleanValue, observeConfigValue, observeLastDismissedAnnouncement} from '@queries/servers/system';

import AnnouncementBanner from './announcement_banner';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    const lastDismissed = observeLastDismissedAnnouncement(database);
    const bannerText = observeConfigValue(database, 'BannerText');
    const allowDismissal = observeConfigBooleanValue(database, 'AllowBannerDismissal');

    const bannerDismissed = combineLatest([lastDismissed, bannerText, allowDismissal]).pipe(
        switchMap(([ld, bt, abd]) => of$(abd && (ld === bt))),
    );

    return {
        bannerColor: observeConfigValue(database, 'BannerColor'),
        bannerText,
        bannerTextColor: observeConfigValue(database, 'BannerTextColor'),
        bannerDismissed,
        allowDismissal,
    };
});

export default withDatabase(enhanced(AnnouncementBanner));
