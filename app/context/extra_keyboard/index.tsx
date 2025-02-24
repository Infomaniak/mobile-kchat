// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {Keyboard, Platform, AccessibilityInfo} from 'react-native';
import Animated, {KeyboardState, useAnimatedKeyboard, useAnimatedStyle, useDerivedValue, withTiming} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Screens} from '@constants';
import {useIsTablet} from '@hooks/device';
import NavigationStore from '@store/navigation_store';
import {preventDoubleTap} from '@utils/tap';

import type {AvailableScreens} from '@typings/screens/navigation';

export type ExtraKeyboardContextProps = {
    isExtraKeyboardVisible: boolean;
    component: React.ReactElement|null;
    showExtraKeyboard: (component: React.ReactElement|null) => void;
    hideExtraKeyboard: () => void;
    registerTextInputFocus: () => void;
    registerTextInputBlur: () => void;
    crossFadeIsEnabled: boolean;
    defaultKeyboardHeight: number;
};

// This is based on the size of the tab bar
const KEYBOARD_OFFSET = -77;

let DEFAULT_KEYBOARD_HEIGHT = 0;

export const ExtraKeyboardContext = createContext<ExtraKeyboardContextProps|undefined>(undefined);

const useOffetForCurrentScreen = (): number => {
    const [screen, setScreen] = useState<AvailableScreens|undefined>();
    const [offset, setOffset] = useState(0);
    const isTablet = useIsTablet();

    useEffect(() => {
        const sub = NavigationStore.getSubject();
        const s = sub.subscribe(setScreen);

        return () => s.unsubscribe();
    }, []);

    useEffect(() => {
        if (isTablet && screen === Screens.HOME) {
            setOffset(KEYBOARD_OFFSET);
        }
    }, [isTablet, screen]);

    return offset;
};

export const ExtraKeyboardProvider = (({children}: {children: React.ReactElement|React.ReactElement[]}) => {
    const [isExtraKeyboardVisible, setExtraKeyboardVisible] = useState(false);
    const [component, setComponent] = useState<React.ReactElement|null>(null);
    const [isTextInputFocused, setIsTextInputFocused] = useState(false);
    const [crossFadeIsEnabled, setCrossFade] = useState(false);

    // IK: Fix: To prevent blank screen when Cross-Fade is on,
    // Saving react-native retrieve keyboard size
    const [defaultKeyboardHeight, setHeight] = useState(DEFAULT_KEYBOARD_HEIGHT);

    const updateHeight = useCallback(() => {
        try {
            const height = Keyboard.metrics()?.height;
            setHeight((prev) => {
                if (height && prev !== height) {
                    DEFAULT_KEYBOARD_HEIGHT = height;
                    return height;
                }
                return prev;
            });
            return undefined;
        } catch {
            return undefined;
        }
    }, []);

    useEffect(() => {
        const subscription = Keyboard.addListener('keyboardDidShow', updateHeight);
        return () => subscription.remove();
    }, [Keyboard.metrics(), Keyboard, updateHeight]);

    useEffect(() => {
        AccessibilityInfo.prefersCrossFadeTransitions().then(setCrossFade);
    }, []);

    const showExtraKeyboard = useCallback((newComponent: React.ReactElement|null) => {
        setExtraKeyboardVisible(true);
        setComponent(newComponent);
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
        }
    }, []);

    const hideExtraKeyboard = useCallback(() => {
        setExtraKeyboardVisible(false);
        setComponent(null);
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
        }
    }, []);

    const registerTextInputFocus = useCallback(() => {
        // If the extra keyboard is opened if we don't do this
        // we get a glitch in the UI that will animate the extra keyboard down
        // and immediately bring the keyboard, by doing this
        // we delay hidding the extra keyboard, so that there is no animation glitch
        setIsTextInputFocused(true);
        setTimeout(() => {
            setExtraKeyboardVisible(false);
        }, 400);
    }, []);

    const registerTextInputBlur = useCallback(() => {
        setIsTextInputFocused(false);
    }, []);

    useEffect(() => {
        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
            if (isTextInputFocused) {
                setExtraKeyboardVisible(false);
            }
        });

        return () => keyboardHideListener.remove();
    }, [isTextInputFocused]);

    return (
        <ExtraKeyboardContext.Provider
            value={{
                isExtraKeyboardVisible,
                component,
                showExtraKeyboard,
                hideExtraKeyboard,
                registerTextInputBlur,
                registerTextInputFocus,
                crossFadeIsEnabled,
                defaultKeyboardHeight,
            }}
        >
            {children}
        </ExtraKeyboardContext.Provider>
    );
});

