// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';

import {observeConferenceParticipantCount, observeConferenceParticipants} from '@app/queries/servers/conference';
import {IkCallsParticipantStack, RENDERED_CONFERENCE_PARTICIPANT_COUNT} from '@calls/components/ik_calls_participant_stack/stack';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables(['conferenceId'], (
    {database: db, conferenceId}:
    WithDatabaseArgs & { conferenceId: string },
) => {
    const participants = observeConferenceParticipants(db, conferenceId!, RENDERED_CONFERENCE_PARTICIPANT_COUNT);
    const participantCount = observeConferenceParticipantCount(db, conferenceId!);

    return {participants, participantCount};
});

export default withDatabase(enhance(IkCallsParticipantStack));
