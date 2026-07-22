// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import RNUtils from '@mattermost/rnutils';
import merge from 'deepmerge';
import {router} from 'expo-router';
import {Alert, DeviceEventEmitter, Platform, StatusBar} from 'react-native';
import tinyColor from 'tinycolor2';

import CompassIcon from '@components/compass_icon';
import {Events, Launch, Screens} from '@constants';
import {NOT_READY} from '@constants/screens';
import {getDefaultThemeByAppearance} from '@context/theme';
import BottomSheetStore from '@store/bottom_sheet_store';
import EphemeralStore from '@store/ephemeral_store';
import NavigationHeaderStore from '@store/navigation_header_store';
import NavigationPropsStore from '@store/navigation_props_store';
import NavigationStore from '@store/navigation_store';
import {isTablet} from '@utils/helpers';
import {dismissKeyboard} from '@utils/keyboard';
import {logDebug, logError} from '@utils/log';
import {captureException} from '@utils/sentry';
import {changeOpacity} from '@utils/theme';

import type {BottomSheetFooterProps} from '@gorhom/bottom-sheet';
import type {default as UserProfileScreen} from '@screens/user_profile';
import type {LaunchProps} from '@typings/launch';
import type {AvailableScreens, NavButtons, NavigationButton, NavigationOptions} from '@typings/screens/navigation';
import type {ComponentProps} from 'react';
import type {IntlShape} from 'react-intl';
import type {Asset} from 'react-native-image-picker';

type LayoutOrientation = 'sensor' | 'sensorLandscape' | 'sensorPortrait' | 'landscape' | 'portrait';

export {addNavigationButtonPressedListener, emitNavigationButtonPressed} from './navigation_button_events';

export const allOrientations: LayoutOrientation[] = ['sensor', 'sensorLandscape', 'sensorPortrait', 'landscape', 'portrait'];
export const portraitOrientation: LayoutOrientation[] = ['portrait'];

const loginFlowScreens = new Set<AvailableScreens>([
    Screens.ONBOARDING,
    Screens.SERVER,
    Screens.LOGIN,
    Screens.MFA,
    Screens.FORGOT_PASSWORD,
]);

function routeToScreen(name: AvailableScreens, passProps: Record<string, unknown> = {}, replace = false) {
    const propsId = NavigationPropsStore.set(passProps);
    const route = {
        pathname: '/[screen]',
        params: {
            propsId,
            screen: name,
        },
    } as never;

    if (replace) {
        router.replace(route);
    } else {
        router.push(route);
    }

    return propsId;
}

function setNavigationBarColor(screen: AvailableScreens, th?: Theme) {
    if (Platform.OS === 'android' && Platform.Version >= 34) {
        const theme = th || getThemeFromState();
        const color = loginFlowScreens.has(screen) ? theme.sidebarBg : theme.centerChannelBg;
        if (color) {
            RNUtils.setNavigationBarColor(color, tinyColor(color).isLight());
        }
    }
}

function showBottomTabsIfNeeded(screen: AvailableScreens) {
    if (screen === Screens.HOME) {
        DeviceEventEmitter.emit(Events.TAB_BAR_VISIBLE, true);
    }
}

function trackScreen(screen: AvailableScreens, modal = false) {
    if (modal) {
        NavigationStore.addModalToStack(screen);
    } else {
        NavigationStore.addScreenToStack(screen);
    }

    showBottomTabsIfNeeded(screen);
    setNavigationBarColor(screen);
}

export function registerNavigationListeners() {
    logDebug('[Navigation.registerNavigationListeners] Expo Router owns navigation events');
}

export const loginAnimationOptions = () => {
    const theme = getThemeFromState();
    return {
        layout: {
            backgroundColor: theme.centerChannelBg,
            componentBackgroundColor: theme.centerChannelBg,
        },
        topBar: {
            visible: true,
            drawBehind: true,
            translucid: true,
            noBorder: true,
            elevation: 0,
            background: {
                color: 'transparent',
            },
            backButton: {
                color: changeOpacity(theme.centerChannelColor, 0.56),
            },
        },
    };
};

