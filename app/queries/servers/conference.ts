// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database, Q, Query} from '@nozbe/watermelondb';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {Database as DatabaseConstants} from '@constants';

import type ConferenceModel from '@typings/database/models/servers/conference';
import type ConferenceParticipantModel from '@typings/database/models/servers/conference_participant';

type QueryPresentConferenceParticipantArg<T> = [database: Database, conferenceId: string, extraArgument?: T];

const {CONFERENCE, CONFERENCE_PARTICIPANT} = DatabaseConstants.MM_TABLES.SERVER;

//
// QUERIES
//
/**
 * Create a query to get one conference by id in the database
 */
export const queryConference = (database: Database, conferenceId: string) =>
    database.get<ConferenceModel>(CONFERENCE).query(Q.where('id', conferenceId));

/**
 * Create a query to get the list of conference participants related to one conference
 */
export const queryConferenceParticipants = (database: Database, conferenceId: string, limit?: number) =>
    database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(...[
            Q.where('conference_id', conferenceId),
            Q.sortBy('id', Q.asc),
            ...(typeof limit === 'number' ? [Q.take(limit)] : []),
        ]);

/**
 * Create a query to get one participant of a conference that is present
 * Optionnaly, specify a custom Q.Where clause to restrict results
 */
export const queryPresentConferenceParticipant: (...args: QueryPresentConferenceParticipantArg<Q.Where>) => Query<ConferenceParticipantModel> =
    (database, conferenceId, extraCondition) =>
        database.
            get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
            query(
                Q.and([
                    Q.where('conference_id', conferenceId),
                    Q.where('present', true),
                    ...(typeof extraCondition === 'undefined' ? [] : [extraCondition]),
                ]),
            );

//
// GETTERS
//
/**
 * Find one conference by id in the database
 */
export const getConferenceById = async (...args: Parameters<typeof queryConference>) => {
    const conferences = await queryConference(...args).fetch();
    return conferences.length ? conferences[0] : undefined;
};

/**
 * Get the list of conference participants related to one conference
 */
export const getConferenceParticipants = (...args: Parameters<typeof queryConferenceParticipants>) =>
    queryConferenceParticipants(...args).fetch();

/**
 * Get the number of conference participants related to one conference
 */
export const getConferenceParticipantCount = (...args: Parameters<typeof queryConferenceParticipants>) =>
    queryConferenceParticipants(...args).fetchCount();

/**
 * Test if there is at least one participant present in the conference
 * Optionnaly, a userId can be ignored from the list of participants
 */
export const getConferenceHasAtLeastOneParticipantPresent = async (...args: Parameters<typeof queryPresentConferenceParticipant>) =>
    (await queryPresentConferenceParticipant(...args).fetchCount()) > 0;

//
// OBSERVERS
//
/**
 * Observe one conference by id in the database
 */
export const observeConference = (...args: Parameters<typeof queryConference>) =>
    queryConference(...args).
        observeWithColumns(['delete_at']).
        pipe(switchMap((cs) => of$(cs.length === 1 ? cs[0] : undefined)));

/**
 * Observe a list of conference participants related to one conference
 */
export const observeConferenceParticipants = (...args: Parameters<typeof queryConferenceParticipants>) =>
    queryConferenceParticipants(...args).
        observeWithColumns(['status', 'presence']);

/**
 * Observe the number of conference participants related to one conference
 */
export const observeConferenceParticipantCount = (...args: Parameters<typeof queryConferenceParticipants>) =>
    queryConferenceParticipants(...args).
        observeCount(false);

/**
 * Observe if a specific user is currently inside a conference
 */
export const observeConferenceHasParticipantPresent = (...args: QueryPresentConferenceParticipantArg<string>) =>
    queryPresentConferenceParticipant(args[0], args[1], typeof args[2] === 'string' ? Q.where('user_id', args[2]) : undefined).
        observeCount(false).
        pipe(switchMap((count) => of$(count > 0)));

/**
 * Observe if there is at least one participant present in the conference
 * Optionnaly, a userId can be ignored from the list of participants
 */
export const observeConferenceHasAtLeastOneParticipantPresent = (...args: QueryPresentConferenceParticipantArg<string>) =>
    queryPresentConferenceParticipant(args[0], args[1], typeof args[2] === 'string' ? Q.where('user_id', Q.notEq(args[2])) : undefined).
        observeCount(false).
        pipe(switchMap((count) => of$(count > 0)));
