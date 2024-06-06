// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

import {observeChannel} from '@app/queries/servers/channel';
import {observeConference, observeConferenceParticipantCount} from '@app/queries/servers/conference';
import CallScreen from '@calls/screens/call_screen/call_screen';
import {observeCurrentUserId} from '@queries/servers/system';
import {observeUser} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables(['channelId', 'conferenceId'], (
    {channelId, conferenceId, database: db}:
    WithDatabaseArgs & { channelId: string; conferenceId?: string },
) => {
    const channel = observeChannel(db, channelId);
    const currentUserId = observeCurrentUserId(db);
    const currentUser = currentUserId.pipe(mergeMap((userId) => observeUser(db, userId)));
    const conference = typeof conferenceId === 'string' ? observeConference(db, conferenceId) : of$(undefined);
    const participantCount = typeof conferenceId === 'string' ? observeConferenceParticipantCount(db, conferenceId!) : of$(0);

    return {channel, conference, currentUser, participantCount};
});

export default withDatabase(enhance(CallScreen));
