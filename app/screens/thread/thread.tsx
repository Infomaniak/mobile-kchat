// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from 'expo-router';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, type LayoutChangeEvent, StyleSheet} from 'react-native';
import {type Edge, SafeAreaView} from 'react-native-safe-area-context';

import {storeLastViewedThreadIdAndServer, removeLastViewedThreadIdAndServer} from '@actions/app/global';
import RoundedHeaderContext from '@components/rounded_header_context';
import {Screens} from '@constants';
import useAndroidHardwareBackHandler from '@hooks/android_back_handler';
import {useIsTablet} from '@hooks/device';
import useDidUpdate from '@hooks/did_update';
import EphemeralStore from '@store/ephemeral_store';
import {NavigationStore} from '@store/navigation_store';

import ThreadContent from './thread_content';
import ThreadFollowButton from './thread_follow_button';

import type PostModel from '@typings/database/models/servers/post';

type ThreadProps = {
    isCRTEnabled: boolean;
    rootId: string;
    rootPost?: PostModel;
    scheduledPostCount: number;
};

const styles = StyleSheet.create({
    flex: {flex: 1},
});

const Thread = ({
    isCRTEnabled,
    rootId,
    rootPost,
    scheduledPostCount,
}: ThreadProps) => {
    const [containerHeight, setContainerHeight] = useState(0);
    const navigation = useNavigation();
    const isVisible = useIsFocused();
    const isTablet = useIsTablet();
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

    const close = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    useAndroidHardwareBackHandler(Screens.THREAD, close);

    useEffect(() => {
        if (isCRTEnabled && rootId) {
            navigation.setOptions({
                headerRight: () => (
                    <ThreadFollowButton threadId={rootId}/>
                ),
            });
        } else {
            navigation.setOptions({
                headerRight: undefined,
            });
        }
    }, [rootId, isCRTEnabled, navigation]);

    useEffect(() => {
        const isFromGlobalOrNotification = NavigationStore.getScreensInStack()[1] === Screens.GLOBAL_THREADS || NavigationStore.getScreensInStack()[1] === Screens.HOME;
        if (isCRTEnabled && isFromGlobalOrNotification) {
            storeLastViewedThreadIdAndServer(rootId);
        }

        return () => {
            if (isCRTEnabled) {
                removeLastViewedThreadIdAndServer();
            }
            if (rootId === EphemeralStore.getCurrentThreadId()) {
                EphemeralStore.setCurrentThreadId('');
            }
            navigation.setOptions({
                headerRight: undefined,
            });
        };
    }, [isCRTEnabled, navigation, rootId]);

    useDidUpdate(() => {
        if (!rootPost) {
            close();
        }
    }, [rootPost]);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        setContainerHeight(e.nativeEvent.layout.height);
    }, []);

    return (
        <SafeAreaView
            style={styles.flex}
            edges={safeAreaViewEdges}
            testID='thread.screen'
            onLayout={onLayout}
        >
            <RoundedHeaderContext/>
            {Boolean(rootPost) &&
            (Platform.OS === 'ios' ? (
                <ThreadContent
                    rootId={rootId}
                    rootPost={rootPost!}
                    scheduledPostCount={scheduledPostCount}
                    containerHeight={containerHeight}
                    enabled={isVisible}
                    onEmojiSearchFocusChange={setIsEmojiSearchFocused}
                />
            ) : (
                <ThreadContent
                    rootId={rootId}
                    rootPost={rootPost!}
                    scheduledPostCount={scheduledPostCount}
                    containerHeight={containerHeight}
                    enabled={isVisible}
                    onEmojiSearchFocusChange={setIsEmojiSearchFocused}
                />
            ))
            }
        </SafeAreaView>
    );
};

export default Thread;
