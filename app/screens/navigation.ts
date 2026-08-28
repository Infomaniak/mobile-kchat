// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {router} from 'expo-router';
import {DeviceEventEmitter} from 'react-native';

import {Events, Navigation, Screens} from '@constants';
import {UNAUTHENTICATED_SCREENS, HOME_TAB_SCREENS, SCREENS_AS_BOTTOM_SHEET, MODAL_SCREENS} from '@constants/screens';
import BottomSheetStore from '@store/bottom_sheet_store';
import {NavigationStore} from '@store/navigation_store';
import {logDebug, logError} from '@utils/log';

import type {BottomSheetFooterProps} from '@gorhom/bottom-sheet';
import type {AvailableScreens} from '@typings/screens/navigation';

export function propsToParams(props: any): Record<string, string> {
    const seen = new WeakSet();
    return Object.keys(props || {}).reduce((params, key) => {
        const value = props[key];
        if (typeof value === 'string') {
            params[key] = value;
        } else {
            try {
                params[key] = JSON.stringify(value, (_k, v) => {
                    if (typeof v === 'object' && v !== null) {
                        if (seen.has(v)) {
                            return undefined;
                        }
                        seen.add(v);
                    }
                    return v;
                });
            } catch {
                params[key] = value?.id ? String(value.id) : '';
            }
        }
        return params;
    }, {} as Record<string, string>);
}

export function updateParams(props: Record<string, any>) {
    if (router) {
        const params = propsToParams(props);
        router.setParams(params);
    }
}

export function getExpoRouterPath(screen: AvailableScreens, _props?: any): string | undefined {
    if (UNAUTHENTICATED_SCREENS.has(screen)) {
        return `/(unauthenticated)/${screen}`;
    }
    if (HOME_TAB_SCREENS.has(screen)) {
        return `/(authenticated)/(home)/${screen}`;
    }

    if (SCREENS_AS_BOTTOM_SHEET.has(screen)) {
        return `/(bottom_sheet)/${screen}`;
    }

    if (MODAL_SCREENS.has(screen)) {
        return `/(modals)/${screen}`;
    }

    return `/(authenticated)/${screen}`;
}

export function navigateToScreen(screen: AvailableScreens, props?: Record<string, unknown>, reset = false) {
    try {
        if (router) {
            const route = getExpoRouterPath(screen, props);
            if (route) {
                const params = propsToParams(props);
                if (reset) {
                    router.replace({pathname: route, params});
                } else {
                    router.push({pathname: route, params});
                }
            }
        }
    } catch (e) {
        logError('navigateToScreen: Expo Router navigation failed', e);
    }
}

export function navigateToScreenWithBaseRoute(baseRoute: string, screen: AvailableScreens, props?: Record<string, unknown>, reset = false) {
    try {
        const pathname = `${baseRoute}/${screen}`;
        const params = propsToParams(props);
        if (reset) {
            router.replace({pathname, params});
        } else {
            router.push({pathname, params});
        }
    } catch (e) {
        logError('navigateToScreenWithBaseRoute: Expo Router navigation failed', e);
    }
}

