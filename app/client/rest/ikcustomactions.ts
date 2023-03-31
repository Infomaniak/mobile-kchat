// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export type TeamServer = {
    id: string;
    display_name: string;
    name: string;
    url: string;
}

export interface IKClientCustomActionsMix {
    addPostReminder: (postId: string, timestamp: number) => Promise<Boolean>;
}

const IKClientCustomActions = (superclass: any) => class extends superclass {
    addPostReminder = async (postId: string, timestamp: number) => {
        return this.doFetch(
            `${this.getUserRoute('me')}/posts/${postId}/reminder`,
            {method: 'post', body: {target_time: timestamp}},
        );
    };
};

export default IKClientCustomActions;
