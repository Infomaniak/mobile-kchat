// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useLocalSearchParams, usePathname} from 'expo-router';
import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {Screens} from '@constants';
import {withServerDatabase} from '@database/components';
import {usePropsFromParams} from '@hooks/props_from_params';
import BottomSheetStore from '@store/bottom_sheet_store';
import NavigationHeaderStore from '@store/navigation_header_store';
import NavigationOverlayStore, {type NavigationOverlayState} from '@store/navigation_overlay_store';
import NavigationPropsStore from '@store/navigation_props_store';
import NavigationStore from '@store/navigation_store';
import {logDebug, logInfo} from '@utils/log';

import NavigationHeader from './navigation_header';

import type {AvailableScreens, NavigationOptions} from '@typings/screens/navigation';

type ScreenComponent = React.ComponentType<Record<string, unknown>>;
type ScreenRouteProps = Record<string, unknown> & {
    navigationOptions?: NavigationOptions;
}

const ROOT_STYLE = {flex: 1};
const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
});

function asScreen(Component: ScreenComponent, withDatabase = true): ScreenComponent {
    return withDatabase ? withServerDatabase(Component) : Component;
}

function BottomSheetScreen(props: Record<string, unknown>) {
    const state = BottomSheetStore.getState();
    const BottomSheet = require('@screens/bottom_sheet').default;

    return (
        <BottomSheet
            {...props}
            {...state}
            componentId={Screens.BOTTOM_SHEET}
        />
    );
}

