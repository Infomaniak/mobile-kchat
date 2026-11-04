// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {renderWithIntlAndTheme} from '@test/intl-test-helper';

import Emoji from './emoji';

jest.mock('@nozbe/watermelondb/react', () => ({
    withDatabase: jest.fn((Component) => Component),
    withObservables: jest.fn((_, observableMapper) => {
        // eslint-disable-next-line react/display-name
        return (Component: any) => (props: any) => {
            const observables = observableMapper(props);
            const mockedProps: Record<string, any> = {};
            // eslint-disable-next-line guard-for-in
            for (const key in observables) {
                observables[key].subscribe((value: any) => {
                    mockedProps[key] = value;
                });
            }
            return (
                <Component
                    {...props}
                    {...mockedProps}
                />
            );
        };
    }),
}));

jest.mock('@actions/remote/custom_emoji', () => ({
    fetchCustomEmojiInBatch: jest.fn(),
}));

jest.mock('@queries/servers/custom_emoji', () => ({
    queryCustomEmojisByName: jest.fn(),
}));

jest.mock('@queries/servers/system', () => ({
    observeConfigBooleanValue: jest.fn(),
}));

jest.mock('@managers/network_manager', () => ({
    __esModule: true,
    default: {getClient: jest.fn()},
}));

describe('Emoji component', () => {
    it('should render text-presentation-default emojis with the emoji presentation selector (VS16)', () => {
        const {getByTestId} = renderWithIntlAndTheme(
            <Emoji
                emojiName='information_source'
                testID='emoji'
                size={24}
            />,
        );

        expect(getByTestId('emoji').props.children).toBe('\u2139\uFE0F');
    });

    it('should render heart with the emoji presentation selector (VS16)', () => {
        const {getByTestId} = renderWithIntlAndTheme(
            <Emoji
                emojiName='heart'
                testID='emoji'
                size={24}
            />,
        );

        expect(getByTestId('emoji').props.children).toBe('\u2764\uFE0F');
    });

    it('should not change emojis with a default emoji presentation', () => {
        const {getByTestId} = renderWithIntlAndTheme(
            <Emoji
                emojiName='grinning'
                testID='emoji'
                size={24}
            />,
        );

        expect(getByTestId('emoji').props.children).toBe('\u{1F600}');
    });
});