export const bottomSheetModalOptions = (theme: Theme, closeButtonId?: string): NavigationOptions => {
    if (closeButtonId) {
        const closeButton = CompassIcon.getImageSourceSync('close', 24, theme.centerChannelColor);
        const closeButtonTestId = `${closeButtonId.replace('close-', 'close.').replace(/-/g, '_')}.button`;
        return {
            topBar: {
                leftButtons: [{
                    id: closeButtonId,
                    icon: closeButton,
                    testID: closeButtonTestId,
                }],
                leftButtonColor: changeOpacity(theme.centerChannelColor, 0.56),
                background: {
                    color: theme.centerChannelBg,
                },
                title: {
                    color: theme.centerChannelColor,
                },
            },
        };
    }

    return {
        animations: {
            showModal: {
                enabled: false,
            },
            dismissModal: {
                enabled: false,
            },
        },
    };
};

export function setScreensOrientation(allowRotation: boolean) {
    if (allowRotation) {
        RNUtils.unlockOrientation();
    }
}

export function getThemeFromState(): Theme {
    return EphemeralStore.theme || getDefaultThemeByAppearance();
}

function isScreenRegistered(screen: AvailableScreens) {
    const notImplemented = NOT_READY.includes(screen) || !Object.values(Screens).includes(screen);
    if (notImplemented) {
        Alert.alert(
            'Temporary error ' + screen,
            'The functionality you are trying to use has not been implemented yet',
        );
        return false;
    }

    return true;
}

function edgeToEdgeHack(screen: AvailableScreens, theme: Theme) {
    const isDark = tinyColor(theme.sidebarBg).isDark();

    if (Platform.OS === 'android') {
        setNavigationBarColor(screen, theme);
    }

    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return {isDark};
}

function replaceRoot(screen: AvailableScreens, passProps: Record<string, unknown> = {}) {
    NavigationStore.clearScreensFromStack();
    NavigationPropsStore.clear();
    BottomSheetStore.clear();
    trackScreen(screen);
    routeToScreen(screen, passProps, true);
    return '';
}

export function openToS() {
    NavigationStore.setToSOpen(true);
    return showOverlay(Screens.TERMS_OF_SERVICE, {}, {overlay: {interceptTouchOutside: true}});
}

export async function resetToHome(passProps: LaunchProps = {launchType: Launch.Normal}) {
    const theme = getThemeFromState();
    edgeToEdgeHack(Screens.HOME, theme);

    if (!passProps.coldStart && (passProps.launchType === Launch.AddServer || passProps.launchType === Launch.AddServerFromDeepLink)) {
        dismissModal({componentId: Screens.SERVER});
        dismissModal({componentId: Screens.BOTTOM_SHEET});
        if (passProps.launchType === Launch.AddServerFromDeepLink) {
            routeToScreen(Screens.HOME, {launchType: Launch.DeepLink, extra: passProps.extra}, true);
        }
        return '';
    }

    return replaceRoot(Screens.HOME, passProps as unknown as Record<string, unknown>);
}

export async function resetToInfomaniakLogin(passProps: LaunchProps) {
    const theme = getDefaultThemeByAppearance();
    edgeToEdgeHack(Screens.INFOMANIAK_LOGIN, theme);

    return replaceRoot(Screens.INFOMANIAK_LOGIN, {
        ...passProps,
        theme,
    } as Record<string, unknown>);
}

export async function resetToInfomaniakNoTeams() {
    const theme = getDefaultThemeByAppearance();
    edgeToEdgeHack(Screens.INFOMANIAK_NO_TEAMS, theme);

    return replaceRoot(Screens.INFOMANIAK_NO_TEAMS, {theme});
}

export async function resetToSelectServer(passProps: LaunchProps) {
    const theme = getDefaultThemeByAppearance();
    edgeToEdgeHack(Screens.SERVER, theme);

    return replaceRoot(Screens.SERVER, {
        ...passProps,
        theme,
    } as Record<string, unknown>);
}

export async function resetToOnboarding(passProps: LaunchProps) {
    const theme = getDefaultThemeByAppearance();
    edgeToEdgeHack(Screens.ONBOARDING, theme);

    return replaceRoot(Screens.ONBOARDING, {
        ...passProps,
        theme,
    } as Record<string, unknown>);
}

export async function resetToTeams() {
    const theme = getThemeFromState();
    edgeToEdgeHack(Screens.SELECT_TEAM, theme);

    return replaceRoot(Screens.SELECT_TEAM);
}

