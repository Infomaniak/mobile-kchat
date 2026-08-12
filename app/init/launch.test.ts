// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {AppState, Linking, Platform} from 'react-native';

import {removePost} from '@actions/local/post';
import {switchToChannelById} from '@actions/remote/channel';
import {appEntry, pushNotificationEntry} from '@actions/remote/entry';
import {fetchAndSwitchToThread} from '@actions/remote/thread';
import LocalConfig from '@assets/config.json';
import {Launch} from '@constants';
import DatabaseManager from '@database/manager';
import {getActiveServerUrl, getServerCredentials} from '@init/credentials';
import {getLastViewedChannelIdAndServer, getOnboardingViewed, getLastViewedThreadIdAndServer} from '@queries/app/global';
import {getAllServers} from '@queries/app/servers';
import {queryPostsByType} from '@queries/servers/post';
import {getCurrentUserId} from '@queries/servers/system';
import {getExpoRouterPath} from '@screens/navigation';

import {launchToHome, cleanupEphemeralPosts, determineInitialExpoRoute} from './launch';

import type ServersModel from '@typings/database/models/app/servers';
import type {LaunchProps} from '@typings/launch';

jest.mock('react-native-notifications', () => ({
    Notifications: {
        getInitialNotification: jest.fn().mockResolvedValue(null),
        ios: {
            getDeliveredNotifications: jest.fn().mockResolvedValue([]),
        },
    },
}));

jest.mock('@actions/local/post');
jest.mock('@actions/remote/channel');
jest.mock('@actions/remote/entry', () => ({
    appEntry: jest.fn(),
    pushNotificationEntry: jest.fn(),
    upgradeEntry: jest.fn().mockResolvedValue({}),
}));
jest.mock('@actions/remote/thread');
jest.mock('@database/manager', () => ({
    getActiveServerUrl: jest.fn(),
    getActiveServerDisplayName: jest.fn(),
    destroyServerDatabase: jest.fn(),
    deleteServerDatabase: jest.fn(),
    searchUrl: jest.fn(),
    getServerUrlFromIdentifier: jest.fn(),
    getServerDatabaseAndOperator: jest.fn(),
    serverDatabases: {},
}));
jest.mock('@init/credentials');
jest.mock('@managers/performance_metrics_manager', () => ({
    setLoadTarget: jest.fn(),
}));
jest.mock('@queries/app/global');
jest.mock('@queries/app/servers');
jest.mock('@queries/servers/post');
jest.mock('@queries/servers/preference');
jest.mock('@queries/servers/system');
jest.mock('@screens/navigation', () => ({
    getExpoRouterPath: jest.fn((screen: string) => `/(authenticated)/${screen}`),
}));
jest.mock('@utils/deep_link');
jest.mock('@store/ephemeral_store');
jest.mock('@context/theme', () => ({
    getDefaultThemeByAppearance: jest.fn(() => ({})),
}));
jest.mock('@utils/notification', () => ({
    convertToNotificationData: jest.fn(),
}));
jest.mock('@utils/sentry', () => ({
    captureMessage: jest.fn(),
}));
jest.mock('@utils/url', () => ({
    removeProtocol: jest.fn((url: string) => url),
    stripTrailingSlashes: jest.fn((url: string) => url),
}));

