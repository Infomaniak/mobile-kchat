// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database, Q} from '@nozbe/watermelondb';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {Database as DatabaseConstants} from '@constants';

import type ConferenceModel from '@typings/database/models/servers/conference';
import type ConferenceParticipantModel from '@typings/database/models/servers/conference_participant';

const {CONFERENCE, CONFERENCE_PARTICIPANT} = DatabaseConstants.MM_TABLES.SERVER;

export const observeConference = (database: Database, conferenceId: string) => {
    return database.
        get<ConferenceModel>(CONFERENCE).
        query(Q.where('id', conferenceId), Q.take(1)).
        observe().
        pipe(switchMap((cs) => of$(cs.length === 1 ? cs[0] : undefined)));
};

export const observeConferenceParticipants = (database: Database, conferenceId: string, limit?: number) => {
    const clauses: Q.Clause[] = [Q.where('conference_id', conferenceId), Q.sortBy('id', Q.asc)];
    if (typeof limit === 'number') {
        clauses.push(Q.take(limit));
    }

    return database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(...clauses).
        observeWithColumns(['status']);
};

export const observeConferenceParticipantCount = (database: Database, conferenceId: string) => {
    return database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(Q.where('conference_id', conferenceId)).
        observeCount();
};
