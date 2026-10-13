// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {NativeModules, Platform} from 'react-native';
import * as KeyChain from 'react-native-keychain';

import {
    clearCachedServerCredentials,
    getAllServerCredentials,
    getServerCredentials,
    listAllKeychainServerUrls,
    removeServerCredentials,
    setServerCredentials,
} from './credentials';

jest.mock('react-native-keychain', () => ({
    SECURITY_LEVEL: {
        SECURE_SOFTWARE: 'SECURE_SOFTWARE',
    },
    STORAGE_TYPE: {
        FB: 'FB',
        AES: 'AES',
        RSA: 'RSA',
    },
    setInternetCredentials: jest.fn(),
    getInternetCredentials: jest.fn(),
    resetInternetCredentials: jest.fn(),
    getAllInternetPasswordServers: jest.fn(),
    getAllGenericPasswordServices: jest.fn(),
}));
jest.mock('@utils/log');
jest.mock('@utils/sentry', () => ({
    captureException: jest.fn(),
}));
jest.mock('@utils/mattermost_managed', () => ({
    getIOSAppGroupDetails: jest.fn().mockReturnValue({
        appGroupIdentifier: 'group.com.mattermost.test',
    }),
}));
jest.mock('@database/manager', () => ({
    getActiveServerUrl: jest.fn().mockResolvedValue('https://example.com'),
    serverDatabases: {},
}));

