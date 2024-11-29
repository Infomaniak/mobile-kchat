// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeChannel} from '@queries/servers/channel';
import {isTypeDMorGM} from '@utils/channel';
import {IkCallsCustomMessage} from '@calls/components/ik_calls_custom_message/ik_call_custom_message';
import {Preferences} from '@constants';
import {getDisplayNamePreferenceAsBool} from '@helpers/api/preference';
import {queryDisplayNamePreferences} from '@queries/servers/preference';
import {observeCurrentUser} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

const enhanced = withObservables(['post'], ({database: db, post}: WithDatabaseArgs & { post: PostModel }) => {
    const currentUser = observeCurrentUser(db);
    const isDM = observeChannel(db, post.channelId).
        pipe(switchMap((c) => of$(isTypeDMorGM(c?.type))));

    const isMilitaryTime = queryDisplayNamePreferences(db).
        observeWithColumns(['value']).
        pipe(switchMap((p) => of$(getDisplayNamePreferenceAsBool(p, Preferences.USE_MILITARY_TIME))));

    return {currentUser, isDM, isMilitaryTime};
});

export default withDatabase(enhanced(IkCallsCustomMessage));
