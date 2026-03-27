// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ComponentProps} from 'react';

import {renderWithIntlAndTheme} from '@test/intl-test-helper';

import OptionItem from './index';

jest.mock('./option_icon', () => {
    const {createElement} = require('react');
    return {
        __esModule: true,
        default: (props: Record<string, unknown>) => createElement('OptionIcon', {...props, testID: 'option-icon'}),
    };
});

jest.mock('./radio_item', () => {
    const {createElement} = require('react');
    return {
        __esModule: true,
        default: (props: Record<string, unknown>) => createElement('RadioItem', props),
    };
});

function getBaseProps(): ComponentProps<typeof OptionItem> {
    return {
        label: 'Test Option',
        type: 'default',
        testID: 'option-item',
    };
}

describe('OptionItem - IK custom props', () => {
    it('should render rightComponent in the action area', () => {
        const {Text} = require('react-native');
        const props = getBaseProps();

        const {getByTestId} = renderWithIntlAndTheme(
            <OptionItem
                {...props}
                // eslint-disable-next-line react/jsx-no-literals
                rightComponent={<Text testID='right-component'>Custom</Text>}
            />,
        );

        expect(getByTestId('right-component')).toBeTruthy();
    });

    it('should not render action area when no rightComponent, no action, and no info', () => {
        const props = getBaseProps();
        props.type = 'none';

        const {queryByTestId} = renderWithIntlAndTheme(
            <OptionItem {...props}/>,
        );

        // The action container should not be rendered
        const container = queryByTestId('option-item');
        expect(container).toBeTruthy();
        expect(container?.children).toBeTruthy();
    });

    it('should use labelNumberOfLines for label text', () => {
        const props = getBaseProps();
        props.labelNumberOfLines = 3;

        const {getByText} = renderWithIntlAndTheme(
            <OptionItem {...props}/>,
        );

        const label = getByText('Test Option');
        expect(label.props.numberOfLines).toBe(3);
    });

    it('should default labelNumberOfLines to 2', () => {
        const props = getBaseProps();

        const {getByText} = renderWithIntlAndTheme(
            <OptionItem {...props}/>,
        );

        const label = getByText('Test Option');
        expect(label.props.numberOfLines).toBe(2);
    });
});