export function getScreenComponent(screenName: AvailableScreens): ScreenComponent | undefined {
    switch (screenName) {
        case Screens.AI_OPTIONS:
            return asScreen(require('@screens/ai_options/index').default);
        case Screens.APPS_FORM:
            return asScreen(require('@screens/apps_form').default);
        case Screens.ATTACHMENT_OPTIONS:
            return asScreen(require('@screens/attachment_options').default);
        case Screens.BOTTOM_SHEET:
            return asScreen(BottomSheetScreen);
        case Screens.BROWSE_CHANNELS:
            return asScreen(require('@screens/browse_channels').default);
        case Screens.CHANNEL:
            return asScreen(require('@screens/channel').default);
        case Screens.CHANNEL_NOTIFICATION_PREFERENCES:
            return asScreen(require('@screens/channel_notification_preferences').default);
        case Screens.CHANNEL_SETTINGS:
            return asScreen(require('@screens/channel_settings').default);
        case Screens.CHANNEL_FILES:
            return asScreen(require('@screens/channel_files').default);
        case Screens.CHANNEL_INFO:
            return asScreen(require('@screens/channel_info').default);
        case Screens.CODE:
            return asScreen(require('@screens/code').default);
        case Screens.CONVERT_GM_TO_CHANNEL:
            return asScreen(require('@screens/convert_gm_to_channel').default);
        case Screens.CREATE_OR_EDIT_CHANNEL:
            return asScreen(require('@screens/create_or_edit_channel').default);
        case Screens.COMPONENT_LIBRARY:
            return asScreen(require('@screens/component_library').default);
        case Screens.CUSTOM_STATUS:
            return asScreen(require('@screens/custom_status').default);
        case Screens.CUSTOM_STATUS_CLEAR_AFTER:
            return asScreen(require('@screens/custom_status_clear_after').default);
        case Screens.CREATE_DIRECT_MESSAGE:
            return asScreen(require('@screens/create_direct_message').default);
        case Screens.CHANNEL_ADD_MEMBERS:
            return asScreen(require('@screens/channel_add_members').default);
        case Screens.DRAFT_SCHEDULED_POST_OPTIONS:
            return asScreen(require('@screens/draft_scheduled_post_options').default);
        case Screens.EDIT_POST:
            return asScreen(require('@screens/edit_post').default);
        case Screens.EDIT_PROFILE:
            return asScreen(require('@screens/edit_profile').default);
        case Screens.EDIT_SERVER:
            return asScreen(require('@screens/edit_server').default, false);
        case Screens.EMOJI_PICKER:
            return asScreen(require('@screens/emoji_picker').default);
        case Screens.FIND_CHANNELS:
            return asScreen(require('@screens/find_channels').default);
        case Screens.GALLERY:
            return asScreen(require('@screens/gallery').default);
        case Screens.GENERIC_OVERLAY:
            return asScreen(require('@screens/overlay').default);
        case Screens.GLOBAL_DRAFTS:
            return asScreen(require('@screens/global_drafts').default);
        case Screens.GLOBAL_THREADS:
            return asScreen(require('@screens/global_threads').default);
        case Screens.GROUP_MEMBERS:
            return asScreen(require('@screens/group_members').default);
        case Screens.HOME:
            return asScreen(require('@screens/home').default);
        case Screens.INTERACTIVE_DIALOG:
            return asScreen(require('@screens/interactive_dialog').default);
        case Screens.DIALOG_ROUTER:
            return asScreen(require('@screens/dialog_router').default);
        case Screens.INTEGRATION_SELECTOR:
            return asScreen(require('@screens/integration_selector').default);
        case Screens.INVITE:
            return asScreen(require('@screens/invite').default);
        case Screens.IN_APP_NOTIFICATION:
            return require('@screens/in_app_notification').default;
        case Screens.JOIN_TEAM:
            return asScreen(require('@screens/join_team').default);
        case Screens.LEAVE_CHANNEL_MEMBERS:
            return asScreen(require('@screens/leave_channel_modal').default);
        case Screens.LATEX:
            return asScreen(require('@screens/latex').default);
        case Screens.MANAGE_CHANNEL_MEMBERS:
            return asScreen(require('@screens/manage_channel_members').default);
        case Screens.MFA:
            return asScreen(require('@screens/mfa').default, false);
        case Screens.ONBOARDING:
            return asScreen(require('@screens/onboarding').default, false);
        case Screens.SELECT_TEAM:
            return asScreen(require('@screens/select_team').default);
        case Screens.PDF_VIEWER:
            return asScreen(require('@screens/pdf_viewer').default);
        case Screens.PERMALINK:
            return asScreen(require('@screens/permalink').default);
        case Screens.PINNED_MESSAGES:
            return asScreen(require('@screens/pinned_messages').default);
        case Screens.POST_OPTIONS:
            return asScreen(require('@screens/post_options').default);
        case Screens.POST_PRIORITY_PICKER:
            return asScreen(require('@screens/post_priority_picker').default);
        case Screens.REACTIONS:
            return asScreen(require('@screens/reactions').default);
        case Screens.REPORT_PROBLEM:
            return asScreen(require('@screens/report_a_problem').default);
        case Screens.RESCHEDULE_DRAFT:
            return asScreen(require('@screens/reschedule_draft').default);
        case Screens.REVIEW_APP:
            return asScreen(require('@screens/review_app').default);
        case Screens.SETTINGS:
            return asScreen(require('@screens/settings').default);
        case Screens.SETTINGS_ADVANCED:
            return asScreen(require('@screens/settings/advanced').default);
        case Screens.SETTINGS_DISPLAY:
            return asScreen(require('@screens/settings/display').default);
        case Screens.SETTINGS_DISPLAY_CLOCK:
            return asScreen(require('@screens/settings/display_clock').default);
        case Screens.SETTINGS_DISPLAY_CRT:
            return asScreen(require('@screens/settings/display_crt').default);
        case Screens.SETTINGS_DISPLAY_THEME:
            return asScreen(require('@screens/settings/display_theme').default);
        case Screens.SETTINGS_DISPLAY_TIMEZONE:
            return asScreen(require('@screens/settings/display_timezone').default);
        case Screens.SETTINGS_DISPLAY_TIMEZONE_SELECT:
            return asScreen(require('@screens/settings/display_timezone_select').default);
        case Screens.SETTINGS_NOTIFICATION:
            return asScreen(require('@screens/settings/notifications').default);
        case Screens.SETTINGS_NOTIFICATION_AUTO_RESPONDER:
            return asScreen(require('@screens/settings/notification_auto_responder').default);
        case Screens.SETTINGS_NOTIFICATION_EMAIL:
            return asScreen(require('@screens/settings/notification_email').default);
        case Screens.SETTINGS_NOTIFICATION_MENTION:
            return asScreen(require('@screens/settings/notification_mention').default);
        case Screens.SETTINGS_NOTIFICATION_PUSH:
            return asScreen(require('@screens/settings/notification_push').default);
        case Screens.SETTINGS_NOTIFICATION_CALL:
            return asScreen(require('@screens/settings/notification_call').default);
        case Screens.SEND_FEEDBACK:
            return asScreen(require('@screens/send_feedback').default);
        case Screens.FEEDBACK_OPTIONS:
            return asScreen(require('@screens/feedback_options').default);
        case Screens.SHARE_FEEDBACK:
            return asScreen(require('@screens/share_feedback').default);
        case Screens.SNACK_BAR:
            return asScreen(require('@screens/snack_bar').default);
        case Screens.TABLE:
            return asScreen(require('@screens/table').default);
        case Screens.TEAM_SELECTOR_LIST:
            return asScreen(require('@screens/convert_gm_to_channel/team_selector_list').default);
        case Screens.TERMS_OF_SERVICE:
            return asScreen(require('@screens/terms_of_service').default);
        case Screens.THREAD:
            return asScreen(require('@screens/thread').default);
        case Screens.THREAD_FOLLOW_BUTTON:
            return asScreen(require('@screens/thread/thread_follow_button').default);
        case Screens.THREAD_OPTIONS:
            return asScreen(require('@screens/thread_options').default);
        case Screens.USER_PROFILE:
            return asScreen(require('@screens/user_profile').default);
        case Screens.SHOW_TRANSLATION:
            return asScreen(require('@screens/show_translation').default);
        case Screens.CALL:
            return asScreen(require('@calls/screens/call_screen').default);
        case Screens.INFOMANIAK_LOGIN:
        case Screens.SERVER:
            return asScreen(require('@screens/ik_login').default, false);
        case Screens.INFOMANIAK_NO_TEAMS:
            return asScreen(require('@screens/ik_no_teams/index').default);
        case Screens.INFOMANIAK_QUOTA_EXCEEDED:
            return asScreen(require('@screens/ik_quota_exceeded').default);
        case Screens.INFOMANIAK_REMINDER:
            return asScreen(require('@screens/ik_reminder').default);
        case Screens.DEBUG_PERFORMANCE:
            return asScreen(require('@screens/debug_performance').default);
        case Screens.SCHEDULED_POST_OPTIONS:
            return asScreen(require('@screens/scheduled_post_options').default);
        case Screens.INFOMANIAK_EVOLVE:
            return asScreen(require('@screens/ik_evolve').default);
        case Screens.AGENTS_REWRITE_OPTIONS:
            return asScreen(require('@agents/screens/rewrite_options').default);
    }

    logDebug(`Screen not found: ${screenName}`);
    return undefined;
}

