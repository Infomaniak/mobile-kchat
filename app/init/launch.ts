// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Alert, AppState, Linking, Platform} from 'react-native';
import {Notifications} from 'react-native-notifications';

import {removePost} from '@actions/local/post';
import {switchToChannelById} from '@actions/remote/channel';
import {appEntry, pushNotificationEntry, upgradeEntry} from '@actions/remote/entry';
import {fetchAndSwitchToThread} from '@actions/remote/thread';
import LocalConfig from '@assets/config.json';
import {DeepLink, Launch, PushNotification} from '@constants';
import {PostTypes} from '@constants/post';
import DatabaseManager from '@database/manager';
import {getActiveServerUrl, getServerCredentials, removeServerCredentials} from '@init/credentials';
import PerformanceMetricsManager from '@managers/performance_metrics_manager';
import {getLastViewedChannelIdAndServer, getOnboardingViewed, getLastViewedThreadIdAndServer} from '@queries/app/global';
import {getAllServers} from '@queries/app/servers';
import {queryPostsByType} from '@queries/servers/post';
import {getThemeForCurrentTeam} from '@queries/servers/preference';
import {getCurrentUserId} from '@queries/servers/system';
import {resetToHome, resetToOnboarding, resetToInfomaniakLogin} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';
import {getLaunchPropsFromDeepLink, handleDeepLink} from '@utils/deep_link';
import {logInfo} from '@utils/log';
import {convertToNotificationData} from '@utils/notification';
import {captureMessage} from '@utils/sentry';
import {removeProtocol} from '@utils/url';

import type {DeepLinkWithData, LaunchProps} from '@typings/launch';

const initialNotificationTypes = [PushNotification.NOTIFICATION_TYPE.MESSAGE];

export const initialLaunch = async () => {
    logInfo('[ExpoRouterBoot] initialLaunch(): begin');
    const deepLinkUrl = await Linking.getInitialURL();
    logInfo('[ExpoRouterBoot] initialLaunch(): initial URL', deepLinkUrl || 'none');
    if (deepLinkUrl) {
        return launchAppFromDeepLink(deepLinkUrl, true);
    }

    const notification = await Notifications.getInitialNotification();
    logInfo('[ExpoRouterBoot] initialLaunch(): initial notification', notification ? 'present' : 'none');
    let tapped = Platform.select({android: true, ios: false})!;
    if (Platform.OS === 'ios' && notification) {
        // when a notification is received on iOS, getInitialNotification, will return the notification
        // as the app will initialized cause we are using background fetch,
        // that does not necessarily mean that the app was opened cause of the notification was tapped.
        // Here we are going to dettermine if the notification still exists in NotificationCenter to determine if
        // the app was opened because of a tap or cause of the background fetch init
        const delivered = await Notifications.ios.getDeliveredNotifications();
        tapped = delivered.find((d) => (d as unknown as NotificationData).ack_id === notification?.payload.ack_id) == null;
    }
    if (initialNotificationTypes.includes(notification?.payload?.type) && tapped) {
        const notificationData = convertToNotificationData(notification!);
        EphemeralStore.setProcessingNotification(notificationData.identifier);
        return launchAppFromNotification(notificationData, true);
    }

    const coldStart = notification ? (tapped || AppState.currentState === 'active') : true;
    logInfo('[ExpoRouterBoot] initialLaunch(): launchApp normal', {coldStart});
    return launchApp({launchType: Launch.Normal, coldStart});
};

const launchAppFromDeepLink = async (deepLinkUrl: string, coldStart = false) => {
    const props = getLaunchPropsFromDeepLink(deepLinkUrl, coldStart);
    return launchApp(props);
};

const launchAppFromNotification = async (notification: NotificationWithData, coldStart = false) => {
    const props = await getLaunchPropsFromNotification(notification, coldStart);
    return launchApp(props);
};

/**
 *
 * @param props set of properties used to determine how to launch the app depending on the containing values
 * @param resetNavigation used when loading the add_server screen and remove all the navigation stack

 * @returns a redirection to a screen, either onboarding, add_server, login or home depending on the scenario
 */
