// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// IK-specific tests for deep link handling.
// Screens.SERVER is NOT registered in kChat (Infomaniak uses its own login flow),
// so deep links to unknown servers must return {error: true} instead of crashing.

import {magicLinkLogin} from '@actions/remote/session';
import DatabaseManager from '@database/manager';
import {getActiveServerUrl} from '@queries/app/servers';
import {addNewServer} from '@utils/server';

import {parseAndHandleDeepLink} from '.';

jest.mock('@actions/remote/session', () => ({
    magicLinkLogin: jest.fn(),
}));

jest.mock('@queries/app/servers', () => ({
    getActiveServerUrl: jest.fn(),
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
    getVisibleScreen: jest.fn(() => 'HOME'),
    hasModalsOpened: jest.fn(() => false),
    waitUntilScreenHasLoaded: jest.fn(),
    getScreensInStack: jest.fn().mockReturnValue([]),
}));

jest.mock('@utils/server', () => ({
    addNewServer: jest.fn(),
}));

jest.mock('@utils/log', () => ({
    logError: jest.fn(),
}));

jest.mock('@i18n', () => ({
    DEFAULT_LOCALE: 'en',
    getTranslations: jest.fn(() => ({})),
}));

jest.mock('@playbooks/database/queries/version');
jest.mock('@playbooks/database/queries/run');
jest.mock('@playbooks/actions/remote/runs');
jest.mock('@playbooks/screens/navigation');

// These are required by handleDeepLink even if not exercised in these tests.
jest.mock('@actions/remote/channel', () => ({
    makeDirectChannel: jest.fn(),
    joinIfNeededAndSwitchToChannel: jest.fn(),
}));
jest.mock('@actions/remote/conference', () => ({
    switchToConferenceByChannelId: jest.fn(),
}));
jest.mock('@actions/remote/permalink', () => ({
    showPermalink: jest.fn(),
}));
jest.mock('@actions/remote/user', () => ({
    fetchUsersByUsernames: jest.fn(),
}));
jest.mock('@queries/servers/user', () => ({
    getCurrentUser: jest.fn(),
    queryUsersByUsername: jest.fn(() => ({fetchIds: jest.fn(() => [])})),
}));
jest.mock('@screens/navigation', () => ({
    dismissAllModalsAndPopToRoot: jest.fn(),
}));
jest.mock('@utils/draft', () => ({
    errorBadChannel: jest.fn(),
    errorUnkownUser: jest.fn(),
    alertErrorWithFallback: jest.fn(),
}));

describe('IK deep link: unknown server handling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(DatabaseManager.searchUrl).mockReturnValue(undefined);
        jest.mocked(getActiveServerUrl).mockResolvedValue('https://kchat.infomaniak.com');
    });

    it('should return error without crashing when permalink points to an unregistered server', async () => {
        // Regression: clicking https://kchat.infomaniakgroup.com/infomaniak/pl/<id> used to
        // crash with "Server has not been registered" because addNewServer called
        // showModal(Screens.SERVER) which is not registered in kChat.
        const result = await parseAndHandleDeepLink(
            'https://kchat.infomaniakgroup.com/infomaniak/pl/019dc967-e55d-72c1-a94d-0246ca0c1571',
        );

        expect(result).toEqual({error: true});
        expect(addNewServer).not.toHaveBeenCalled();
    });

    it('should return error without crashing when channel link points to an unregistered server', async () => {
        const result = await parseAndHandleDeepLink(
            'https://other.kchat.example.com/team/channels/general',
        );

        expect(result).toEqual({error: true});
        expect(addNewServer).not.toHaveBeenCalled();
    });

    it('should still attempt magic link login for an unregistered server', async () => {
        jest.mocked(magicLinkLogin).mockResolvedValueOnce({error: false, failed: false});

        const result = await parseAndHandleDeepLink(
            'https://kchat.infomaniakgroup.com/login/one_time_link?t=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        );

        expect(magicLinkLogin).toHaveBeenCalledWith(
            'kchat.infomaniakgroup.com',
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        );
        expect(result).toEqual({error: false});
    });
});