function useNavigationOverlayState() {
    const [state, setState] = React.useState<NavigationOverlayState>(() => NavigationOverlayStore.getState());

    useEffect(() => {
        const unsubscribe = NavigationOverlayStore.subscribe(() => {
            setState(NavigationOverlayStore.getState());
        });

        setState(NavigationOverlayStore.getState());

        return unsubscribe;
    }, []);

    return state;
}

function NavigationOverlay() {
    const overlayState = useNavigationOverlayState();
    const overlayScreenName = overlayState.screen;

    const OverlayScreen = useMemo(() => {
        if (!overlayScreenName) {
            return undefined;
        }

        logInfo('[ExpoRouterBoot] Overlay resolving component', overlayScreenName);
        return getScreenComponent(overlayScreenName);
    }, [overlayScreenName]);

    useEffect(() => {
        if (!overlayScreenName) {
            return undefined;
        }

        logInfo('[ExpoRouterBoot] Overlay mounted', {
            screenName: overlayScreenName,
            propKeys: Object.keys(overlayState.props || {}),
        });

        return () => {
            logInfo('[ExpoRouterBoot] Overlay unmounted', overlayScreenName);
        };
    }, [overlayScreenName, overlayState.props]);

    if (!OverlayScreen || !overlayScreenName) {
        return null;
    }

    return (
        <View
            pointerEvents='box-none'
            style={styles.overlay}
        >
            <OverlayScreen
                {...overlayState.props}
                componentId={overlayScreenName}
            />
        </View>
    );
}

export default function ScreenRoute() {
    const params = useLocalSearchParams<{propsId?: string; screen?: string; targetScreen?: string}>();
    const pathname = usePathname();
    const screenNameParam = Array.isArray(params.screen) ? params.screen[0] : params.screen;
    const targetScreenNameParam = Array.isArray(params.targetScreen) ? params.targetScreen[0] : params.targetScreen;
    const screenNameFromPath = pathname.split('/').filter(Boolean)[0];
    const normalizedScreenNameFromPath = screenNameFromPath === 'undefined' ? undefined : screenNameFromPath;
    const propsId = Array.isArray(params.propsId) ? params.propsId[0] : params.propsId;
    const screenName = (targetScreenNameParam || screenNameParam || normalizedScreenNameFromPath) as AvailableScreens | undefined;
    const props = usePropsFromParams<ScreenRouteProps>();
    const propKeys = useMemo(() => Object.keys(props), [props]);

    const Screen = useMemo(() => {
        if (!screenName) {
            return undefined;
        }

        logInfo('[ExpoRouterBoot] ScreenRoute resolving component', screenName);
        return getScreenComponent(screenName);
    }, [screenName]);

    useEffect(() => {
        if (!screenName) {
            return undefined;
        }

        logInfo('[ExpoRouterBoot] ScreenRoute mounted', {screenName, propsId, propKeys});
        NavigationStore.addScreenToStack(screenName);

        return () => {
            logInfo('[ExpoRouterBoot] ScreenRoute unmounted', screenName);
            NavigationHeaderStore.clear(screenName);
            NavigationStore.removeScreenFromStack(screenName);
            NavigationPropsStore.remove(propsId);
        };
    }, [propKeys, propsId, screenName]);

    useEffect(() => {
        if (!screenName || !props.navigationOptions) {
            return;
        }

        NavigationHeaderStore.mergeOptions(screenName, props.navigationOptions);
    }, [props.navigationOptions, screenName]);

    if (!Screen || !screenName) {
        logInfo('[ExpoRouterBoot] ScreenRoute render skipped', {
            hasScreen: Boolean(Screen),
            params,
            pathname,
            normalizedScreenNameFromPath,
            screenName,
            screenNameFromPath,
            screenNameParam,
            targetScreenNameParam,
        });
        return null;
    }

    return (
        <View style={ROOT_STYLE}>
            <NavigationHeader screenName={screenName}/>
            <Screen
                {...props}
                componentId={screenName}
            />
            <NavigationOverlay/>
        </View>
    );
}
