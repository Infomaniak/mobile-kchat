// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {renderWithIntl} from '@test/intl-test-helper';

import InfomaniakNoTeams from './';

jest.mock('@managers/network_manager');
jest.mock('@managers/websocket_manager');
jest.mock('@init/credentials');

describe('InfomaniakNoTeams', () => {
    it('should render without a server database', () => {
        const {getByText} = renderWithIntl(<InfomaniakNoTeams/>);

        expect(getByText('You have no kChat, discover it with kSuite')).toBeTruthy();
        expect(getByText('Discover kSuite')).toBeTruthy();
        expect(getByText('Log out')).toBeTruthy();
    });
});
