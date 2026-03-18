// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {Platform, DeviceEventEmitter, type LayoutChangeEvent, StyleSheet} from 'react-native';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {type Edge, SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {storeLastViewedChannelIdAndServer, removeLastViewedChannelIdAndServer} from '@actions/app/global';
import {fetchPostsForChannel} from '@actions/remote/post';
import FreezeScreen from '@components/freeze_screen';
import {Events} from '@constants';
import {useServerUrl} from '@context/server';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {useChannelSwitch} from '@hooks/channel_switch';
import {useIsTablet} from '@hooks/device';
import {useDefaultHeaderHeight} from '@hooks/header';
import {useTeamSwitch} from '@hooks/team_switch';
import {useIsScreenVisible} from '@hooks/use_screen_visibility';
import SecurityManager from '@managers/security_manager';
import WebsocketManager from '@managers/websocket_manager';
import {popTopScreen} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';

import ChannelContent from './channel_content';
import ChannelHeader from './header';
import useGMasDMNotice from './use_gm_as_dm_notice';

import type PreferenceModel from '@typings/database/models/servers/preference';
import type {AvailableScreens} from '@typings/screens/navigation';

type ChannelProps = {
    channelId: string;
    componentId?: AvailableScreens;
    isCallsEnabledInChannel: boolean;
    groupCallsAllowed: boolean;
    isTabletView?: boolean;
    dismissedGMasDMNotice: PreferenceModel[];
    currentUserId: string;
    channelType: ChannelType;
    hasGMasDMFeature: boolean;
    includeBookmarkBar?: boolean;
    includeChannelBanner: boolean;
    scheduledPostCount: number;
};

const edges: Edge[] = Platform.select({
    android: ['left', 'right', 'bottom'],
    ios: ['left', 'right'],
}) as Edge[];

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
});

const Channel = ({
    channelId,
    componentId,
    isCallsEnabledInChannel,
    groupCallsAllowed,
    isTabletView,
    dismissedGMasDMNotice,
    channelType,
    currentUserId,
    hasGMasDMFeature,

    // includeBookmarkBar,
    includeChannelBanner,
    scheduledPostCount,
}: ChannelProps) => {
    useGMasDMNotice(currentUserId, channelType, dismissedGMasDMNotice, hasGMasDMFeature);
    const isTablet = useIsTablet();
    const insets = useSafeAreaInsets();
    const [shouldRenderPosts, setShouldRenderPosts] = useState(false);
    const switchingTeam = useTeamSwitch();
    const switchingChannels = useChannelSwitch();
    const defaultHeight = useDefaultHeaderHeight();
    const [containerHeight, setContainerHeight] = useState(0);
    const serverUrl = useServerUrl();
    const shouldRender = !switchingTeam && !switchingChannels && shouldRenderPosts && Boolean(channelId);
    const isVisible = useIsScreenVisible(componentId);
    const [isEmojiSearchFocused, setIsEmojiSearchFocused] = useState(false);

    const safeAreaViewEdges: Edge[] = useMemo(() => {
        if (isTablet) {
            return ['left', 'right'];
        }
        if (isEmojiSearchFocused) {
            return ['left', 'right'];
        }
        return ['left', 'right', 'bottom'];
    }, [isTablet, isEmojiSearchFocused]);

    const handleBack = useCallback(() => {
        // Ik change : sometimes componentId is undefined and it crashes the app only on tablet
        if (componentId) {
            popTopScreen(componentId);
        }
    }, [componentId]);

    const computedEdges: Edge[] = isTablet ? ['left', 'right'] : edges;

    useAndroidHardwareBackHandler(componentId, handleBack);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener(Events.POST_DELETED_FOR_CHANNEL, ({serverUrl: url, channelId: id}) => {
            if (serverUrl === url && channelId === id) {
                fetchPostsForChannel(serverUrl, channelId, false, true);
            }
        });
        return () => listener.remove();
    }, [serverUrl, channelId]);

    const marginTop = defaultHeight + (isTablet ? 0 : -insets.top);
    useEffect(() => {
        const wsClient = WebsocketManager.getClient(serverUrl);

        // This is done so that the header renders
        // and the screen does not look totally blank
        const raf = requestAnimationFrame(() => {
            setShouldRenderPosts(Boolean(channelId));
        });

        // This is done to give time to the WS event
        const t = setTimeout(() => {
            EphemeralStore.removeSwitchingToChannel(channelId);
        }, 500);

        storeLastViewedChannelIdAndServer(channelId);
        wsClient?.bindPresenceChannel(channelId);

        return () => {
            wsClient?.unbindPresenceChannel();
            cancelAnimationFrame(raf);
            clearTimeout(t);
            removeLastViewedChannelIdAndServer();
            EphemeralStore.removeSwitchingToChannel(channelId);
        };
    }, [channelId]);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        setContainerHeight(e.nativeEvent.layout.height);
    }, []);

    return (
        <FreezeScreen>
            <SafeAreaView
                style={styles.flex}
                mode='margin'
                edges={safeAreaViewEdges}
                testID='channel.screen'
                onLayout={onLayout}
                nativeID={componentId ? SecurityManager.getShieldScreenId(componentId) : undefined}
            >
                <ChannelHeader
                    channelId={channelId}
                    componentId={componentId}
                    callsEnabledInChannel={isCallsEnabledInChannel}
                    groupCallsAllowed={groupCallsAllowed}
                    isTabletView={isTabletView}
                    shouldRenderBookmarks={shouldRender}
                    shouldRenderChannelBanner={includeChannelBanner}
                />
                {Platform.OS === 'ios' ? (
                    <KeyboardProvider>
                        {shouldRender && (
                            <ChannelContent
                                channelId={channelId}
                                marginTop={marginTop}
                                scheduledPostCount={scheduledPostCount}
                                containerHeight={containerHeight}
                                enabled={isVisible || shouldRender}
                                onEmojiSearchFocusChange={setIsEmojiSearchFocused}
                            />
                        )}
                    </KeyboardProvider>
                ) : (
                    shouldRender && (
                        <ChannelContent
                            channelId={channelId}
                            marginTop={marginTop}
                            scheduledPostCount={scheduledPostCount}
                            containerHeight={containerHeight}
                            enabled={isVisible || shouldRender}
                            onEmojiSearchFocusChange={setIsEmojiSearchFocused}
                        />
                    )
                )}
            </SafeAreaView>
        </FreezeScreen>
    );
};

export default Channel;
