// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {act, fireEvent} from '@testing-library/react-native';
import React from 'react';

import {Screens} from '@constants';
import {renderWithIntlAndTheme} from '@test/intl-test-helper';

import DraftInput from './draft_input';

// isAndroidEdgeToEdge is a module-level constant — mock the whole module
jest.mock('@constants/device', () => ({
    isAndroidEdgeToEdge: false,
    isEdgeToEdge: false,
}));

const mockStateContext = {
    postInputTranslateY: {value: 0},
};

jest.mock('@context/keyboard_state', () => ({
    useKeyboardState: jest.fn(() => ({
        inputRef: {current: null},
        blurAndDismissKeyboard: jest.fn(),
        stateContext: mockStateContext,
    })),
}));

jest.mock('@context/server', () => ({
    useServerUrl: jest.fn(() => 'https://server.test'),
}));

jest.mock('react-native-worklets', () => ({
    scheduleOnRN: jest.fn((fn: (...args: unknown[]) => void, ...args: unknown[]) => fn(...args)),
}));

// The jest environment does not run reanimated reactions (see plan), so capture the reaction
// processor/effect to drive them manually like the device would on each keyboard frame.
let mockCapturedReaction: {processor: () => number; effect: (value: number) => void} | undefined;

jest.mock('react-native-reanimated', () => {
    const actual = jest.requireActual('react-native-reanimated');
    return {
        ...actual,
        useAnimatedReaction: jest.fn((processor: () => number, effect: (value: number) => void) => {
            mockCapturedReaction = {processor, effect};
            return undefined;
        }),
    };
});

jest.mock('@actions/websocket/users', () => ({
    userTyping: jest.fn(),
}));

jest.mock('@screens/navigation', () => ({
    openAsBottomSheet: jest.fn(),
}));

jest.mock('@utils/post', () => ({
    persistentNotificationsConfirmation: jest.fn(),
}));

jest.mock('@agents/components/rewriting_indicator', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../typing', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('./header', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('./voice_input', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../post_input', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../uploads', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../quick_actions', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../send_button', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('../record_action', () => ({
    __esModule: true,
    default: () => null,
}));

describe('DraftInput keyboard anchor tracking', () => {
    const baseProps = {
        testID: 'draft_input',
        channelId: 'channel-id',
        channelType: 'O' as ChannelType,
        currentUserId: 'current-user-id',
        postPriority: {priority: ''} as PostPriority,
        updatePostPriority: jest.fn(),
        persistentNotificationInterval: 0,
        persistentNotificationMaxRecipients: 0,
        updatePostInputTop: jest.fn(),
        setIsFocused: jest.fn(),
        updateCursorPosition: jest.fn(),
        cursorPosition: 0,
        sendMessage: jest.fn(),
        canSend: true,
        maxMessageLength: 4000,
        files: [],
        value: '',
        uploadFileError: null,
        updateValue: jest.fn(),
        addFiles: jest.fn(),
        scheduledPostsEnabled: false,
        voiceMessageEnabled: false,
        location: Screens.CHANNEL,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedReaction = undefined;
        mockStateContext.postInputTranslateY = {value: 0};
        const deviceModule = require('@constants/device');
        deviceModule.isAndroidEdgeToEdge = false;
    });

    function renderAndLayout(updatePostInputTop: jest.Mock) {
        const {getByTestId} = renderWithIntlAndTheme(
            <DraftInput
                {...baseProps}
                updatePostInputTop={updatePostInputTop}
            />,
        );
        fireEvent(getByTestId('draft_input'), 'layout', {nativeEvent: {layout: {x: 0, y: 0, width: 1080, height: 90}}});
        return getByTestId;
    }

    it('should track the keyboard translation into postInputTop on Android edge-to-edge', () => {
        const deviceModule = require('@constants/device');
        deviceModule.isAndroidEdgeToEdge = true;
        mockStateContext.postInputTranslateY = {value: 300};

        const updatePostInputTop = baseProps.updatePostInputTop as jest.Mock;
        renderAndLayout(updatePostInputTop);

        // The keyboard anchor reaction is part of the rendered component
        expect(mockCapturedReaction).toBeDefined();

        // handleLayout must not push the bare height on Android edge-to-edge: the reaction is
        // the single source of truth, otherwise a layout change while the keyboard is open
        // would drop the open autocomplete behind the keyboard
        expect(updatePostInputTop).not.toHaveBeenCalled();

        // The reaction listens to the keyboard translation shared value
        expect(mockCapturedReaction!.processor()).toBe(300);

        // Each keyboard frame pushes layoutHeight + translateY + bottom inset to the anchor
        // (the test env SafeAreaProvider reports a bottom inset of 0)
        act(() => {
            mockCapturedReaction!.effect(300);
        });
        expect(updatePostInputTop).toHaveBeenLastCalledWith(90 + 300);

        // The translation is forwarded 1:1
        act(() => {
            mockCapturedReaction!.effect(350);
        });
        expect(updatePostInputTop).toHaveBeenLastCalledWith(90 + 350);
    });

    it('should keep the keyboard offset when the input height changes while the keyboard is open', () => {
        const deviceModule = require('@constants/device');
        deviceModule.isAndroidEdgeToEdge = true;
        mockStateContext.postInputTranslateY = {value: 300};

        const updatePostInputTop = baseProps.updatePostInputTop as jest.Mock;
        const {getByTestId} = renderWithIntlAndTheme(
            <DraftInput
                {...baseProps}
                updatePostInputTop={updatePostInputTop}
            />,
        );
        expect(mockCapturedReaction).toBeDefined();

        // First layout (initial height): the anchor only comes from the reaction
        fireEvent(getByTestId('draft_input'), 'layout', {nativeEvent: {layout: {x: 0, y: 0, width: 1080, height: 90}}});
        expect(updatePostInputTop).not.toHaveBeenCalledWith(90);
        act(() => {
            mockCapturedReaction!.effect(300);
        });
        expect(updatePostInputTop).toHaveBeenLastCalledWith(90 + 300);

        // Second layout while the keyboard is open (multiline growth): the bare height must
        // never reach the anchor, the composed position must use the new layout height
        fireEvent(getByTestId('draft_input'), 'layout', {nativeEvent: {layout: {x: 0, y: 0, width: 1080, height: 130}}});
        expect(updatePostInputTop).not.toHaveBeenCalledWith(130);
        act(() => {
            mockCapturedReaction!.effect(300);
        });
        expect(updatePostInputTop).toHaveBeenLastCalledWith(130 + 300);
    });

    it('should not compose the keyboard translation when not on Android edge-to-edge', () => {
        mockStateContext.postInputTranslateY = {value: 300};

        const updatePostInputTop = baseProps.updatePostInputTop as jest.Mock;
        renderAndLayout(updatePostInputTop);

        // The reaction exists (registered unconditionally), the gate must skip the composition
        expect(mockCapturedReaction).toBeDefined();
        expect(updatePostInputTop).toHaveBeenCalledWith(90);

        act(() => {
            mockCapturedReaction!.effect(300);
        });
        expect(updatePostInputTop).not.toHaveBeenCalledWith(90 + 300);
        expect(updatePostInputTop).toHaveBeenLastCalledWith(90);
    });
});
