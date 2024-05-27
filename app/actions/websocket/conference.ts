// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Q} from '@nozbe/watermelondb';
import {z} from 'zod';

import {logError} from '@app/utils/log';
import {MM_TABLES} from '@constants/database';
import DatabaseManager from '@database/manager';

import type ConferenceModel from '@app/database/models/server/conference';
import type ConferenceParticipantModel from '@app/database/models/server/conference_participant';

const {CONFERENCE, CONFERENCE_PARTICIPANT} = MM_TABLES.SERVER;

export const ConferenceAddedEvent = z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    team_id: z.string().uuid(),
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
    update_at: z.number().optional(),
});

export const ConferenceGenericEvent = z.object({
    url: z.string().url(),
    channel_id: z.string().uuid(),
    user_id: z.string().uuid(),
    team_id: z.string().uuid(),
});

export async function handleConferenceAdded(serverUrl: string, msg: WebSocketMessage) {
    const operator = DatabaseManager.serverDatabases[serverUrl]?.operator;
    if (!operator) {
        return {error: `${serverUrl} operator not found`};
    }

    try {
        operator.handleConferences({
            conferences: [ConferenceAddedEvent.parse(msg.data)],
            prepareRecordsOnly: false,
        });
    } catch (e) {
        logError(e);
        return {error: (e as Error).toString()};
    }

    return {};
}

export async function handleConferenceDeleted(serverUrl: string, msg: WebSocketMessage) {
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!database) {
            return {error: `${serverUrl} database not found`};
        }

        const event = ConferenceGenericEvent.parse(msg.data);
        const conferences = await database.get<ConferenceModel>(CONFERENCE).query(
            Q.and(
                Q.where('user_id', event.user_id),
                Q.where('channel_id', event.channel_id),
                Q.where('delete_at', Q.eq(null)),
            ),
        ).fetch();

        // Update each "delete_at"
        const batch = [] as ConferenceModel[];
        for (const conference of conferences) {
            batch.push(conference.prepareUpdate((c) => {
                c.deleteAt = Date.now();
            }));
        }

        await operator.batchRecords(batch, 'updateConferences');
    } catch (e) {
        logError(e);
        return {error: (e as Error).toString()};
    }

    return {};
}

export async function handleConferenceUserPresence(serverUrl: string, msg: WebSocketMessage, present: boolean) {
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        if (!database) {
            return {error: `${serverUrl} database not found`};
        }

        // Parse the event and construct the fetch the participants
        const event = ConferenceGenericEvent.parse(msg.data);
        const conferenceParticipants = await database.get<ConferenceParticipantModel>(CONFERENCE_PARTICIPANT).query(
            Q.and(
                Q.where('user_id', event.user_id),
                Q.where('channel_id', event.channel_id),
            ),
        ).fetch();

        // Update each status
        const batch = [] as ConferenceParticipantModel[];
        for (const participant of conferenceParticipants) {
            batch.push(participant.prepareUpdate((p) => {
                p.status = present ? 'approved' : 'denied';
                p.present = present;
            }));
        }

        await operator.batchRecords(batch, 'updateConferenceParticipants');
    } catch (e) {
        logError(e);
        return {error: (e as Error).toString()};
    }

    return {};
}

export async function handleConferenceUserConnected(serverUrl: string, msg: WebSocketMessage) {
    return handleConferenceUserPresence(serverUrl, msg, true);
}

export async function handleConferenceUserDisconnected(serverUrl: string, msg: WebSocketMessage) {
    return handleConferenceUserPresence(serverUrl, msg, false);
}
