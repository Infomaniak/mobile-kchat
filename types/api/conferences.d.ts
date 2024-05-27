// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

type ConferenceParticipant = {
    id: string;
    user_id: string;
    channel_id: string;
    conference_id: string;
    present: boolean;
    status: 'approved' | 'pending' | 'denied';
}

type Conference = {
    id: string;
    url: string;
    channel_id: string;
    team_id: string;
    user_id: string;
    participants?: string[];
    registrants?: Record<string, Pick<ConferenceParticipant, 'id' | 'present' | 'status'>>;
    create_at: number;
    delete_at?: number;
};