export async function navigateBack() {
    if (router && router.canGoBack()) {
        router.back();
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
}

export function navigateToHomeTab(params?: Record<string, unknown>) {
    DeviceEventEmitter.emit(Navigation.NAVIGATE_TO_TAB, {
        screen: Screens.CHANNEL_LIST,
        params,
    });
}

export async function navigateToRoot() {
    if (router) {
        router.dismissTo(getExpoRouterPath(Screens.CHANNEL_LIST)!);

        if (router.canDismiss()) {
            router.dismissAll();
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
    }
}

export async function dismissAllRoutesAndPopToScreen(screenId: AvailableScreens, passProps = {}) {
    try {
        if (!router) {
            return;
        }
        const route = getExpoRouterPath(screenId);
        if (!route) {
            return;
        }

        if (NavigationStore.isScreenInStack(screenId)) {
            router.dismissTo(route);
            router.dismissTo(route);
            router.setParams(propsToParams(passProps));
            await new Promise((resolve) => setTimeout(resolve, 250));
        } else {
            // Stacking a pop-to-home (navigateToRoot) before the push races with
            // the push when the app is returning to the foreground (e.g. answering
            // a CallKit call): the home navigation lands after the push and buries
            // the target screen. Push the target on top of the current state
            // instead; open modal stacks are dismissed first.
            if (NavigationStore.hasModalsOpened()) {
                router.dismissAll();
            }
            navigateToScreen(screenId, passProps);
            await new Promise((resolve) => setTimeout(resolve, 250));
        }
    } catch (e) {
        logError('dismissAllRoutesAndPopToScreen: Expo Router navigation failed', e);
    }
}

export function navigateToSettingsScreen(screen: AvailableScreens, props?: Record<string, unknown>) {
    navigateToScreenWithBaseRoute(`/(modals)/${Screens.SETTINGS}`, screen, props);
}

export function navigateToChannelInfoScreen(screen: AvailableScreens, props?: Record<string, unknown>) {
    navigateToScreenWithBaseRoute(`/(modals)/${Screens.CHANNEL_INFO}`, screen, props);
}

export function bottomSheet(options: {
    closeButtonId?: string;
    renderContent: () => React.ReactNode;
    snapPoints: Array<string | number>;
    footerComponent?: (props: BottomSheetFooterProps) => React.ReactNode;
    title?: string;
    theme?: Theme;
    initialSnapIndex?: number;
}) {
    DeviceEventEmitter.emit(Events.BLUR_AND_DISMISS_KEYBOARD);
    BottomSheetStore.setSnapPoints(options.snapPoints);
    BottomSheetStore.setRenderContentCallback(options.renderContent);
    if (options.footerComponent) {
        BottomSheetStore.setFooterComponent(options.footerComponent);
    }

    navigateToScreen(Screens.GENERIC_BOTTOM_SHEET);
}

export async function dismissBottomSheet() {
    const hasRegularSheet = NavigationStore.isScreenInStack(Screens.BOTTOM_SHEET);
    const hasGenericSheet = NavigationStore.isScreenInStack(Screens.GENERIC_BOTTOM_SHEET);
    if (!hasRegularSheet && !hasGenericSheet) {
        return;
    }
    DeviceEventEmitter.emit(Events.CLOSE_BOTTOM_SHEET);

    await NavigationStore.waitUntilScreensIsRemoved(hasRegularSheet ? Screens.BOTTOM_SHEET : Screens.GENERIC_BOTTOM_SHEET);
    BottomSheetStore.reset();
    await new Promise((resolve) => setTimeout(resolve, 250));
}

// Compatibility wrappers for old RNN function names
export function goToScreen(name: AvailableScreens, _title: string, passProps: Record<string, any> = {}, _options: any = {}) {
    navigateToScreen(name, passProps);
}

export async function popTopScreen(_screenId?: AvailableScreens) {
    await navigateBack();
}

export async function popTo(screenId: AvailableScreens) {
    try {
        if (router) {
            const route = getExpoRouterPath(screenId);
            if (route) {
                router.dismissTo(route);
                await new Promise((resolve) => setTimeout(resolve, 250));
            }
        }
    } catch (e) {
        logError('popTo: Expo Router navigation failed', e);
    }
}

export async function popToRoot() {
    await navigateToRoot();
}

export function showModal(name: AvailableScreens, _title: string, passProps: Record<string, any> = {}, _options: any = {}) {
    navigateToScreen(name, passProps);
}

export function showModalOverCurrentContext(name: AvailableScreens, passProps: Record<string, any> = {}, _options: any = {}) {
    navigateToScreen(name, passProps);
}

export async function dismissModal(_options?: any) {
    await navigateBack();
}

export async function dismissAllModals() {
    await navigateToRoot();
}

export async function dismissAllModalsAndPopToRoot() {
    await navigateToRoot();
}

export async function dismissAllModalsAndPopToScreen(screenId: AvailableScreens, _title: string, passProps: Record<string, any> = {}, _options: any = {}) {
    await dismissAllRoutesAndPopToScreen(screenId, passProps);
}

export function showOverlay(name: AvailableScreens, passProps: Record<string, any> = {}, _options: any = {}, _id?: string) {
    if (SCREENS_AS_BOTTOM_SHEET.has(name)) {
        navigateToScreen(name, passProps);
    } else {
        logDebug(`showOverlay: screen ${name} is not a bottom sheet, ignoring`);
    }
}

export async function dismissOverlay(_componentId: string) {
    await navigateBack();
}

export async function dismissAllOverlays() {
    // No-op with expo-router
}

export function openAsBottomSheet({screen, props}: {
    closeButtonId: string;
    props?: Record<string, any>;
    screen: AvailableScreens;
    theme: Theme;
    title: string;
}) {
    navigateToScreen(screen, props);
}

export function openAttachmentOptions(props: Record<string, any>) {
    navigateToScreen(Screens.ATTACHMENT_OPTIONS, props);
}

export function showAppForm(form: any, context: any) {
    navigateToScreen(Screens.APPS_FORM, {form, context});
}

export function openUserProfileModal(intl: any, theme: Theme, props: Record<string, any>, _screenToDismiss?: AvailableScreens) {
    navigateToScreen(Screens.USER_PROFILE, props);
}

export function showReviewOverlay(hasAskedBefore: boolean) {
    navigateToScreen(Screens.REVIEW_APP, {hasAskedBefore});
}

export function showShareFeedbackOverlay() {
    navigateToScreen(Screens.SHARE_FEEDBACK);
}

export async function findChannels(_title: string, _theme: Theme) {
    navigateToScreen(Screens.FIND_CHANNELS);
}

export function setButtons(componentId?: AvailableScreens, _buttons: any = {}) {
    // No-op with expo-router — header buttons are handled by route layouts
}

export function setScreensOrientation(_allowRotation: boolean) {
    // No-op with expo-router
}

export function openToS() {
    navigateToScreen(Screens.TERMS_OF_SERVICE);
}

export function bottomSheetModalOptions(_theme: Theme, _closeButtonId?: string) {
    return {};
}

export function loginAnimationOptions() {
    return {};
}

export function resetToHome(passProps: Record<string, any> = {}) {
    navigateToScreen(Screens.HOME, passProps, true);
}

export function resetToOnboarding(passProps: Record<string, any> = {}) {
    navigateToScreen(Screens.ONBOARDING, passProps, true);
}

export function resetToInfomaniakLogin(passProps: Record<string, any> = {}) {
    navigateToScreen(Screens.IK_LOGIN, passProps, true);
}

export function resetToInfomaniakNoTeams() {
    navigateToScreen(Screens.IK_NO_TEAMS, {}, true);
}

export function resetToSelectServer(passProps: Record<string, any> = {}) {
    navigateToScreen(Screens.SERVER, passProps, true);
}

export function resetToTeams() {
    navigateToScreen(Screens.SELECT_TEAM, {}, true);
}

export const allOrientations: string[] = ['sensor', 'sensorLandscape', 'sensorPortrait', 'landscape', 'portrait'];
export const portraitOrientation: string[] = ['portrait'];

export function registerNavigationListeners() {
    // No-op with expo-router
}

export function getThemeFromState(): Theme {
    const EphemeralStoreModule = require('@store/ephemeral_store').default;
    return EphemeralStoreModule.getTheme();
}

export function buildNavigationButton(id: string, testID: string, icon?: any, text?: string) {
    const button: {
        id: string;
        testID: string;
        icon?: any;
        text?: string;
        enabled?: boolean;
        showAsAction?: string;
        color?: string;
    } = {id, testID, icon, text};
    return button;
}
