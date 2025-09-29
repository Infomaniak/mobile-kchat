// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React from 'react';
import {of as of$} from 'rxjs';
import {switchMap, distinctUntilChanged} from 'rxjs/operators';

import {Preferences} from '@constants';
import {getAdvanceSettingPreferenceAsBool} from '@helpers/api/preference';
import {observeMyChannel} from '@queries/servers/channel';
import {queryAllPosts} from '@queries/servers/post';
import {queryAdvanceSettingsPreferences} from '@queries/servers/preference';
import {observeIsCRTEnabled} from '@queries/servers/thread';

import ChannelPostList from './channel_post_list';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables(['channelId'], ({database, channelId}: {channelId: string} & WithDatabaseArgs) => {
    const isCRTEnabledObserver = observeIsCRTEnabled(database);

    return {
        isCRTEnabled: isCRTEnabledObserver,
        lastViewedAt: observeMyChannel(database, channelId).pipe(
            switchMap((myChannel) => of$(myChannel?.viewedAt)),
            distinctUntilChanged(),
        ),

        // Ik change : Query all posts in the channel instead of latest/earliest PostsInChannel logic
        posts: isCRTEnabledObserver.pipe(
            switchMap((isCRTEnabled) =>
                queryAllPosts(database, Q.desc, '', channelId, isCRTEnabled ? '' : undefined).observe(),
            ),
        ),
        shouldShowJoinLeaveMessages: queryAdvanceSettingsPreferences(database, Preferences.ADVANCED_FILTER_JOIN_LEAVE).
            observeWithColumns(['value']).pipe(
                switchMap((preferences) => of$(getAdvanceSettingPreferenceAsBool(preferences, Preferences.ADVANCED_FILTER_JOIN_LEAVE, true))),
                distinctUntilChanged(),
            ),
    };
});

export default React.memo(withDatabase(enhanced(ChannelPostList)));
