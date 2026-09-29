// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Check if calls is enabled. If it is, then run fn; if it isn't, show an alert and set
// msgPostfix to ' (Not Available)'.
import {useEffect} from 'react';
import {Platform} from 'react-native';
import Permissions from 'react-native-permissions';

import {setMicPermissionsGranted} from '@calls/state/actions';
import {useAppState} from '@hooks/device';

const micPermission = Platform.select({
    ios: Permissions.PERMISSIONS.IOS.MICROPHONE,
    default: Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
});

export const usePermissionsChecker = (micPermissionsGranted: boolean) => {
    const appState = useAppState();

    useEffect(() => {
        const asyncFn = async () => {
            if (appState === 'active') {
                // Request rather than check: this triggers the OS prompt when the
                // permission is undetermined and resolves as soon as it is answered,
                // so the mute button does not stay disabled if the user grants the
                // permission while the app stays foregrounded.
                const result = (await Permissions.request(micPermission)) === Permissions.RESULTS.GRANTED;
                if (result !== micPermissionsGranted) {
                    setMicPermissionsGranted(result);
                }
            }
        };
        asyncFn();
    }, [appState, micPermissionsGranted]);
};
