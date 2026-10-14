// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Import necessary dependencies and functions
import Sentry from '@sentry/react-native'; // Importing Sentry as module mock
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Config from '@assets/config.json';
import ClientError from '@client/rest/error';
import DatabaseManager from '@database/manager';
import {getConfig} from '@queries/servers/system';
import {getCurrentUser} from '@queries/servers/user';

import * as log from './log';
import {initializeSentry, captureException, captureJSException, addSentryContext, startChannelSwitchSpan, endChannelSwitchSpan, wrapSentryRoot} from './sentry';

// Mocks
jest.mock('@sentry/react-native', () => ({
    init: jest.fn(),
    captureException: jest.fn(),
    startInactiveSpan: jest.fn(),
    addBreadcrumb: jest.fn(),
    setContext: jest.fn(),
    setTag: jest.fn(),
    wrap: jest.fn((component) => component),
    ReactNativeTracing: jest.fn(),
    reactNativeNavigationIntegration: jest.fn().mockImplementation(() => ({
        name: 'reactNativeNavigation',
    })),
}));

jest.mock('react-native-device-info', () => ({
    getInstallerPackageNameSync: jest.fn().mockReturnValue('AppStore'),
}));

jest.mock('@assets/config.json', () => ({
    SentryEnabled: true,
    SentryDsnAndroid: 'YOUR_ANDROID_DSN_HERE',
    SentryDsnIos: 'YOUR_IOS_DSN_HERE',
    SentryEnvironment: 'production',
    SentryOptions: {
        severityLevelFilter: ['error', 'warning'],
    },
}));

jest.mock('./log', () => ({
    logDebug: jest.fn(),
    logWarning: jest.fn(),
    logError: jest.fn(),
}));

jest.mock('@database/manager', () => ({
    getServerDatabaseAndOperator: jest.fn().mockReturnValue({
        database: {} as any, // Mocking database object
    }),
}));

jest.mock('@queries/servers/system', () => ({
    getConfig: jest.fn().mockResolvedValue({
        BuildDate: '2024-06-24',
        BuildEnterpriseReady: true,
        BuildHash: 'HASH',
        BuildHashEnterprise: 'HASH_ENTERPRISE',
        BuildNumber: '1234',
    }),
}));

jest.mock('@queries/servers/user', () => ({
    getCurrentUser: jest.fn().mockResolvedValue({
        id: 'userId',
        locale: 'en-US',
        roles: ['user'],
    }),
}));

jest.mock('@utils/errors', () => ({
    getFullErrorMessage: jest.fn().mockReturnValue('Full error message'),
}));

describe('initializeSentry function', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mock calls after each test
    });

    it('should not initialize Sentry if SentryEnabled is false', () => {
        Config.SentryEnabled = false;

        initializeSentry();

        expect(Sentry.init).not.toHaveBeenCalled();
    });

    it('should log a warning if DSN is missing', () => {
        Config.SentryEnabled = true;
        Config.SentryDsnAndroid = '';
        Config.SentryDsnIos = '';

        initializeSentry();

        expect(log.logWarning).toHaveBeenCalledWith('Sentry is enabled, but not configured on this platform');
    });

    it('should resolve TestFlight installs to rc on iOS', () => {
        const originalDev = __DEV__;
        (global as any).__DEV__ = false;
        Config.SentryEnabled = true;
        Config.SentryDsnIos = 'YOUR_IOS_DSN_HERE';
        (DeviceInfo.getInstallerPackageNameSync as jest.Mock).mockReturnValue('TestFlight');

        try {
            initializeSentry();

            expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({environment: 'rc'}));
            expect(Sentry.setTag).toHaveBeenCalledWith('install_source', 'testflight');
        } finally {
            (global as any).__DEV__ = originalDev;
        }
    });

    it('should resolve App Store installs to production on iOS', () => {
        const originalDev = __DEV__;
        (global as any).__DEV__ = false;
        Config.SentryEnabled = true;
        Config.SentryDsnIos = 'YOUR_IOS_DSN_HERE';
        (DeviceInfo.getInstallerPackageNameSync as jest.Mock).mockReturnValue('AppStore');

        try {
            initializeSentry();

            expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({environment: 'production'}));
            expect(Sentry.setTag).toHaveBeenCalledWith('install_source', 'appstore');
        } finally {
            (global as any).__DEV__ = originalDev;
        }
    });

    it('should fail safe to rc when the install source is unknown on iOS', () => {
        const originalDev = __DEV__;
        (global as any).__DEV__ = false;
        Config.SentryEnabled = true;
        Config.SentryDsnIos = 'YOUR_IOS_DSN_HERE';
        (DeviceInfo.getInstallerPackageNameSync as jest.Mock).mockReturnValue('Other');

        try {
            initializeSentry();

            expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({environment: 'rc'}));
        } finally {
            (global as any).__DEV__ = originalDev;
        }
    });

    it('should use the configured environment on Android', () => {
        const originalDev = __DEV__;
        const originalPlatform = Platform.OS;
        (global as any).__DEV__ = false;
        Platform.OS = 'android';
        Config.SentryEnabled = true;
        Config.SentryDsnAndroid = 'YOUR_ANDROID_DSN_HERE';
        Config.SentryEnvironment = 'rc';
        (DeviceInfo.getInstallerPackageNameSync as jest.Mock).mockReturnValue('AppStore');

        try {
            initializeSentry();

            expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({environment: Config.SentryEnvironment}));
        } finally {
            (global as any).__DEV__ = originalDev;
            Platform.OS = originalPlatform;
        }
    });

    it.skip('should initialize Sentry correctly', () => {
        // IK change : skipped on CI temporarily, will fix later
        Config.SentryEnabled = true;
        Config.SentryDsnAndroid = 'YOUR_ANDROID_DSN_HERE';
        Config.SentryDsnIos = 'YOUR_IOS_DSN_HERE';

        initializeSentry();

        expect(Sentry.init).toHaveBeenCalled();
        Platform.OS = 'ios';
        expect(Sentry.init).toHaveBeenCalledWith({
            dsn: 'YOUR_IOS_DSN_HERE',
            sendDefaultPii: false,
            environment: 'rc', // Assuming isBetaApp() returns true in this test
            tracesSampleRate: 1.0,
            sampleRate: 1.0,
            attachStacktrace: true, // Adjust based on your actual logic
            enableCaptureFailedRequests: false,
            integrations: [
                {name: 'reactNativeNavigation'},
            ],
            beforeSend: expect.any(Function),
        });

        // @ts-expect-error mock not in definition
        const beforeSendFn = Sentry.init.mock.calls[0][0].beforeSend;
        const event = {level: 'error'};
        const result = beforeSendFn(event as any); // Simulate a call to beforeSend function

        expect(result).toEqual(event);
    });
});

