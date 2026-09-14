// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {renderHook} from '@testing-library/react-hooks';

import useBackNavigation from './navigate_back';

const mockAddListener = jest.fn();
const mockNavigation = {
    addListener: mockAddListener,
};

jest.mock('expo-router', () => ({
    useNavigation: jest.fn(() => mockNavigation),
}));

describe('hooks/useBackNavigation', () => {
    let mockRemoveListener: jest.Mock;

    beforeEach(() => {
        mockRemoveListener = jest.fn();
        mockAddListener.mockReturnValue(mockRemoveListener);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register beforeRemove listener on mount', () => {
        renderHook(() => useBackNavigation(jest.fn()));

        expect(mockAddListener).toHaveBeenCalledWith('beforeRemove', expect.any(Function));
        expect(mockAddListener).toHaveBeenCalledTimes(1);
    });

    it('should remove listener on unmount', () => {
        const {unmount} = renderHook(() => useBackNavigation(jest.fn()));

        unmount();

        expect(mockRemoveListener).toHaveBeenCalled();
    });

    it('should call callback when beforeRemove event fires', () => {
        const callback = jest.fn();
        renderHook(() => useBackNavigation(callback));

        const listener = mockAddListener.mock.calls[0][1];
        listener();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call callback twice for the same navigation event', () => {
        const callback = jest.fn();
        renderHook(() => useBackNavigation(callback));

        const listener = mockAddListener.mock.calls[0][1];
        listener();
        listener();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should use latest callback without re-registering listener', () => {
        const initialCallback = jest.fn();
        const {rerender} = renderHook(({cb}) => useBackNavigation(cb), {
            initialProps: {cb: initialCallback},
        });

        expect(mockAddListener).toHaveBeenCalledTimes(1);

        const newCallback = jest.fn();
        rerender({cb: newCallback});

        expect(mockAddListener).toHaveBeenCalledTimes(1);
        expect(mockRemoveListener).not.toHaveBeenCalled();

        const listener = mockAddListener.mock.calls[0][1];
        listener();

        expect(initialCallback).not.toHaveBeenCalled();
        expect(newCallback).toHaveBeenCalledTimes(1);
    });
});
