// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type ConferenceModel from './conference';
import type UserModel from './user';
import type {Relation, Model} from '@nozbe/watermelondb';
import type {Associations} from '@nozbe/watermelondb/Model';

/**
 * The ConferenceParticipants model represents the 'association table' where many users have conferences and many conferences are in
 * users (relationship type N:N)
 */
declare class ConferenceParticipantModel extends Model {
    /** table (name) : ConferenceParticipants */
    static table: string;

    /** associations : Describes every relationship to this table. */
    static associations: Associations;

    /** present : Is the user currently in the conference */
    present: boolean;

    /**
     * status : The participant's status in this Conference
     * possible values are "approved", "pending", "denied"
     */
    status: 'approved' | 'pending' | 'denied';

    /** channel_id : The related Channel's foreign key to which this conference belongs */
    channelId: string;

    /** conference_id : The related Conference's foreign key to which this participant belongs */
    conferenceId: string;

    /** user_id : The user id of the user participating in the conference */
    userId: string;

    /** conference : The related record to the Conference model */
    conference: Relation<ConferenceModel>;

    /** user : The related record to the User model */
    user: Relation<UserModel>;
}

export default ConferenceParticipantModel;