describe('captureException function', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mock calls after each test
    });

    it('should not capture exception if Sentry is disabled', () => {
        Config.SentryEnabled = false;

        captureException(new Error('Test error'));

        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('should log a warning if error is missing', () => {
        Config.SentryEnabled = true;

        captureException(undefined);

        expect(log.logWarning).toHaveBeenCalledWith('captureException called with missing arguments', undefined);
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('should capture exception correctly', () => {
        captureException(new Error('Test error'));

        expect(Sentry.captureException).toHaveBeenCalled();
        expect(Sentry.captureException).toHaveBeenCalledWith(new Error('Test error'));
    });
});

describe('captureJSException function', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mock calls after each test
    });

    it('should not capture exception if Sentry is disabled', () => {
        Config.SentryEnabled = false;

        captureJSException(new Error('Test error'), true);

        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('should log a warning if error is missing', () => {
        Config.SentryEnabled = true;

        captureJSException(undefined, true);

        expect(log.logWarning).toHaveBeenCalledWith('captureJSException called with missing arguments', undefined);
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('should capture ClientError as breadcrumb', () => {
        const errorData: ClientErrorProps = {
            url: 'https://example.com',
            status_code: 400,
            message: 'some error from server',
            server_error_id: 'server_error_id',
        };
        const clientError = new ClientError('Client error', errorData);

        captureJSException(clientError, true);

        expect(Sentry.addBreadcrumb).toHaveBeenCalled();
        expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
            category: 'uncaught-app-error',
            data: {
                isFatal: 'true',
                server_error_id: 'server_error_id',
                status_code: 400,
            },
            level: 'warning',
            message: 'Full error message',
        });
    });

    it('should capture other exceptions', () => {
        const error = new Error('Test error');

        captureJSException(error, true);

        expect(Sentry.captureException).toHaveBeenCalled();
        expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });
});

describe('addSentryContext function', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mock calls after each test
    });

    it('should not add context if Sentry is disabled', async () => {
        Config.SentryEnabled = false;

        await addSentryContext('https://example.com');

        expect(Sentry.setContext).not.toHaveBeenCalled();
    });

    it.skip('should add user, build, and server context', async () => {
        // IK change : skipped on CI temporarily, will fix later
        Config.SentryEnabled = true;

        await addSentryContext('https://example.com');

        expect(DatabaseManager.getServerDatabaseAndOperator).toHaveBeenCalledWith('https://example.com');
        expect(getCurrentUser).toHaveBeenCalled();
        expect(getConfig).toHaveBeenCalled();
        expect(Sentry.setContext).toHaveBeenCalledWith('User-Information', {
            userID: 'userId',
            email: '',
            username: '',
            locale: 'en-US',
            roles: ['user'],
        });
        expect(Sentry.setContext).toHaveBeenCalledWith('App-Build Information', {
            serverBuildHash: 'HASH',
            serverBuildNumber: '1234',
        });
        expect(Sentry.setContext).toHaveBeenCalledWith('Server-Information', {
            config: {
                BuildDate: '2024-06-24',
                BuildEnterpriseReady: true,
                BuildHash: 'HASH',
                BuildHashEnterprise: 'HASH_ENTERPRISE',
                BuildNumber: '1234',
            },
            currentChannel: {},
            currentTeam: {},
        });
    });

    it.skip('should log an error if an exception occurs', async () => {
        // IK change : skipped on CI temporarily, will fix later
        (DatabaseManager.getServerDatabaseAndOperator as jest.Mock).mockImplementation(() => {
            throw new Error('Database error');
        });

        await addSentryContext('https://example.com');

        expect(log.logError).toHaveBeenCalledWith('addSentryContext for serverUrl https://example.com', expect.any(Error));
        expect(Sentry.setContext).not.toHaveBeenCalled();
    });
});

