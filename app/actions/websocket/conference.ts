// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import {z} from 'zod';

import {MM_TABLES} from '@constants/database';
import DatabaseManager from '@database/manager';
import {queryConference} from '@queries/servers/conference';
import {logError} from '@utils/log';

import type {default as ConferenceModel, ConferenceModelFields} from '@database/models/server/conference';
import type {default as ConferenceParticipantModel, ConferenceParticipantModelFields} from '@database/models/server/conference_participant';

type ConferenceModelChanges = Partial<Pick<ConferenceModel, ConferenceModelFields>>;
type ConferenceParticipantModelChanges = Partial<Pick<ConferenceParticipantModel, ConferenceParticipantModelFields>>;

const {CONFERENCE, CONFERENCE_PARTICIPANT} = MM_TABLES.SERVER;

const ConferenceEvent = z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    channel_id: z.string().uuid(),
    user_id: z.string().uuid(),
    participants: z.array(z.string().uuid()).optional(),
    registrants: z.record(
        z.string().uuid(),
        z.object({
            id: z.string().uuid(),
            present: z.boolean(),
            status: z.enum(['approved', 'pending', 'denied']),
        }),
    ).optional(),
    create_at: z.number(),
    delete_at: z.number().optional(),
});

const ConferenceGenericEvent = z.object({
    url: z.string().url(),
    channel_id: z.string().uuid(),
    user_id: z.string().uuid(),
    team_id: z.string().uuid(),
});

/**
 * Handle conference upsert
 */
export const handleConferenceReceived = async (serverUrl: string, data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const operator = DatabaseManager.serverDatabases[serverUrl]?.operator;
    if (!operator) {
        logError(`${serverUrl} operator not found`);
        return undefined;
    }

    try {
        const [conference] = await operator.handleConferences({
            conferences: [ConferenceEvent.parse(data)],
            prepareRecordsOnly: false,
        });
        return conference;
    } catch (e) {
        logError(e);
        return undefined;

        // return {error: (e as Error).toString()};
    }
};

/**
 * Handle the insertion of a conference via WS
 */
export const handleConferenceAdded = async (serverUrl: string, msg: WebSocketMessage) =>
    handleConferenceReceived(serverUrl, msg.data);

export const handleConferenceUpdated = async (serverUrl: string, conferences: ConferenceModel[], changes: ConferenceModelChanges) => {
    const operator = DatabaseManager.serverDatabases[serverUrl]?.operator;
    if (!operator) {
        return {error: `${serverUrl} operator not found`};
    }

    try {
        const batch = [] as ConferenceModel[];
        for (const conference of conferences) {
            batch.push(conference.prepareUpdate((c) => {
                for (const [key, value] of Object.entries(changes)) {
                    // @ts-expect-error ts does not know how to process key as enums
                    c[key] = value;
                }
            }));
        }

        await operator.batchRecords(batch, 'updateConferences');
    } catch (e) {
        logError(e);
        return {error: (e as Error).toString()};
    }

    return {};
};

export const handleConferenceUpdatedById = async (serverUrl: string, conferenceId: string, changes: ConferenceModelChanges) => {
    const database = DatabaseManager.serverDatabases[serverUrl]?.database;
    if (!database) {
        return {error: `${serverUrl} database not found`};
    }

    try {
        const conferences = await queryConference(database, conferenceId).fetch();
        return await handleConferenceUpdated(serverUrl, conferences, changes);
    } catch (e) {
        logError(e);
        return {error: (e as Error).toString()};
    }
};

const deleteConferences = (serverUrl: string, conferences: ConferenceModel[]) =>
    handleConferenceUpdated(serverUrl, conferences, {deleteAt: Date.now()});

export const handleConferenceDeleted = async (serverUrl: string, msg: WebSocketMessage) => {
    const database = DatabaseManager.serverDatabases[serverUrl]?.database;
    if (!database) {
        return {error: `${serverUrl} database not found`};
    }

    try {
        // ConferenceGenericEvent does not contain the conferenceId
        const event = ConferenceGenericEvent.parse(msg.data);
        const conferences = await database.get<ConferenceModel>(CONFERENCE).query(
            Q.and(
                Q.where('user_id', event.user_id),
                Q.where('channel_id', event.channel_id),
                Q.where('delete_at', Q.eq(null)),
            ),
        ).fetch();

        return await deleteConferences(serverUrl, conferences);
    } catch (e) {
        logError(e);
        return {error: (e as Error).toString()};
    }
};

export const handleConferenceDeletedById = async (serverUrl: string, conferenceId: string) => {
    const database = DatabaseManager.serverDatabases[serverUrl]?.database;
    if (!database) {
        return {error: `${serverUrl} database not found`};
    }

    try {
        const conferences = await queryConference(database, conferenceId).fetch();
        return await deleteConferences(serverUrl, conferences);
    } catch (e) {
        logError(e);
        return {error: (e as Error).toString()};
    }
};

export const handleConferenceUserUpdated = async (serverUrl: string, msg: WebSocketMessage, changes: ConferenceParticipantModelChanges) => {
    const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
    if (!database) {
        return {error: `${serverUrl} database not found`};
    }

    try {
        // Parse the event
        const event = ConferenceGenericEvent.parse(msg.data);

        // Fetch the latest conference that matches this channel_id
        const [conference] = await database.get<ConferenceModel>(CONFERENCE).query(
            Q.where('channel_id', event.channel_id),
            Q.sortBy('create_at', Q.desc),
            Q.take(1),
        ).fetch();

        // Get the conference participant that matches the conference's id and user id
        const conferenceId = conference?.id;
        if (typeof conferenceId === 'string') {
            const conferenceParticipants = await database.get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).query(
                Q.and(
                    Q.where('user_id', event.user_id),
                    Q.where('conference_id', conference.id),
                ),
            ).fetch();

            // Update each status
            const batch = [] as ConferenceParticipantModel[];
            for (const participant of conferenceParticipants) {
                batch.push(participant.prepareUpdate((p) => {
                    for (const [key, value] of Object.entries(changes)) {
                        // @ts-expect-error ts does not know how to process key as enums
                        p[key] = value;
                    }
                }));
            }

            await operator.batchRecords(batch, 'updateConferenceParticipants');
        }
    } catch (e) {
        logError(e);
        return {error: (e as Error).toString()};
    }

    return {};
};

export async function handleConferenceUserConnected(serverUrl: string, msg: WebSocketMessage) {
    return handleConferenceUserUpdated(serverUrl, msg, {present: true, status: 'approved'});
}

export async function handleConferenceUserDenied(serverUrl: string, msg: WebSocketMessage) {
    return handleConferenceUserUpdated(serverUrl, msg, {status: 'denied'});
}

export async function handleConferenceUserDisconnected(serverUrl: string, msg: WebSocketMessage) {
    return handleConferenceUserUpdated(serverUrl, msg, {present: false});
}
