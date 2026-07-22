// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {renderHook} from '@testing-library/react-hooks';

import {emitNavigationButtonPressed} from '@screens/navigation_button_events';

import useBackNavigation from './navigate_back';

describe('hooks/useBackNavigation', () => {
    it('should call callback when back button is pressed', () => {
        const callback = jest.fn();
        renderHook(() => useBackNavigation(callback));

        emitNavigationButtonPressed('RNN.back');

        expect(callback).toHaveBeenCalled();
    });

    it('should not call callback when different button is pressed', () => {
        const callback = jest.fn();
        renderHook(() => useBackNavigation(callback));

        emitNavigationButtonPressed('other.button');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should remove listener on unmount', () => {
        const callback = jest.fn();
        const {unmount} = renderHook(() => useBackNavigation(callback));

        unmount();
        emitNavigationButtonPressed('RNN.back');

        expect(callback).not.toHaveBeenCalled();
    });
});
