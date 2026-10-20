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
import {isEdgeToEdge} from '@constants/device';
import {useThemeByAppearanceWithDefault} from '@context/theme';
import useDidMount from '@hooks/did_mount';
import {DEFAULT_LOCALE, getTranslations} from '@i18n';
import {cleanup, initialize} from '@init/app';
import SessionManager from '@managers/session_manager';
import InAppNotificationContainer from '@screens/in_app_notification';
import SnackBarContainer from '@screens/snack_bar';
import EphemeralStore from '@store/ephemeral_store';
import NavigationStore, {useCurrentScreen} from '@store/navigation_store';
import {logError} from '@utils/log';

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

// Hold the native splash screen while the initial route is determined, so the
// launch imagery covers the navigation bootstrap (as on iOS) instead of an
// unpainted Stack. The root layout releases it once the first real route is
// committed.
SplashScreen.setOptions({fade: true});
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appReady, setAppReady] = useState(false);
    const navigationRef = useNavigationContainerRef();
    const currentScreen = useCurrentScreen();
    const appearanceTheme = useThemeByAppearanceWithDefault();
    const [theme, setTheme] = useState(appearanceTheme);

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
        setTheme(appearanceTheme);
    });

    useDidMount(() => {
        async function initializeApp() {
            try {
                await initialize();

                // Trigger initial data sync for cold start (onAppStateChange won't fire if already active)
                SessionManager.triggerInitialResync();
                RNUtils.lockPortrait();
                setAppReady(true);
            } catch (error) {
                logError('[RootLayout.initializeApp] failed', error);
                setAppReady(true);
            }
        }

        initializeApp();

        return () => {
            cleanup();
        };
    });

    // Hold the splash screen until the initial route has been determined and
    // the real screen is committed: hiding earlier exposes the Stack while the
    // bootstrapping index route (still unpainted) is up. The theme is already
    // resolved at that point (EphemeralStore), so the first revealed frame
    // matches the user's theme.
    useEffect(() => {
        if (!appReady) {
            return;
        }

        // The ref is typed against the root params, which resolve to never for
        // the bootstrapping index route; read the name as a plain string.
        const route = navigationRef.getCurrentRoute() as {name?: string} | undefined;
        if (route?.name && route.name !== 'index') {
            SplashScreen.hideAsync();
        }
    }, [appReady, currentScreen, navigationRef]);

    // Safety net: if the initial route bootstrap fails, don't hold the splash forever.
    useEffect(() => {
        if (!appReady) {
            return undefined;
        }
        const fallback = setTimeout(() => SplashScreen.hideAsync(), 5000);
        return () => clearTimeout(fallback);
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

    // EphemeralStore.theme is hydrated during the initial route determination
    // (before any screen is committed), earlier than any DB-backed theme
    // source reachable from this layout. Until it is known, keep the Stack
    // content transparent so the window background (the launch splash) shows
    // through instead of flashing the appearance default color.
    const bootCenterChannelBg = EphemeralStore.theme?.centerChannelBg ?? 'transparent';
    const bootSidebarBg = (EphemeralStore.theme ?? theme).sidebarBg;

    const stackScreenOptions = useMemo<NativeStackNavigationOptions>(() => ({
        headerShown: false,
        animation: 'none',
        contentStyle: {backgroundColor: bootCenterChannelBg},
        ...Platform.select({android: {statusBarBackgroundColor: bootSidebarBg, statusBarTranslucent: isEdgeToEdge, statusBarStyle: tinycolor(bootSidebarBg).isLight() ? 'dark' : 'light'}}),
    }), [bootCenterChannelBg, bootSidebarBg]);

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
        ...Platform.select({android: {statusBarBackgroundColor: theme.sidebarBg, statusBarTranslucent: isEdgeToEdge}}),
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
                        <KeyboardProvider
                            enabled={isEdgeToEdge}
                            statusBarTranslucent={isEdgeToEdge}
                            navigationBarTranslucent={isEdgeToEdge}
                            preserveEdgeToEdge={isEdgeToEdge}
                            preload={true}
                        >
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

                        </KeyboardProvider>
                        <PortalHost name='snack_bar'/>
                        <SnackBarContainer/>
                        <PortalHost name='notification'/>
                        <InAppNotificationContainer/>
                    </PortalProvider>
                </IntlProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
