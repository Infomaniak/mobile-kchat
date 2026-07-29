// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {router} from 'expo-router';
import {DeviceEventEmitter} from 'react-native';

import {Events, Navigation, Screens} from '@constants';
import {UNAUTHENTICATED_SCREENS, HOME_TAB_SCREENS, SCREENS_AS_BOTTOM_SHEET, MODAL_SCREENS} from '@constants/screens';
import BottomSheetStore from '@store/bottom_sheet_store';
import {NavigationStore} from '@store/navigation_store';
import {logError} from '@utils/log';

import type {BottomSheetFooterProps} from '@gorhom/bottom-sheet';
import type {AvailableScreens} from '@typings/screens/navigation';

export function propsToParams(props: any): Record<string, string> {
    return Object.keys(props || {}).reduce((params, key) => {
        params[key] = typeof props[key] === 'string' ? props[key] : JSON.stringify(props[key]);
        return params;
    }, {} as Record<string, string>);
}

export function updateParams(props: Record<string, any>) {
    if (router) {
        const params = propsToParams(props);
        router.setParams(params);
    }
}

export function getExpoRouterPath(screen: AvailableScreens, props?: any): string | undefined {
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
            await navigateToRoot();
            navigateToScreen(screenId, passProps);
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

export function bottomSheet(renderContent: () => React.ReactNode, snapPoints: Array<string | number>, footerComponent?: (props: BottomSheetFooterProps) => React.ReactNode) {
    DeviceEventEmitter.emit(Events.BLUR_AND_DISMISS_KEYBOARD);
    BottomSheetStore.setSnapPoints(snapPoints);
    BottomSheetStore.setRenderContentCallback(renderContent);
    if (footerComponent) {
        BottomSheetStore.setFooterComponent(footerComponent);
    }

    navigateToScreen(Screens.GENERIC_BOTTOM_SHEET);
}

export async function dismissBottomSheet(alternativeScreen: AvailableScreens = Screens.GENERIC_BOTTOM_SHEET) {
    const hasRegularSheet = NavigationStore.isScreenInStack(Screens.BOTTOM_SHEET);
    const hasGenericSheet = NavigationStore.isScreenInStack(Screens.GENERIC_BOTTOM_SHEET);
    if (!hasRegularSheet && !hasGenericSheet) {
        return;
    }
    DeviceEventEmitter.emit(Events.CLOSE_BOTTOM_SHEET);

    const screen = hasRegularSheet ? Screens.BOTTOM_SHEET : Screens.GENERIC_BOTTOM_SHEET;
    await NavigationStore.waitUntilScreensIsRemoved(screen);
    BottomSheetStore.reset();
    await new Promise((resolve) => setTimeout(resolve, 250));
}
