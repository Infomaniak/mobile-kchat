// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import React from 'react';
import {of as of$} from 'rxjs';
import {switchMap, distinctUntilChanged} from 'rxjs/operators';

import {General} from '@constants';
import {observeIsMutedSetting, observeMyChannel, queryChannelMembers} from '@queries/servers/channel';
import {queryDraft} from '@queries/servers/drafts';
import {observeCurrentChannelId, observeCurrentUserId} from '@queries/servers/system';
import {observeTeam} from '@queries/servers/team';

import ChannelItem from './channel_item';

import type {WithDatabaseArgs} from '@typings/database/database';
import type ChannelModel from '@typings/database/models/servers/channel';

type EnhanceProps = WithDatabaseArgs & {
    channel: ChannelModel | Channel;
    showTeamName?: boolean;
    shouldHighlightActive?: boolean;
    shouldHighlightState?: boolean;
}

// Only `channel` and `showTeamName` re-create the observables: the highlight booleans
// stay plain props so a screen change can't re-subscribe every item of the list.
const enhance = withObservables(['channel', 'showTeamName'], ({
    channel,
    database,
    showTeamName = false,
}: EnhanceProps) => {
    const currentUserId = observeCurrentUserId(database);
    const myChannel = observeMyChannel(database, channel.id);

    const hasDraft = queryDraft(database, channel.id).observeWithColumns(['message', 'files', 'metadata']).pipe(
        switchMap((drafts) => {
            if (!drafts.length) {
                return of$(false);
            }

            const draft = drafts[0];
            const standardPriority = draft?.metadata?.priority?.priority === '';

            if (!draft.message && !draft.files.length && standardPriority) {
                return of$(false);
            }

            return of$(true);
        }),
        distinctUntilChanged(),
    );

    const isActive = observeCurrentChannelId(database).pipe(
        switchMap((id) => of$(id ? id === channel.id : false)),
        distinctUntilChanged(),
    );

    const isMuted = myChannel.pipe(
        switchMap((mc) => {
            if (!mc) {
                return of$(false);
            }
            return observeIsMutedSetting(database, mc.id);
        }),
    );

    const teamId = 'teamId' in channel ? channel.teamId : channel.team_id;
    const teamDisplayName = (teamId && showTeamName) ? observeTeam(database, teamId).pipe(
        switchMap((team) => of$(team?.displayName || '')),
        distinctUntilChanged(),
    ) : of$('');

    const membersCount = channel.type === General.GM_CHANNEL ? queryChannelMembers(database, channel.id).observeCount(false) : of$(0);

    const isUnread = myChannel.pipe(
        switchMap((mc) => of$(mc?.isUnread)),
        distinctUntilChanged(),
    );

    const mentionsCount = myChannel.pipe(
        switchMap((mc) => of$(mc?.mentionsCount)),
        distinctUntilChanged(),
    );

    return {
        channel: 'observe' in channel ? channel.observe() : of$(channel),
        currentUserId,
        hasDraft,
        isActive,
        isMuted,
        membersCount,
        isUnread,
        mentionsCount,
        teamDisplayName,
    };
});

export default React.memo(withDatabase(enhance(ChannelItem)));