describe('Launch', () => {
    const mockServerUrl = 'http://server-1.com';
    const mockDatabase = {};
    const mockServerDatabases = {
        [mockServerUrl]: {
            database: mockDatabase,
            operator: {},
        },
    } as unknown as typeof DatabaseManager.serverDatabases;

    beforeEach(() => {
        jest.clearAllMocks();
        DatabaseManager.serverDatabases = mockServerDatabases;
        Platform.OS = 'ios';
        AppState.currentState = 'active';
        jest.mocked(getAllServers).mockResolvedValue([]);
        jest.mocked(getActiveServerUrl).mockResolvedValue(mockServerUrl);
    });

    describe('determineInitialExpoRoute', () => {
        it('should handle normal launch with active server', async () => {
            const serverUrl = 'http://server-1.com';
            const credentials = {token: 'token1'} as ServerCredential;

            jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(null);
            jest.mocked(getActiveServerUrl).mockResolvedValue(serverUrl);
            jest.mocked(getServerCredentials).mockResolvedValue(credentials);
            jest.mocked(getCurrentUserId).mockResolvedValue('user1');

            await determineInitialExpoRoute();

            expect(getActiveServerUrl).toHaveBeenCalled();
            expect(getServerCredentials).toHaveBeenCalledWith(serverUrl);
            expect(getCurrentUserId).toHaveBeenCalled();
            expect(appEntry).toHaveBeenCalledWith(serverUrl);
        });

        it('should handle upgrade launch with no current user', async () => {
            const {upgradeEntry} = require('@actions/remote/entry');
            const credentials = {token: 'token1'} as ServerCredential;

            jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(null);
            jest.mocked(getActiveServerUrl).mockResolvedValue(mockServerUrl);
            jest.mocked(getServerCredentials).mockResolvedValue(credentials);
            jest.mocked(getCurrentUserId).mockResolvedValueOnce('');

            await determineInitialExpoRoute();

            expect(upgradeEntry).toHaveBeenCalledWith(mockServerUrl);
        });

        it('should show onboarding when enabled and not viewed', async () => {
            LocalConfig.ShowOnboarding = true;
            jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(null);
            jest.mocked(getActiveServerUrl).mockResolvedValue(undefined);
            jest.mocked(getOnboardingViewed).mockResolvedValue(false);

            const result = await determineInitialExpoRoute();

            expect(getOnboardingViewed).toHaveBeenCalled();
            expect(getExpoRouterPath).toHaveBeenCalled();
            expect(result.route).toBeDefined();
        });
    });

    describe('launchToHome', () => {
        const serverUrl = 'http://server-1.com';

        beforeEach(() => {
            DatabaseManager.serverDatabases = {
                [serverUrl]: {database: {}, operator: {}},
            } as unknown as typeof DatabaseManager.serverDatabases;
        });

        it('should handle deep link launch', async () => {
            const props = {
                launchType: Launch.DeepLink,
                serverUrl,
            };

            await launchToHome(props);

            expect(appEntry).toHaveBeenCalledWith(serverUrl);
        });

        it('should handle notification launch', async () => {
            const notification = {
                payload: {
                    channel_id: 'channel1',
                },
                userInteraction: true,
            };
            const props = {
                launchType: Launch.Notification,
                serverUrl,
                extra: notification,
            } as LaunchProps;

            await launchToHome(props);

            expect(pushNotificationEntry).toHaveBeenCalledWith(serverUrl, notification.payload, 'Notification');
        });

        it('should handle cold start with last viewed channel', async () => {
            const lastChannel = {
                server_url: serverUrl,
                channel_id: 'channel1',
            };
            jest.mocked(getLastViewedChannelIdAndServer).mockResolvedValue(lastChannel);
            jest.mocked(getLastViewedThreadIdAndServer).mockResolvedValue(null);

            const props = {
                launchType: Launch.Normal,
                serverUrl,
                coldStart: true,
            };

            await launchToHome(props);

            expect(switchToChannelById).toHaveBeenCalledWith(serverUrl, 'channel1');
            expect(appEntry).toHaveBeenCalledWith(serverUrl);
        });

        it('should handle cold start with last viewed thread', async () => {
            const lastThread = {
                server_url: serverUrl,
                thread_id: 'thread1',
            };
            jest.mocked(getLastViewedChannelIdAndServer).mockResolvedValue(null);
            jest.mocked(getLastViewedThreadIdAndServer).mockResolvedValue(lastThread);

            const props = {
                launchType: Launch.Normal,
                serverUrl,
                coldStart: true,
            };

            await launchToHome(props);

            expect(fetchAndSwitchToThread).toHaveBeenCalledWith(serverUrl, 'thread1');
            expect(appEntry).toHaveBeenCalledWith(serverUrl);
        });
    });

    describe('cleanupEphemeralPosts', () => {
        it('should remove ephemeral posts', async () => {
            const serverUrl = 'http://server-1.com';
            const ephemeralPosts = [{id: 'post1'}, {id: 'post2'}];

            DatabaseManager.serverDatabases = {
                [serverUrl]: {database: {}, operator: {}},
            } as unknown as typeof DatabaseManager.serverDatabases;

            jest.mocked(getAllServers).mockResolvedValue([{url: serverUrl} as ServersModel]);
            jest.mocked(queryPostsByType).mockReturnValue({fetch: () => ephemeralPosts} as never);

            await cleanupEphemeralPosts();

            expect(removePost).toHaveBeenCalledTimes(2);
            expect(removePost).toHaveBeenCalledWith(serverUrl, ephemeralPosts[0]);
            expect(removePost).toHaveBeenCalledWith(serverUrl, ephemeralPosts[1]);
        });
    });
});
