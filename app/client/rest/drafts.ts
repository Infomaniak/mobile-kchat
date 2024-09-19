// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {omit} from 'lodash';

import type ClientBase from './base';

export interface ClientDraftsMix {
    getDrafts: (teamId: string) => Promise<Draft[]>;
    upsertDraft: (draft: Draft) => Promise<Draft>;
    deleteDraft: (channelId: Channel['id'], rootId?: string) => Promise<null>;
    updateScheduledDraft: (draft: ScheduledDraft) => Promise<Draft>;
    deleteScheduledDraft: (draftId: ScheduledDraft['id']) => Promise<Draft>;
}

type ScheduledDraft = Draft & { id: string };

const ClientDrafts = <TBase extends Constructor<ClientBase>>(superclass: TBase) => class extends superclass {
    // Routes
    getDraftsRoute = (suffix?: string): string => `${this.urlVersion}/drafts${suffix || ''}`;
    getDraftRoute = (draftId: string) => this.getDraftsRoute(`/${draftId}`);

    // Queries
    getDrafts = (teamId: string) =>
        this.doFetch<Draft[]>(`${this.getUserRoute('me')}/teams/${teamId}/drafts`, {method: 'get'});

    // - normal draft
    upsertDraft = (draft: Draft) => {
        return this.doFetch<Draft>(
            this.getDraftsRoute(),
            {method: 'post', body: omit(draft, 'props')},
        );
    };
    deleteDraft = (channelId: Channel['id'], rootId = '') => {
        let endpoint = `${this.getUserRoute('me')}/channels/${channelId}/drafts`;
        if (rootId !== '') {
            endpoint += `/${rootId}`;
        }

        return this.doFetch<null>(endpoint, {method: 'delete'});
    };

    // - scheduled draft
    updateScheduledDraft = (draft: ScheduledDraft) => this.doFetch<Draft>(
        `${this.getDraftRoute(draft.id)}`,
        {method: 'put', body: JSON.stringify(draft)},
    );
    deleteScheduledDraft = (draftId: ScheduledDraft['id']) => this.doFetch<Draft>(
        `${this.getDraftRoute(draftId)}`,
        {method: 'delete'},
    );
};

export default ClientDrafts;
