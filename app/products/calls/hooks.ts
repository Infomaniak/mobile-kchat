// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Check if calls is enabled. If it is, then run fn; if it isn't, show an alert and set
// msgPostfix to ' (Not Available)'.
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import Permissions from 'react-native-permissions';

import {setMicPermissionsGranted} from '@calls/state';
import {useAppState} from '@hooks/device';
import { initializeVoiceTrack } from './actions';

const micPermission = Platform.select({
    ios: Permissions.PERMISSIONS.IOS.MICROPHONE,
    default: Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
});

export const usePermissionsChecker = (micPermissionsGranted: boolean) => {
    const appState = useAppState();
    const [hasPermission, setHasPermission] = useState(micPermissionsGranted);

    useEffect(() => {
        const asyncFn = async () => {
            if (appState === 'active') {
                const result = (await Permissions.check(micPermission)) === Permissions.RESULTS.GRANTED;
                setHasPermission(result);
                if (result) {
                    initializeVoiceTrack();
                    setMicPermissionsGranted(result);
                }
            }
        };
        if (!micPermissionsGranted) {
            asyncFn();
        }
    }, [appState]);

    return hasPermission;
};
