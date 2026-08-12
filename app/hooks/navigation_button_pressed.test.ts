// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {renderHook} from '@testing-library/react-hooks';

import useNavButtonPressed from './navigation_button_pressed';

const mockAddListener = jest.fn();
const mockNavigation = {
    addListener: mockAddListener,
};

jest.mock('expo-router', () => ({
    useNavigation: jest.fn(() => mockNavigation),
}));

describe('hooks/useNavButtonPressed', () => {
    const componentId = 'test-component-id';
    const buttonId = 'test-button-id';
    let callback: jest.Mock;
    let unsubscribeMock: jest.Mock;

    beforeEach(() => {
        callback = jest.fn();
        unsubscribeMock = jest.fn();
        mockAddListener.mockReturnValue(unsubscribeMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register beforeRemove listener', () => {
        renderHook(() => useNavButtonPressed(buttonId, componentId, callback));

        expect(mockAddListener).toHaveBeenCalledWith('beforeRemove', expect.any(Function));
    });

    it('should call callback when beforeRemove fires', () => {
        renderHook(() => useNavButtonPressed(buttonId, componentId, callback));

        const listener = mockAddListener.mock.calls[0][1];
        listener();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe listener on unmount', () => {
        const {unmount} = renderHook(() => useNavButtonPressed(buttonId, componentId, callback));

        unmount();

        expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });

    it('should re-register listener when deps change', () => {
        const {rerender} = renderHook(
            ({dep}) => useNavButtonPressed(buttonId, componentId, callback, [dep]),
            {initialProps: {dep: 1}},
        );

        rerender({dep: 2});

        expect(mockAddListener).toHaveBeenCalledTimes(2);
        expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });
});
