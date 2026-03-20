// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {render} from '@testing-library/react-native';

import Image from './image';

jest.mock('@context/server', () => ({
    useServerUrl: () => 'https://server.test',
}));

jest.mock('@context/theme', () => ({
    useTheme: () => ({
        centerChannelColor: '#000000',
        centerChannelBg: '#ffffff',
    }),
}));

jest.mock('@managers/network_manager', () => ({
    getClient: () => ({
        getProfilePictureUrl: (id: string, lastUpdate: number) => `/api/v4/users/${id}/image?_=${lastUpdate}`,
        getCurrentBearerToken: () => 'Bearer test-token',
    }),
}));

jest.mock('@components/expo_image', () => {
    const {View} = require('react-native');
    const MockReact = require('react');
    return {
        ExpoImageAnimated: MockReact.forwardRef((props: any, ref: any) => (
            <View {...props} ref={ref} testID='expo-image-animated'/>
        )),
    };
});

jest.mock('react-native-color-matrix-image-filters', () => ({
    Grayscale: ({children}: {children: unknown}) => children,
}));

jest.mock('@utils/user', () => ({
    getLastPictureUpdate: () => 12345,
}));

describe('ProfilePicture Image', () => {
    const author = {
        id: 'user-1',
        isBot: true,
    } as any;

    it('should not have backgroundColor on the image style to avoid white circle behind transparent GIFs', () => {
        const {getByTestId} = render(
            <Image
                author={author}
                size={32}
            />,
        );

        const image = getByTestId('expo-image-animated');
        const flatStyle = image.props.style;

        expect(flatStyle).not.toHaveProperty('backgroundColor');
        expect(flatStyle).toMatchObject({
            borderRadius: 16,
            height: 32,
            width: 32,
        });
    });
});
