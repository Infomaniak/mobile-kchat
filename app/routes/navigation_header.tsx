// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {router} from 'expo-router';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Pressable, Text, View, type ImageSourcePropType} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import CompassIcon from '@components/compass_icon';
import {Screens} from '@constants';
import {MODAL_SCREENS_WITHOUT_BACK, SCREENS_AS_BOTTOM_SHEET} from '@constants/screens';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {usePreventDoubleTap} from '@hooks/utils';
import {emitNavigationButtonPressed} from '@screens/navigation_button_events';
import NavigationHeaderStore, {type NavigationHeaderState} from '@store/navigation_header_store';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {AvailableScreens, NavigationButton} from '@typings/screens/navigation';

type Props = {
    screenName: AvailableScreens;
}

type ButtonProps = {
    button: NavigationButton;
    color: string;
    onButtonPress: (buttonId: string) => void;
}

const EMPTY_BUTTONS: NavigationButton[] = [];
const BACK_BUTTON: NavigationButton = {id: 'expo-router-back-button'};
const BACK_BUTTONS: NavigationButton[] = [BACK_BUTTON];
const HEADER_HEIGHT = 56;
const SIDE_WIDTH = 112;
const ICON_SIZE = 24;

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    header: {
        backgroundColor: theme.sidebarBg,
        borderBottomColor: changeOpacity(theme.sidebarHeaderTextColor, 0.12),
        borderBottomWidth: 1,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        height: HEADER_HEIGHT,
    },
    side: {
        alignItems: 'center',
        flexDirection: 'row',
        minWidth: SIDE_WIDTH,
        overflow: 'hidden',
    },
    leftSide: {
        justifyContent: 'flex-start',
        paddingLeft: 4,
    },
    rightSide: {
        justifyContent: 'flex-end',
        paddingRight: 4,
    },
    titleContainer: {
        flex: 1,
        paddingHorizontal: 8,
    },
    title: {
        color: theme.sidebarHeaderTextColor,
        textAlign: 'center',
        ...typography('Body', 200, 'SemiBold'),
    },
    button: {
        alignItems: 'center',
        height: 44,
        justifyContent: 'center',
        minWidth: 44,
        paddingHorizontal: 10,
    },
    buttonIcon: {
        height: ICON_SIZE,
        width: ICON_SIZE,
    },
    buttonText: {
        color: theme.sidebarHeaderTextColor,
        maxWidth: 96,
        ...typography('Body', 100, 'SemiBold'),
    },
}));

function useNavigationHeaderState(screenName: AvailableScreens) {
    const [state, setState] = useState<NavigationHeaderState>(() => NavigationHeaderStore.getState(screenName));

    useEffect(() => {
        const unsubscribe = NavigationHeaderStore.subscribe(() => {
            setState(NavigationHeaderStore.getState(screenName));
        });

        setState(NavigationHeaderStore.getState(screenName));

        return unsubscribe;
    }, [screenName]);

    return state;
}

function HeaderButton({button, color, onButtonPress}: ButtonProps) {
    const styles = getStyleSheet(useTheme());
    const handlePress = usePreventDoubleTap(useCallback(() => {
        if (button.enabled === false) {
            return;
        }

        onButtonPress(button.id);
    }, [button.enabled, button.id, onButtonPress]));

    const content = useMemo(() => {
        if (button === BACK_BUTTON) {
            return (
                <CompassIcon
                    color={color}
                    name='arrow-left'
                    size={ICON_SIZE}
                />
            );
        }

        if (button.icon) {
            return (
                <Image
                    resizeMode='contain'
                    source={button.icon as ImageSourcePropType}
                    style={[styles.buttonIcon, {tintColor: color}]}
                />
            );
        }

        return (
            <Text
                numberOfLines={1}
                style={[styles.buttonText, {color}]}
            >
                {button.text || button.id}
            </Text>
        );
    }, [button, color, styles.buttonIcon, styles.buttonText]);

    return (
        <Pressable
            accessibilityLabel={button.accessibilityLabel || button.text || button.id}
            accessibilityRole='button'
            disabled={button.enabled === false}
            onPress={handlePress}
            style={({pressed}) => [
                styles.button,
                (pressed || button.enabled === false) && {opacity: 0.56},
            ]}
            testID={button.testID}
        >
            {content}
        </Pressable>
    );
}

export default function NavigationHeader({screenName}: Props) {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const insets = useSafeAreaInsets();
    const isTablet = useIsTablet();
    const state = useNavigationHeaderState(screenName);
    const isBottomSheetScreen = SCREENS_AS_BOTTOM_SHEET.has(screenName);
    const hideBackButton = MODAL_SCREENS_WITHOUT_BACK.has(screenName) || isBottomSheetScreen || screenName === Screens.HOME;
    const canGoBack = router.canGoBack();
    const showBackButton = canGoBack && !hideBackButton;
    let leftButtons = EMPTY_BUTTONS;
    if (state.leftButtons?.length) {
        leftButtons = state.leftButtons;
    } else if (showBackButton) {
        leftButtons = BACK_BUTTONS;
    }
    const rightButtons = state.rightButtons || EMPTY_BUTTONS;
    const title = state.title || '';
    const backgroundColor = state.backgroundColor || theme.sidebarBg;
    const textColor = state.textColor || theme.sidebarHeaderTextColor;
    const buttonColor = state.buttonColor || textColor;

    const handleButtonPress = useCallback((buttonId: string) => {
        emitNavigationButtonPressed(buttonId, screenName);
    }, [screenName]);

    const handleBackPress = useCallback(() => {
        router.back();
    }, []);

    if (state.visible === false || (isBottomSheetScreen && !isTablet)) {
        return null;
    }

    if (!title && leftButtons.length === 0 && rightButtons.length === 0) {
        return null;
    }

    return (
        <View style={[styles.header, {backgroundColor, paddingTop: insets.top}]}>
            <View style={styles.row}>
                <View style={[styles.side, styles.leftSide]}>
                    {leftButtons.map((button) => (
                        <HeaderButton
                            button={button}
                            color={buttonColor}
                            key={button.id}
                            onButtonPress={button === BACK_BUTTON ? handleBackPress : handleButtonPress}
                        />
                    ))}
                </View>
                <View style={styles.titleContainer}>
                    <Text
                        numberOfLines={1}
                        style={[styles.title, {color: textColor}]}
                    >
                        {title}
                    </Text>
                </View>
                <View style={[styles.side, styles.rightSide]}>
                    {rightButtons.map((button) => (
                        <HeaderButton
                            button={button}
                            color={buttonColor}
                            key={button.id}
                            onButtonPress={handleButtonPress}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}
