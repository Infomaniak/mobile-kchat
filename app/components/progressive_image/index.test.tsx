// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {render} from '@testing-library/react-native';
import React from 'react';

import {Preferences} from '@constants';

import ProgressiveImage from './index';

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
        getCurrentBearerToken: () => 'Bearer test-token',
    }),
}));

jest.mock('@components/expo_image', () => {
    const {View} = require('react-native');
    const MockReact = require('react');
    return {
        __esModule: true,
        default: MockReact.forwardRef((props: any, ref: any) => (
            <View
                {...props}
                ref={ref}
                testID='progressive_image.expo_image'
            />
        )),
        ExpoImage: MockReact.forwardRef((props: any, ref: any) => (
            <View
                {...props}
                ref={ref}
                testID='progressive_image.expo_image'
            />
        )),
        ExpoImageAnimated: MockReact.forwardRef((props: any, ref: any) => (
            <View
                {...props}
                ref={ref}
                testID='expo-image-animated'
            />
        )),
        ExpoImageBackground: MockReact.forwardRef((props: any, ref: any) => (
            <View
                {...props}
                ref={ref}
                testID='expo-image-background'
            />
        )),
    };
});

const mockOnError = jest.fn();

const mockTheme = {...Preferences.THEMES.denim};

function renderProgressiveImage(props: any = {}) {
    return render(
        <ProgressiveImage
            id='test-id'
            onError={mockOnError}
            theme={mockTheme}
            {...props}
        />,
    );
}

describe('ProgressiveImage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not attach Authorization header for external imageUri', () => {
        const {getByTestId} = renderProgressiveImage({
            imageUri: 'https://evil.example.com/i.png',
            inViewPort: true,
        });

        const image = getByTestId('progressive_image.expo_image');
        const source = image.props.source;

        expect(source).toBeDefined();
        expect(source.uri).toBe('https://evil.example.com/i.png');
        expect(source).not.toHaveProperty('headers');
    });

    it('should attach Authorization header for internal imageUri', () => {
        const {getByTestId} = renderProgressiveImage({
            imageUri: '/api/v4/files/x',
            inViewPort: true,
        });

        const image = getByTestId('progressive_image.expo_image');
        const source = image.props.source;

        expect(source).toBeDefined();
        expect(source.uri).toBe('https://server.test/api/v4/files/x');
        expect(source.headers).toBeDefined();
        expect(source.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not attach Authorization header in placeholder for external thumbnailUri', () => {
        const {getByTestId} = renderProgressiveImage({
            imageUri: 'https://evil.example.com/i.png',
            thumbnailUri: 'https://evil.example.com/t.png',
            inViewPort: true,
        });

        const image = getByTestId('progressive_image.expo_image');
        const placeholder = image.props.placeholder;

        expect(placeholder).toBeDefined();
        expect(placeholder.uri).toBe('https://evil.example.com/t.png');
        expect(placeholder).not.toHaveProperty('headers');
    });
});

