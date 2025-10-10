// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DeviceEventEmitter} from 'react-native';

import {Events} from '@constants';
import {getAllServerCredentials} from '@init/credentials';
import NetworkManager from '@managers/network_manager';
import WebsocketManager from '@managers/websocket_manager';
import {getDeviceToken} from '@queries/app/global';
import {captureException} from '@utils/sentry';

import {logout} from './session';

jest.mock('@utils/sentry', () => ({captureException: jest.fn()}));
jest.mock('@init/credentials', () => ({getAllServerCredentials: jest.fn()}));
jest.mock('@queries/app/global', () => ({getDeviceToken: jest.fn()}));
jest.mock('@managers/network_manager', () => ({__esModule: true, default: {getClient: jest.fn()}}));
jest.mock('@managers/websocket_manager', () => ({__esModule: true, default: {getClient: jest.fn().mockReturnValue({close: jest.fn()})}}));
jest.mock('@database/manager', () => ({__esModule: true, default: {appDatabase: {database: {}}}}));
jest.mock('react-native', () => ({DeviceEventEmitter: {emit: jest.fn()}, Platform: {OS: 'ios'}}));

jest.mock('@init/push_notifications', () => ({
    __esModule: true,
    default: {},
}));

jest.mock('./entry', () => ({
    __esModule: true,
    loginEntry: jest.fn(),
}));

describe('logout', () => {
    const mockClient = {logout: jest.fn()};

    beforeEach(() => {
        jest.clearAllMocks();
        (NetworkManager.getClient as jest.Mock).mockReturnValue(mockClient);
        (WebsocketManager.getClient as jest.Mock).mockReturnValue({close: jest.fn()});
        DeviceEventEmitter.emit = jest.fn();
    });

    it('should call captureException if deviceToken is undefined', async () => {
        (getAllServerCredentials as jest.Mock).mockResolvedValue([
            {serverUrl: 'https://server1.com'},
        ]);
        (getDeviceToken as jest.Mock).mockResolvedValue(undefined);

        await logout('https://server1.com', undefined);

        expect(captureException).toHaveBeenCalledTimes(1);
        expect(captureException).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('Logout called without deviceToken for server=https://server1.com'),
            }),
        );
    });

    it('calls logout on all servers with correct deviceToken', async () => {
        const servers = [
            {serverUrl: 'https://server1.com'},
            {serverUrl: 'https://server2.com'},
        ];
        (getAllServerCredentials as jest.Mock).mockResolvedValue(servers);
        (getDeviceToken as jest.Mock).mockResolvedValue('token123');

        await logout('https://server1.com', undefined);

        expect(mockClient.logout).toHaveBeenCalledTimes(2);

        servers.forEach((server, index) => {
            expect(mockClient.logout).toHaveBeenNthCalledWith(index + 1, 'token123');
        });

        expect(DeviceEventEmitter.emit).toHaveBeenCalledTimes(2);
        servers.forEach((server) => {
            expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(
                Events.SERVER_LOGOUT,
                expect.objectContaining({serverUrl: server.serverUrl}),
            );
        });
    });
});
