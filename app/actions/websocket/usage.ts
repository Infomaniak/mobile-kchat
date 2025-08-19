// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchUsage} from '@actions/remote/cloud';

export async function handleLimitationChanged(serverUrl: string) {
    await fetchUsage(serverUrl);
}
