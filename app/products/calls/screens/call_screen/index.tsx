// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {distinctUntilChanged, switchMap} from 'rxjs/operators';

import {observeChannel} from '@app/queries/servers/channel';
import {observeConference, observeConferenceParticipantCount, observeConferenceHasAtLeastOneParticipantPresent, observeConferenceHasParticipantPresent} from '@app/queries/servers/conference';
import CallScreen, {type PassedProps} from '@calls/screens/call_screen/call_screen';
import {observeGlobalCallsState} from '@calls/state';
import {observeCurrentUserId} from '@queries/servers/system';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables(['channelId', 'conferenceId'], (
    {channelId, conferenceId, database: db}:
    WithDatabaseArgs & Pick<PassedProps, 'channelId' | 'conferenceId'>,
) => {
    const currentUserId = observeCurrentUserId(db);

    return {
        channel: observeChannel(db, channelId),
        currentUserId,

        micPermissionsGranted: observeGlobalCallsState().pipe(
            switchMap((gs) => of$(gs.micPermissionsGranted)),
            distinctUntilChanged(),
        ),

        conference: observeConference(db, conferenceId),
        participantCount: observeConferenceParticipantCount(db, conferenceId),
        isCurrentUserPresent: currentUserId.pipe(
            switchMap((userId) => observeConferenceHasParticipantPresent(db, conferenceId, userId)),
            distinctUntilChanged(),
        ),
        hasAtLeastOneParticipantPresent: currentUserId.pipe(
            switchMap((userId) => observeConferenceHasAtLeastOneParticipantPresent(db, conferenceId, userId)),
            distinctUntilChanged(),
        ),
    };
});

export default withDatabase(enhance(CallScreen));