describe('channel switch span', () => {
    let mockSpan: {end: jest.Mock; setAttribute: jest.Mock};

    beforeEach(() => {
        Config.SentryEnabled = true;
        Config.SentryDsnAndroid = 'YOUR_ANDROID_DSN_HERE';
        Config.SentryDsnIos = 'YOUR_IOS_DSN_HERE';
        mockSpan = {end: jest.fn(), setAttribute: jest.fn()};
        (Sentry.startInactiveSpan as jest.Mock).mockReturnValue(mockSpan);
        initializeSentry();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should start an inactive span with the channel switch operation', () => {
        startChannelSwitchSpan('channel-id-1');

        expect(Sentry.startInactiveSpan).toHaveBeenCalledWith({
            name: 'channel_switch',
            op: 'mobile.channel_switch',
            attributes: {'kchat.channel_id': 'channel-id-1'},
        });
        endChannelSwitchSpan('channel-id-1');
    });

    it('should end the started span', () => {
        startChannelSwitchSpan('channel-id-1');
        endChannelSwitchSpan('channel-id-1');

        expect(mockSpan.end).toHaveBeenCalledTimes(1);
    });

    it('should ignore an end from another channel', () => {
        startChannelSwitchSpan('channel-id-1');
        endChannelSwitchSpan('channel-id-2');

        expect(mockSpan.end).not.toHaveBeenCalled();
        endChannelSwitchSpan('channel-id-1');
    });

    it('should not start a second span while one is still in flight', () => {
        startChannelSwitchSpan('channel-id-1');
        startChannelSwitchSpan('channel-id-2');

        expect(Sentry.startInactiveSpan).toHaveBeenCalledTimes(1);
        endChannelSwitchSpan('channel-id-1');
    });

    it('should abandon a span in flight past the staleness limit', () => {
        jest.useFakeTimers({doNotFake: ['nextTick']});
        try {
            startChannelSwitchSpan('channel-id-1');
            jest.advanceTimersByTime(31_000);
            startChannelSwitchSpan('channel-id-2');

            expect(mockSpan.end).toHaveBeenCalledTimes(1);
            expect(mockSpan.setAttribute).toHaveBeenCalledWith('kchat.channel_switch.abandoned', true);
            expect(Sentry.startInactiveSpan).toHaveBeenCalledTimes(2);
            expect(Sentry.startInactiveSpan).toHaveBeenLastCalledWith({
                name: 'channel_switch',
                op: 'mobile.channel_switch',
                attributes: {'kchat.channel_id': 'channel-id-2'},
            });
        } finally {
            jest.useRealTimers();
            endChannelSwitchSpan('channel-id-2');
        }
    });

    it('should be a no-op when ending without a started span', () => {
        endChannelSwitchSpan('channel-id-1');

        expect(mockSpan.end).not.toHaveBeenCalled();
    });

    it('should not start a span when Sentry is disabled', () => {
        Config.SentryEnabled = false;
        initializeSentry();

        startChannelSwitchSpan('channel-id-1');

        expect(Sentry.startInactiveSpan).not.toHaveBeenCalled();
    });

    it('should not start spans when Sentry has no DSN', () => {
        Config.SentryDsnAndroid = '';
        Config.SentryDsnIos = '';
        initializeSentry();

        startChannelSwitchSpan('channel-id-1');

        expect(Sentry.startInactiveSpan).not.toHaveBeenCalled();
    });
});

describe('wrapSentryRoot', () => {
    it('should wrap the root component when Sentry is enabled', () => {
        Config.SentryEnabled = true;
        const MockComponent = () => null;

        wrapSentryRoot(MockComponent);

        expect(Sentry.wrap).toHaveBeenCalledWith(MockComponent);
    });

    it('should return the component unchanged when Sentry is disabled', () => {
        Config.SentryEnabled = false;
        const MockComponent = () => null;

        const result = wrapSentryRoot(MockComponent);

        expect(Sentry.wrap).not.toHaveBeenCalledWith(MockComponent);
        expect(result).toBe(MockComponent);
    });
});
