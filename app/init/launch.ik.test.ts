// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Linking} from 'react-native';

import {DeepLink, Launch} from '@constants';
import {initialLaunch} from '@init/launch';
import {resetToInfomaniakLogin} from '@screens/navigation';
import {getLaunchPropsFromDeepLink} from '@utils/deep_link';

import type {LaunchProps} from '@typings/launch';

jest.mock('@utils/deep_link', () => ({
    getLaunchPropsFromDeepLink: jest.fn(),
}));

jest.mock('@screens/navigation', () => ({
    resetToHome: jest.fn(),
    resetToInfomaniakLogin: jest.fn(),
    resetToInfomaniakNoTeams: jest.fn(),
    resetToOnboarding: jest.fn(),
}));

jest.mock('@database/manager', () => ({
    getActiveServerUrl: jest.fn(),
    searchUrl: jest.fn(),
    serverDatabases: {},
    getServerDatabaseAndOperator: jest.fn(),
}));

jest.mock('@init/credentials', () => ({
    getActiveServerUrl: jest.fn(),
    getServerCredentials: jest.fn(),
}));

jest.mock('@queries/app/global', () => ({
    getOnboardingViewed: jest.fn(),
}));

jest.mock('@assets/config.json', () => ({
    ShowOnboarding: false,
}));

describe('Launch - Infomaniak Specific Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle deep link launch', async () => {
        const deepLinkUrl = 'infomaniak://server-1.com';
        const launchProps = {
            launchType: Launch.DeepLink,
            serverUrl: 'server-1.com',
            extra: {data: {serverUrl: 'server-1.com'}, type: DeepLink.Server},
        } as LaunchProps;

        jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(deepLinkUrl);
        jest.mocked(getLaunchPropsFromDeepLink).mockReturnValue(launchProps);
        jest.mocked(resetToInfomaniakLogin).mockResolvedValue('');

        await initialLaunch();

        expect(Linking.getInitialURL).toHaveBeenCalled();
        expect(getLaunchPropsFromDeepLink).toHaveBeenCalledWith(deepLinkUrl, true);
        expect(resetToInfomaniakLogin).toHaveBeenCalledWith(launchProps);
    });

});
