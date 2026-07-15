// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import CookieManager from '@react-native-cookies/cookies';
import {AppState, DeviceEventEmitter, Platform} from 'react-native';

import {syncMultiTeam} from '@actions/remote/entry/ikcommon';
import {logout} from '@actions/remote/session';
import {handleFirstConnect, handleReconnect} from '@actions/websocket';
import {Events} from '@constants';
import DatabaseManager from '@database/manager';
import {getAllServerCredentials, removeServerCredentials} from '@init/credentials';
import {relaunchApp} from '@init/launch';
import PushNotifications from '@init/push_notifications';
import NetworkManager from '@managers/network_manager';
import WebsocketManager from '@managers/websocket_manager';
import {queryGlobalValue} from '@queries/app/global';
import {getAllServers, getServerDisplayName} from '@queries/app/servers';
import TestHelper from '@test/test_helper';
import {deleteFileCache, deleteFileCacheByDir} from '@utils/file';
import {isMainActivity} from '@utils/helpers';

import {SessionManagerSingleton as SessionManagerClass} from './session_manager';

import type {Query} from '@nozbe/watermelondb';
import type GlobalModel from '@typings/database/models/app/global';

jest.mock('@react-native-cookies/cookies', () => ({
    get: jest.fn(),
    clearByName: jest.fn(),
    flush: jest.fn(),
}));
jest.mock('expo-image');
jest.mock('@actions/app/global');
jest.mock('@actions/remote/session');
jest.mock('@database/manager', () => ({
    getActiveServerUrl: jest.fn(),
    getActiveServerDisplayName: jest.fn(),
    destroyServerDatabase: jest.fn(),
    deleteServerDatabase: jest.fn(),
    serverDatabases: {},
}));
jest.mock('@i18n');
jest.mock('@actions/local/session', () => {
    const actual = jest.requireActual('@actions/local/session');
    return {
        ...actual,
        cancelAllSessionNotifications: jest.fn(),
    };
});
jest.mock('@init/credentials');
jest.mock('@init/launch');
jest.mock('@init/push_notifications');
jest.mock('@managers/network_manager');
jest.mock('@managers/websocket_manager');
jest.mock('@queries/app/global', () => ({
    queryGlobalValue: jest.fn(),
    storeGlobal: jest.fn(),
}));
jest.mock('@queries/app/servers');
jest.mock('@queries/servers/user');
jest.mock('@screens/navigation');
jest.mock('@store/ephemeral_store');
jest.mock('@utils/file');
jest.mock('@utils/helpers');
jest.mock('@actions/websocket');
jest.mock('@actions/remote/entry/ikcommon');

