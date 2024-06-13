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
        observeWithColumns(['status', 'presence']);
};

export const observeConferenceParticipantCount = (database: Database, conferenceId: string) =>
    database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(Q.where('conference_id', conferenceId)).
        observeCount(false);

/**
 * Observe if there is at least one participant present in the conference
 * Optionnaly, a userId can be ignored from the list of participants
 */
export const observeConferenceHasAtLeastOneParticipantPresent = (database: Database, conferenceId: string, ignoredUserId?: string) => {
    const clauses: Q.Where[] = [
        Q.where('conference_id', conferenceId),
        Q.where('present', true),
    ];
    if (typeof ignoredUserId === 'string') {
        clauses.push(Q.where('user_id', Q.notEq(ignoredUserId)));
    }

    return database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(Q.and(...clauses), Q.take(1)).
        observe().
        pipe(switchMap((cps) => of$(cps.length > 0)));
};

export const fetchConferenceHasAtLeastOneParticipantPresent = async (database: Database, conferenceId: string, ignoredUserId?: string) => {
    const clauses: Q.Where[] = [
        Q.where('conference_id', conferenceId),
        Q.where('present', true),
    ];
    if (typeof ignoredUserId === 'string') {
        clauses.push(Q.where('user_id', Q.notEq(ignoredUserId)));
    }

    const participants = await database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(Q.and(...clauses), Q.take(1)).
        fetch();

    return participants.length > 0;
};
