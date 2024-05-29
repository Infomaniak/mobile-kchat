// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {experimentalFailsafe, field, immutableRelation} from '@nozbe/watermelondb/decorators';
import Model, {type Associations} from '@nozbe/watermelondb/Model';

import {MM_TABLES} from '@constants/database';

import type {Relation} from '@nozbe/watermelondb';
import type ConferenceModel from '@typings/database/models/servers/conference';
import type ConferenceParticipantModelInterface from '@typings/database/models/servers/conference_participant';
import type UserModel from '@typings/database/models/servers/user';

const {CHANNEL, CONFERENCE, CONFERENCE_PARTICIPANT, USER} = MM_TABLES.SERVER;

/**
 * The Conference Participants model contains participants data of a conference.
 */
export default class ConferenceParticipantModel extends Model implements ConferenceParticipantModelInterface {
    /** table (name) : ConferenceParticipant */
    static table = CONFERENCE_PARTICIPANT;

    /** associations : Describes every relationship to this table. */
    static associations: Associations = {

        /** A CHANNEL can have multiple PARTICIPANT (relationship is 1:N) */
        [CHANNEL]: {type: 'belongs_to', key: 'channel_id'},

        /** A CONFERENCE can have multiple PARTICIPANT (relationship is 1:N) */
        [CONFERENCE]: {type: 'belongs_to', key: 'conference_id'},

        /** A USER can participate in multiple CONFERENCE (relationship is 1:N) */
        [USER]: {type: 'belongs_to', key: 'user_id'},
    };

    /** present : Is the user currently in the conference */
    @field('present') present!: boolean;

    /**
     * status : The participant's status in this Conference
     * possible values are "approved", "pending", "denied"
     */
    @field('status') status!: 'approved' | 'pending' | 'denied';

    /** channel_id : The related Channel's foreign key to which this participant belongs */
    @field('channel_id') channelId!: string;

    /** conference_id : The related Conference's foreign key to which this participant belongs */
    @field('conference_id') conferenceId!: string;

    /** user_id : The user id of the user participating in the conference */
    @field('user_id') userId!: string;

    /** conference : The related record to the Conference model */
    @immutableRelation(CONFERENCE, 'id') conference!: Relation<ConferenceModel>;

    /** user : The related record to the User model */
    @experimentalFailsafe(undefined) @immutableRelation(USER, 'user_id') user!: Relation<UserModel>;
}
