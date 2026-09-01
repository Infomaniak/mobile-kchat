/* eslint-disable max-nested-callbacks */
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {setGenerator} from '@nozbe/watermelondb/utils/common/randomId';
import * as ReactNative from 'react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import {v4 as uuidv4} from 'uuid';

import 'react-native-gesture-handler/jestSetup';

import {mockApiClient} from './mock_api_client';

import type {RequestOptions} from '@mattermost/react-native-network-client';

// @ts-expect-error Promise does not exists in global
global.Promise = jest.requireActual('promise');

// eslint-disable-next-line no-process-env
process.env.EXPO_OS = 'ios';

setGenerator(uuidv4);

require('isomorphic-fetch');

jest.mock('expo-application', () => {
    return {
        nativeApplicationVersion: '0.0.0',
        nativeBuildVersion: '0',
        applicationName: 'Mattermost',
        applicationId: 'com.mattermost.rnbeta',
    };
});

jest.mock('expo-crypto', () => ({
    randomUUID: jest.fn(() => '12345678-1234-1234-1234-1234567890ab'),
    getRandomValues: jest.fn((arr: Uint8Array) => {
        // deterministic non-zero bytes for tests
        arr.fill(0x7b);
        return arr;
    }),
}));

jest.mock('expo-device', () => {
    return {
        deviceName: 'Device',
        osName: 'Test',
        osVersion: '0.0.0',
        applicationId: 'com.mattermost.rnbeta',
        isRootedExperimentalAsync: jest.fn().mockResolvedValue(false),
    };
});

jest.mock('expo-file-system', () => {
    const mockInfo = {exists: true, uri: 'file:///mock', size: 0, modificationTime: 0};

    function makeFileInstance(uri: string) {
        return {uri, exists: true, size: 0, delete: jest.fn(), info: jest.fn(() => mockInfo), move: jest.fn(), copy: jest.fn(), create: jest.fn(), write: jest.fn(), text: jest.fn(() => Promise.resolve(''))};
    }
    function makeDirectoryInstance(uri: string) {
        return {uri, exists: true, size: 0, delete: jest.fn(), info: jest.fn(() => mockInfo), create: jest.fn(), list: jest.fn(() => []), move: jest.fn(), copy: jest.fn()};
    }

    const MockFile = jest.fn().mockImplementation((...args: string[]) => makeFileInstance(args.join('')));
    (MockFile as jest.Mock & {downloadFileAsync: jest.Mock}).downloadFileAsync = jest.fn(() => Promise.resolve(makeFileInstance('file:///downloaded')));
    const MockDirectory = jest.fn().mockImplementation((...args: string[]) => makeDirectoryInstance(args.join('')));
    return {
        File: MockFile,
        Directory: MockDirectory,
        Paths: {
            cache: makeDirectoryInstance('file://test-cache-directory/'),
            document: makeDirectoryInstance('file:///test-directory/'),
        },
    };
});

jest.mock('expo-web-browser', () => ({
    openAuthSessionAsync: jest.fn().mockResolvedValue(({
        type: 'success',
        url: 'mmauthbeta://callback?MMAUTHTOKEN=123&MMCSRF=456',
    })),
}));

jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        canGoBack: jest.fn(() => true),
        canDismiss: jest.fn(() => true),
        dismiss: jest.fn(),
        dismissAll: jest.fn(),
        dismissTo: jest.fn(),
        setParams: jest.fn(),
        navigate: jest.fn(),
    },
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        canGoBack: jest.fn(() => true),
        navigate: jest.fn(),
    }),
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        canGoBack: jest.fn(() => true),
        setOptions: jest.fn(),
        setParams: jest.fn(),
        getState: jest.fn(() => ({})),
        addListener: jest.fn(() => jest.fn()),
    }),
    useSegments: () => [],
    usePathname: () => '/',
    useLocalSearchParams: () => ({}),
    useGlobalSearchParams: () => ({}),
    Link: 'Link',
    Redirect: 'Redirect',
    Stack: {
        Screen: 'Screen',
    },
    Tabs: {
        Screen: 'Screen',
    },
}));

jest.mock('@react-native-camera-roll/camera-roll', () => ({}));

jest.mock('@sayem314/react-native-keep-awake', () => ({
    useKeepAwake: jest.fn(),
}));

jest.mock('@mattermost/react-native-turbo-log', () => ({
    getLogPaths: jest.fn(),
}));

