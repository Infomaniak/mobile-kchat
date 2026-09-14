// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {defineMessages} from 'react-intl';
import {Alert} from 'react-native';

import {DEFAULT_LOCALE, getTranslations} from '@i18n';
import {dismissAllModals, dismissAllOverlays} from '@screens/navigation';
import {isBetaApp} from '@utils/general';
import {
    captureJSException,
    initializeSentry,
} from '@utils/sentry';

import {logWarning} from './log';

const messages = defineMessages({
    title: {
        id: 'mobile.error_handler.title',
        defaultMessage: 'Unexpected error occurred',
    },
    description: {
        id: 'mobile.error_handler.description',
        defaultMessage: '\nTap relaunch to open the app again. After restart, you can report the problem from the settings menu.\n',
    },
    button: {
        id: 'mobile.error_handler.button',
        defaultMessage: 'Relaunch',
    },
});

class JavascriptAndNativeErrorHandlerSingleton {
    initializeErrorHandling = () => {
        initializeSentry();

        // Chain the previously-installed handler so RN's own handling (dev RedBox,
        // fatal-crash reporting) still runs, as react-native-exception-handler did
        const previousHandler = ErrorUtils.getGlobalHandler();
        ErrorUtils.setGlobalHandler((e, isFatal) => {
            this.errorHandler(e, isFatal ?? false);
            previousHandler?.(e, isFatal);
        });
    };

    errorHandler = (e: unknown, isFatal: boolean) => {
        logWarning('Handling Javascript error', e, isFatal);

        if (isBetaApp || isFatal) {
            captureJSException(e, isFatal);
        }

        if (isFatal && e instanceof Error) {
            const translations = getTranslations(DEFAULT_LOCALE);

            Alert.alert(
                translations[messages.title.id],
                translations[messages.description.id] + `\n\n${e.message}\n\n${e.stack}`,
                [{
                    text: translations[messages.button.id],
                    onPress: async () => {
                        await dismissAllModals();
                        await dismissAllOverlays();
                    },
                }],
                {cancelable: false},
            );
        }
    };
}

const JavascriptAndNativeErrorHandler = new JavascriptAndNativeErrorHandlerSingleton();
export default JavascriptAndNativeErrorHandler;
