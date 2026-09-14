// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {createIntl} from 'react-intl';

import {joinIfNeededAndSwitchToChannel, makeDirectChannel} from '@actions/remote/channel';
import {fetchUsersByUsernames} from '@actions/remote/user';
import {DeepLink, Launch, Screens} from '@constants';
import DatabaseManager from '@database/manager';
import WebsocketManager from '@managers/websocket_manager';
import {getActiveServerUrl} from '@queries/app/servers';
import {queryUsersByUsername} from '@queries/servers/user';
import {dismissAllModalsAndPopToRoot} from '@screens/navigation';
import NavigationStore from '@store/navigation_store';
import TestHelper from '@test/test_helper';

import {alertErrorWithFallback, errorBadChannel, errorUnkownUser} from '../draft';

import {alertInvalidDeepLink, extractServerUrl, getLaunchPropsFromDeepLink, parseAndHandleDeepLink} from '.';

jest.mock('@actions/remote/user', () => ({
    fetchUsersByUsernames: jest.fn(),
}));

jest.mock('@actions/remote/permalink', () => ({
    showPermalink: jest.fn(),
}));

jest.mock('@queries/app/servers', () => ({
    getActiveServerUrl: jest.fn(),
}));

jest.mock('@queries/servers/user', () => ({
    getCurrentUser: jest.fn(),
    queryUsersByUsername: jest.fn(() => ({fetchIds: jest.fn(() => ['user-id'])})),
}));

jest.mock('@database/manager', () => ({
    searchUrl: jest.fn(),
    setActiveServerDatabase: jest.fn(),
    getServerDatabaseAndOperator: jest.fn(() => ({database: {}, operator: {}})),
}));

jest.mock('@managers/websocket_manager', () => ({
    initializeClient: jest.fn(),
}));

jest.mock('@store/navigation_store', () => ({
    __esModule: true,
    default: {
        getVisibleScreen: jest.fn(),
        hasModalsOpened: jest.fn(() => false),
        waitUntilScreenHasLoaded: jest.fn(),
        getScreensInStack: jest.fn().mockReturnValue([]),
    },
}));

jest.mock('@screens/navigation', () => ({
    dismissAllModalsAndPopToRoot: jest.fn(),
}));

jest.mock('@utils/server', () => ({
    addNewServer: jest.fn(),
}));

jest.mock('@actions/remote/channel', () => ({
    makeDirectChannel: jest.fn(),
    joinIfNeededAndSwitchToChannel: jest.fn(),
}));

jest.mock('@utils/draft', () => ({
    errorBadChannel: jest.fn(),
    errorUnkownUser: jest.fn(),
    alertErrorWithFallback: jest.fn(),
}));

jest.mock('@utils/log', () => ({
    logError: jest.fn(),
}));

jest.mock('@i18n', () => ({
    DEFAULT_LOCALE: 'en',
    getTranslations: jest.fn(() => ({})),
    t: jest.fn((id) => id),
}));

describe('extractServerUrl', () => {
    it('should extract the sanitized server url', () => {
        expect(extractServerUrl('example.com:8080//path/to///login')).toEqual('example.com:8080/path/to');
        expect(extractServerUrl('localhost:3000/signup')).toEqual('localhost:3000');
        expect(extractServerUrl('192.168.0.1/admin_console')).toEqual('192.168.0.1');
        expect(extractServerUrl('example.com/path//to/resource')).toEqual('example.com/path/to/resource');
        expect(extractServerUrl('my.local.network/.../resource/admin_console')).toEqual('my.local.network/resource');
        expect(extractServerUrl('my.local.network//ad-1/channels/%252f%252e.town-square')).toEqual(null);
        expect(extractServerUrl('example.com:8080')).toEqual('example.com:8080');
        expect(extractServerUrl('example.com:8080/')).toEqual('example.com:8080');
    });
});

