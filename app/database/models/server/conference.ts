// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {children, field, immutableRelation} from '@nozbe/watermelondb/decorators';
import Model, {type Associations} from '@nozbe/watermelondb/Model';

import {MM_TABLES} from '@constants/database';

import type {Query, Relation} from '@nozbe/watermelondb';
import type ChannelModel from '@typings/database/models/servers/channel';
import type ConferenceModelInterface from '@typings/database/models/servers/conference';
import type ConferenceParticipantModel from '@typings/database/models/servers/conference_participant';
import type TeamModel from '@typings/database/models/servers/team';
import type UserModel from '@typings/database/models/servers/user';

const {CHANNEL, CONFERENCE, CONFERENCE_PARTICIPANT, TEAM, USER} = MM_TABLES.SERVER;

/**
 * The Conference model contains conference information of a post.
 */
export default class ConferenceModel extends Model implements ConferenceModelInterface {
    /** table (name) : Conference */
    static table = CONFERENCE;

    /** associations : Describes every relationship to this table. */
    static associations: Associations = {

        /** A CONFERENCE belongs to a CHANNEL (relationship is 1:1) */
        [CHANNEL]: {type: 'belongs_to', key: 'channel_id'},

        /** A CONFERENCE has one TEAM (relationship is 1:1) */
        [TEAM]: {type: 'belongs_to', key: 'team_id'},

        /** A CONFERENCE is created by one USER (relationship is 1:1) */
        [USER]: {type: 'belongs_to', key: 'user_id'},

        /** A CONFERENCE can have multiple CONFERENCE_PARTICIPANT (relationship is 1:N) */
        [CONFERENCE_PARTICIPANT]: {type: 'has_many', foreignKey: 'conference_id'},
    };

    /** create_at : The creation date for this channel */
    @field('create_at') createAt!: number;

    /** delete_at : The deletion date for this channel */
    @field('delete_at') deleteAt?: number;

    /** url : The kMeet URL of this conference */
    @field('url') url!: string;

    /** channel_id : The foreign key to the related Channel */
    @field('channel_id') channelId!: string;

    /** team_id : The foreign key to the related Team model */
    @field('team_id') teamId!: string;

    /** user_id : The related User's foreign key that created this conference */
    @field('user_id') userId!: string;

    /** channel: The channel related to the kMeet conference */
    @immutableRelation(CHANNEL, 'channel_id') channel!: Relation<ChannelModel>;

    /** team: The related team */
    @immutableRelation(TEAM, 'team_id') team!: Relation<TeamModel>;

    /** user : The user that initiated this conference */
    @immutableRelation(USER, 'user_id') user!: Relation<UserModel>;

    /** participants : All the participants associated with this Conference */
    @children(CONFERENCE_PARTICIPANT) participants!: Query<ConferenceParticipantModel>;
}
