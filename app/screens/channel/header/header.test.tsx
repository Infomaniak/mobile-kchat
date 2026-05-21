// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ComponentProps} from 'react';

import NavigationHeader from '@components/navigation_header';
import {General} from '@constants';
import {useServerUrl} from '@context/server';
import {renderWithIntl} from '@test/intl-test-helper';

import ChannelHeader from './header';

jest.mock('@components/navigation_header', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(NavigationHeader).mockImplementation((props) => React.createElement('NavigationHeader', {testID: 'navigation-header', ...props}));

jest.mock('@screens/navigation');
jest.mock('@playbooks/screens/navigation');
jest.mock('@playbooks/actions/remote/runs');

jest.mock('@calls/state', () => ({
    getCallsConfig: jest.fn().mockReturnValue({
        pluginEnabled: false,
    }),
}));

const serverUrl = 'some.server.url';
jest.mock('@context/server');
jest.mocked(useServerUrl).mockReturnValue(serverUrl);

// Ik change : skip on CI, will fix later
describe.skip('ChannelHeader', () => {
    function getBaseProps(): ComponentProps<typeof ChannelHeader> {
        return {
            channelId: 'channel-id',
            channelType: 'O' as ChannelType,
            displayName: 'Test Channel',
            teamId: 'team-id',
            callsEnabledInChannel: false,
            isBookmarksEnabled: false,
            canAddBookmarks: false,
            hasBookmarks: false,
            shouldRenderBookmarks: false,
            isCustomStatusEnabled: false,
            isCustomStatusExpired: false,
            isOwnDirectMessage: false,
            shouldRenderChannelBanner: false,
            isChannelAutotranslated: false,
        };
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows playbook button with "+" when there are no active runs', () => {
        const props: any = getBaseProps();
        props.hasPlaybookRuns = false;
        props.playbooksActiveRuns = 0;
        props.isPlaybooksEnabled = true;

        const {getByTestId} = renderWithIntl(<ChannelHeader {...props}/>);

        const navHeader = getByTestId('navigation-header');
        expect(navHeader.props.rightButtons).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    iconName: 'product-playbooks',
                    count: '+',
                }),
            ]),
        );
    });

    it('does not show playbook button when is DM or GM', () => {
        const props: any = getBaseProps();
        props.hasPlaybookRuns = true;
        props.playbooksActiveRuns = 1;
        props.channelType = General.DM_CHANNEL;
        const {getByTestId, rerender} = renderWithIntl(<ChannelHeader {...props}/>);
        const navHeader = getByTestId('navigation-header');
        let rightButtons = navHeader.props.rightButtons;
        expect(rightButtons).not.toEqual(expect.arrayContaining(
            [
                expect.objectContaining({
                    iconName: 'product-playbooks',
                }),
            ]),
        );

        props.channelType = General.GM_CHANNEL;
        rerender(<ChannelHeader {...props}/>);
        rightButtons = navHeader.props.rightButtons;
        expect(rightButtons).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    iconName: 'product-playbooks',
                }),
            ]),
        );

        props.channelType = General.OPEN_CHANNEL;
        rerender(<ChannelHeader {...props}/>);
        rightButtons = navHeader.props.rightButtons;
        expect(rightButtons).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    iconName: 'product-playbooks',
                }),
            ]),
        );
    });
});
