// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import NetInfo, {type NetInfoState} from '@react-native-community/netinfo';

import {removePushDisabledInServerAcknowledged} from '@actions/app/global';
import DatabaseManager from '@database/manager';
import {resetMomentLocale} from '@i18n';
import {removeServerCredentials} from '@init/credentials';
import PushNotifications from '@init/push_notifications';
import NetworkManager from '@managers/network_manager';
import WebsocketManager from '@managers/websocket_manager';
import {getExpiredSession} from '@queries/servers/system';
import {getCurrentUser} from '@queries/servers/user';
import {deleteFileCache, deleteFileCacheByDir} from '@utils/file';
import {clearCookiesForServer, urlSafeBase64Encode} from '@utils/security';

import {terminateSession} from './index';

import type ServerDataOperator from '@database/operator/server_data_operator';
import type {Database} from '@nozbe/watermelondb';
import type {ServerDatabase, ServerDatabases} from '@typings/database/database';
import type UserModel from '@typings/database/models/servers/user';

// Mock all dependencies
jest.mock('@react-native-community/netinfo');
jest.mock('expo-image', () => ({
    Image: {
        clearDiskCache: jest.fn(),
    },
}));
jest.mock('@actions/app/global');
jest.mock('@database/manager', () => ({
    getServerDatabaseAndOperator: jest.fn(),
    getActiveServerDatabase: jest.fn(),
    destroyServerDatabase: jest.fn(),
    deleteServerDatabase: jest.fn(),
    serverDatabases: {},
}));
jest.mock('@i18n', () => ({
    resetMomentLocale: jest.fn(),
}));
jest.mock('@init/credentials');
jest.mock('@init/push_notifications', () => ({
    removeServerNotifications: jest.fn(),
    clearAllNotifications: jest.fn(),
    cancelScheduleNotification: jest.fn(),
}));
jest.mock('@managers/network_manager', () => ({
    invalidateClient: jest.fn(),
}));
jest.mock('@managers/websocket_manager', () => ({
    invalidateClient: jest.fn(),
}));
jest.mock('@queries/app/global');
jest.mock('@queries/servers/system');
jest.mock('@queries/servers/user');
jest.mock('@utils/file');
jest.mock('@utils/security');

describe('session actions', () => {
    const mockServerUrl = 'https://example.com';
    const mockDatabase = {database: 'mockDb'};
    const mockOperator = {
        handleSystem: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('terminateSession', () => {
        const encodedServerUrl = 'aHR0cHM6Ly9leGFtcGxlLmNvbQ==';

        beforeEach(() => {
            jest.mocked(DatabaseManager.getServerDatabaseAndOperator).mockReturnValue({
                database: mockDatabase as unknown as Database,
                operator: mockOperator as unknown as ServerDataOperator,
            });
            jest.mocked(getExpiredSession).mockResolvedValue(undefined);
            jest.mocked(NetInfo.fetch).mockResolvedValue({
                isInternetReachable: false,
            } as NetInfoState);
            jest.mocked(urlSafeBase64Encode).mockReturnValue(encodedServerUrl);
            jest.mocked(getCurrentUser).mockResolvedValue(undefined);
            (DatabaseManager.serverDatabases as ServerDatabases) = {};
        });

        it('should call all cleanup functions in correct order for removeServer=true', async () => {
            await terminateSession(mockServerUrl, true);

            // Verify all cleanup functions called
            expect(removeServerCredentials).toHaveBeenCalledWith(mockServerUrl);
            expect(PushNotifications.removeServerNotifications).toHaveBeenCalledWith(mockServerUrl);
            expect(PushNotifications.clearAllNotifications).toHaveBeenCalled();
            expect(NetworkManager.invalidateClient).toHaveBeenCalledWith(mockServerUrl);
            expect(WebsocketManager.invalidateClient).toHaveBeenCalledWith(mockServerUrl);
            expect(removePushDisabledInServerAcknowledged).toHaveBeenCalledWith(encodedServerUrl);
            expect(DatabaseManager.destroyServerDatabase).toHaveBeenCalledWith(mockServerUrl);
            expect(resetMomentLocale).toHaveBeenCalled();
            expect(clearCookiesForServer).toHaveBeenCalledWith(mockServerUrl);
            expect(deleteFileCache).toHaveBeenCalledWith(mockServerUrl);
            expect(deleteFileCacheByDir).toHaveBeenCalledWith('mmPasteInput');
            expect(deleteFileCacheByDir).toHaveBeenCalledWith('thumbnails');
        });

        it('should call deleteServerDatabase when removeServer=false', async () => {
            await terminateSession(mockServerUrl, false);

            expect(DatabaseManager.deleteServerDatabase).toHaveBeenCalledWith(mockServerUrl);
            expect(DatabaseManager.destroyServerDatabase).not.toHaveBeenCalled();
            expect(removePushDisabledInServerAcknowledged).not.toHaveBeenCalled();
        });

        it('should clear cookies for server', async () => {
            await terminateSession(mockServerUrl, true);

            expect(clearCookiesForServer).toHaveBeenCalledWith(mockServerUrl);
        });

        it('should clear image cache with URL-safe encoded server URL', async () => {
            await terminateSession(mockServerUrl, true);

            expect(urlSafeBase64Encode).toHaveBeenCalledWith(mockServerUrl);
        });

        it('should delete file caches for server and common directories', async () => {
            await terminateSession(mockServerUrl, true);

            expect(deleteFileCache).toHaveBeenCalledWith(mockServerUrl);
            expect(deleteFileCacheByDir).toHaveBeenCalledWith('mmPasteInput');
            expect(deleteFileCacheByDir).toHaveBeenCalledWith('thumbnails');
        });

        it('should reset locale with user locale when active server database exists', async () => {
            const mockUser = {locale: 'es'};
            const mockServerDatabase = {database: 'serverDb'} as unknown as ServerDatabase;

            (DatabaseManager.serverDatabases as ServerDatabases) = {[mockServerUrl]: mockServerDatabase};
            jest.mocked(DatabaseManager.getActiveServerDatabase).mockResolvedValue(mockServerDatabase as unknown as Database);
            jest.mocked(getCurrentUser).mockResolvedValue(mockUser as unknown as UserModel);

            await terminateSession(mockServerUrl, true);

            // Wait for the async resetLocale to complete (not awaited in implementation)
            await new Promise((resolve) => setImmediate(resolve));

            expect(resetMomentLocale).toHaveBeenCalledWith('es');
        });

        it('should reset locale to default when no active server database', async () => {
            (DatabaseManager.serverDatabases as ServerDatabases) = {};

            await terminateSession(mockServerUrl, true);

            // Wait for the async resetLocale to complete (not awaited in implementation)
            await new Promise((resolve) => setImmediate(resolve));

            expect(resetMomentLocale).toHaveBeenCalledWith();
        });

        it('should remove user credentials on logout (removeServer=false)', async () => {
            await terminateSession(mockServerUrl, false);

            expect(removeServerCredentials).toHaveBeenCalledWith(mockServerUrl);
            expect(DatabaseManager.deleteServerDatabase).toHaveBeenCalledWith(mockServerUrl);
            expect(DatabaseManager.destroyServerDatabase).not.toHaveBeenCalled();
        });

        it('should call destroyServerDatabase on server removal (removeServer=true)', async () => {
            await terminateSession(mockServerUrl, true);

            expect(DatabaseManager.destroyServerDatabase).toHaveBeenCalledWith(mockServerUrl);
            expect(DatabaseManager.deleteServerDatabase).not.toHaveBeenCalled();
        });
    });
});
