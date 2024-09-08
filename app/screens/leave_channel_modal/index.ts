// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';

import {Tutorial} from '@constants';
import {observeTutorialWatched} from '@queries/app/global';
import {observeChannel} from '@queries/servers/channel';
import {observeCurrentUser, observeTeammateNameDisplay} from '@queries/servers/user';

import LeaveChannelModal from './leave_channel_modal';

import type {WithDatabaseArgs} from '@typings/database/database';

type OwnProps = {
    channelId: string;
} & WithDatabaseArgs;
const enhanced = withObservables(['channelId'], ({database, channelId}: OwnProps) => {
    const channel = observeChannel(database, channelId);
    const currentUser = observeCurrentUser(database);

    return {
        currentUser,
        channel,
        teammateNameDisplay: observeTeammateNameDisplay(database),
        tutorialWatched: observeTutorialWatched(Tutorial.PROFILE_LONG_PRESS),
    };
});

export default withDatabase(enhanced(LeaveChannelModal));
