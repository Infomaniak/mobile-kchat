// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {render} from '@testing-library/react-native';
import React from 'react';

import ExpoImage from './index';

jest.mock('expo-image', () => {
    const {View} = require('react-native');
    const MockReact = require('react');
    return {
        __esModule: true,
        Image: MockReact.forwardRef((props: any, ref: any) => (
            <View
                {...props}
                ref={ref}
                testID='expo-image'
            />
        )),
        ImageBackground: MockReact.forwardRef((props: any, ref: any) => (
            <View
                {...props}
                ref={ref}
                testID='expo-image-background'
            />
        )),
    };
});

jest.mock('@context/server', () => ({
    useServerUrl: () => 'https://server.test',
}));

jest.mock('@managers/network_manager', () => ({
    __esModule: true,
    default: {
        getClient: () => ({
            getRequestHeaders: () => ({
                Authorization: 'Bearer server-default',
                'Content-Type': 'application/json',
            }),
        }),
    },
}));

jest.mock('@utils/security', () => ({
    urlSafeBase64Encode: () => 'encoded-server-url',
}));

describe('ExpoImage', () => {
    it('case A: external source uri with caller Authorization header strips Authorization', () => {
        const {getByTestId} = render(
            <ExpoImage
                id='test-id'
                source={{
                    uri: 'https://evil.example.com/image.png',
                    headers: {Authorization: 'Bearer caller-token', 'X-Custom': 'value'},
                }}
            />,
        );
        const image = getByTestId('expo-image');
        expect(image.props.source.headers).toBeDefined();
        expect(image.props.source.headers.Authorization).toBeUndefined();
        expect(image.props.source.headers['X-Custom']).toBe('value');
    });

    it('case A-placeholder: external placeholder uri with caller Authorization header strips Authorization', () => {
        const {getByTestId} = render(
            <ExpoImage
                id='test-id'
                source={{uri: 'https://server.test/api/v4/files/x'}}
                placeholder={{
                    uri: 'https://evil.example.com/thumb.png',
                    headers: {Authorization: 'Bearer caller-token', 'X-Custom': 'value'},
                }}
            />,
        );
        const image = getByTestId('expo-image');
        expect(image.props.placeholder.headers).toBeDefined();
        expect(image.props.placeholder.headers.Authorization).toBeUndefined();
        expect(image.props.placeholder.headers['X-Custom']).toBe('value');
    });

    it('case B: same-origin /api/v4/ source uri merges requestHeaders', () => {
        const {getByTestId} = render(
            <ExpoImage
                id='test-id'
                source={{uri: 'https://server.test/api/v4/users/me/image'}}
            />,
        );
        const image = getByTestId('expo-image');
        expect(image.props.source.headers).toBeDefined();
        expect(image.props.source.headers.Authorization).toBe('Bearer server-default');
        expect(image.props.source.headers['Content-Type']).toBe('application/json');
    });

    it('case C: external source uri with no caller headers has undefined headers', () => {
        const {getByTestId} = render(
            <ExpoImage
                id='test-id'
                source={{uri: 'https://evil.example.com/image.png'}}
            />,
        );
        const image = getByTestId('expo-image');
        expect(image.props.source.headers).toBeUndefined();
    });
});
