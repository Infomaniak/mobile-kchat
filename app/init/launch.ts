// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {router} from 'expo-router';
import {AppState, DeviceEventEmitter, Linking, Platform} from 'react-native';
import {Notifications} from 'react-native-notifications';

import {removePost} from '@actions/local/post';
import {switchToChannelById} from '@actions/remote/channel';
import {appEntry, pushNotificationEntry, upgradeEntry} from '@actions/remote/entry';
import {fetchAndSwitchToThread} from '@actions/remote/thread';
import LocalConfig from '@assets/config.json';
import {DeepLink, Events, Launch, PushNotification, Screens} from '@constants';
import {PostTypes} from '@constants/post';
import {getDefaultThemeByAppearance} from '@context/theme';
import DatabaseManager from '@database/manager';
import {getActiveServerUrl, getServerCredentials} from '@init/credentials';
import PerformanceMetricsManager from '@managers/performance_metrics_manager';
import {getLastViewedChannelIdAndServer, getOnboardingViewed, getLastViewedThreadIdAndServer} from '@queries/app/global';
import {getAllServers} from '@queries/app/servers';
import {queryPostsByType} from '@queries/servers/post';
import {getThemeForCurrentTeam} from '@queries/servers/preference';
import {getCurrentUserId} from '@queries/servers/system';
import {getExpoRouterPath, propsToParams} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';
import {handleDeepLink, getLaunchPropsFromDeepLink} from '@utils/deep_link';
import {logError} from '@utils/log';
import {convertToNotificationData} from '@utils/notification';
import {captureMessage} from '@utils/sentry';
import {removeProtocol} from '@utils/url';

import type {DeepLinkWithData, LaunchProps} from '@typings/launch';

export type ExpoRouterLaunchResult = {
    route: string;
    params: Record<string, any>;
};

const initialNotificationTypes = [PushNotification.NOTIFICATION_TYPE.MESSAGE];

export async function determineInitialExpoRoute(): Promise<ExpoRouterLaunchResult> {
    const deepLinkUrl = await Linking.getInitialURL();
    if (deepLinkUrl) {
        return determineRouteFromDeeplink(deepLinkUrl);
    }

    const notification = await Notifications.getInitialNotification();
    let tapped = Platform.select({android: true, ios: false})!;
    if (Platform.OS === 'ios' && notification) {
        const delivered = await Notifications.ios.getDeliveredNotifications();
        tapped = delivered.find((d) => (d as unknown as NotificationData).ack_id === notification?.payload.ack_id) == null;
    }
    if (initialNotificationTypes.includes(notification?.payload?.type) && tapped) {
        const notificationData = convertToNotificationData(notification!);
        EphemeralStore.setProcessingNotification(notificationData.identifier);
        return determineRouteFromNotification(notificationData);
    }

    const coldStart = notification ? (tapped || AppState.currentState === 'active') : true;
    return determineRoute({launchType: Launch.Normal, coldStart});
}

async function determineRouteFromDeeplink(deepLinkUrl: string): Promise<ExpoRouterLaunchResult> {
    const props = getLaunchPropsFromDeepLink(deepLinkUrl, true);
    return determineRoute(props);
}

async function determineRouteFromNotification(notification: NotificationWithData): Promise<ExpoRouterLaunchResult> {
    const launchProps: LaunchProps = {
        launchType: Launch.Notification,
        coldStart: true,
    };

    const {payload} = notification;
    launchProps.extra = notification;
    let serverUrl: string | undefined;

    try {
        if (payload?.server_url) {
            DatabaseManager.getServerDatabaseAndOperator(payload.server_url);
            serverUrl = payload.server_url;
        } else if (payload?.server_id) {
            serverUrl = await DatabaseManager.getServerUrlFromIdentifier(payload.server_id);
        }
    } catch {
        launchProps.launchError = true;
    }

    if (serverUrl) {
        launchProps.serverUrl = serverUrl;
    } else {
        launchProps.launchError = true;
    }

    return determineRoute(launchProps);
}