export const launchApp = async (props: LaunchProps) => {
    logInfo('[ExpoRouterBoot] launchApp(): begin', props);
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
                        return '';
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
            break;
        }
        default:
            serverUrl = await getActiveServerUrl();
            logInfo('[ExpoRouterBoot] launchApp(): active server URL loaded', serverUrl || 'none');
            break;
    }

    if (props.launchError && !serverUrl) {
        serverUrl = await getActiveServerUrl();
    }

    cleanupEphemeralPosts();
    logInfo('[ExpoRouterBoot] launchApp(): cleanupEphemeralPosts started');

    if (serverUrl) {
        logInfo('[ExpoRouterBoot] launchApp(): checking credentials', serverUrl);
        const credentials = await getServerCredentials(serverUrl);
        logInfo('[ExpoRouterBoot] launchApp(): credentials', credentials ? 'present' : 'missing');
        if (credentials) {
            const database = DatabaseManager.serverDatabases[serverUrl]?.database;
            let hasCurrentUser = false;
            if (database) {
                EphemeralStore.theme = await getThemeForCurrentTeam(database);
                const currentUserId = await getCurrentUserId(database);
                hasCurrentUser = Boolean(currentUserId);
            }

            let launchType = props.launchType;
            if (!hasCurrentUser) {
                // migrating from v1
                if (launchType === Launch.Normal) {
                    launchType = Launch.Upgrade;
                }

                const result = await upgradeEntry(serverUrl);
                if (result.error) {
                    Alert.alert(
                        'Error Upgrading',
                        `An error occurred while upgrading the app to the new version.\n\nDetails: ${result.error}\n\nThe app will now quit.`,
                        [{
                            text: 'OK',
                            onPress: async () => {
                                await DatabaseManager.destroyServerDatabase(serverUrl!);
                                await removeServerCredentials(serverUrl!);
                            },
                        }],
                    );
                    return '';
                }
            }

            return launchToHome({...props, launchType, serverUrl});
        }
    }

    const onboardingViewed = LocalConfig.ShowOnboarding && await getOnboardingViewed();

    // if the config value is set and the onboarding has not been seeing yet, show the onboarding
    if (LocalConfig.ShowOnboarding && !onboardingViewed) {
        logInfo('[ExpoRouterBoot] launchApp(): routing onboarding');
        return resetToOnboarding(props);
    }

    logInfo('[ExpoRouterBoot] launchApp(): routing infomaniak login');
    return resetToInfomaniakLogin(props);
};

export const launchToHome = async (props: LaunchProps) => {
    logInfo('[ExpoRouterBoot] launchToHome(): begin', props);
    let openPushNotification = false;

    switch (props.launchType) {
        case Launch.DeepLink: {
            appEntry(props.serverUrl!);
            break;
        }
        case Launch.Notification: {
            const extra = props.extra as NotificationWithData;
            openPushNotification = Boolean(props.serverUrl && !props.launchError && extra.userInteraction && extra.payload?.channel_id && !extra.payload?.userInfo?.local);
            if (openPushNotification) {
                await resetToHome(props);
                return pushNotificationEntry(props.serverUrl!, extra.payload!, 'Notification');
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

    logInfo('Launch app in Home screen');
    logInfo('[ExpoRouterBoot] launchToHome(): resetToHome');
    return resetToHome(props);
};

export const relaunchApp = (props: LaunchProps) => {
    return launchApp(props);
};

export const getLaunchPropsFromNotification = async (notification: NotificationWithData, coldStart = false): Promise<LaunchProps> => {
    const launchProps: LaunchProps = {
        launchType: Launch.Notification,
        coldStart,
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

    return launchProps;
};

export async function cleanupEphemeralPosts() {
    const servers = await getAllServers();

    for (const server of servers) {
        const database = DatabaseManager.serverDatabases[server.url]?.database;
        if (!database) {
            continue;
        }
        /* eslint-disable-next-line no-await-in-loop */
        const posts = await queryPostsByType(database, PostTypes.EPHEMERAL).fetch();
        posts.forEach((post) => removePost(server.url, post));
    }
}
