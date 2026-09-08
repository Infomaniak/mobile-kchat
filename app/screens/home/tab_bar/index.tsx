// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import React, {useEffect, useMemo, useState} from 'react';
import {DeviceEventEmitter, Platform, Pressable, View} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {Events, Navigation as NavigationConstants, Screens, View as ViewConstants} from '@constants';
import {useWindowDimensions} from '@hooks/device';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import Account from './account';
import Home from './home';
import Mentions from './mentions';
import SavedMessages from './saved_messages';
import Search from './search';

import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        backgroundColor: theme.centerChannelBg,
        alignContent: 'center',
        flexDirection: 'row',
        height: ViewConstants.BOTTOM_TAB_HEIGHT,
        justifyContent: 'center',
    },
    outerContainer: {
        backgroundColor: theme.centerChannelBg,
        boxShadow: '0px -4px 4px rgba(61, 60, 64, 0.08)',
    },
    item: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    separator: {
        borderTopColor: changeOpacity(theme.centerChannelColor, 0.08),
        borderTopWidth: 0.5,
    },
    slider: {
        backgroundColor: theme.buttonBg,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        width: 48,
        height: 4,
    },
    sliderContainer: {
        height: 4,
        position: 'absolute',
        top: 0,
        left: 10,
        alignItems: 'center',
    },
}));

const TabComponents: Record<string, any> = {
    [Screens.ACCOUNT]: Account,
    [Screens.CHANNEL_LIST]: Home,
    [Screens.MENTIONS]: Mentions,
    [Screens.SAVED_MESSAGES]: SavedMessages,
    [Screens.SEARCH]: Search,
};

const GLASS_BAR_HEIGHT = 64;
const GLASS_BAR_MARGIN = 12;

const getGlassStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    overlayContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: GLASS_BAR_MARGIN,
        paddingTop: 8,
    },
    glass: {
        height: GLASS_BAR_HEIGHT,
        borderRadius: 32,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
    pillContainer: {
        position: 'absolute',
        top: 8,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pill: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: changeOpacity(theme.centerChannelColor, 0.12),
    },
}));

const useLiquidGlass = Platform.OS === 'ios' && isLiquidGlassSupported;

function TabBar({state, descriptors, navigation, theme}: BottomTabBarProps & {theme: Theme}) {
    const [visible, setVisible] = useState<boolean|undefined>();
    const {width} = useWindowDimensions();
    const tabs = useMemo(() => state.routes.filter((route) => route.name !== 'index'), [state.routes]);
    const tabWidth = width / tabs.length;
    const style = getStyleSheet(theme);
    const safeareaInsets = useSafeAreaInsets();

    useEffect(() => {
        const event = DeviceEventEmitter.addListener(Events.TAB_BAR_VISIBLE, (show) => {
            setVisible(show);
        });

        return () => event.remove();
    }, []);

    useEffect(() => {
        const listner = DeviceEventEmitter.addListener(NavigationConstants.NAVIGATION_HOME, () => {
            navigation.navigate(Screens.HOME);
        });

        return () => listner.remove();
    });

    useEffect(() => {
        const listner = DeviceEventEmitter.addListener(NavigationConstants.NAVIGATE_TO_TAB, ({screen, params = {}}: {screen: string; params: any}) => {
            const lastTab = state.history[state.history.length - 1];
            // eslint-disable-next-line max-nested-callbacks
            const routeIndex = state.routes.findIndex((r) => r.name === screen);
            const route = state.routes[routeIndex];
            // eslint-disable-next-line max-nested-callbacks
            const lastIndex = state.routes.findIndex((r) => r.key === lastTab.key);
            const direction = lastIndex < routeIndex ? 'right' : 'left';
            const event = navigation.emit({
                type: 'tabPress',
                target: screen,
                canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                navigation.navigate({params: {direction, ...params}, name: route.name, merge: false});
            }
        });

        return () => listner.remove();
    }, [navigation, state]);

    const glassStyle = getGlassStyleSheet(theme);
    const glassTabWidth = (width - (GLASS_BAR_MARGIN * 2)) / tabs.length;

    const getTabHandlers = (route: typeof tabs[number], index: number, isFocused: boolean) => {
        const onPress = () => {
            const lastTab = state.history[state.history.length - 1];
            const lastIndex = tabs.findIndex((r) => r.key === lastTab.key);
            const direction = lastIndex < index ? 'right' : 'left';
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });
            DeviceEventEmitter.emit(NavigationConstants.TAB_PRESSED);
            if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                navigation.navigate({params: {direction}, name: route.name, merge: false});
            }
        };

        const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
        };

        return {onPress, onLongPress};
    };

    const renderTabContent = (routeName: string, isFocused: boolean) => {
        const Component = TabComponents[routeName];
        if (!Component) {
            return null;
        }

        return (
            <Component
                isFocused={isFocused}
                theme={theme}
            />
        );
    };

    const items = tabs.map((route, index) => {
        const isFocused = state.index === index;
        const {options} = descriptors[route.key];
        const {onPress, onLongPress} = getTabHandlers(route, index, isFocused);

        return (
            <Pressable
                key={route.name}
                accessibilityRole='button'
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={({pressed}) => [
                    useLiquidGlass ? glassStyle.item : style.item,
                    pressed && {opacity: 0.72},
                ]}
            >
                {renderTabContent(route.name, isFocused)}
            </Pressable>
        );
    });

    const transform = useAnimatedStyle(() => {
        const tabSize = useLiquidGlass ? glassTabWidth : tabWidth;
        const translateX = withTiming(state.index * tabSize, {duration: 150});
        return {
            transform: [{translateX}],
        };
    }, [state.index, tabWidth, glassTabWidth]);

    const animatedStyle = useAnimatedStyle(() => {
        if (visible === undefined) {
            return {transform: [{translateY: 0}]};
        }

        const glassHideOffset = GLASS_BAR_HEIGHT + safeareaInsets.bottom + GLASS_BAR_MARGIN;
        const flatHideOffset = 52 + safeareaInsets.bottom;
        const hideOffset = useLiquidGlass ? glassHideOffset : flatHideOffset;
        const height = visible ? withTiming(0, {duration: 200}) : withTiming(hideOffset, {duration: 150});
        return {
            transform: [{translateY: height}],
        };
    }, [visible, safeareaInsets.bottom]);

    if (useLiquidGlass) {
        return (
            <View
                pointerEvents='box-none'
                style={[glassStyle.overlayContainer, {height: GLASS_BAR_HEIGHT + 8 + safeareaInsets.bottom}]}
            >
                <LiquidGlassView
                    style={glassStyle.glass}
                    effect='regular'
                    interactive={true}
                >
                    <View style={glassStyle.row}>
                        <Animated.View
                            style={[glassStyle.pillContainer, {width: glassTabWidth}, transform]}
                        >
                            <View style={glassStyle.pill}/>
                        </Animated.View>
                        {items}
                    </View>
                </LiquidGlassView>
            </View>
        );
    }

    return (
        <SafeAreaView edges={['bottom']}>
            <Animated.View style={style.outerContainer}>
                <Animated.View style={[style.container, style.separator, animatedStyle]}>
                    <Animated.View
                        style={[
                            style.sliderContainer,
                            {width: tabWidth - 20},
                            transform,
                        ]}
                    >
                        <View style={style.slider}/>
                    </Animated.View>
                    {items}
                </Animated.View>
            </Animated.View>
        </SafeAreaView>
    );
}

export default TabBar;
