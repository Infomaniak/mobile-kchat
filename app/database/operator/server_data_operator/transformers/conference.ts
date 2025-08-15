// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {MM_TABLES, OperationType} from '@constants/database';
import {prepareBaseRecord} from '@database/operator/server_data_operator/transformers/index';

import type {TransformerArgs} from '@typings/database/database';
import type ConferenceModel from '@typings/database/models/servers/conference';
import type ConferenceParticipantModel from '@typings/database/models/servers/conference_participant';

const {CONFERENCE, CONFERENCE_PARTICIPANT} = MM_TABLES.SERVER;

/**
 * transformConferenceRecord: Prepares a record of the SERVER database 'Conference' table for update or create actions.
 * @param {TransformerArgs} operator
 * @param {Database} operator.database
 * @param {RecordPair} operator.value
 * @returns {Promise<ConferenceModel>}
 */
export const transformConferenceRecord = ({action, database, value}: TransformerArgs<ConferenceModel, Conference>): Promise<ConferenceModel> => {
    const raw = value.raw as Conference;
    const record = value.record as ConferenceModel;
    const isCreateAction = action === OperationType.CREATE;

    // If isCreateAction is true, we will use the id (API response) from the RAW, else we shall use the existing record id from the database
    const fieldsMapper = (conference: ConferenceModel) => {
        conference._raw.id = isCreateAction ? (raw?.id ?? conference.id) : record.id;
        conference.createAt = raw.create_at;

        conference.channelId = raw.channel_id;
        conference.userId = raw.user_id;
    };

    return prepareBaseRecord({
        action,
        database,
        tableName: CONFERENCE,
        value,
        fieldsMapper,
    }) as Promise<ConferenceModel>;
};

/**
 * transformConferenceParticipantRecord: Prepares a record of the SERVER database 'ConferenceParticipant' table for update or create actions.
 * @param {TransformerArgs} operator
 * @param {Database} operator.database
 * @param {RecordPair} operator.value
 * @returns {Promise<ConferenceParticipantModel>}
 */
export const transformConferenceParticipantRecord = ({action, database, value}: TransformerArgs<ConferenceParticipantModel, ConferenceParticipant>): Promise<ConferenceParticipantModel> => {
    const raw = value.raw as ConferenceParticipant;

    // id of participant comes from server response
    const fieldsMapper = (participant: ConferenceParticipantModel) => {
        // Status is always "approved" if the participant is present in the conference
        participant.present = raw.present;
        participant.status = participant.present ? 'approved' : raw.status;
        participant.channelId = raw.channel_id;
        participant.conferenceId = raw.conference_id;
        participant.userId = raw.user_id;
    };

    return prepareBaseRecord({
        action,
        database,
        tableName: CONFERENCE_PARTICIPANT,
        value,
        fieldsMapper,
    }) as Promise<ConferenceParticipantModel>;
};
