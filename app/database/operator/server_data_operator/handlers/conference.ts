// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {MM_TABLES} from '@constants/database';
import {
    transformConferenceRecord,
    transformConferenceParticipantRecord,
} from '@database/operator/server_data_operator/transformers/conference';
import {getUniqueRawsBy} from '@database/operator/utils/general';
import {logWarning} from '@utils/log';

import type ServerDataOperatorBase from '.';
import type Model from '@nozbe/watermelondb/Model';
import type {HandleConferencesArgs, HandleConferenceParticipantsArgs} from '@typings/database/database';
import type ConferenceModel from '@typings/database/models/servers/conference';
import type ConferenceParticipantModel from '@typings/database/models/servers/conference_participant';

const {CONFERENCE, CONFERENCE_PARTICIPANT} = MM_TABLES.SERVER;

export interface ConferenceHandlerMix {
    handleConferences: ({conferences, prepareRecordsOnly}: HandleConferencesArgs) => Promise<ConferenceModel[]>;
    handleConferenceParticipants: ({conferencesParticipants, prepareRecordsOnly}: HandleConferenceParticipantsArgs) => Promise<ConferenceParticipantModel[]>;
}

const ConferenceHandler = <TBase extends Constructor<ServerDataOperatorBase>>(superclass: TBase) => class extends superclass {
    /**
     * Handler responsible for the Create/Update operations occurring on the Conference table from the 'Server' schema
     */
    handleConferences = async ({conferences, prepareRecordsOnly}: HandleConferencesArgs): Promise<Model[]> => {
        if (!conferences?.length) {
            logWarning(
                'An empty or undefined "conferences" array has been passed to the handleConferences method',
            );
            return [];
        }

        const uniqueConferences = getUniqueRawsBy({raws: conferences, key: 'id'}) as Conference[];

        // Extract/Flatten all conference participants
        const conferencesParticipants = uniqueConferences.reduce(
            (arr, conference) => {
                Object.values(conference.registrants || {}).reduce(
                    (acc, {id: user_id, ...participant}) => {
                        acc.push({
                            ...participant,
                            user_id,
                            conference_id: conference.id, // Add the conference id
                            channel_id: conference.channel_id, // Add the channel_id
                            id: `${conference.id}-${user_id}`, // Create a unique id by using conference and user id

                            // If this user is the one that initiated the conference
                            // We always consider him present (he may disconnect later)
                            ...(user_id === conference.user_id ? {
                                present: true,
                                status: 'approved',
                            } : {}),
                        });
                        return acc;
                    },
                    arr,
                );

                // Match the ConferenceModel and delete properties before adding to DB
                delete conference.participants;
                delete conference.registrants;

                return arr;
            },
            [] as ConferenceParticipant[],
        );

        // Get conference models to be created and updated
        const preparedConferences = await this.handleRecords({
            fieldName: 'id',
            transformer: transformConferenceRecord,
            prepareRecordsOnly: true,
            createOrUpdateRawValues: uniqueConferences,
            tableName: CONFERENCE,
        }, 'handleConferences(NEVER)');

        // Add the models to be batched here
        const batch: Model[] = [...preparedConferences];

        // Calls handler for Conference Participants
        const conferenceParticipants = await this.handleConferenceParticipants({conferencesParticipants, prepareRecordsOnly: true});
        batch.push(...conferenceParticipants);

        if (batch.length && !prepareRecordsOnly) {
            await this.batchRecords(batch, 'handleConferences');
        }

        return batch;
    };

    /**
     * handleConferenceParticipants: Handler responsible for the Create/Update operations occurring on the ConferenceParticipants table from the 'Server' schema
     */
    handleConferenceParticipants = async ({conferencesParticipants, prepareRecordsOnly}: HandleConferenceParticipantsArgs): Promise<ConferenceParticipantModel[]> => {
        return this.handleRecords({
            fieldName: 'id',
            transformer: transformConferenceParticipantRecord,
            prepareRecordsOnly,
            createOrUpdateRawValues: getUniqueRawsBy({raws: conferencesParticipants, key: 'id'}) as ConferenceParticipant[],
            tableName: CONFERENCE_PARTICIPANT,
        }, 'handleConferenceParticipants');
    };
};

export default ConferenceHandler;