// Ik change : skip on CI, will fix later
describe('SessionManager', () => {
    const mockServerUrl = 'https://example.com';
    const mockServerDisplayName = 'Example Server';
    let appStateCallback: ((state: string) => void) | undefined;
    let SessionManager: SessionManagerClass;

    jest.mocked(isMainActivity).mockReturnValue(true);

    jest.mocked(DatabaseManager.getActiveServerUrl).mockResolvedValue(mockServerUrl);
    jest.mocked(DatabaseManager.getActiveServerDisplayName).mockResolvedValue(mockServerDisplayName);

    (CookieManager.get as jest.Mock).mockResolvedValue({
        cookie1: {name: 'cookie1'},
        cookie2: {name: 'cookie2'},
    });

    jest.mocked(getAllServerCredentials).mockResolvedValue([{serverUrl: mockServerUrl, userId: 'user_id', token: 'token'}]);
    jest.mocked(getAllServers).mockResolvedValue([]);
    jest.mocked(getServerDisplayName).mockResolvedValue(mockServerDisplayName);

    jest.mocked(DatabaseManager.getActiveServerUrl).mockResolvedValue(mockServerUrl);
    jest.mocked(handleFirstConnect).mockResolvedValue(undefined);
    jest.mocked(handleReconnect).mockResolvedValue(undefined);

    // Mock queryGlobalValue to return a resolved promise for cache migration check
    jest.mocked(queryGlobalValue).mockReturnValue({
        fetch: jest.fn().mockResolvedValue([{value: true}]),
    } as unknown as Query<GlobalModel>);

    beforeEach(() => {
        jest.clearAllMocks();

        AppState.currentState = 'active';
        Platform.OS = 'ios';

        // Reset queryGlobalValue mock to return cache migration as done
        jest.mocked(queryGlobalValue).mockReturnValue({
            fetch: jest.fn().mockResolvedValue([{value: true}]),
        } as unknown as Query<GlobalModel>);

        (AppState.addEventListener as jest.Mock).mockImplementation((event, callback) => {
            if (event === 'change' || event === 'focus' || event === 'blur') {
                appStateCallback = callback;
            }
            return {remove: jest.fn()};
        });

        SessionManager = new SessionManagerClass();
    });

    afterEach(() => {
        // Clear all timers to prevent Jest from hanging
        jest.clearAllTimers();

        // Remove all event listeners
        DeviceEventEmitter.removeAllListeners(Events.SERVER_LOGOUT);
        DeviceEventEmitter.removeAllListeners(Events.ACTIVE_SERVER_CHANGED);
        DeviceEventEmitter.removeAllListeners(Events.WEBSOCKET_RECONNECTED);
    });

    describe('constructor', () => {
        // IK change : skipped on CI temporarily, will fix later
        it.skip('should construct with Android correctly', async () => {
            Platform.OS = 'android';
            const manager = new SessionManagerClass();
            expect(manager).toBeDefined();
            expect(AppState.addEventListener).toHaveBeenCalledWith('blur', expect.any(Function));
            expect(AppState.addEventListener).toHaveBeenCalledWith('focus', expect.any(Function));
        });
    });

    describe('initialization', () => {
        it('should delete legacy cache on first init', async () => {
            // Mock cache migration as not done
            jest.mocked(queryGlobalValue).mockReturnValueOnce({
                fetch: jest.fn().mockResolvedValue([]),
            } as unknown as Query<GlobalModel>);

            SessionManager.init();

            // Wait for the async promise chain to complete
            await new Promise((resolve) => setImmediate(resolve));

            expect(deleteFileCacheByDir).toHaveBeenCalledWith('com.hackemist.SDImageCache');
        });

        it('should not delete legacy cache if migration already done', async () => {
            // Mock cache migration as already done
            jest.mocked(queryGlobalValue).mockReturnValueOnce({
                fetch: jest.fn().mockResolvedValue([{value: true}]),
            } as unknown as Query<GlobalModel>);

            SessionManager.init();

            // Wait for the async promise chain to complete
            await new Promise((resolve) => setImmediate(resolve));
            await new Promise((resolve) => setImmediate(resolve));

            expect(deleteFileCacheByDir).not.toHaveBeenCalledWith('com.hackemist.SDImageCache');
        });
    });

    describe('session termination', () => {
        it('should handle logout correctly', async () => {
            const event = {serverUrl: mockServerUrl, removeServer: true};
            DeviceEventEmitter.emit(Events.SERVER_LOGOUT, event);

            await TestHelper.wait(50);

            expect(removeServerCredentials).toHaveBeenCalledWith(mockServerUrl);
            expect(PushNotifications.removeServerNotifications).toHaveBeenCalledWith(mockServerUrl);
            expect(NetworkManager.invalidateClient).toHaveBeenCalledWith(mockServerUrl);
            expect(WebsocketManager.invalidateClient).toHaveBeenCalledWith(mockServerUrl);
        });

        it.skip('should handle session expiration', async () => {
            DeviceEventEmitter.emit(Events.SESSION_EXPIRED, mockServerUrl);

            await TestHelper.wait(50);

            expect(logout).toHaveBeenCalledWith(mockServerUrl, undefined, {skipEvents: true, skipServerLogout: true});
            expect(relaunchApp).toHaveBeenCalled();
        });
    });

    describe('app state changes', () => {
        beforeEach(() => {
            SessionManager.init();
        });

        it('should call syncMultiTeam and resyncActiveServer when app becomes active', async () => {
            expect(appStateCallback).toBeDefined();
            appStateCallback!('background');
            expect(syncMultiTeam).not.toHaveBeenCalled();
            await appStateCallback!('active');
            await TestHelper.wait(50);
            expect(syncMultiTeam).toHaveBeenCalled();
            expect(handleFirstConnect).toHaveBeenCalledWith(mockServerUrl);
        });

        it('should not sync when app becomes inactive', async () => {
            expect(appStateCallback).toBeDefined();
            appStateCallback!('inactive');
            await TestHelper.wait(50);
            expect(syncMultiTeam).not.toHaveBeenCalled();
            expect(handleFirstConnect).not.toHaveBeenCalled();
        });
    });

    describe('server sync', () => {
        beforeEach(() => {
            SessionManager.init();
        });

        it('should call handleFirstConnect on first active state sync', async () => {
            expect(appStateCallback).toBeDefined();
            appStateCallback!('background');
            await appStateCallback!('active');
            await TestHelper.wait(50);
            expect(handleFirstConnect).toHaveBeenCalledTimes(1);
            expect(handleFirstConnect).toHaveBeenCalledWith(mockServerUrl);
            expect(handleReconnect).not.toHaveBeenCalled();
        });

        it('should call handleReconnect on subsequent active state sync', async () => {
            expect(appStateCallback).toBeDefined();
            appStateCallback!('background');
            await appStateCallback!('active');
            await TestHelper.wait(50);
            jest.clearAllMocks();
            appStateCallback!('background');
            await appStateCallback!('active');
            await TestHelper.wait(50);
            expect(handleFirstConnect).not.toHaveBeenCalled();
            expect(handleReconnect).toHaveBeenCalledTimes(1);
            expect(handleReconnect).toHaveBeenCalledWith(mockServerUrl);
        });
    });

    describe('active server changes', () => {
        beforeEach(() => {
            SessionManager.init();
        });

        it('should call syncServer when active server changes', async () => {
            DeviceEventEmitter.emit(Events.ACTIVE_SERVER_CHANGED, {serverUrl: mockServerUrl});
            await TestHelper.wait(50);
            expect(handleFirstConnect).toHaveBeenCalledTimes(1);
            expect(handleFirstConnect).toHaveBeenCalledWith(mockServerUrl);
        });

        it('should not sync when active server is empty', async () => {
            DeviceEventEmitter.emit(Events.ACTIVE_SERVER_CHANGED, {serverUrl: ''});
            await TestHelper.wait(50);
            expect(handleFirstConnect).not.toHaveBeenCalled();
            expect(handleReconnect).not.toHaveBeenCalled();
        });
    });

    describe('websocket reconnection', () => {
        beforeEach(() => {
            SessionManager.init();
        });

        it('should sync active server when websocket reconnects', async () => {
            DeviceEventEmitter.emit(Events.WEBSOCKET_RECONNECTED, {serverUrl: mockServerUrl});
            await TestHelper.wait(50);

            expect(handleFirstConnect).toHaveBeenCalledTimes(1);
            expect(handleFirstConnect).toHaveBeenCalledWith(mockServerUrl);
        });

        it('should ignore websocket reconnects for inactive servers', async () => {
            jest.mocked(DatabaseManager.getActiveServerUrl).mockResolvedValueOnce('https://other.example.com');

            DeviceEventEmitter.emit(Events.WEBSOCKET_RECONNECTED, {serverUrl: mockServerUrl});
            await TestHelper.wait(50);

            expect(handleFirstConnect).not.toHaveBeenCalled();
            expect(handleReconnect).not.toHaveBeenCalled();
        });

        it('should replay a sync requested while another sync is running', async () => {
            let resolveFirstSync: (value: Error | undefined) => void;
            jest.mocked(handleFirstConnect).mockImplementationOnce(() => {
                return new Promise((resolve) => {
                    resolveFirstSync = resolve;
                });
            });

            const firstSync = SessionManager.triggerSync(mockServerUrl);
            await TestHelper.wait(0);

            DeviceEventEmitter.emit(Events.WEBSOCKET_RECONNECTED, {serverUrl: mockServerUrl});
            await TestHelper.wait(0);

            resolveFirstSync!(undefined);
            await firstSync;
            await TestHelper.wait(50);

            expect(handleFirstConnect).toHaveBeenCalledTimes(1);
            expect(handleReconnect).toHaveBeenCalledTimes(1);
            expect(handleReconnect).toHaveBeenCalledWith(mockServerUrl);
        });
    });

    describe('sync error handling', () => {
        beforeEach(() => {
            SessionManager.init();
        });

        it('should not mark server as synced on handleFirstConnect error', async () => {
            jest.mocked(handleFirstConnect).mockResolvedValueOnce(new Error('sync failed'));
            expect(appStateCallback).toBeDefined();
            appStateCallback!('background');
            await appStateCallback!('active');
            await TestHelper.wait(50);
            expect(handleFirstConnect).toHaveBeenCalledTimes(1);
            expect(handleReconnect).not.toHaveBeenCalled();
            jest.mocked(handleFirstConnect).mockResolvedValue(undefined);
            appStateCallback!('background');
            await appStateCallback!('active');
            await TestHelper.wait(50);
            expect(handleFirstConnect).toHaveBeenCalledTimes(2);
            expect(handleReconnect).not.toHaveBeenCalled();
        });

        it('should clear firstSyncedUrls on logout', async () => {
            // First sync
            expect(appStateCallback).toBeDefined();
            appStateCallback!('background');
            await appStateCallback!('active');
            await TestHelper.wait(50);

            // After first sync, should use reconnect
            jest.clearAllMocks();
            appStateCallback!('background');
            await appStateCallback!('active');
            await TestHelper.wait(50);
            expect(handleFirstConnect).not.toHaveBeenCalled();
            expect(handleReconnect).toHaveBeenCalledTimes(1);

            // Logout
            DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {
                serverUrl: mockServerUrl,
                removeServer: true,
            });
            await TestHelper.wait(50);

            // After logout, should be firstConnect again
            jest.clearAllMocks();
            DeviceEventEmitter.emit(Events.ACTIVE_SERVER_CHANGED, {serverUrl: mockServerUrl});
            await TestHelper.wait(50);

            expect(handleFirstConnect).toHaveBeenCalledTimes(1);
            expect(handleReconnect).not.toHaveBeenCalled();
        });
    });

    describe('cleanup operations', () => {
        beforeEach(() => {
            const mockCookies = {
                cookie1: {name: 'cookie1'},
                cookie2: {name: 'cookie2'},
            };
            (CookieManager.get as jest.Mock).mockResolvedValue(mockCookies);
            SessionManager.init();
        });

        it('should clear cookies correctly - iOS', async () => {
            Platform.OS = 'ios';
            DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {
                serverUrl: mockServerUrl,
                removeServer: true,
            });

            await TestHelper.wait(450);

            expect(CookieManager.clearByName).toHaveBeenCalledWith(mockServerUrl, 'cookie1', false);
            expect(CookieManager.clearByName).toHaveBeenCalledWith(mockServerUrl, 'cookie2', false);
        });

        it('should clear cookies correctly - Android', async () => {
            Platform.OS = 'android';
            DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {
                serverUrl: mockServerUrl,
                removeServer: true,
            });

            await TestHelper.wait(50);

            expect(CookieManager.flush).toHaveBeenCalled();
        });

        it('should clear file caches', async () => {
            DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {
                serverUrl: mockServerUrl,
                removeServer: true,
            });

            await TestHelper.wait(50);

            expect(deleteFileCache).toHaveBeenCalledWith(mockServerUrl);
            expect(deleteFileCacheByDir).toHaveBeenCalledWith('mmPasteInput');
            expect(deleteFileCacheByDir).toHaveBeenCalledWith('thumbnails');
        });
    });
});
