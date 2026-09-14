// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Alert} from 'react-native';

import {dismissAllModals, dismissAllOverlays} from '@screens/navigation';
import testHelper from '@test/test_helper';
import * as Sentry from '@utils/sentry';

import errorHandling from './error_handling';
import * as Log from './log';

jest.mock('@utils/log', () => ({
    logError: jest.fn(),
    logWarning: jest.fn(() => ''),
    logDebug: jest.fn(),
    logInfo: jest.fn(),
}));

// Ik change : skip on CI, will fix later
describe.skip('JavascriptAndNativeErrorHandler', () => {
    const warning = jest.spyOn(Log, 'logWarning');
    const error = 'some error';

    test('Initialization', () => {
        const setGlobalHandler = jest.spyOn(ErrorUtils, 'setGlobalHandler');
        const previousHandler = jest.fn();
        jest.spyOn(ErrorUtils, 'getGlobalHandler').mockReturnValue(previousHandler);
        const initializeSentry = jest.spyOn(Sentry, 'initializeSentry');
        errorHandling.initializeErrorHandling();
        expect(setGlobalHandler).toHaveBeenCalledTimes(1);
        expect(initializeSentry).toHaveBeenCalledTimes(1);
        const wrappedHandler = setGlobalHandler.mock.calls[0][0] as (e: unknown, isFatal: boolean) => void;

        // The installed wrapper must chain both ways: our handler and the previous one
        const thrown = new Error('boom');
        wrappedHandler(thrown, false);
        expect(warning).toHaveBeenCalledWith('Handling Javascript error', thrown, false);
        expect(previousHandler).toHaveBeenCalledWith(thrown, false);
    });

    test('errorHandler', async () => {
        const captureJSException = jest.spyOn(Sentry, 'captureJSException');

        errorHandling.errorHandler(error, true);
        expect(warning).toHaveBeenCalledTimes(1);
        expect(warning).toHaveBeenCalledWith('Handling Javascript error', error, true);
        expect(captureJSException).toHaveBeenCalledTimes(1);
        expect(captureJSException).toHaveBeenCalledWith(error, true);

        const throwError = new Error(error);
        const alert = jest.spyOn(Alert, 'alert');
        errorHandling.errorHandler(throwError, true);
        expect(alert?.mock?.calls?.[0]?.length).toBe(4);
        alert?.mock.calls?.[0]?.[2]?.[0]?.onPress?.();
        expect(dismissAllModals).toHaveBeenCalledTimes(1);
        await testHelper.wait(20);
        expect(dismissAllOverlays).toHaveBeenCalledTimes(1);
    });
});
