// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';

import {IkCallsParticipantStackList} from '@calls/components/ik_calls_participant_stack/list/list';
import {observeConferenceParticipants} from '@queries/servers/conference';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhance = withObservables(['conferenceId'], (
    {database: db, conferenceId}:
    WithDatabaseArgs & { conferenceId: string },
) => {
    return {participants: observeConferenceParticipants(db, conferenceId!)};
});

export default withDatabase(enhance(IkCallsParticipantStackList));
