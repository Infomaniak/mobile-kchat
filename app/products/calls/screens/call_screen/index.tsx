// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {distinctUntilChanged, switchMap} from 'rxjs/operators';

import {observeChannel} from '@app/queries/servers/channel';
import {observeConference, observeConferenceParticipantCount/*, observeConferenceHasAtLeastOneParticipantPresent*/} from '@app/queries/servers/conference';
import CallScreen, {type PassedProps} from '@calls/screens/call_screen/call_screen';
import {observeGlobalCallsState} from '@calls/state';
import {observeCurrentUserId} from '@queries/servers/system';
import {observeUser} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables(['channelId', 'conferenceId'], (
    {channelId, conferenceId, database: db}:
    WithDatabaseArgs & Pick<PassedProps, 'channelId' | 'conferenceId'>,
) => {
    const currentUserId = observeCurrentUserId(db);

    return {
        channel: observeChannel(db, channelId),
        currentUserId: observeCurrentUserId(db),
        currentUser: currentUserId.pipe(
            switchMap((userId) => observeUser(db, userId)),
        ),

        micPermissionsGranted: observeGlobalCallsState().pipe(
            switchMap((gs) => of$(gs.micPermissionsGranted)),
            distinctUntilChanged(),
        ),

        conference: observeConference(db, conferenceId),
        participantCount: observeConferenceParticipantCount(db, conferenceId),

        // hasAtLeastOneParticipantPresent: currentUserId.pipe(
        //     switchMap((userId) => observeConferenceHasAtLeastOneParticipantPresent(db, conferenceId, userId)),
        //     distinctUntilChanged(),
        // ),
    };
});

export default withDatabase(enhance(CallScreen));
