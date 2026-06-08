// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import CompassIcon from '@components/compass_icon';
import {renderWithIntlAndTheme} from '@test/intl-test-helper';
import TestHelper from '@test/test_helper';

import Header from './header';

jest.mock('@components/compass_icon', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mocked(CompassIcon).mockImplementation(
    (props) => React.createElement('CompassIcon', {testID: `compass-icon${props.name ? '-' + props.name : ''}`, ...props}) as any,
);

describe('Header', () => {
    const currentUser = TestHelper.fakeUserModel();

    const defaultProps = {
        commentCount: 0,
        enablePostUsernameOverride: false,
        isAutoResponse: false,
        isCustomStatusEnabled: false,
        isEphemeral: false,
        isMilitaryTime: false,
        isPendingOrFailed: false,
        isSystemPost: false,
        isWebHook: false,
        location: 'About' as const,
        showPostPriority: false,
        teammateNameDisplay: '',
        hideGuestTags: false,
        currentUser,
        isChannelAutotranslated: false,
        files: [],
    };

    it('Should render header for a regular post', () => {
        const post = TestHelper.fakePostModel({
            userId: currentUser.id,
        });

        const {toJSON} = renderWithIntlAndTheme(
            <Header
                {...defaultProps}
                post={post}
            />,
        );

        expect(toJSON()).toBeDefined();
    });
});
