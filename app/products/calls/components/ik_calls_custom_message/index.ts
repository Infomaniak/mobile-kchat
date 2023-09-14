// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {IkCallsCustomMessage} from '@calls/components/ik_calls_custom_message/ik_call_custom_message';
import {Preferences} from '@constants';
import {getDisplayNamePreferenceAsBool} from '@helpers/api/preference';
import {queryDisplayNamePreferences} from '@queries/servers/preference';
import {observeCurrentUser} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

type OwnProps = {
    serverUrl: string;
    post: PostModel;
}

const enhanced = withObservables(['post'], ({database}: OwnProps & WithDatabaseArgs) => {
    const currentUser = observeCurrentUser(database);
    const isMilitaryTime = queryDisplayNamePreferences(database).observeWithColumns(['value']).pipe(
        switchMap(
            (preferences) => of$(getDisplayNamePreferenceAsBool(preferences, Preferences.USE_MILITARY_TIME)),
        ),
    );

    return {
        currentUser,
        isMilitaryTime,
    };
});

export default withDatabase(enhanced(IkCallsCustomMessage));
