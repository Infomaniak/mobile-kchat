// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {of as of$} from 'rxjs';

import {observeChannel, observeChannelInfo} from '@queries/servers/channel';
import {observeLimits} from '@queries/servers/limit';
import {observeCurrentTeamId} from '@queries/servers/system';
import {observeUsage} from '@queries/servers/usage';

import CreateOrEditChannel from './create_or_edit_channel';

import type {WithDatabaseArgs} from '@typings/database/database';

type OwnProps = {
    channelId?: string;
}

const enhanced = withObservables([], ({database, channelId}: WithDatabaseArgs & OwnProps) => {
    const channel = channelId ? observeChannel(database, channelId) : of$(undefined);
    const channelInfo = channelId ? observeChannelInfo(database, channelId) : of$(undefined);

    const currentTeamId = observeCurrentTeamId(database);
    const limits = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeLimits(database, teamId) : of$(null))),
    );
    const usage = currentTeamId.pipe(
        switchMap((teamId) => (teamId ? observeUsage(database, teamId) : of$(null))),
    );

    return {
        channel,
        channelInfo,
        limits,
        usage,
    };
});

export default withDatabase(enhanced(CreateOrEditChannel));
