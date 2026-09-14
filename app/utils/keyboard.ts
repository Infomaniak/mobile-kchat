// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Keyboard} from 'react-native';
import {KeyboardController} from 'react-native-keyboard-controller';

import {isEdgeToEdge} from '@constants/device';

/**
 * Dismisses the keyboard using platform-specific implementation.
 * - Edge-to-edge: Uses KeyboardController.dismiss() which provides better control
 * - Non-edge-to-edge: Uses React Native's Keyboard.dismiss() with a delay
 */
export const dismissKeyboard = async (): Promise<void> => {
    if (isEdgeToEdge) {
        await KeyboardController.dismiss({animated: false});
    } else {
        Keyboard.dismiss();
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
};

/**
 * Checks if the keyboard is currently visible.
 * - Edge-to-edge: Uses KeyboardController.isVisible() for accurate keyboard state
 * - Non-edge-to-edge: Uses React Native's Keyboard.isVisible()
 */
export const isKeyboardVisible = (): boolean => {
    if (isEdgeToEdge) {
        return KeyboardController.isVisible();
    }
    return Keyboard.isVisible();
};