describe('credentials', () => {
    const mockServerUrl = 'https://example.com';
    const mockToken = 'test-token-123';
    const mockUserId = 'user-id-123';
    const originalPlatformOS = Platform.OS;

    beforeEach(() => {
        jest.clearAllMocks();
        clearCachedServerCredentials();
        (NativeModules as any).IkStorage = {
            setItem: jest.fn().mockResolvedValue(undefined),
        };
        jest.mocked(KeyChain.setInternetCredentials).mockResolvedValue({
            service: mockServerUrl,
            storage: 'keychain',
        } as any);
    });

    afterEach(() => {
        Platform.OS = originalPlatformOS;
    });

    describe('setServerCredentials', () => {
        it('should store credentials', async () => {
            await setServerCredentials(mockServerUrl, mockToken);

            expect(KeyChain.setInternetCredentials).toHaveBeenCalledWith(
                mockServerUrl,
                mockToken,
                mockToken,
                expect.objectContaining({
                    securityLevel: KeyChain.SECURITY_LEVEL.SECURE_SOFTWARE,
                }),
            );
        });

        it('should store credentials in IkStorage on Android', async () => {
            Platform.OS = 'android';

            await setServerCredentials(mockServerUrl, mockToken);

            expect(NativeModules.IkStorage.setItem).toHaveBeenCalledWith(mockServerUrl, mockToken);
        });

        it('should not store credentials in IkStorage on iOS', async () => {
            Platform.OS = 'ios';

            await setServerCredentials(mockServerUrl, mockToken);

            expect(NativeModules.IkStorage.setItem).not.toHaveBeenCalled();
        });

        it('should not store credentials when serverUrl is missing', async () => {
            await setServerCredentials('', mockToken);

            expect(KeyChain.setInternetCredentials).not.toHaveBeenCalled();
        });

        it('should not store credentials when token is missing', async () => {
            await setServerCredentials(mockServerUrl, '');

            expect(KeyChain.setInternetCredentials).not.toHaveBeenCalled();
        });

        it('should use iOS app group on iOS platform', async () => {
            Platform.OS = 'ios';

            await setServerCredentials(mockServerUrl, mockToken);

            expect(KeyChain.setInternetCredentials).toHaveBeenCalledWith(
                mockServerUrl,
                mockToken,
                mockToken,
                expect.objectContaining({
                    accessGroup: 'group.com.mattermost.test',
                }),
            );
        });

        it('should not use app group on Android platform', async () => {
            Platform.OS = 'android';

            await setServerCredentials(mockServerUrl, mockToken);

            expect(KeyChain.setInternetCredentials).toHaveBeenCalledWith(
                mockServerUrl,
                mockToken,
                mockToken,
                expect.objectContaining({
                    accessGroup: undefined,
                }),
            );
        });
    });

    describe('getServerCredentials', () => {
        it('should retrieve credentials', async () => {
            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue({
                username: mockUserId,
                password: mockToken,
                service: mockServerUrl,
                storage: 'keychain' as any,
            });

            const result = await getServerCredentials(mockServerUrl);

            expect(result).toEqual({
                serverUrl: mockServerUrl,
                userId: mockUserId,
                token: mockToken,
            });
        });

        it('should handle legacy token format with device token', async () => {
            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue({
                username: 'device-token-123,user-id-456',
                password: mockToken,
                service: mockServerUrl,
                storage: 'keychain' as any,
            });

            const result = await getServerCredentials(mockServerUrl);

            expect(result).toEqual({
                serverUrl: mockServerUrl,
                userId: 'user-id-456',
                token: mockToken,
            });
        });

        it('should return null when credentials do not exist', async () => {
            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue(false as any);

            const result = await getServerCredentials(mockServerUrl);

            expect(result).toBeNull();
        });

        it('should return null when token is undefined', async () => {
            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue({
                username: mockUserId,
                password: 'undefined',
                service: mockServerUrl,
                storage: 'keychain' as any,
            });

            const result = await getServerCredentials(mockServerUrl);

            expect(result).toBeNull();
        });

        it('should return null on error retrieving main credentials', async () => {
            jest.mocked(KeyChain.getInternetCredentials).mockRejectedValue(new Error('Keychain error'));

            const result = await getServerCredentials(mockServerUrl);

            expect(result).toBeNull();
        });
    });

    describe('removeServerCredentials', () => {
        it('should remove internet credentials', async () => {
            await removeServerCredentials(mockServerUrl);

            expect(KeyChain.resetInternetCredentials).toHaveBeenCalledWith({
                server: mockServerUrl,
            });
        });
    });

    describe('listAllKeychainServerUrls', () => {
        it('should list all servers on iOS', async () => {
            Platform.OS = 'ios';
            jest.mocked(KeyChain.getAllInternetPasswordServers).mockResolvedValue([mockServerUrl]);

            await expect(listAllKeychainServerUrls()).resolves.toEqual([mockServerUrl]);
            expect(KeyChain.getAllGenericPasswordServices).not.toHaveBeenCalled();
        });

        it('should list all services on Android', async () => {
            Platform.OS = 'android';
            jest.mocked(KeyChain.getAllGenericPasswordServices).mockResolvedValue([mockServerUrl]);

            await expect(listAllKeychainServerUrls()).resolves.toEqual([mockServerUrl]);
            expect(KeyChain.getAllInternetPasswordServers).not.toHaveBeenCalled();
        });
    });

    describe('getAllServerCredentials', () => {
        it('should retrieve all server credentials on iOS', async () => {
            Platform.OS = 'ios';
            const serverUrls = [
                'https://server1.com',
                'https://server2.com',
            ];

            jest.mocked(KeyChain.getAllInternetPasswordServers).mockResolvedValue(serverUrls);

            jest.mocked(KeyChain.getInternetCredentials).mockImplementation(async (url) => {
                if (url === 'https://server1.com') {
                    return {
                        username: 'user1',
                        password: 'token1',
                        service: url,
                        storage: 'keychain' as any,
                    };
                } else if (url === 'https://server2.com') {
                    return {
                        username: 'user2',
                        password: 'token2',
                        service: url,
                        storage: 'keychain' as any,
                    };
                }
                return false as any;
            });

            const result = await getAllServerCredentials();

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                serverUrl: 'https://server1.com',
                userId: 'user1',
                token: 'token1',
            });
            expect(result[1]).toEqual({
                serverUrl: 'https://server2.com',
                userId: 'user2',
                token: 'token2',
            });
        });

        it('should retrieve all server credentials on Android', async () => {
            Platform.OS = 'android';
            const serverUrls = ['https://server1.com'];

            jest.mocked(KeyChain.getAllGenericPasswordServices).mockResolvedValue(serverUrls);

            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue({
                username: 'user1',
                password: 'token1',
                service: 'https://server1.com',
                storage: 'keychain' as any,
            });

            const result = await getAllServerCredentials();

            expect(result).toHaveLength(1);
            expect(KeyChain.getAllGenericPasswordServices).toHaveBeenCalled();
            expect(KeyChain.getAllInternetPasswordServers).not.toHaveBeenCalled();
        });

        it('should filter out null credentials', async () => {
            Platform.OS = 'ios';
            const serverUrls = [
                'https://server1.com',
                'https://server2.com',
            ];

            jest.mocked(KeyChain.getAllInternetPasswordServers).mockResolvedValue(serverUrls);

            jest.mocked(KeyChain.getInternetCredentials).mockImplementation(async (url) => {
                if (url === 'https://server1.com') {
                    return {
                        username: 'user1',
                        password: 'token1',
                        service: url,
                        storage: 'keychain' as any,
                    };
                }
                return false as any;
            });

            const result = await getAllServerCredentials();

            expect(result).toHaveLength(1);
            expect(result[0].serverUrl).toBe('https://server1.com');
        });

        it('should skip Android service listing when known URLs are provided', async () => {
            Platform.OS = 'android';
            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue({
                username: 'user1',
                password: 'token1',
                service: 'https://server1.com',
                storage: 'keychain' as any,
            });

            const result = await getAllServerCredentials(['https://server1.com']);

            expect(result).toHaveLength(1);
            expect(result[0].serverUrl).toBe('https://server1.com');
            expect(KeyChain.getAllGenericPasswordServices).not.toHaveBeenCalled();
        });

        it('should fall back to listing when known URLs is empty', async () => {
            Platform.OS = 'ios';
            jest.mocked(KeyChain.getAllInternetPasswordServers).mockResolvedValue([mockServerUrl]);
            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue({
                username: mockUserId,
                password: mockToken,
                service: mockServerUrl,
                storage: 'keychain' as any,
            });

            const result = await getAllServerCredentials([]);

            expect(result).toHaveLength(1);
            expect(KeyChain.getAllInternetPasswordServers).toHaveBeenCalled();
        });

        it('should return the cache on a second call without listing or decrypting', async () => {
            Platform.OS = 'ios';
            jest.mocked(KeyChain.getAllInternetPasswordServers).mockResolvedValue([mockServerUrl]);
            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue({
                username: mockUserId,
                password: mockToken,
                service: mockServerUrl,
                storage: 'keychain' as any,
            });

            const first = await getAllServerCredentials();
            jest.mocked(KeyChain.getAllInternetPasswordServers).mockClear();
            jest.mocked(KeyChain.getInternetCredentials).mockClear();

            const second = await getAllServerCredentials();
            const one = await getServerCredentials(mockServerUrl);

            expect(second).toEqual(first);
            expect(one).toEqual(first[0]);
            expect(KeyChain.getAllInternetPasswordServers).not.toHaveBeenCalled();
            expect(KeyChain.getInternetCredentials).not.toHaveBeenCalled();
        });
    });

    describe('credential cache', () => {
        const loadCache = async () => {
            Platform.OS = 'ios';
            jest.mocked(KeyChain.getAllInternetPasswordServers).mockResolvedValue([mockServerUrl]);
            jest.mocked(KeyChain.getInternetCredentials).mockResolvedValue({
                username: mockUserId,
                password: mockToken,
                service: mockServerUrl,
                storage: 'keychain' as any,
            });
            await getAllServerCredentials();
        };

        it('should upsert the cached credential after a successful write', async () => {
            await loadCache();
            await setServerCredentials(mockServerUrl, 'new-token');

            await expect(getServerCredentials(mockServerUrl)).resolves.toEqual({
                serverUrl: mockServerUrl,
                userId: 'new-token',
                token: 'new-token',
            });
        });

        it('should leave the cache unchanged when a Keychain write fails', async () => {
            await loadCache();
            jest.mocked(KeyChain.setInternetCredentials).mockResolvedValue(false as any);

            await setServerCredentials(mockServerUrl, 'new-token');

            await expect(getServerCredentials(mockServerUrl)).resolves.toEqual({
                serverUrl: mockServerUrl,
                userId: mockUserId,
                token: mockToken,
            });
        });

        it('should drop the cached credential on remove', async () => {
            await loadCache();
            jest.mocked(KeyChain.getInternetCredentials).mockClear();

            await removeServerCredentials(mockServerUrl);

            await expect(getAllServerCredentials()).resolves.toEqual([]);
            expect(KeyChain.getInternetCredentials).not.toHaveBeenCalled();
        });

        it('should not let callers mutate cached credentials', async () => {
            await loadCache();
            const all = await getAllServerCredentials();
            expect(all).toHaveLength(1);
            all[0].token = 'mutated';

            await expect(getServerCredentials(mockServerUrl)).resolves.toMatchObject({token: mockToken});
        });
    });
});
