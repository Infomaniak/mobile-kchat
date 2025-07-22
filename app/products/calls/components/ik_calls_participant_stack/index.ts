// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';

import {observeConferenceParticipantCount, observeConferenceParticipants} from '@queries/servers/conference';
import {IkCallsParticipantStack} from '@calls/components/ik_calls_participant_stack/stack';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables(['conferenceId', 'maxDisplayedCount'], (
    {database: db, conferenceId, maxDisplayedCount = 3}:
    WithDatabaseArgs & { conferenceId: string; maxDisplayedCount?: number },
) => {
    const participants = observeConferenceParticipants(db, conferenceId!, maxDisplayedCount);
    const participantCount = observeConferenceParticipantCount(db, conferenceId!);

    return {participants, participantCount};
});

export default withDatabase(enhance(IkCallsParticipantStack));
