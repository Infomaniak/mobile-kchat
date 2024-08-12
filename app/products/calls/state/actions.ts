// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getGlobalCallsState, setGlobalCallsState} from '@calls/state';

export const setMicPermissionsGranted = (granted: boolean) => {
    const globalState = getGlobalCallsState();

    const nextGlobalState = {
        ...globalState,
        micPermissionsGranted: granted,
    };
    setGlobalCallsState(nextGlobalState);
};