export const determineRoute = async (props: LaunchProps): Promise<ExpoRouterLaunchResult> => {
    let serverUrl: string | undefined;
    switch (props?.launchType) {
        case Launch.DeepLink:
            if (props.extra && props.extra.type !== DeepLink.Invalid) {
                const extra = props.extra as DeepLinkWithData;
                const existingServer = DatabaseManager.searchUrl(extra.data!.serverUrl);
                serverUrl = existingServer;
                props.serverUrl = serverUrl || extra.data?.serverUrl;
                if (extra.type === DeepLink.MagicLink && extra.data && 'token' in extra.data) {
                    const result = await handleDeepLink(extra);
                    if (result.error) {
                        props.launchError = true;
                    } else {
                        serverUrl = await getActiveServerUrl();
                        return determineAuthenticatedRoute({...props, serverUrl});
                    }
                } else if (!serverUrl && extra.type !== DeepLink.Server) {
                    props.launchError = true;
                } else if (extra.type === DeepLink.Server) {
                    if (removeProtocol(serverUrl) === extra.data?.serverUrl) {
                        props.extra = undefined;
                        props.launchType = Launch.Normal;
                    } else {
                        serverUrl = await getActiveServerUrl();
                    }
                }
            }
            break;
        case Launch.Notification: {
            serverUrl = props.serverUrl;
            const extra = props.extra as NotificationWithData;
            const sessionExpiredNotification = Boolean(props.serverUrl && extra.payload?.type === PushNotification.NOTIFICATION_TYPE.SESSION);
            if (sessionExpiredNotification) {
                DeviceEventEmitter.emit(Events.SESSION_EXPIRED, serverUrl);
                return determineRouteFromLaunchProps({launchType: Launch.Normal, coldStart: false});
            }
            break;
        }
        default:
            serverUrl = await getActiveServerUrl();
            break;
    }

    if (props.launchError && !serverUrl) {
        serverUrl = await getActiveServerUrl();
    }

    cleanupEphemeralPosts();

    return determineRouteFromLaunchProps({...props, serverUrl});
};

export async function determineRouteFromLaunchProps(props: LaunchProps): Promise<ExpoRouterLaunchResult> {
    if (props.serverUrl) {
        const credentials = await getServerCredentials(props.serverUrl);
        if (credentials) {
            const database = DatabaseManager.serverDatabases[props.serverUrl]?.database;
            let hasCurrentUser = false;
            if (database) {
                EphemeralStore.theme = await getThemeForCurrentTeam(database);
                const currentUserId = await getCurrentUserId(database);
                hasCurrentUser = Boolean(currentUserId);
            }

            let launchType = props.launchType;
            if (!hasCurrentUser) {
                if (launchType === Launch.Normal) {
                    launchType = Launch.Upgrade;
                }

                const result = await upgradeEntry(props.serverUrl);
                if (result.error) {
                    return {
                        route: getExpoRouterPath(Screens.IK_LOGIN)!,
                        params: {launchError: true},
                    };
                }
            }

            return determineAuthenticatedRoute({...props, launchType, serverUrl: props.serverUrl});
        }
    }

    const onboardingViewed = LocalConfig.ShowOnboarding ? await getOnboardingViewed() : true;
    const theme = getDefaultThemeByAppearance();

    if (LocalConfig.ShowOnboarding && !onboardingViewed) {
        return {
            route: getExpoRouterPath(Screens.ONBOARDING)!,
            params: {
                ...props,
                theme: JSON.stringify(theme),
            },
        };
    }

    return {
        route: getExpoRouterPath(Screens.IK_LOGIN)!,
        params: {
            ...props,
            theme: JSON.stringify(theme),
        },
    };
}