export function goToScreen(name: AvailableScreens, title: string, passProps = {}, options: NavigationOptions = {}) {
    if (!isScreenRegistered(name)) {
        captureException(new Error(`[Navigation] Screen ${name} is not registered`));
        return '';
    }

    const theme = getThemeFromState();
    edgeToEdgeHack(name, theme);

    if (!NavigationStore.getVisibleScreen()) {
        logError('Trying to go to screen without any screen on the navigation store');
        return '';
    }

    DeviceEventEmitter.emit(Events.TAB_BAR_VISIBLE, false);

    const nextProps = {
        ...passProps,
        navigationOptions: merge({title}, options),
    };

    if (NavigationStore.getScreensInStack().includes(name)) {
        NavigationStore.popTo(name);
        router.dismissTo({
            pathname: '/[screen]',
            params: {screen: name},
        } as never);
        return '';
    }

    trackScreen(name);
    routeToScreen(name, nextProps);
    return '';
}

export async function popTopScreen(screenId?: AvailableScreens) {
    if (screenId) {
        NavigationStore.removeScreenFromStack(screenId);
    } else {
        const componentId = NavigationStore.getVisibleScreen();
        if (componentId) {
            NavigationStore.removeScreenFromStack(componentId);
        }
    }

    if (router.canGoBack()) {
        router.back();
    }
}

export async function popTo(screenId: AvailableScreens) {
    NavigationStore.popTo(screenId);
    router.dismissTo({
        pathname: '/[screen]',
        params: {screen: screenId},
    } as never);
}

export async function popToRoot() {
    NavigationStore.clearScreensFromStack();
    NavigationStore.addScreenToStack(Screens.HOME);
    router.dismissTo({
        pathname: '/[screen]',
        params: {screen: Screens.HOME},
    } as never);
}

export async function dismissAllModalsAndPopToRoot() {
    await dismissAllModals();
    await dismissAllOverlays();
    await popToRoot();
}

export async function dismissAllModalsAndPopToScreen(screenId: AvailableScreens, title: string, passProps = {}, options = {}) {
    await dismissAllModals();
    await dismissAllOverlays();
    if (NavigationStore.getScreensInStack().includes(screenId)) {
        await popTo(screenId);
    } else {
        await goToScreen(screenId, title, passProps, options);
    }
}

export function showModal(name: AvailableScreens, title: string, passProps = {}, options: NavigationOptions = {}) {
    if (!isScreenRegistered(name) || NavigationStore.getVisibleModal() === name) {
        return undefined;
    }

    const theme = getThemeFromState();
    edgeToEdgeHack(name, theme);
    trackScreen(name, true);
    routeToScreen(name, {
        ...passProps,
        isModal: true,
        navigationOptions: merge({title}, options),
    });

    return undefined;
}

export function showModalOverCurrentContext(name: AvailableScreens, passProps = {}, options: NavigationOptions = {}) {
    return showModal(name, '', passProps, options);
}

export async function dismissModal(options?: NavigationOptions & {componentId: AvailableScreens}) {
    const componentId = options?.componentId || NavigationStore.getVisibleModal();
    if (componentId) {
        NavigationStore.removeModalFromStack(componentId);
        NavigationStore.removeScreenFromStack(componentId);
    }

    if (router.canGoBack()) {
        router.back();
    }
}

export async function dismissAllModals() {
    NavigationStore.getModalsInStack().forEach((modal) => {
        NavigationStore.removeModalFromStack(modal);
    });
}

export const buildNavigationButton = (id: string, testID: string, icon?: unknown, text?: string): NavigationButton => ({
    id,
    icon,
    testID,
    text,
});

export function setButtons(componentId: AvailableScreens, buttons: NavButtons = {leftButtons: [], rightButtons: []}) {
    NavigationHeaderStore.setButtons(componentId, buttons);
    return buttons;
}

export function showOverlay(name: AvailableScreens, passProps = {}, options: NavigationOptions = {}, id?: string) {
    if (!isScreenRegistered(name)) {
        return undefined;
    }

    trackScreen(name, true);
    routeToScreen(name, {
        ...passProps,
        overlayId: id,
        navigationOptions: options,
    });

    return undefined;
}

export async function dismissOverlay(componentId: string) {
    NavigationStore.removeModalFromStack(componentId as AvailableScreens);
    NavigationStore.removeScreenFromStack(componentId as AvailableScreens);
    if (router.canGoBack()) {
        router.back();
    }
}

export async function dismissAllOverlays() {
    await dismissAllModals();
}

