// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
export interface CloudUsage {
    id: string;
    storage: number;
    public_channels: number;
    private_channels: number;
    guests: number;
    pending_guests: number;
    members: number;

    // usageLoaded: boolean;

    // files: {
    //     totalStorage: number;
    //     totalStorageLoaded: boolean;
    // };
    // messages: {
    //     history: number;
    //     historyLoaded: boolean;
    // };

    // teams: TeamsUsage;

    //Ik plan limitation:
    custom_emojis: number;
    incoming_webhooks: number;
    outgoing_webhooks: number;
    sidebar_categories: number;
    scheduled_draft_custom_date: number;
    reminder_custom_date: number;
}

export type Limits = {
    id: string;
    boards: any;
    bots: any;
    integrations: any;
    storage: number;
    public_channels: number;
    private_channels: number;
    guests: number;
    members: number;
    messages: {
        history: number;
    };
    files: {
        total_storage: number;
    };
    teams: {
        active: number;
    };

    //Ik plan limitation:
    custom_emojis: number;
    incoming_webhooks: number;
    outgoing_webhooks: number;
    sidebar_categories: number;
    reminder_custom_date: boolean;
    scheduled_draft_custom_date: boolean;
}

