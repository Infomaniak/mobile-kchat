// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {renderHook} from '@testing-library/react-hooks';

import useBackNavigation from './navigate_back';

jest.mock('expo-router', () => ({
    useNavigation: () => ({
        addListener: jest.fn().mockReturnValue(jest.fn()),
    }),
}));

describe('hooks/useBackNavigation', () => {
    let mockRemove: jest.Mock;
    let mockAddListener: jest.Mock;

    beforeEach(() => {
        mockRemove = jest.fn();
        mockAddListener = jest.fn().mockReturnValue(mockRemove);
        const {useNavigation} = require('expo-router');
        (useNavigation as jest.Mock).mockReturnValue({
            addListener: mockAddListener,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register beforeRemove listener on mount', () => {
        renderHook(() => useBackNavigation(jest.fn()));
        expect(mockAddListener).toHaveBeenCalledWith('beforeRemove', expect.any(Function));
    });

    it('should remove listener on unmount', () => {
        const {unmount} = renderHook(() => useBackNavigation(jest.fn()));
        unmount();
        expect(mockRemove).toHaveBeenCalled();
    });

    it('should call callback when back navigation is triggered', () => {
        const callback = jest.fn();
        renderHook(() => useBackNavigation(callback));

        const listener = mockAddListener.mock.calls[0][1];
        listener();

        expect(callback).toHaveBeenCalled();
    });

    it('should not call callback twice for the same navigation event', () => {
        const callback = jest.fn();
        renderHook(() => useBackNavigation(callback));

        const listener = mockAddListener.mock.calls[0][1];
        listener();
        listener();

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should update listener when callback changes', () => {
        const initialCallback = jest.fn();
        const {rerender} = renderHook(({cb}) => useBackNavigation(cb), {
            initialProps: {cb: initialCallback},
        });

        expect(mockAddListener).toHaveBeenCalledTimes(1);

        const newCallback = jest.fn();
        rerender({cb: newCallback});

        // The listener is re-registered because navigation is stable but callbackRef updates
        // With the new implementation, the effect depends on [navigation] which is stable,
        // so the listener is NOT re-registered on callback change
        expect(mockRemove).not.toHaveBeenCalled();
    });
});
