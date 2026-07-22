// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {RUNNING_E2E} from '@env';
import TurboLogger from '@mattermost/react-native-turbo-log';
import {Alert, type AlertButton, type AlertOptions, AppRegistry, AppState, LogBox, Platform, UIManager} from 'react-native';
import 'react-native-gesture-handler';
import ViewReactNativeStyleAttributes from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

import setFontFamily from './app/utils/font_family';
import {logInfo} from './app/utils/log';

import type {RequireContext} from 'expo-router/build/types';

declare const global: { HermesInternal: null | {} };

export function installAlertSpy() {
    const originalAlert = Alert.alert;

    Alert.alert = ((title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => {
        // eslint-disable-next-line no-console
        console.log(
            '[Alert.alert] called',
            {title, message, buttons, options},
        );

        // Ik change : do not show alerts when app is in background https://trello.com/c/0h69EeHH/1468-ios-un-bouton-ok-apparait-sur-la-home
        if (AppState.currentState === 'background') {
            return undefined;
        }

        return (originalAlert as any)(title, message, buttons, options);
    }) as typeof Alert.alert;
}

ViewReactNativeStyleAttributes.scaleY = true;

TurboLogger.configure({
    dailyRolling: false,
    logToFile: !__DEV__,
    maximumFileSize: 1024 * 1024,
    maximumNumberOfFiles: 2,
});

if (__DEV__) {
    LogBox.ignoreLogs([
        'new NativeEventEmitter',
    ]);

    const isRunningE2e = RUNNING_E2E === 'true';
    logInfo(`RUNNING_E2E: ${RUNNING_E2E}, isRunningE2e: ${isRunningE2e}`);
    if (isRunningE2e) {
        LogBox.ignoreAllLogs(true);
    }
}

setFontFamily();
installAlertSpy();

if (global.HermesInternal) {
    require('@formatjs/intl-getcanonicallocales/polyfill-force');
    require('@formatjs/intl-locale/polyfill-force');
    require('@formatjs/intl-pluralrules/polyfill-force');
    require('@formatjs/intl-numberformat/polyfill-force');
    require('@formatjs/intl-datetimeformat/polyfill-force');
    require('@formatjs/intl-datetimeformat/add-all-tz');
    require('@formatjs/intl-listformat/polyfill-force');
    require('@formatjs/intl-relativetimeformat/polyfill-force');
    require('@formatjs/intl-displaynames/polyfill-force');
}

if (Platform.OS === 'android') {
    const ShareExtension = require('share_extension/index.tsx').default;
    AppRegistry.registerComponent('MattermostShare', () => ShareExtension);
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

// eslint-disable-next-line no-process-env
process.env.EXPO_OS = Platform.OS;

function App() {
    const {ExpoRoot} = require('expo-router') as typeof import('expo-router');
    const context = require.context('./app/routes') as RequireContext;
    return <ExpoRoot context={context}/>;
}

AppRegistry.registerComponent('Mattermost', () => App);
