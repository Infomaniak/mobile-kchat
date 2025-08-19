// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {PredefinedTimestamp} from '@screens/ik_reminder';

export type TeamServer = {
    id: string;
    display_name: string;
    name: string;
    url: string;
}

type CustomTimestamp = number;
export type PostReminderTimestamp = CustomTimestamp | PredefinedTimestamp

export interface IKClientCustomActionsMix {

    // Ik change : timestamp can be either a number (in milliseconds) or a string of type IkPostReminder
    addPostReminder: (postId: string, timestamp: PostReminderTimestamp, reschedule?: boolean, reminderPostId?: string) => Promise<Boolean>;
    markPostReminderAsDone: (postId: string) => Promise<Boolean>;
    translatePost: (postId: string) => Promise<Boolean>;
}

const IKClientCustomActions = (superclass: any) => class extends superclass {
    addPostReminder = async (postId: string, timestamp: number |string, reschedule?: boolean, reminderPostId?: string) => {
        return this.doFetch(
            `${this.getUserRoute('me')}/posts/${postId}/reminder`,
            {method: 'post', body: {target_time: timestamp, reschedule, post_id: reminderPostId}},
        );
    };

    markPostReminderAsDone = (postId: string) => {
        return this.doFetch(
            `${this.getUserRoute('me')}/posts/${postId}/reminder`,
            {method: 'delete'},
        );
    };

    translatePost = async (postId: string) => {
        return this.doFetch(
            `${this.getPostRoute(postId)}/translate`,
            {method: 'post'},
        );
    };
};

export default IKClientCustomActions;
