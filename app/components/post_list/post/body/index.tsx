// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';

import {observeVoiceMessagesEnabled} from '@queries/servers/system';

import Body from './body';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
    return {
        voiceMessageEnabled: observeVoiceMessagesEnabled(database),
    };
});

export default withDatabase(enhanced(Body));
