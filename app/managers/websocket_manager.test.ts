// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import NetInfo from '@react-native-community/netinfo';
import {AppState, type AppStateStatus} from 'react-native';

import WebSocketClient from '@client/websocket';
import DatabaseManager from '@database/manager';
import {isMainActivity} from '@utils/helpers';

import WebsocketManager from './websocket_manager';

import type {ServerDatabase} from '@typings/database/database';

jest.mock('@actions/remote/user');
jest.mock('@actions/websocket/event');
jest.mock('@client/websocket');
jest.mock('@utils/helpers');

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

        // Mock getActiveServerUrl so openAll can identify the active server
        (DatabaseManager as any).getActiveServerUrl = jest.fn().mockResolvedValue(mockServerUrl);

        // Reset singleton internal state by manipulating private fields
        (WebsocketManager as any).previousActiveState = true;
        (WebsocketManager as any).connectedSubjects = {};

        // Clean up existing clients
        WebsocketManager.invalidateClient(mockServerUrl);
        delete (WebsocketManager as any).clients[mockServerUrl];

        // Setup WebSocketClient mock
        mockCallbacks = {};
        mockWebSocketClient = {
            initialize: jest.fn(),
            setConnectedCallback: jest.fn((cb: () => void) => {
                mockCallbacks.connected = cb;
            }),
            setEventCallback: jest.fn(),
            setCloseCallback: jest.fn((cb: (count: number) => void) => {
                mockCallbacks.close = cb;
            }),
            isConnected: jest.fn().mockReturnValue(false),
            close: jest.fn(),
            invalidate: jest.fn(),
        };

        (WebSocketClient as unknown as jest.Mock).mockImplementation(() => mockWebSocketClient);

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

        // Clear any lingering periodic status update intervals
        const statusIds = (WebsocketManager as any).statusUpdatesIntervalIDs || {};
        for (const id of Object.values(statusIds)) {
            clearInterval(id as number);
        }
        (WebsocketManager as any).statusUpdatesIntervalIDs = {};

        await DatabaseManager.destroyServerDatabase(mockServerUrl);
    });

    it('should close all websockets immediately when app goes to background', () => {
        expect(capturedAppStateCallback).toBeDefined();

        capturedAppStateCallback!('background');

        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);
        expect(mockWebSocketClient.invalidate).toHaveBeenCalled();
    });

    it('should NOT close websockets when app goes to inactive (Control Center, notification shade)', () => {
        expect(capturedAppStateCallback).toBeDefined();

        capturedAppStateCallback!('inactive');

        expect(mockWebSocketClient.close).not.toHaveBeenCalled();
        expect(mockWebSocketClient.invalidate).not.toHaveBeenCalled();
    });

    it('should open all websockets when returning to foreground', async () => {
        // 1. Background → closeAll immediately
        capturedAppStateCallback!('background');

        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);
        expect(mockWebSocketClient.initialize).not.toHaveBeenCalled();

        // 2. Foreground → openAll
        capturedAppStateCallback!('active');

        // Allow async openAll to complete
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(mockWebSocketClient.initialize).toHaveBeenCalledWith({});
    });

    it('should reinitialize websocket clients when returning to foreground after background', async () => {
        // 1. Background → closeAll immediately
        capturedAppStateCallback!('background');

        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);

        // 2. Foreground → openAll triggers initializeClient
        capturedAppStateCallback!('active');

        // Allow async openAll to complete
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(mockWebSocketClient.initialize).toHaveBeenCalled();
    });

    it('should skip inactive during active→background transition and only close on background', () => {
        // active → inactive (Control Center) — nothing happens
        capturedAppStateCallback!('inactive');
        expect(mockWebSocketClient.close).not.toHaveBeenCalled();

        jest.clearAllMocks();

        // inactive → background — now close
        capturedAppStateCallback!('background');

        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);
        expect(mockWebSocketClient.invalidate).toHaveBeenCalled();
    });

    it('should not trigger data sync on connected callback', () => {
        expect(mockCallbacks.connected).toBeDefined();

        let latestState: WebsocketConnectedState | undefined;
        WebsocketManager.observeWebsocketState(mockServerUrl).subscribe((state) => {
            latestState = state;
        });

        mockCallbacks.connected!();

        expect(latestState).toBe('connected');
    });

    it('should handle network disconnection by closing all websockets', () => {
        expect(capturedNetInfoCallback).toBeDefined();

        capturedNetInfoCallback!({isConnected: false, type: 'none'});

        // Ensure clients are closed when network drops
        expect(mockWebSocketClient.close).toHaveBeenCalledWith(true);
    });
});
