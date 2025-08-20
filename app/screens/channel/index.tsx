// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {combineLatest, combineLatestWith, distinctUntilChanged, of as of$, switchMap} from 'rxjs';

import {observeIsCallsEnabledInChannel} from '@calls/observers';
import {Preferences} from '@constants';
import {withServerUrl} from '@context/server';
import {observeChannel, observeCurrentChannel} from '@queries/servers/channel';
import {queryBookmarks} from '@queries/servers/channel_bookmark';
import {observeHasGMasDMFeature} from '@queries/servers/features';
import {queryPreferencesByCategoryAndName} from '@queries/servers/preference';
import {observeScheduledPostCountForChannel} from '@queries/servers/scheduled_post';
import {
    observeConfigBooleanValue,
    observeCurrentChannelId,
    observeCurrentUserId,
    observeLicense,
} from '@queries/servers/system';
import {observeIsCRTEnabled} from '@queries/servers/thread';
import {shouldShowChannelBanner} from '@screens/channel/channel_feature_checks';

import Channel from './channel';

import type {WithDatabaseArgs} from '@typings/database/database';

type EnhanceProps = WithDatabaseArgs & {
    serverUrl: string;
}

const enhanced = withObservables([], ({database}: EnhanceProps) => {
    const channel = observeCurrentChannel(database);
    const channelId = observeCurrentChannelId(database);
    const dismissedGMasDMNotice = queryPreferencesByCategoryAndName(database, Preferences.CATEGORIES.SYSTEM_NOTICE, Preferences.NOTICES.GM_AS_DM).observe();
    const channelType = channel.pipe(switchMap((c) => of$(c?.type)));
    const currentUserId = observeCurrentUserId(database);
    const hasGMasDMFeature = observeHasGMasDMFeature(database);
    const isBookmarksEnabled = observeConfigBooleanValue(database, 'FeatureFlagChannelBookmarks');
    const hasBookmarks = (count: number) => of$(count > 0);
    const includeBookmarkBar = channelId.pipe(
        combineLatestWith(isBookmarksEnabled),
        switchMap(([cId, enabled]) => {
            if (!enabled) {
                return of$(false);
            }

            return queryBookmarks(database, cId).observeCount(false).pipe(
                switchMap(hasBookmarks),
                distinctUntilChanged(),
            );
        }),
    );

    const license = observeLicense(database);
    const bannerInfo = channelId.pipe(
        switchMap((cId) => observeChannel(database, cId)),
        switchMap((chan) => of$(chan?.bannerInfo)),
    );

    const includeChannelBanner = channelType.pipe(
        combineLatestWith(license, bannerInfo),
        switchMap(([channelTypeValue, licenseValue, bannerInfoValue]) =>
            of$(shouldShowChannelBanner(channelTypeValue, licenseValue, bannerInfoValue)),
        ),
    );

    const isCRTEnabled = observeIsCRTEnabled(database);

    const scheduledPostCount = combineLatest([channelId, isCRTEnabled]).pipe(
        switchMap(([cid, isCRT]) => observeScheduledPostCountForChannel(database, cid, isCRT)),
    );

    return {
        channelId,
        isCallsEnabledInChannel: observeIsCallsEnabledInChannel(currentUserId, channel),
        dismissedGMasDMNotice,
        channelType,
        currentUserId,
        hasGMasDMFeature,
        includeBookmarkBar,
        includeChannelBanner,
        scheduledPostCount,
    };
});

export default withDatabase(withServerUrl(enhanced(Channel)));