jest.mock('@nozbe/watermelondb/utils/common/randomId/randomId', () => ({}));
jest.mock('@nozbe/watermelondb/react/withObservables/garbageCollector', () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

/* eslint-disable no-console */
jest.mock('@database/manager');

jest.doMock('react-native', () => {
    const {
        AppState: RNAppState,
        Platform,
        StyleSheet,
        requireNativeComponent,
        Alert: RNAlert,
        InteractionManager: RNInteractionManager,
        NativeModules: RNNativeModules,
        Linking: RNLinking,
        Keyboard: RNKeyboard,
    } = ReactNative;

    const Alert = {
        ...RNAlert,
        alert: jest.fn(),
    };

    const AppState = {
        ...RNAppState,
        currentState: 'active',
        addEventListener: jest.fn(() => ({
            remove: jest.fn(),
        })),
    };

    let activeInteractions = 0;
    const pendingCallbacks: Array<() => void> = [];
    const InteractionManager = {
        ...RNInteractionManager,
        createInteractionHandle: jest.fn(() => {
            activeInteractions += 1;
            return activeInteractions;
        }),
        clearInteractionHandle: jest.fn(() => {
            activeInteractions = Math.max(0, activeInteractions - 1);
            if (activeInteractions === 0) {
                // Execute pending callbacks when interactions are cleared
                while (pendingCallbacks.length > 0) {
                    const cb = pendingCallbacks.shift();
                    cb?.();
                }
            }
        }),
        runAfterInteractions: jest.fn((callback) => {
            if (activeInteractions === 0) {
                callback();
            } else {
                pendingCallbacks.push(callback); // Delay execution until interactions finish
            }
        }),
    };

    const NativeModules = {
        ...RNNativeModules,
        UIManager: {
            RCTView: {
                directEventTypes: {},
            },
        },
        PlatformConstants: {
            forceTouchAvailable: false,
        },
        RNGestureHandlerModule: {
            State: {
                BEGAN: 'BEGAN',
                FAILED: 'FAILED',
                ACTIVE: 'ACTIVE',
                END: 'END',
            },
        },
        KeyboardObserver: {},
        JailMonkey: {
            trustFall: jest.fn().mockReturnValue(true),
        },
        RNCNetInfo: {
            getCurrentState: jest.fn().mockResolvedValue({isConnected: true}),
            addListener: jest.fn(),
            removeListeners: jest.fn(),
            addEventListener: jest.fn(),
        },
        RNKeychainManager: {
            SECURITY_LEVEL_ANY: 'ANY',
            SECURITY_LEVEL_SECURE_SOFTWARE: 'SOFTWARE',
            SECURITY_LEVEL_SECURE_HARDWARE: 'HARDWARE',
        },
        RNReactNativeHapticFeedback: {
            trigger: jest.fn(),
        },
        RNDocumentPicker: {
            pick: jest.fn(),
        },
        RNFastStorage: {
            setupLibrary: jest.fn(),
            setStringAsync: jest.fn(),
        },
        Appearance: {
            getColorScheme: jest.fn().mockReturnValue('light'),
            addChangeListener: jest.fn(() => ({
                remove: jest.fn(),
            })),
        },
        RNUtils: {
            getConstants: () => ({
                appGroupIdentifier: 'group.mattermost.rnbeta',
                appGroupSharedDirectory: {
                    sharedDirectory: '',
                    databasePath: '',
                },
            }),
            addListener: jest.fn(),
            removeListeners: jest.fn(),
            isRunningInSplitView: jest.fn().mockReturnValue({isSplit: false, isTablet: false}),
            getHasRegisteredLoad: jest.fn().mockReturnValue({hasRegisteredLoad: false}),
            setHasRegisteredLoad: jest.fn(),

            getDeliveredNotifications: jest.fn().mockResolvedValue([]),
            removeChannelNotifications: jest.fn().mockImplementation(),
            removeThreadNotifications: jest.fn().mockImplementation(),
            removeServerNotifications: jest.fn().mockImplementation(),

            createZipFile: jest.fn(),
            saveFile: jest.fn(),

            unlockOrientation: jest.fn(),
            getWindowDimensions: jest.fn().mockReturnValue({width: 426, height: 952}),
        },
        APIClient: {
            getConstants: () => ({
                EVENTS: {
                    UPLOAD_PROGRESS: 'APIClient-UploadProgress',
                    CLIENT_ERROR: 'APIClient-Error',
                },
                RETRY_TYPES: {
                    EXPONENTIAL_RETRY: 'exponential',
                    LINEAR_RETRY: 'linear',
                },
            }),
        },
        WebSocketClient: {
            getConstants: () => ({
                EVENTS: {
                    OPEN_EVENT: 'WebSocketClient-Open',
                    CLOSE_EVENT: 'WebSocketClient-Close',
                    ERROR_EVENT: 'WebSocketClient-Error',
                    MESSAGE_EVENT: 'WebSocketClient-Message',
                    READY_STATE_EVENT: 'WebSocketClient-ReadyState',
                    CLIENT_ERROR: 'WebSocketClient-Error',
                },
                READY_STATE: {
                    CONNECTING: 0,
                    OPEN: 1,
                    CLOSING: 2,
                    CLOSED: 3,
                },
            }),
        },
        WebRTCModule: {
            senderGetCapabilities: jest.fn().mockReturnValue(null),
            receiverGetCapabilities: jest.fn().mockReturnValue(null),
        },
        RNIntune: {
            login: jest.fn(),
            enrollInMAM: jest.fn(),
            deregisterAndUnenroll: jest.fn(),
            setCurrentIdentity: jest.fn(),
            isManagedServer: jest.fn().mockResolvedValue(false),
            getPolicy: jest.fn().mockResolvedValue(null),
            getEnrolledAccount: jest.fn().mockResolvedValue(null),
        },
    };

    const Linking = {
        ...RNLinking,
        openURL: jest.fn(),
        addEventListener: jest.fn(() => {
            return {remove: jest.fn()};
        }),
    };

    const Keyboard = {
        ...RNKeyboard,
        isVisible: jest.fn(() => false),
        dismiss: jest.fn(),
        addListener: jest.fn(() => ({
            remove: jest.fn(),
        })),
    };

    return Object.setPrototypeOf({
        Platform: {
            ...Platform,
            OS: 'ios',
            Version: 12,
            constants: {
                reactNativeVersion: {
                    major: 0,
                    minor: 64,
                },
            },
            select: jest.fn((dict) => dict.ios || dict.default),
        },
        StyleSheet,
        requireNativeComponent,
        Alert,
        AppState,
        InteractionManager,
        NativeModules,
        Linking,
        Keyboard,
        DeviceEventEmitter: mockDeviceEventEmitter,
        NativeEventEmitter: class MockNativeEventEmitter {
            constructor() {
                return mockDeviceEventEmitter;
            }
        },
        Animated: {
            ...ReactNative.Animated,
            timing: jest.fn(() => ({
                start: jest.fn((callback) => callback?.({finished: true})),
            })),
        },
    }, ReactNative);
});

jest.mock('react-native-vector-icons', () => {
    const React = jest.requireActual('react');
    class CompassIcon extends React.PureComponent {
        render() {
            return React.createElement('Icon', this.props);
        }
    }
    CompassIcon.getImageSource = jest.fn().mockResolvedValue({});
    return {
        createIconSet: () => CompassIcon,

        createIconSetFromFontello: () => CompassIcon,
    };
});

// Mock Intune module - use virtual: true since module may not exist when Intune is disabled
jest.mock('@mattermost/intune', () => ({
    __esModule: true,
    default: {
        login: jest.fn(),
        enrollInMAM: jest.fn(),
        deregisterAndUnenroll: jest.fn(),
        isManagedServer: jest.fn().mockResolvedValue(false),
        setCurrentIdentity: jest.fn(),
        getPolicy: jest.fn().mockResolvedValue(null),
        getEnrolledAccount: jest.fn().mockResolvedValue(null),
        onIntunePolicyChanged: jest.fn(() => ({remove: jest.fn()})),
        onIntuneEnrollmentChanged: jest.fn(() => ({remove: jest.fn()})),
        onIntuneWipeRequested: jest.fn(() => ({remove: jest.fn()})),
        onIntuneAuthRequired: jest.fn(() => ({remove: jest.fn()})),
        onIntuneConditionalLaunchBlocked: jest.fn(() => ({remove: jest.fn()})),
        onIntuneIdentitySwitchRequired: jest.fn(() => ({remove: jest.fn()})),
    },
}), {virtual: true});

// Create a working DeviceEventEmitter mock
const createEventEmitter = () => {
    const listeners = new Map<string, Set<Function>>();

    return {
        addListener: jest.fn((eventType: string, listener: Function) => {
            if (!listeners.has(eventType)) {
                listeners.set(eventType, new Set());
            }
            listeners.get(eventType)!.add(listener);
            return {
                remove: jest.fn(() => {
                    listeners.get(eventType)?.delete(listener);
                }),
            };
        }),
        emit: jest.fn((eventType: string, ...args: unknown[]) => {
            listeners.get(eventType)?.forEach((listener) => {
                listener(...args);
            });
        }),
        removeListener: jest.fn((eventType: string, listener: Function) => {
            listeners.get(eventType)?.delete(listener);
        }),
        removeAllListeners: jest.fn((eventType?: string) => {
            if (eventType) {
                listeners.delete(eventType);
            } else {
                listeners.clear();
            }
        }),
        listenerCount: jest.fn((eventType: string) => {
            return listeners.get(eventType)?.size || 0;
        }),
    };
};

const mockDeviceEventEmitter = createEventEmitter();

jest.mock('../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
    // Return a constructor function that returns our mock event emitter
    return class MockNativeEventEmitter {
        constructor() {
            return mockDeviceEventEmitter;
        }
    };
});

