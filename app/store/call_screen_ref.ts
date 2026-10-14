// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import type {CallScreenHandle} from '@calls/screens/call_screen/call_screen';

// Lives outside the calls product so that CallManager (loaded at boot) can hold
// the imperative handle without statically importing the call screen, which
// would pull the whole Jitsi SDK into the startup evaluation path. The screen
// registers itself through useImperativeHandle on mount.
export const callScreenRef = React.createRef<CallScreenHandle>();