async function determineAuthenticatedRoute(props: LaunchProps): Promise<ExpoRouterLaunchResult> {
    switch (props.launchType) {
        case Launch.DeepLink: {
            appEntry(props.serverUrl!);
            break;
        }
        case Launch.Notification: {
            const extra = props.extra as NotificationWithData;
            const openPushNotification = Boolean(props.serverUrl && !props.launchError && extra.userInteraction && extra.payload?.channel_id && !extra.payload?.userInfo?.local);
            if (openPushNotification) {
                pushNotificationEntry(props.serverUrl!, extra.payload!, 'Notification');
                break;
            }

            captureMessage(`Notification not redirected: serverUrl=${Boolean(props.serverUrl)}, launchError=${props.launchError}, userInteraction=${extra.userInteraction}, channelId=${extra.payload?.channel_id}, isLocal=${extra.payload?.userInfo?.local}`);
            appEntry(props.serverUrl!);
            break;
        }
        case Launch.Normal:
            if (props.coldStart) {
                const lastViewedChannel = await getLastViewedChannelIdAndServer();
                const lastViewedThread = await getLastViewedThreadIdAndServer();

                if (lastViewedThread && lastViewedThread.server_url === props.serverUrl && lastViewedThread.thread_id) {
                    PerformanceMetricsManager.setLoadTarget('THREAD');
                    fetchAndSwitchToThread(props.serverUrl!, lastViewedThread.thread_id);
                } else if (lastViewedChannel && lastViewedChannel.server_url === props.serverUrl && lastViewedChannel.channel_id) {
                    PerformanceMetricsManager.setLoadTarget('CHANNEL');
                    switchToChannelById(props.serverUrl!, lastViewedChannel.channel_id);
                } else {
                    PerformanceMetricsManager.setLoadTarget('HOME');
                }

                appEntry(props.serverUrl!);
            }
            break;
    }

    return {
        route: getExpoRouterPath(Screens.HOME)!,
        params: props,
    };
}

export async function cleanupEphemeralPosts() {
    const servers = await getAllServers();

    await Promise.all(
        servers.map(async (server) => {
            const database = DatabaseManager.serverDatabases[server.url]?.database;
            if (!database) {
                return Promise.resolve();
            }
            const posts = await queryPostsByType(database, PostTypes.EPHEMERAL).fetch();
            return Promise.all(posts.map((post) => removePost(server.url, post)));
        }),
    );
}

export async function relaunchApp(props?: Partial<LaunchProps>) {
    try {
        const launchRoute = await determineRouteFromLaunchProps({launchType: Launch.Normal, coldStart: false, ...props});
        requestAnimationFrame(() => {
            router.replace({pathname: launchRoute.route, params: propsToParams(launchRoute.params)});
        });
    } catch (error) {
        logError('[launch] relaunchApp failed to determine the route', error);
    }
}

export async function launchToHome(props: LaunchProps) {
    // With expo-router, navigation to home is handled by the root index route redirect.
    // Perform the same entry logic as determineAuthenticatedRoute, then the router
    // will navigate to the home screen.
    if (props.serverUrl) {
        switch (props.launchType) {
            case Launch.DeepLink:
                appEntry(props.serverUrl);
                break;
            case Launch.Notification: {
                const extra = props.extra as NotificationWithData;
                const openPushNotification = Boolean(props.serverUrl && !props.launchError && extra.userInteraction && extra.payload?.channel_id && !extra.payload?.userInfo?.local);
                if (openPushNotification) {
                    pushNotificationEntry(props.serverUrl, extra.payload!, 'Notification');
                } else {
                    appEntry(props.serverUrl);
                }
                break;
            }
            case Launch.Normal:
                if (props.coldStart) {
                    const lastViewedChannel = await getLastViewedChannelIdAndServer();
                    const lastViewedThread = await getLastViewedThreadIdAndServer();

                    if (lastViewedThread && lastViewedThread.server_url === props.serverUrl && lastViewedThread.thread_id) {
                        fetchAndSwitchToThread(props.serverUrl, lastViewedThread.thread_id);
                    } else if (lastViewedChannel && lastViewedChannel.server_url === props.serverUrl && lastViewedChannel.channel_id) {
                        switchToChannelById(props.serverUrl, lastViewedChannel.channel_id);
                    }
                    appEntry(props.serverUrl);
                }
                break;
        }
    }
}
