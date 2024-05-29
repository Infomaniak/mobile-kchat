// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {distinctUntilChanged} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeConferenceParticipantCount, observeConferenceParticipants} from '@app/queries/servers/conference';
import {IkCallsParticipantStack} from '@calls/components/ik_calls_participant_stack/stack';
import {idsAreEqual, userIds} from '@calls/utils';
import {queryUsersById} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables(['conferenceId'], (
    {database: db, conferenceId}:
    WithDatabaseArgs & { conferenceId: string },
) => {
    const participants = observeConferenceParticipants(db, conferenceId!, 3);
    const participantCount = observeConferenceParticipantCount(db, conferenceId!);
    const users = participants.pipe(
        switchMap((p) => of$(userIds(p))),
        distinctUntilChanged((prev, curr) => idsAreEqual(prev, curr)), // Continue only if we have a different set of participant userIds
        switchMap((ids) => (ids.length > 0 ? queryUsersById(db, ids).observeWithColumns(['last_picture_update']) : of$([]))),
    );

    return {participants, participantCount, users};
});

export default withDatabase(enhanced(IkCallsParticipantStack));