jest.mock('react-native-keyboard-controller', () => {
    return {
        KeyboardProvider: ({children}: {children: React.ReactNode}) => children,
        KeyboardController: {
            dismiss: jest.fn(),
            isVisible: jest.fn(() => false),
        },
        useKeyboardHandler: jest.fn(),
        useKeyboardState: jest.fn(() => ({
            isVisible: false,
        })),
        KeyboardGestureArea: ({children}: {children: React.ReactNode}) => children,
        useAnimatedKeyboard: jest.fn(() => ({
            height: {value: 0},
            progress: {value: 0},
            state: {value: 0},
        })),
    };
});

jest.mock('react-native-localize', () => ({
    getTimeZone: () => 'World/Somewhere',
    getLocales: () => ([
        {countryCode: 'GB', languageTag: 'en-GB', languageCode: 'en', isRTL: false},
        {countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false},
        {countryCode: 'FR', languageTag: 'fr-FR', languageCode: 'fr', isRTL: false},
    ]),
}));

jest.mock('@preeternal/react-native-cookie-manager', () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    getInitialURL: jest.fn(),
    clearAll: jest.fn(),
    get: () => Promise.resolve(({
        res: {
            MMCSRF: {
                value: 'the cookie',
            },
        },
    })),
}));

jest.mock('react-native-notifications', () => {
    let deliveredNotifications: ReactNative.PushNotification[] = [];

    return {
        Notifications: {
            registerRemoteNotifications: jest.fn(),
            addEventListener: jest.fn(),
            isRegisteredForRemoteNotifications: jest.fn(),
            setDeliveredNotifications: jest.fn((notifications) => {
                deliveredNotifications = notifications;
            }),
            NotificationAction: jest.fn(),
            NotificationCategory: jest.fn(),
            events: () => ({
                registerNotificationOpened: jest.fn(),
                registerRemoteNotificationsRegistered: jest.fn(),
                registerNotificationReceivedBackground: jest.fn(),
                registerNotificationReceivedForeground: jest.fn(),
            }),
            ios: {
                getDeliveredNotifications: jest.fn().mockImplementation(() => Promise.resolve(deliveredNotifications)),
                removeDeliveredNotifications: jest.fn((ids) => {

                    // @ts-ignore
                    deliveredNotifications = deliveredNotifications.filter((n) => !ids.includes(n.identifier));
                }),
                setBadgeCount: jest.fn(),
            },
            postLocalNotification: jest.fn((notification) => notification),
        },
    };
});