export const useExtraKeyboardContext = (): ExtraKeyboardContextProps|undefined => {
    const context = useContext(ExtraKeyboardContext);
    if (!context) {
        throw new Error('useExtraKeyboardContext must be used within a ExtraKeyboardProvider');
    }
    return context;
};

export const useHideExtraKeyboardIfNeeded = (callback: (...args: any) => void, dependencies: React.DependencyList = []) => {
    const keyboardContext = useExtraKeyboardContext();

    return useCallback(preventDoubleTap((...args: any) => {
        if (keyboardContext?.isExtraKeyboardVisible) {
            keyboardContext.hideExtraKeyboard();

            /*
            /* At this point the early return is commented
            /* Based on the UX we actually want to have
            /* we can uncoment this and reaturn as early
            /* as the custom keyboard is hidden
            */
            // return;
        }

        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
        }

        callback(...args);
    }), [keyboardContext, ...dependencies]);
};

export const ExtraKeyboard = () => {
    const keyb = useAnimatedKeyboard({isStatusBarTranslucentAndroid: true});
    const defaultKeyboardHeight = DEFAULT_KEYBOARD_HEIGHT || Platform.select({ios: 291, default: 240});
    const context = useExtraKeyboardContext();
    const insets = useSafeAreaInsets();
    const offset = useOffetForCurrentScreen();

    const maxKeyboardHeight = useDerivedValue(() => {
        if (keyb.state.value === KeyboardState.OPEN) {
            const keyboardOffset = keyb.height.value < 70 ? 0 : offset; // When using a hw keyboard
            return keyb.height.value + keyboardOffset;
        }

        return defaultKeyboardHeight;
    });

    const animatedStyle = useAnimatedStyle(() => {
        let height = keyb.height.value + offset;
        if (keyb.height.value < 70) {
            height = 0; // When using a hw keyboard
        }
        if (context?.isExtraKeyboardVisible) {
            height = withTiming(maxKeyboardHeight.value, {duration: 250});
        } else if (keyb.state.value === KeyboardState.CLOSED || keyb.state.value === KeyboardState.UNKNOWN) {
            height = withTiming(0, {duration: 250});
        }

        // IK: If keyboard height calculated by react-native-reanimated
        // is higher than what react-native got,
        // It is highly a bug when in crossFade mode
        // Resetting keyboard and closing it:
        if (context?.crossFadeIsEnabled && context?.defaultKeyboardHeight) {
            if (keyb.height.value > context?.defaultKeyboardHeight && keyb.state.value === KeyboardState.OPEN) {
                height = withTiming(0, {duration: 250});
                keyb.state.value = KeyboardState.CLOSED;
            }
        }

        return {
            height,
            marginBottom: withTiming((keyb.state.value === KeyboardState.CLOSED || keyb.state.value === KeyboardState.CLOSING || keyb.state.value === KeyboardState.UNKNOWN) ? insets.bottom : 0, {duration: 250}),
        };
    }, [context, insets.bottom, offset]);

    return (
        <Animated.View style={animatedStyle}>
            {context?.isExtraKeyboardVisible && context.component}
        </Animated.View>
    );
};
