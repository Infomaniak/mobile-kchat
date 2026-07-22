// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DeviceEventEmitter} from 'react-native';

const NAVIGATION_BUTTON_PRESSED = 'navigation-button-pressed';

export function emitNavigationButtonPressed(buttonId: string, componentId?: string) {
    DeviceEventEmitter.emit(NAVIGATION_BUTTON_PRESSED, {buttonId, componentId});
}

export function addNavigationButtonPressedListener(callback: (event: {buttonId: string; componentId?: string}) => void) {
    return DeviceEventEmitter.addListener(NAVIGATION_BUTTON_PRESSED, callback);
}