jest.mock('react-native-share', () => ({
    default: jest.fn(),
}));

jest.mock('@react-native-clipboard/clipboard', () => ({}));

jest.mock('react-native-document-picker', () => ({}));

jest.mock('@mattermost/react-native-network-client', () => ({
    getOrCreateAPIClient: jest.fn((serverUrl: string) => Promise.resolve({client: {
        baseUrl: serverUrl,
        get: (url: string, options?: RequestOptions) => mockApiClient.get(`${serverUrl}${url}`, options),
        post: (url: string, options?: RequestOptions) => mockApiClient.post(`${serverUrl}${url}`, options),
        invalidate: jest.fn(),
    }})),
    RetryTypes: {
        EXPONENTIAL_RETRY: 'exponential',
    },
}));

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-native-worklets', () => {
    const mock = require('react-native-worklets/src/mock');
    return {
        ...mock,

        // Override scheduleOnRN to call synchronously so state updates from
        // useAnimatedReaction fire inside act() rather than via queueMicrotask.
        scheduleOnRN: <Args extends unknown[]>(fn: (...args: Args) => unknown, ...args: Args) => {
            fn(...args);
        },
    };
});

require('@shopify/flash-list/jestSetup');

require('react-native-reanimated').setUpTests();
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

jest.mock('react-native-haptic-feedback', () => ({
    trigger: () => '',
    HapticFeedbackTypes: {
        selection: 'selection',
        impactLight: 'impactLight',
        impactMedium: 'impactMedium',
        impactHeavy: 'impactHeavy',
        rigid: 'rigid',
        soft: 'soft',
        notificationSuccess: 'notificationSuccess',
        notificationWarning: 'notificationWarning',
        notificationError: 'notificationError',
    },
}));

