// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {RUNNING_E2E} from '@env';
import TurboLogger from '@mattermost/react-native-turbo-log';
import {ExpoRoot} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import {AppRegistry, LogBox, Platform, UIManager} from 'react-native';
import ViewReactNativeStyleAttributes from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

import setFontFamily from './app/utils/font_family';
import {logInfo} from './app/utils/log';

ViewReactNativeStyleAttributes.scaleY = true;

TurboLogger.configure({
    dailyRolling: false,
    logToFile: !__DEV__,
    maximumFileSize: 1024 * 1024,
    maximumNumberOfFiles: 2,
});

if (__DEV__) {
    LogBox.ignoreAllLogs(true);
    const isRunningE2e = RUNNING_E2E === 'true';
    logInfo(`RUNNING_E2E: ${RUNNING_E2E}, isRunningE2e: ${isRunningE2e}`);
    if (isRunningE2e) {
        LogBox.ignoreAllLogs(true);
    }
}

setFontFamily();

if (Platform.OS === 'android') {
    const ShareExtension = require('./share_extension/index.tsx').default;
    AppRegistry.registerComponent('MattermostShare', () => ShareExtension);
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

// eslint-disable-next-line no-process-env
process.env.EXPO_OS = Platform.OS;

// Before ExpoRoot; NavigationContainer onReady otherwise hides splash.
SplashScreen.setOptions({fade: true});
SplashScreen.preventAutoHideAsync().catch(() => undefined);

export function App() {
    const ctx = require.context('./app/routes');
    return <ExpoRoot context={ctx}/>;
}

AppRegistry.registerComponent('kChat', () => App);