describe('parseAndHandleDeepLink', () => {
    const intl = createIntl({locale: 'en', messages: {}});

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return error for invalid deep link', async () => {
        const result = await parseAndHandleDeepLink('invalid-url');
        expect(result).toEqual({error: true});
    });

    it('should handle existing server and switch to home screen', async () => {
        jest.mocked(getActiveServerUrl).mockResolvedValueOnce('https://currentserver.com');
        jest.mocked(DatabaseManager.searchUrl).mockReturnValueOnce('https://existingserver.com');
        jest.mocked(NavigationStore.getVisibleScreen).mockReturnValueOnce(Screens.HOME);
        const result = await parseAndHandleDeepLink('https://existingserver.com/team/channels/town-square');
        expect(dismissAllModalsAndPopToRoot).toHaveBeenCalled();
        expect(DatabaseManager.setActiveServerDatabase).toHaveBeenCalledWith('https://existingserver.com');
        expect(WebsocketManager.initializeClient).toHaveBeenCalledWith('https://existingserver.com');
        expect(result).toEqual({error: false});
    });

    it('should switch to channel by name for Channel deep link', async () => {
        jest.mocked(DatabaseManager.searchUrl).mockReturnValueOnce('https://existingserver.com');
        jest.mocked(getActiveServerUrl).mockResolvedValueOnce('https://existingserver.com');
        const result = await parseAndHandleDeepLink('https://existingserver.com/team/channels/town-square', intl);
        expect(joinIfNeededAndSwitchToChannel).toHaveBeenCalledWith('https://existingserver.com', {name: 'town-square'}, {name: 'team'}, errorBadChannel, intl);
        expect(result).toEqual({error: false});
    });

    it('should create direct message for DirectMessage deep link', async () => {
        jest.mocked(DatabaseManager.searchUrl).mockReturnValueOnce('https://existingserver.com');
        jest.mocked(getActiveServerUrl).mockResolvedValueOnce('https://existingserver.com');
        (queryUsersByUsername as jest.Mock).mockReturnValueOnce(TestHelper.fakeQuery([TestHelper.fakeUserModel({id: 'user-id'})]));
        const result = await parseAndHandleDeepLink('https://existingserver.com/team/messages/@user-id', intl);
        expect(makeDirectChannel).toHaveBeenCalledWith('https://existingserver.com', 'user-id', '', true);
        expect(result).toEqual({error: false});
    });

    it('should fetch user and create direct message if user not found locally', async () => {
        jest.mocked(DatabaseManager.searchUrl).mockReturnValueOnce('https://existingserver.com');
        jest.mocked(getActiveServerUrl).mockResolvedValueOnce('https://existingserver.com');
        jest.mocked(fetchUsersByUsernames).mockResolvedValueOnce({users: [TestHelper.fakeUser({id: 'user-id'})]});
        jest.mocked(queryUsersByUsername).mockReturnValueOnce(TestHelper.fakeQuery([]));
        const result = await parseAndHandleDeepLink('https://existingserver.com/team/messages/@user-id', intl);
        expect(makeDirectChannel).toHaveBeenCalledWith('https://existingserver.com', 'user-id', '', true);
        expect(result).toEqual({error: false});
    });

    it('should show unknown user error if user not found', async () => {
        jest.mocked(DatabaseManager.searchUrl).mockReturnValueOnce('https://existingserver.com');
        jest.mocked(getActiveServerUrl).mockResolvedValueOnce('https://existingserver.com');
        jest.mocked(queryUsersByUsername).mockReturnValueOnce(TestHelper.fakeQuery([]));
        jest.mocked(fetchUsersByUsernames).mockResolvedValueOnce({users: []});
        const result = await parseAndHandleDeepLink('https://existingserver.com/team/messages/@user-id', intl);
        expect(errorUnkownUser).toHaveBeenCalledWith(intl);
        expect(result).toEqual({error: false});
    });

    it('should switch to group message channel for GroupMessage deep link', async () => {
        jest.mocked(DatabaseManager.searchUrl).mockReturnValueOnce('https://existingserver.com');
        jest.mocked(getActiveServerUrl).mockResolvedValueOnce('https://existingserver.com');
        const result = await parseAndHandleDeepLink('https://existingserver.com/team/messages/7b35c77a645e1906e03a2c330f89203385db102f', intl);
        expect(joinIfNeededAndSwitchToChannel).toHaveBeenCalledWith('https://existingserver.com', {name: '7b35c77a645e1906e03a2c330f89203385db102f'}, {name: 'team'}, errorBadChannel, intl);
        expect(result).toEqual({error: false});
    });
});

describe('getLaunchPropsFromDeepLink', () => {
    it('should return launch props with launchError when deep link is invalid', () => {
        const result = getLaunchPropsFromDeepLink('invalid-url');

        expect(result).toEqual({
            launchType: Launch.DeepLink,
            coldStart: false,
            launchError: true,
            extra: {
                type: DeepLink.Invalid,
                url: 'invalid-url',
            },
        });
    });

    it('should return launch props with extra data when deep link is valid', () => {
        const extraData = {
            type: DeepLink.Channel,
            data: {
                channelName: 'town-square',
                serverUrl: 'existingserver.com',
                teamName: 'team',
            },
            url: 'https://existingserver.com/team/channels/town-square',
        };
        const result = getLaunchPropsFromDeepLink('https://existingserver.com/team/channels/town-square', true);

        expect(result).toEqual({
            launchType: Launch.DeepLink,
            coldStart: true,
            extra: extraData,
        });
    });
});

describe('alertInvalidDeepLink', () => {
    it('should call alertErrorWithFallback with correct arguments', () => {
        const intl = createIntl({locale: 'en', messages: {}});
        const message = {
            id: 'mobile.deep_link.invalid',
            defaultMessage: 'This link you are trying to open is invalid.',
        };

        alertInvalidDeepLink(intl);

        expect(alertErrorWithFallback).toHaveBeenCalledWith(intl, {}, message);
    });
});