jest.mock('@utils/log', () => ({
    logError: jest.fn(),
    logDebug: jest.fn(),
    logInfo: jest.fn(),
    logWarning: jest.fn(),
}));

declare const global: {
    requestAnimationFrame: (callback: () => void) => void;
    performance: {
        now: () => number;
    };
};

global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
};

global.performance.now = () => Date.now();

const colors = {
    reset: '\x1b[0m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    blue: '\x1b[1;34m',
};

const filterStackTrace = (color: string, prefix: string) => {
    return (...args: unknown[]) => {
        const message = args.join(' ');
        process.stdout.write(`\n${color}${prefix} ${message}${colors.reset}\n`);
    };
};

// Override console methods globally
console.warn = filterStackTrace(colors.yellow, '⚠️  Warning:');
console.error = filterStackTrace(colors.red, '🚨 Error:');
console.log = filterStackTrace(colors.cyan, '📢 Log:');
console.debug = filterStackTrace(colors.blue, '🐞 Debug:');

// Silence warnings about missing EXPO_OS environment variable
// on tests
process.env.EXPO_OS = 'ios'; // eslint-disable-line no-process-env

jest.mock('react-native-nitro-sound', () => ({
    createSound: jest.fn(() => ({
        startPlayer: jest.fn(() => Promise.resolve()),
        stopPlayer: jest.fn(() => Promise.resolve()),
        pausePlayer: jest.fn(() => Promise.resolve()),
        resumePlayer: jest.fn(() => Promise.resolve()),
        seekToPlayer: jest.fn(() => Promise.resolve()),
        setPlaybackSpeed: jest.fn(() => Promise.resolve()),
        setSubscriptionDuration: jest.fn(() => Promise.resolve()),
        addPlayBackListener: jest.fn(),
        removePlayBackListener: jest.fn(),
        startRecorder: jest.fn(() => Promise.resolve('file://test.m4a')),
        stopRecorder: jest.fn(() => Promise.resolve()),
        resumeRecorder: jest.fn(() => Promise.resolve()),
        pauseRecorder: jest.fn(() => Promise.resolve()),
        addRecordBackListener: jest.fn(),
        removeRecordBackListener: jest.fn(),
    })),
}));

jest.mock('ratex-react-native', () => {
    const React = require('react');
    return {
        RaTeXView: 'RaTeXView',
        RaTeXColorContext: React.createContext({}),
    };
});

jest.mock('@mattermost/react-native-paste-input', () => {
    const React = require('react');
    const MockedPasteTextInput = React.forwardRef((props: any, ref: any) => {
        const {TextInput} = require('react-native');
        return React.createElement(TextInput, {...props, ref});
    });
    MockedPasteTextInput.displayName = 'PasteTextInput';
    return {
        __esModule: true,
        default: MockedPasteTextInput,
    };
});

// IK MOCKS

jest.mock('react-native-fs', () => ({
    unlink: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-color-matrix-image-filters', () => ({
    Grayscale: ({children}: { children?: React.ReactNode }) => {
        return children || null;
    },
}));

jest.mock('@jitsi/react-native-sdk', () => ({
    JitsiMeeting: ({children}: { children?: React.ReactNode }) => children || null,

}));

jest.mock('@calls/screens/call_screen/jitsi_components', () => ({
    AudioMuteButton: () => null,
    VideoMuteButton: () => null,
    HangupButton: () => null,
    ToolboxContainer: () => null,
    ContentContainer: ({children}: { children?: React.ReactNode }) => children || null,
    Sound: () => null,
}));

// Global afterAll to clean up event listeners that might prevent Jest from exiting
afterAll(() => {
    // Clear all event listeners from DeviceEventEmitter to prevent hanging
    mockDeviceEventEmitter.removeAllListeners();
});