type BottomSheetArgs = {
    closeButtonId: string;
    enableDynamicSizing?: boolean;
    initialSnapIndex?: number;
    footerComponent?: React.FC<BottomSheetFooterProps>;
    renderContent: () => React.ReactNode;
    snapPoints: Array<number | string>;
    theme: Theme;
    title: string;
    scrollable?: boolean;
}

export function bottomSheet({title, renderContent, footerComponent, snapPoints, initialSnapIndex = 1, theme, closeButtonId, scrollable = false, enableDynamicSizing}: BottomSheetArgs) {
    BottomSheetStore.setState({
        footerComponent,
        renderContent,
        snapPoints,
    });

    if (isTablet()) {
        showModal(Screens.BOTTOM_SHEET, title, {
            closeButtonId,
            enableDynamicSizing,
            initialSnapIndex,
            scrollable,
        }, bottomSheetModalOptions(theme, closeButtonId));
    } else {
        showModalOverCurrentContext(Screens.BOTTOM_SHEET, {
            enableDynamicSizing,
            initialSnapIndex,
            scrollable,
        }, bottomSheetModalOptions(theme));
    }
}

export async function dismissBottomSheet(alternativeScreen: AvailableScreens = Screens.BOTTOM_SHEET) {
    DeviceEventEmitter.emit(Events.CLOSE_BOTTOM_SHEET);
    NavigationStore.removeScreenFromStack(alternativeScreen);
    await dismissModal({componentId: alternativeScreen});
}

type AsBottomSheetArgs = {
    closeButtonId: string;
    props?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    screen: AvailableScreens;
    theme: Theme;
    title: string;
}

export function openAsBottomSheet({closeButtonId, screen, theme, title, props}: AsBottomSheetArgs) {
    if (isTablet()) {
        showModal(screen, title, {
            closeButtonId,
            ...props,
        }, bottomSheetModalOptions(theme, closeButtonId));
    } else {
        showModalOverCurrentContext(screen, props, bottomSheetModalOptions(theme));
    }
}

export function openAttachmentOptions(
    intl: IntlShape,
    theme: Theme,
    props: {
        onUploadFiles: (files: Asset[]) => void;
        maxFilesReached: boolean;
        canUploadFiles: boolean;
        testID?: string;
        fileCount?: number;
        maxFileCount?: number;
    },
) {
    const title = intl.formatMessage({id: 'mobile.file_attachment.title', defaultMessage: 'Files and media'});
    openAsBottomSheet({
        closeButtonId: 'attachment-close-id',
        screen: Screens.ATTACHMENT_OPTIONS,
        theme,
        title,
        props,
    });
}

export const showAppForm = async (form: AppForm, context: AppContext) => {
    const passProps = {form, context};
    showModal(Screens.APPS_FORM, form.title || '', passProps);
};

export const showReviewOverlay = (hasAskedBefore: boolean) => {
    showOverlay(
        Screens.REVIEW_APP,
        {hasAskedBefore},
        {overlay: {interceptTouchOutside: true}},
    );
};

export const showShareFeedbackOverlay = () => {
    showOverlay(
        Screens.SHARE_FEEDBACK,
        {},
        {overlay: {interceptTouchOutside: true}},
    );
};

export async function findChannels(title: string, theme: Theme) {
    const closeButtonId = 'close-find-channels';
    const closeButton = CompassIcon.getImageSourceSync('close', 24, theme.sidebarHeaderTextColor);
    const options: NavigationOptions = {
        topBar: {
            leftButtons: [{
                id: closeButtonId,
                icon: closeButton,
                testID: 'close.find_channels.button',
            }],
        },
    };

    showModal(
        Screens.FIND_CHANNELS,
        title,
        {closeButtonId},
        options,
    );
}

export async function openUserProfileModal(
    intl: IntlShape,
    theme: Theme,
    props: Omit<ComponentProps<typeof UserProfileScreen>, 'closeButtonId'>,
    screenToDismiss?: AvailableScreens,
) {
    if (screenToDismiss) {
        await dismissBottomSheet(screenToDismiss);
    }
    const screen = Screens.USER_PROFILE;
    const title = intl.formatMessage({id: 'mobile.routes.user_profile', defaultMessage: 'Profile'});
    const closeButtonId = 'close-user-profile';

    dismissKeyboard();
    openAsBottomSheet({screen, title, theme, closeButtonId, props: {...props}});
}
