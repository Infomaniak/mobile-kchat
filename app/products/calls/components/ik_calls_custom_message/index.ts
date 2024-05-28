// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {distinctUntilChanged} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {observeChannel} from '@app/queries/servers/channel';
import {observeConferenceParticipantCount, observeConferenceParticipants} from '@app/queries/servers/conference';
import {isTypeDMorGM} from '@app/utils/channel';
import {IkCallsCustomMessage} from '@calls/components/ik_calls_custom_message/ik_call_custom_message';
import {idsAreEqual, userIds} from '@calls/utils';
import {Preferences} from '@constants';
import {getDisplayNamePreferenceAsBool} from '@helpers/api/preference';
import {queryDisplayNamePreferences} from '@queries/servers/preference';
import {observeCurrentUser, queryUsersById} from '@queries/servers/user';

import type {WithDatabaseArgs} from '@typings/database/database';
import type PostModel from '@typings/database/models/servers/post';

const enhanced = withObservables(['post'], ({database: db, post}: WithDatabaseArgs & { post: PostModel }) => {
    const conferenceId: string | undefined = post.props?.conference_id;
    const hasConferenceId = typeof conferenceId === 'string';

    const currentUser = observeCurrentUser(db);
    const isDM = observeChannel(db, post.channelId).
        pipe(switchMap((c) => of$(isTypeDMorGM(c?.type))));

    const isMilitaryTime = queryDisplayNamePreferences(db).
        observeWithColumns(['value']).
        pipe(switchMap((p) => of$(getDisplayNamePreferenceAsBool(p, Preferences.USE_MILITARY_TIME))));

    const shouldObserveParticipants = isDM.
        pipe(switchMap((dm) => of$(hasConferenceId && !dm)));
    const participants = shouldObserveParticipants.pipe(
        switchMap((o) => (o ? observeConferenceParticipants(db, conferenceId!, 3) : of$([]))),
    );
    const participantCount = shouldObserveParticipants.
        pipe(switchMap((o) => (o ? observeConferenceParticipantCount(db, conferenceId!) : of$(0))));
    const participantUsers = participants.pipe(
        switchMap((p) => of$(userIds(p))),
        distinctUntilChanged((prev, curr) => idsAreEqual(prev, curr)), // Continue only if we have a different set of participant userIds
        switchMap((ids) => (ids.length > 0 ? queryUsersById(db, ids).observeWithColumns(['last_picture_update']) : of$([]))),
    );

    return {
        currentUser,
        isDM,
        isMilitaryTime,
        participants,
        participantCount,
        participantUsers,
        shouldObserveParticipants,
    };
});

export default withDatabase(enhanced(IkCallsCustomMessage));
