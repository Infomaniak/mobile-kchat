// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {renderHook} from '@testing-library/react-hooks';

import {emitNavigationButtonPressed} from '@screens/navigation_button_events';

import useNavButtonPressed from './navigation_button_pressed';

describe('hooks/useNavButtonPressed', () => {
    const componentId = 'test-component-id';
    const buttonId = 'test-button-id';

    it('should call callback when matching button is pressed', () => {
        const callback = jest.fn();
        renderHook(() => useNavButtonPressed(buttonId, componentId, callback));

        emitNavigationButtonPressed(buttonId, componentId);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should call callback when matching button is pressed without component id', () => {
        const callback = jest.fn();
        renderHook(() => useNavButtonPressed(buttonId, componentId, callback));

        emitNavigationButtonPressed(buttonId);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call callback when different button is pressed', () => {
        const callback = jest.fn();
        renderHook(() => useNavButtonPressed(buttonId, componentId, callback));

        emitNavigationButtonPressed('different-button', componentId);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should unsubscribe listener on unmount', () => {
        const callback = jest.fn();
        const {unmount} = renderHook(() => useNavButtonPressed(buttonId, componentId, callback));

        unmount();
        emitNavigationButtonPressed(buttonId, componentId);

        expect(callback).not.toHaveBeenCalled();
    });
});
