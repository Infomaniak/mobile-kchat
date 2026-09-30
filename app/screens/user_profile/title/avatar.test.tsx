// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {render} from '@testing-library/react-native';
import React from 'react';

import UserProfileAvatar from './avatar';

jest.mock('@context/server', () => ({
    useServerUrl: () => 'https://mattermost.example.com',
}));

jest.mock('@context/theme', () => ({
    useTheme: () => ({
        centerChannelColor: '#000000',
        centerChannelBg: '#ffffff',
    }),
}));

jest.mock('@managers/network_manager', () => ({
    getClient: () => ({
        getCurrentBearerToken: () => 'Bearer test-token',
    }),
}));

jest.mock('@components/expo_image', () => {
    const {View} = require('react-native');
    const MockReact = require('react');
    return {
        ExpoImageAnimated: MockReact.forwardRef((props: any, ref: any) => (
            <View
                {...props}
                ref={ref}
                testID='expo-image-animated'
            />
        )),
    };
});

jest.mock('react-native-color-matrix-image-filters', () => ({
    Grayscale: ({children}: {children: unknown}) => children,
}));

jest.mock('@utils/user', () => ({
    getLastPictureUpdate: () => 12345,
}));

jest.mock('@utils/security', () => ({
    urlSafeBase64Encode: () => 'aGVsbG8=',
}));

jest.mock('@components/profile_picture', () => {
    const {View} = require('react-native');
    return function MockProfilePicture(props: any) {
        return (
            <View
                {...props}
                testID='profile-picture'
            />
        );
    };
});

jest.mock('@components/compass_icon', () => {
    const {View} = require('react-native');
    return function MockCompassIcon(props: any) {
        return (
            <View
                testID='compass-icon'
                {...props}
            />
        );
    };
});

describe('UserProfileAvatar', () => {
    const fakeUser = {
        id: 'user-1',
        isBot: false,
    } as any;

    it('should NOT attach Authorization header for external userIconOverride', () => {
        const {getByTestId} = render(
            <UserProfileAvatar
                enablePostIconOverride={true}
                user={fakeUser}
                userIconOverride='https://evil.example.com/canary.png'
            />,
        );

        const image = getByTestId('expo-image-animated');
        const source = image.props.source;

        expect(source.uri).toBe('https://evil.example.com/canary.png');
        expect(source.headers?.Authorization).toBeUndefined();
    });

    it('should attach Authorization header for internal userIconOverride', () => {
        const {getByTestId} = render(
            <UserProfileAvatar
                enablePostIconOverride={true}
                user={fakeUser}
                userIconOverride='/api/v4/users/x/image'
            />,
        );

        const image = getByTestId('expo-image-animated');
        const source = image.props.source;

        expect(source.uri).toBe('https://mattermost.example.com/api/v4/users/x/image');
        expect(source.headers?.Authorization).toBe('Bearer test-token');
    });

    it('should render ProfilePicture when enablePostIconOverride is false', () => {
        const {getByTestId, queryByTestId} = render(
            <UserProfileAvatar
                enablePostIconOverride={false}
                user={fakeUser}
                userIconOverride='https://evil.example.com/canary.png'
            />,
        );

        expect(getByTestId('profile-picture')).toBeTruthy();
        expect(queryByTestId('expo-image-animated')).toBeFalsy();
    });
});

