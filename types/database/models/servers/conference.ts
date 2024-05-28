// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type ChannelModel from './channel';
import type ConferenceParticipantModel from './conference_participant';
import type TeamModel from './team';
import type UserModel from './user';
import type {Model, Query, Relation} from '@nozbe/watermelondb';
import type {Associations} from '@nozbe/watermelondb/Model';

/**
 * A Conference is a kMeet call triggered on a channel with one or many participants
 */
declare class ConferenceModel extends Model {
    /** table (name) : Conference */
    static table: string;

    /** associations : Describes every relationship to this table. */
    static associations: Associations;

    /** create_at : The creation date for this conference */
    createAt: number;

    /** delete_at : The deletion date for this conference */
    deleteAt?: number;

    /* url : The kMeet URL of this conference */
    url: string;

    /* channel_id : The foreign key to the related Channel */
    channelId: string;

    /** team_id : The foreign key to the related Team model */
    teamId: string;

    /** user_id : The related User's foreign key that created this conference */
    userId: string;

    /** channel : The related channel */
    channel: Relation<ChannelModel>;

    /** team : The related team */
    team: Relation<TeamModel>;

    /** user : The user that initiated this conference */
    user: Relation<UserModel>;

    /** participants : All the participants (users) of this conference */
    participants: Query<ConferenceParticipantModel>;
}

export default ConferenceModel;
