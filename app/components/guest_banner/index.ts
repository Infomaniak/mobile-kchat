// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {of as of$, switchMap} from '@nozbe/watermelondb/utils/rx';

import {observeChannelInfo} from '@queries/servers/channel';

import GuestBanner from './guest_banner';

import type {WithDatabaseArgs} from '@typings/database/database';

type OwnProps = {
    channelId: string;
}

const enhanced = withObservables([], ({database, channelId}: WithDatabaseArgs & OwnProps) => {
    return {
        guestsCount: observeChannelInfo(database, channelId).pipe(switchMap((info) => of$(info?.guestCount))),
    };
});

export default withDatabase(enhanced(GuestBanner));
