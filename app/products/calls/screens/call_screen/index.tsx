// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {distinctUntilChanged, mergeMap, switchMap} from 'rxjs/operators';

import {observeChannel} from '@app/queries/servers/channel';
import {observeConference, observeConferenceParticipantCount, observeConferenceParticipantApprovedCount} from '@app/queries/servers/conference';
import CallScreen from '@calls/screens/call_screen/call_screen';
import {observeGlobalCallsState} from '@calls/state';
import {observeCurrentUserId} from '@queries/servers/system';
import {observeUser} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables(['channelId', 'conferenceId'], (
    {channelId, conferenceId, database: db}:
    WithDatabaseArgs & { channelId?: string; conferenceId?: string },
) => {
    const channel = typeof channelId === 'string' ? observeChannel(db, channelId) : of$(undefined);
    const currentUserId = observeCurrentUserId(db);
    const currentUser = currentUserId.pipe(mergeMap((userId) => observeUser(db, userId)));

    const micPermissionsGranted = observeGlobalCallsState().pipe(
        switchMap((gs) => of$(gs.micPermissionsGranted)),
        distinctUntilChanged(),
    );

    const {conference, participantCount, participantApprovedCount} = typeof conferenceId === 'string' ? {
        conference: observeConference(db, conferenceId),
        participantCount: observeConferenceParticipantCount(db, conferenceId),
        participantApprovedCount: currentUserId.pipe(mergeMap((userId) => observeConferenceParticipantApprovedCount(db, conferenceId, userId))),
    } : {
        conference: of$(undefined),
        participantCount: of$(0),
        participantApprovedCount: of$(0),
    };

    return {
        channel,
        conference,
        currentUser,
        currentUserId,
        micPermissionsGranted,
        participantCount,
        participantApprovedCount,
    };
});

export default withDatabase(enhance(CallScreen));
