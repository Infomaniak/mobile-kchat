// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database, Q} from '@nozbe/watermelondb';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {Database as DatabaseConstants} from '@constants';

import type ConferenceModel from '@typings/database/models/servers/conference';
import type ConferenceParticipantModel from '@typings/database/models/servers/conference_participant';

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
 * Optionnaly, a specific userId can be ignored from the list of participants
 */
export const queryPresentConferenceParticipant = (database: Database, conferenceId: string, ignoredUserId?: string) =>
    database.
        get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).
        query(
            Q.and([
                Q.where('conference_id', conferenceId),
                Q.where('present', true),
                ...(typeof ignoredUserId === 'string' ? [Q.where('user_id', Q.notEq(ignoredUserId))] : []),
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
 * Observe if there is at least one participant present in the conference
 * Optionnaly, a userId can be ignored from the list of participants
 */
export const observeConferenceHasAtLeastOneParticipantPresent = (...args: Parameters<typeof queryPresentConferenceParticipant>) =>
    queryPresentConferenceParticipant(...args).
        observeCount(false).
        pipe(switchMap((count) => of$(count > 0)));
