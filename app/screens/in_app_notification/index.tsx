// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Portal} from '@gorhom/portal';
import {useNavigation} from 'expo-router';
import React, {useCallback, useRef, useState} from 'react';
import {DeviceEventEmitter, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GestureDetector, Gesture, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {FullWindowOverlay} from 'react-native-screens';

import {openNotification} from '@actions/remote/notifications';
import {Navigation as NavigationTypes} from '@constants';
import DatabaseManager from '@database/manager';
import {useIsTablet} from '@hooks/device';
import useDidMount from '@hooks/did_mount';
import {usePreventDoubleTap} from '@hooks/utils';
import InAppNotificationStore from '@store/in_app_notification_store';
import {changeOpacity} from '@utils/theme';
import {secureGetFromRecord} from '@utils/types';

import Icon from './icon';
import Server from './server';
import Title from './title';

type InAppNotificationProps = {
    notification: NotificationWithData;
    serverName?: string;
    serverUrl?: string;
}

const AUTO_DISMISS_TIME_MILLIS = 5000;

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        backgroundColor: changeOpacity('#000', 0.88),
        borderRadius: 12,
        flexDirection: 'row',
        padding: 10,
        width: '95%',
    },
    tablet: {
        width: 500,
    },
    flex: {
        width: '100%',
    },
    message: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'SuisseIntl-Regular',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        marginLeft: 10,
        minHeight: 60,
    },
    touchable: {
        flexDirection: 'row',
    },
    gestureHandler: {
        flex: 0,
    },
});

function InAppNotificationContent({serverName, serverUrl, notification}: InAppNotificationProps) {
    const navigation = useNavigation();
    const [animate, setAnimate] = useState(false);
    const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
    const initial = useSharedValue(-130);
    const isTablet = useIsTablet();
    const insetTop = initialWindowMetrics?.insets.top ?? 0;
    const tapped = useRef<boolean>(false);

    const animateDismissOverlay = () => {
        cancelDismissTimer();
        setAnimate(true);
        dismissTimerRef.current = setTimeout(dismiss, 1000);
    };

    const cancelDismissTimer = () => {
        if (dismissTimerRef.current) {
            clearTimeout(dismissTimerRef.current);
        }
    };

    const dismiss = useCallback(() => {
        cancelDismissTimer();
        InAppNotificationStore.dismiss();
    }, []);

    const notificationTapped = usePreventDoubleTap(useCallback(() => {
        tapped.current = true;
        dismiss();
    }, [dismiss]));

    useDidMount(() => {
        initial.value = 0;

        dismissTimerRef.current = setTimeout(() => {
            if (!tapped.current) {
                animateDismissOverlay();
            }
        }, AUTO_DISMISS_TIME_MILLIS);

        return cancelDismissTimer;
    });

    useDidMount(() => {
        const beforeRemove = navigation.addListener('beforeRemove', () => {
            if (tapped.current && serverUrl && notification) {
                const {channel_id} = notification.payload || {};
                if (channel_id) {
                    openNotification(serverUrl, notification);
                }
            }
        });

        return () => beforeRemove();
    });

    useDidMount(() => {
        const listener = DeviceEventEmitter.addListener(NavigationTypes.NAVIGATION_SHOW_OVERLAY, dismiss);

        return () => listener.remove();
    });

    const animatedStyle = useAnimatedStyle(() => {
        const translateY = animate ? withTiming(-130, {duration: 300}) : withTiming(initial.value, {duration: 300});

        return {
            marginTop: insetTop,
            transform: [{translateY}],
        };
    }, [animate, insetTop]);

    const message = notification?.payload?.body || notification?.payload?.message;
    const gesture = Gesture.Pan().activeOffsetY(-20).onStart(() => runOnJS(animateDismissOverlay)());

    const database = serverUrl ? secureGetFromRecord(DatabaseManager.serverDatabases, serverUrl)?.database : undefined;

    if (!notification) {
        return null;
    }

    return (
        <GestureHandlerRootView style={styles.gestureHandler}>
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[styles.container, isTablet ? styles.tablet : undefined, animatedStyle]}
                    testID='in_app_notification.screen'
                    nativeID='in_app_notification.screen'
                >
                    <View style={styles.flex}>
                        <TouchableOpacity
                            style={styles.touchable}
                            onPress={notificationTapped}
                            activeOpacity={1}
                        >
                            {Boolean(database) && serverUrl &&
                            <Icon
                                database={database!}
                                fromWebhook={notification.payload?.from_webhook === 'true'}
                                overrideIconUrl={notification.payload?.override_icon_url}
                                senderId={notification.payload?.sender_id || ''}
                                serverUrl={serverUrl}
                                useUserIcon={notification.payload?.use_user_icon === 'true'}
                            />
                            }
                            <View style={styles.titleContainer}>
                                <Title channelName={notification.payload?.channel_name || ''}/>
                                <View style={styles.flex}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                        style={styles.message}
                                        testID='in_app_notification.message'
                                    >
                                        {message}
                                    </Text>
                                </View>
                                {Boolean(serverName) && <Server serverName={serverName!}/>}
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

function InAppNotification() {
    const [state, setState] = useState(InAppNotificationStore.getState());

    useDidMount(() => {
        const sub = InAppNotificationStore.observe().subscribe(setState);
        return () => sub.unsubscribe();
    });

    if (!state.visible || !state.notification) {
        return null;
    }

    return (
        <Portal hostName='notification'>
            <FullWindowOverlay>
                <InAppNotificationContent
                    key={state.id}
                    notification={state.notification}
                    serverName={state.serverName}
                    serverUrl={state.serverUrl}
                />
            </FullWindowOverlay>
        </Portal>
    );
}

export default InAppNotification;
