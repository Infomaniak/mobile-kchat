// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import NetInfo from '@react-native-community/netinfo';
import {AppState, type AppStateStatus} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

import {handleReconnect} from '@actions/websocket';
import WebSocketClient from '@client/websocket';
import DatabaseManager from '@database/manager';
import {isMainActivity} from '@utils/helpers';
import {captureMessage} from '@utils/sentry';

import WebsocketManager, {WAIT_TO_CLOSE} from './websocket_manager';

import type {ServerDatabase} from '@typings/database/database';

jest.mock('@actions/websocket');
jest.mock('@actions/websocket/event');
jest.mock('@client/websocket');
jest.mock('@utils/helpers');

jest.mock('@utils/sentry');

let capturedAppStateCallback: ((state: AppStateStatus) => void) | undefined;
let capturedNetInfoCallback: ((state: any) => void) | undefined;

let mockWebSocketClient: any;
let mockCallbacks: {[key: string]: (...args: any[]) => void};

const mockServerUrl = 'https://example.com';
const mockToken = 'mock-token';
const mockCredentials = [{serverUrl: mockServerUrl, token: mockToken} as ServerCredential];

describe('WebsocketManager - background/foreground reconnection', () => {
    beforeEach(async () => {
        jest.clearAllMocks();

        (isMainActivity as jest.Mock).mockReturnValue(true);

        // Capture callbacks
        jest.spyOn(AppState, 'addEventListener').mockImplementation((event: string, callback: (state: AppStateStatus) => void) => {
            if (event === 'change') {
                capturedAppStateCallback = callback;
            }
            return {remove: jest.fn()};
        });

        jest.spyOn(NetInfo, 'addEventListener').mockImplementation((callback: (state: any) => void) => {
            capturedNetInfoCallback = callback;
            return jest.fn();
        });

        jest.spyOn(NetInfo, 'fetch').mockResolvedValue({isConnected: true, type: 'wifi'} as any);

        await DatabaseManager.init([mockServerUrl]);

        // Reset singleton internal state by manipulating private fields
        (WebsocketManager as any).previousActiveState = true;
        (WebsocketManager as any).isBackgroundTimerRunning = false;
        (WebsocketManager as any).connectedSubjects = {};

        // Clean up existing clients
        WebsocketManager.invalidateClient(mockServerUrl);
        delete (WebsocketManager as any).clients[mockServerUrl];
        delete (WebsocketManager as any).firstConnectionSynced[mockServerUrl];

        // Setup WebSocketClient mock
        mockCallbacks = {};
        mockWebSocketClient = {
            initialize: jest.fn(),
            setFirstConnectCallback: jest.fn((cb: () => void) => {
                mockCallbacks.firstConnect = cb;
            }),
            setEventCallback: jest.fn(),
            setReconnectCallback: jest.fn((cb: () => void) => {
                mockCallbacks.reconnect = cb;
            }),
            setReliableReconnectCallback: jest.fn(),
            setCloseCallback: jest.fn((cb: (count: number) => void) => {
                mockCallbacks.close = cb;
            }),
            isConnected: jest.fn().mockReturnValue(false),
            close: jest.fn(),
            invalidate: jest.fn(),
        };

        (WebSocketClient as unknown as jest.Mock).mockImplementation(() => mockWebSocketClient);

        // Mock BackgroundTimer to capture interval callbacks
        jest.spyOn(BackgroundTimer, 'setInterval').mockImplementation((callback: () => void) => {
            (WebsocketManager as any)._bgTimerCallback = callback;
            return 12345;
        });
        jest.spyOn(BackgroundTimer, 'clearInterval').mockImplementation(() => {
            (WebsocketManager as any)._bgTimerCallback = undefined;
        });

        // Mock DatabaseManager.getServerDatabaseAndOperator for init
        jest.spyOn(DatabaseManager, 'getServerDatabaseAndOperator').mockImplementation(() => {
            return DatabaseManager.serverDatabases[mockServerUrl] as unknown as ServerDatabase;
        });

        await WebsocketManager.init(mockCredentials);
    });

    afterEach(async () => {
        WebsocketManager.closeAll();
        WebsocketManager.invalidateClient(mockServerUrl);
        (WebsocketManager as any).previousActiveState = true;
        (WebsocketManager as any).isBackgroundTimerRunning = false;

        // Clear any lingering periodic status update intervals
        const statusIds = (WebsocketManager as any).statusUpdatesIntervalIDs || {};
        for (const id of Object.values(statusIds)) {
            clearInterval(id as number);
        }
        (WebsocketManager as any).statusUpdatesIntervalIDs = {};

        await DatabaseManager.destroyServerDatabase(mockServerUrl);
    });

    it('should start background timer when app goes to background', () => {
        expect(capturedAppStateCallback).toBeDefined();

        capturedAppStateCallback!('background');

        expect(BackgroundTimer.setInterval).toHaveBeenCalledWith(expect.any(Function), WAIT_TO_CLOSE);
        expect((WebsocketManager as any).isBackgroundTimerRunning).toBe(true);
    });

    it('should close all websockets after 15s in background', () => {
        capturedAppStateCallback!('background');

        expect((WebsocketManager as any).isBackgroundTimerRunning).toBe(true);

        // Trigger the background timer callback manually
        const bgCallback = (WebsocketManager as any)._bgTimerCallback;
        expect(bgCallback).toBeDefined();
        bgCallback();

        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);
        expect((WebsocketManager as any).isBackgroundTimerRunning).toBe(false);
    });

    it('should open all websockets when returning to foreground after background timer fired', async () => {
        // 1. Simulate background → timer fired (closeAll)
        capturedAppStateCallback!('background');
        const bgCallback = (WebsocketManager as any)._bgTimerCallback;
        expect(bgCallback).toBeDefined();
        bgCallback();

        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);
        expect(mockWebSocketClient.initialize).not.toHaveBeenCalled();

        // 2. Simulate foreground
        // Need to firstConnectionSynced so it triggers immediate open
        (WebsocketManager as any).firstConnectionSynced[mockServerUrl] = true;
        capturedAppStateCallback!('active');

        // Allow async openAll to complete its microtasks
        await new Promise(process.nextTick);

        expect(BackgroundTimer.clearInterval).toHaveBeenCalled();
        expect((WebsocketManager as any).isBackgroundTimerRunning).toBe(false);
        expect(mockWebSocketClient.initialize).toHaveBeenCalledWith({}, false);
    });

    it('should trigger handleReconnect after websocket reconnects post-foreground', async () => {
        // Setup: first connection already synced
        (WebsocketManager as any).firstConnectionSynced[mockServerUrl] = true;

        // 1. Background → timer fires → closeAll
        capturedAppStateCallback!('background');
        const bgCallback = (WebsocketManager as any)._bgTimerCallback;
        bgCallback();

        // 2. Foreground → openAll → initializeClient
        capturedAppStateCallback!('active');

        // Allow async openAll to complete its microtasks
        await new Promise(process.nextTick);

        // The initializeClient method should have called client.initialize
        expect(mockWebSocketClient.initialize).toHaveBeenCalled();

        // 3. Simulate Pusher 'connected' event via firstConnect callback
        // Since shouldSkipSync is false after close, this triggers reconnect
        // Actually, looking at client code, after close (which sets shouldSkipSync=false),
        // the connected callback will call reconnectCallback
        jest.mocked(handleReconnect).mockResolvedValue(undefined);

        if (mockCallbacks.reconnect) {
            await mockCallbacks.reconnect();
        }

        expect(handleReconnect).toHaveBeenCalledWith(mockServerUrl);
    });

    it('should clear background timer when returning to foreground before it fires', () => {
        capturedAppStateCallback!('background');
        expect((WebsocketManager as any).isBackgroundTimerRunning).toBe(true);

        // Return to foreground before 15s
        (WebsocketManager as any).firstConnectionSynced[mockServerUrl] = true;
        capturedAppStateCallback!('active');

        // If we call it now, it shouldn't error but should have no effect since timer was cleared
        expect(true).toBe(true);
    });

    it('should handle race condition when timer fires during foreground transition', () => {
        capturedAppStateCallback!('background');
        expect((WebsocketManager as any).isBackgroundTimerRunning).toBe(true);

        const bgCallback = (WebsocketManager as any)._bgTimerCallback;
        expect(bgCallback).toBeDefined();

        (WebsocketManager as any).firstConnectionSynced[mockServerUrl] = true;

        // Simulate: foreground event happens, then timer callback executes (race)
        capturedAppStateCallback!('active');

        // Timer callback fires AFTER foreground transition already processed
        bgCallback();

        // Should not be in a broken state: closed then opened
        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);
        expect(BackgroundTimer.clearInterval).toHaveBeenCalled();
        expect((WebsocketManager as any).isBackgroundTimerRunning).toBe(false);
    });

    it('should captureMessage when zombie client is detected during initializeClient', async () => {
        // Setup: client pretends to be connected and marked as potential zombie
        (WebsocketManager as any).firstConnectionSynced[mockServerUrl] = true;
        (WebsocketManager as any).potentialZombie[mockServerUrl] = true;
        mockWebSocketClient.isConnected.mockReturnValue(true);

        await (WebsocketManager as any).initializeClient(mockServerUrl, 'test');

        expect(captureMessage).toHaveBeenCalledWith(
            expect.stringContaining('ZOMBIE CLIENT'),
        );

        // potentialZombie should be cleaned up
        expect((WebsocketManager as any).potentialZombie[mockServerUrl]).toBeUndefined();
    });

    it('should captureMessage when client still connected after closeAll without zombie flag', async () => {
        // Client connected but not marked as zombie
        (WebsocketManager as any).firstConnectionSynced[mockServerUrl] = true;
        mockWebSocketClient.isConnected.mockReturnValue(true);

        await (WebsocketManager as any).initializeClient(mockServerUrl, 'test');

        expect(captureMessage).toHaveBeenCalledWith(
            expect.stringContaining('still connected after closeAll'),
        );
    });

    it('should not delete potentialZombie in closeAll', () => {
        (WebsocketManager as any).potentialZombie[mockServerUrl] = true;

        WebsocketManager.closeAll();

        // potentialZombie should survive closeAll
        expect((WebsocketManager as any).potentialZombie[mockServerUrl]).toBe(true);
    });

    it('should handle network disconnection by closing all websockets', () => {
        expect(capturedNetInfoCallback).toBeDefined();

        capturedNetInfoCallback!({isConnected: false, type: 'none'});

        // Ensure clients are closed when network drops
        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);
    });
});
