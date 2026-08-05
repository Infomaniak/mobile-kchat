// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getOrCreateWebSocketClient} from '@mattermost/react-native-network-client';
import Pusher from 'pusher-js/react-native';

import DatabaseManager from '@database/manager';
import {getConfigValue} from '@queries/servers/system';

import WebSocketClient from '.';

jest.mock('@mattermost/react-native-network-client', () => ({
    getOrCreateWebSocketClient: jest.fn(),
    WebSocketReadyState: {
        CONNECTING: 0,
        OPEN: 1,
        CLOSED: 3,
    },
}));

jest.mock('pusher-js/react-native', () => ({
    __esModule: true,
    default: {},
}));

jest.mock('@database/manager', () => ({
    __esModule: true,
    default: {
        serverDatabases: {},
    },
}));

jest.mock('@managers/network_manager', () => ({
    __esModule: true,
    default: {
        getClient: jest.fn(),
    },
}));

jest.mock('@queries/servers/system', () => ({
    getConfigValue: jest.fn(),
}));

const serverUrl = 'https://example.com';
const token = 'token';

const mockedGetConfigValue = jest.mocked(getConfigValue);
const mockedGetOrCreateWebSocketClient = jest.mocked(getOrCreateWebSocketClient);

const createDeferred = <T, >() => {
    let resolvePromise: (value: T) => void = () => undefined;
    const promise = new Promise<T>((resolve) => {
        resolvePromise = resolve;
    });

    return {promise, resolve: resolvePromise};
};

describe('WebSocketClient', () => {
    beforeEach(() => {
        DatabaseManager.serverDatabases[serverUrl] = {database: {}} as never;
        mockedGetOrCreateWebSocketClient.mockRejectedValue(new Error('connection failed'));
    });

    afterEach(() => {
        delete DatabaseManager.serverDatabases[serverUrl];
    });

    it('should share one initialization between concurrent callers', async () => {
        const websocketUrl = createDeferred<string>();
        mockedGetConfigValue.mockReturnValue(websocketUrl.promise);
        const client = new WebSocketClient(serverUrl, token);

        const firstInitialization = client.initialize();
        const secondInitialization = client.initialize();

        expect(secondInitialization).toBe(firstInitialization);
        expect(client.isConnecting()).toBe(true);
        expect(mockedGetConfigValue).toHaveBeenCalledTimes(1);

        websocketUrl.resolve(serverUrl);
        await Promise.all([firstInitialization, secondInitialization]);

        expect(mockedGetOrCreateWebSocketClient).toHaveBeenCalledTimes(1);
        expect(client.isConnecting()).toBe(false);
    });

    it('should allow initialization to be retried after an attempt finishes', async () => {
        mockedGetConfigValue.mockResolvedValue(serverUrl);
        const client = new WebSocketClient(serverUrl, token);

        await client.initialize();
        await client.initialize();

        expect(mockedGetOrCreateWebSocketClient).toHaveBeenCalledTimes(2);
    });

    it('should not revive a connection if close(true) is called while connecting', async () => {
        const wsDeferred = createDeferred<{client: Pusher; created: boolean}>();
        mockedGetConfigValue.mockResolvedValue(serverUrl);
        mockedGetOrCreateWebSocketClient.mockReturnValue(wsDeferred.promise as never);

        const client = new WebSocketClient(serverUrl, token);
        const initPromise = client.initialize();
        expect(client.isConnecting()).toBe(true);

        // Simulate close(true) while getOrCreateWebSocketClient is still pending
        client.close(true);

        // Now resolve the in-flight connection attempt
        const mockPusher = {
            connection: {
                state: 'connecting',
                callbacks: new Map([['connected', []], ['disconnected', []], ['error', []]]),
            },
            connect: jest.fn(),
            disconnect: jest.fn(),
            send_event: jest.fn(),
        } as unknown as Pusher;
        wsDeferred.resolve({client: mockPusher, created: true});

        await initPromise;

        // The connection should NOT have been established — no callbacks bound, no conn set
        expect(mockPusher.connect).not.toHaveBeenCalled();
        expect(client.isConnected()).toBe(false);
    });
});
