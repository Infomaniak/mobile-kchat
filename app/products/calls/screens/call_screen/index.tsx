// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {distinctUntilChanged, mergeMap, switchMap} from 'rxjs/operators';

import {observeChannel} from '@app/queries/servers/channel';
import {observeConference, observeConferenceParticipantCount, observeConferenceParticipantPresentCount} from '@app/queries/servers/conference';
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
        currentUser: currentUserId.pipe(mergeMap((userId) => observeUser(db, userId))),

        micPermissionsGranted: observeGlobalCallsState().pipe(
            switchMap((gs) => of$(gs.micPermissionsGranted)),
            distinctUntilChanged(),
        ),

        conference: observeConference(db, conferenceId),
        participantCount: observeConferenceParticipantCount(db, conferenceId),
        participantApprovedCount: currentUserId.pipe(mergeMap((userId) => observeConferenceParticipantPresentCount(db, conferenceId, userId))),
    };
});

export default withDatabase(enhance(CallScreen));
