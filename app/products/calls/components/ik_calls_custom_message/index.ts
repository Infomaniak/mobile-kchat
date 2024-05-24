// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeChannel} from '@app/queries/servers/channel';
import {IkCallsCustomMessage} from '@calls/components/ik_calls_custom_message/ik_call_custom_message';
import {Preferences} from '@constants';
import {getDisplayNamePreferenceAsBool} from '@helpers/api/preference';
import {queryDisplayNamePreferences} from '@queries/servers/preference';
import {observeCurrentUser} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

type OwnProps = {
    serverUrl: string;
    channelType: ChannelType;
    post: PostModel;
}

const enhanced = withObservables(['post'], ({database, post}: OwnProps & WithDatabaseArgs) => {
    const currentUser = observeCurrentUser(database);
    const channelType = observeChannel(database, post.channelId).pipe(
        switchMap((c) => of$(c?.type)),
    );
    const isMilitaryTime = queryDisplayNamePreferences(database).observeWithColumns(['value']).pipe(
        switchMap(
            (preferences) => of$(getDisplayNamePreferenceAsBool(preferences, Preferences.USE_MILITARY_TIME)),
        ),
    );

    return {
        channelType,
        currentUser,
        isMilitaryTime,
    };
});

export default withDatabase(enhanced(IkCallsCustomMessage));
