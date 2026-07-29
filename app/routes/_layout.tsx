// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {PortalHost, PortalProvider} from '@gorhom/portal';
import RNUtils from '@mattermost/rnutils';
import {Stack, useNavigationContainerRef} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {IntlProvider} from 'react-intl';
import {Keyboard, Platform, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import tinycolor from 'tinycolor2';

import {Screens} from '@constants';
import {useThemeByAppearanceWithDefault} from '@context/theme';
import useDidMount from '@hooks/did_mount';
import {DEFAULT_LOCALE, getTranslations} from '@i18n';
import {cleanup, initialize} from '@init/app';
import InAppNotificationContainer from '@screens/in_app_notification';
import ReviewAppContainer from '@screens/review_app';
import ShareFeedbackContainer from '@screens/share_feedback';
import SnackBarContainer from '@screens/snack_bar';
import EphemeralStore from '@store/ephemeral_store';
import NavigationStore, {useCurrentScreen} from '@store/navigation_store';

import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import type {AvailableScreens} from '@typings/screens/navigation';

const loginFlowScreens = new Set<AvailableScreens>([
    Screens.ONBOARDING,
    Screens.SERVER,
    Screens.LOGIN,
    Screens.MFA,
    Screens.FORGOT_PASSWORD,
    Screens.IK_LOGIN,
    Screens.IK_NO_TEAMS,
]);

const styles = StyleSheet.create({
    gestureHandlerRootView: {
        flex: 1,
    },
});

SplashScreen.setOptions({fade: true});
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appReady, setAppReady] = useState(false);
    const navigationRef = useNavigationContainerRef();
    const currentScreen = useCurrentScreen();
    const [theme, setTheme] = useState(EphemeralStore.getTheme());
    const appearanceTheme = useThemeByAppearanceWithDefault();

    const setAndroidNavigationBarColor = useCallback(() => {
        if (Platform.OS === 'android') {
            let t = theme;
            if (currentScreen && loginFlowScreens.has(currentScreen)) {
                t = appearanceTheme;
            }
            RNUtils.setNavigationBarColor(t.centerChannelBg, tinycolor(t.centerChannelBg).isLight());
        }
    }, [theme, appearanceTheme, currentScreen]);

    useDidMount(() => {
        const subscription = EphemeralStore.observeTheme().subscribe((newTheme) => {
            setTheme(newTheme);
        });
        return () => {
            subscription.unsubscribe();
        };
    });

    useDidMount(() => {
        async function initializeApp() {
            try {
                await initialize();
                RNUtils.lockPortrait();
                setAppReady(true);
            } catch (error) {
                setAppReady(true);
            }
        }

        initializeApp();

        return () => {
            cleanup();
        };
    });

    useEffect(() => {
        if (appReady) {
            SplashScreen.hideAsync();
        }
    }, [appReady]);

    useEffect(() => {
        const handleKeyboardHide = () => {
            setTimeout(setAndroidNavigationBarColor, 100);
        };

        const keyboardListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            keyboardListener.remove();
        };
    }, [setAndroidNavigationBarColor]);

    useEffect(() => {
        setAndroidNavigationBarColor();
    }, [setAndroidNavigationBarColor]);

    useEffect(() => {
        const handleStateChange = () => {
            const state = navigationRef.getRootState();
            NavigationStore.updateFromNavigationState(state);
        };

        const setupNavigation = () => {
            if (navigationRef.isReady()) {
                const unsubscribe = navigationRef.addListener('state', handleStateChange);
                handleStateChange();
                return unsubscribe;
            }
            return undefined;
        };

        let unsubscribe = setupNavigation();

        if (!unsubscribe) {
            const readyUnsubscribe = navigationRef.addListener('state', () => {
                if (!unsubscribe && navigationRef.isReady()) {
                    unsubscribe = setupNavigation();
                    readyUnsubscribe();
                }
            });

            return () => {
                readyUnsubscribe();
                unsubscribe?.();
            };
        }

        return unsubscribe;
    }, [navigationRef]);

    const stackScreenOptions = useMemo<NativeStackNavigationOptions>(() => ({
        headerShown: false,
        animation: 'none',
        contentStyle: {backgroundColor: theme.centerChannelBg},
        ...Platform.select({android: {statusBarBackgroundColor: theme.sidebarBg}}),
    }), [theme.centerChannelBg, theme.sidebarBg]);

    const modalScreenOptions = useMemo<NativeStackNavigationOptions>(() => ({
        presentation: 'modal',
        animation: 'slide_from_bottom',
        headerShown: false,
    }), []);

    const bottomSheetScreenOptions = useMemo<NativeStackNavigationOptions>(() => ({
        presentation: 'transparentModal',
        animation: 'none',
        headerShown: false,
        contentStyle: {backgroundColor: 'transparent'},
        ...Platform.select({android: {statusBarBackgroundColor: theme.sidebarBg}}),
    }), [theme.sidebarBg]);

    if (!appReady) {
        return null;
    }

    return (
        <GestureHandlerRootView style={styles.gestureHandlerRootView}>
            <SafeAreaProvider>
                <IntlProvider
                    locale={DEFAULT_LOCALE}
                    messages={getTranslations(DEFAULT_LOCALE)}
                >
                    <PortalProvider>
                        <KeyboardProvider>
                            <Stack screenOptions={stackScreenOptions}>
                                <Stack.Screen name='(unauthenticated)'/>
                                <Stack.Screen name='(authenticated)'/>
                                <Stack.Screen name='index'/>
                                <Stack.Screen
                                    name='(modals)'
                                    options={modalScreenOptions}
                                />
                                <Stack.Screen
                                    name='(bottom_sheet)'
                                    options={bottomSheetScreenOptions}
                                />
                            </Stack>
                            <PortalHost name='snack_bar'/>
                            <SnackBarContainer/>
                        </KeyboardProvider>
                        <PortalHost name='notification'/>
                        <InAppNotificationContainer/>
                        <PortalHost name='review_app'/>
                        <ReviewAppContainer/>
                        <PortalHost name='share_feedback'/>
                        <ShareFeedbackContainer/>
                    </PortalProvider>
                </IntlProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
