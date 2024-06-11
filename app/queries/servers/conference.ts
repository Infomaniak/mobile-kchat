// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database, Q} from '@nozbe/watermelondb';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {Database as DatabaseConstants} from '@constants';

import type ConferenceModel from '@typings/database/models/servers/conference';
import type ConferenceParticipantModel from '@typings/database/models/servers/conference_participant';

const {CONFERENCE, CONFERENCE_PARTICIPANT} = DatabaseConstants.MM_TABLES.SERVER;

export const queryConference = (database: Database, conferenceId: string) =>
    database.get<ConferenceModel>(CONFERENCE).query(Q.where('id', conferenceId));

export const observeConference = (database: Database, conferenceId: string) =>
    queryConference(database, conferenceId).
        observeWithColumns(['delete_at']).
        pipe(switchMap((cs) => of$(cs.length === 1 ? cs[0] : undefined)));

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

export const observeConferenceParticipantCount = (database: Database, conferenceId: string) =>
    database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(Q.where('conference_id', conferenceId)).
        observeCount();

/**
 * Observe the number of conference participants that are in an "approved" status
 * (ie. they are currently in the call)
 * Possibly ignore a user ids (the caller)
 */
export const observeConferenceParticipantApprovedCount = (database: Database, conferenceId: string, ignoredUserId?: string) => {
    const clauses: Q.Where[] = [
        Q.where('conference_id', conferenceId),
        Q.where('status', 'approved'),
    ];
    if (typeof ignoredUserId === 'string') {
        clauses.push(Q.where('user_id', Q.notEq(ignoredUserId)));
    }

    return database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(Q.and(...clauses)).
        observeCount();
};
