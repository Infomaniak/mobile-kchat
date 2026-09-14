// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DEFAULT_INPUT_ACCESSORY_HEIGHT} from '@keyboard';
import React, {type ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DeviceEventEmitter, type ListRenderItemInfo, Platform, type StyleProp, StyleSheet, type ViewStyle, type NativeSyntheticEvent, type NativeScrollEvent} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {KeyboardState, useAnimatedKeyboard, useKeyboardState as useControllerKeyboardState} from 'react-native-keyboard-controller';
import Animated, {scrollTo, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, type AnimatedStyle} from 'react-native-reanimated';
import {scheduleOnRN, scheduleOnUI} from 'react-native-worklets';

import {removePost} from '@actions/local/post';
import {fetchPosts, fetchPostThread} from '@actions/remote/post';
import CombinedUserActivity from '@components/post_list/combined_user_activity';
import DateSeparator from '@components/post_list/date_separator';
import LimitedMessages, {type KSuiteLimit} from '@components/post_list/limited_messages/limited_messages';
import NewMessagesLine from '@components/post_list/new_message_line';
import Post from '@components/post_list/post';
import ThreadOverview from '@components/post_list/thread_overview';
import {Events, Screens} from '@constants';
import {isAndroidEdgeToEdge, isEdgeToEdge} from '@constants/device';
import {PostTypes} from '@constants/post';
import {useKeyboardState} from '@context/keyboard_state';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useInputAccessoryViewGesture} from '@hooks/use_input_accessory_view_gesture';
import EphemeralStore from '@store/ephemeral_store';
import {logDebug} from '@utils/log';
import {getDateForDateLine, preparePostList} from '@utils/post_list';

import {INITIAL_BATCH_TO_RENDER, SCROLL_POSITION_CONFIG, VIEWABILITY_CONFIG} from './config';
import MoreMessages from './more_messages';
import ScrollToEndView from './scroll_to_end_view';

import type {PostListItem, PostListOtherItem, ViewableItemsChanged, ViewableItemsChangedListenerEvent} from '@typings/components/post_list';
import type PostModel from '@typings/database/models/servers/post';
import type {AvailableScreens} from '@typings/screens/navigation';

type Props = {
    appsEnabled: boolean;
    channelId: string;
    contentContainerStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
    currentTimezone: string | null;
    currentUserId: string;
    currentUsername: string;
    customEmojiNames: string[];
    disablePullToRefresh?: boolean;
    forceShowScrollToEndBtn?: boolean;
    highlightedId?: PostModel['id'];
    highlightPinnedOrSaved?: boolean;
    isCRTEnabled?: boolean;
    isPostAcknowledgementEnabled?: boolean;
    lastViewedAt: number;
    location: AvailableScreens;
    onEndReached?: () => void;
    onScrollToEnd?: () => boolean | void;
    posts: PostModel[];
    rootId?: string;
    scrollTargetId?: PostModel['id'];
    shouldRenderReplyButton?: boolean;
    shouldShowJoinLeaveMessages: boolean;
    showMoreMessages?: boolean;
    showNewMessageLine?: boolean;
    footer?: ReactElement;
    header?: ReactElement;
    testID: string;
    savedPostIds: Set<string>;
    isChannelAutotranslated: boolean;
}

type onScrollEndIndexListenerEvent = (endIndex: number) => void;

type ScrollIndexFailed = {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
};

export type PostListHandle = {scrollToEnd: () => void};

export const postListRef = React.createRef<PostListHandle>();

const CONTENT_OFFSET_THRESHOLD = 160;
const HIGHLIGHT_SCROLL_RETRY_TIMEOUT = 250;
const MAX_HIGHLIGHT_SCROLL_RETRIES = 3;
const SCROLL_EVENT_THROTTLE = Platform.select({android: 17, default: 60});

const keyExtractor = (item: PostListItem | PostListOtherItem) => (item.type === 'post' ? item.value.currentPost.id : item.value);

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});

const PostList = ({
    appsEnabled,
    channelId,
    contentContainerStyle,
    currentTimezone,
    currentUserId,
    currentUsername,
    customEmojiNames,
    disablePullToRefresh,
    footer,
    forceShowScrollToEndBtn,
    header,
    highlightedId,
    highlightPinnedOrSaved = true,
    isCRTEnabled,
    isPostAcknowledgementEnabled,
    lastViewedAt,
    location,
    onEndReached,
    onScrollToEnd,
    posts,
    rootId,
    scrollTargetId,
    shouldRenderReplyButton = true,
    shouldShowJoinLeaveMessages,
    showMoreMessages,
    showNewMessageLine = true,
    testID,
    savedPostIds,
    isChannelAutotranslated,
}: Props) => {
    const firstIdInPosts = posts[0]?.id;
    const {panGesture: emojiPickerGesture} = useInputAccessoryViewGesture();

    const {stateContext, onScroll: onScrollProp, postInputContainerHeight, stateMachine, listRef, isEmojiSearchFocused} = useKeyboardState();
    const {postInputTranslateY, inputAccessoryHeight} = stateContext;

    useAnimatedReaction(
        () => ({
            scrollOffset: stateContext.scrollOffset.value,
            scrollPosition: stateContext.scrollPosition.value,
            isReconcilerPaused: stateContext.isReconcilerPaused.value,
        }),
        (current, previous) => {
            'worklet';

            // Skip scroll compensation if reconciler is paused (exit actions adjust scrollPosition manually)
            if (current.isReconcilerPaused || !listRef) {
                return;
            }

            const offsetChanged = previous === null || Math.abs(current.scrollOffset - (previous?.scrollOffset || 0)) > 0.5;

            if (!offsetChanged) {
                return;
            }

            scrollTo(listRef, 0, -current.scrollOffset + current.scrollPosition, false);
        },
        [listRef],
    );

    const onScrollEndIndexListener = useRef<onScrollEndIndexListenerEvent | undefined>(undefined);
    const onViewableItemsChangedListener = useRef<ViewableItemsChangedListenerEvent | undefined>(undefined);
    const scrolledToHighlighted = useRef(false);
    const didHandleInitialHighlightedScroll = useRef(false);
    const hasUserTouchedList = useRef(false);
    const highlightedScrollRetryCount = useRef(0);
    const [refreshing, setRefreshing] = useState(false);
    const [limit, setLimit] = useState<KSuiteLimit | undefined>(undefined);
    const [showScrollToEndBtn, setShowScrollToEndBtn] = useState(false);
    const [lastPostId, setLastPostId] = useState<string | undefined>(firstIdInPosts);
    const [progressViewOffset, setProgressViewOffset] = useState(postInputContainerHeight);
    const [emojiPickerPadding, setEmojiPickerPadding] = useState(0);
    const theme = useTheme();
    const serverUrl = useServerUrl();
    const {isVisible: isControllerKeyboardVisible} = useControllerKeyboardState();
    const {state} = useAnimatedKeyboard();
    const activeScrollTargetId = scrollTargetId ?? highlightedId;
    const shouldUseInitialScrollIndex = !scrollTargetId;
    const previousScrollTargetId = useRef(activeScrollTargetId);

    useAnimatedReaction(
        () => {
            return {
                state: state.value,
            };
        },
        ({state: kbState}) => {
            if (!isAndroidEdgeToEdge && (kbState === KeyboardState.CLOSED || kbState === KeyboardState.OPEN)) {
                scheduleOnRN(setProgressViewOffset, stateContext.postInputContainerHeight.value + postInputTranslateY.value);
            }
        },
        [],
    );

    const orderedPosts = useMemo(() => {
        return preparePostList(posts, lastViewedAt, showNewMessageLine, currentUserId, currentUsername, shouldShowJoinLeaveMessages, currentTimezone, location === Screens.THREAD, savedPostIds);
    }, [posts, lastViewedAt, showNewMessageLine, currentUserId, currentUsername, shouldShowJoinLeaveMessages, currentTimezone, location, savedPostIds]);

    const initialIndex = orderedPosts.findIndex((i) => i.type === 'start-of-new-messages');

    const scrollTargetIndex = useMemo(() => {
        if (!activeScrollTargetId) {
            return -1;
        }

        return orderedPosts.findIndex((p) => p.type === 'post' && p.value.currentPost.id === activeScrollTargetId);
    }, [activeScrollTargetId, orderedPosts]);

    const initialNumToRender = useMemo(() => {
        if (scrollTargetIndex < 0) {
            return INITIAL_BATCH_TO_RENDER + 2;
        }

        return Math.max(INITIAL_BATCH_TO_RENDER + 2, scrollTargetIndex + 1);
    }, [scrollTargetIndex]);

    const isNewMessage = lastPostId ? firstIdInPosts !== lastPostId : false;

    const scrollToEnd = useCallback(() => {
        if (listRef) {
            scheduleOnUI(() => {
                scrollTo(listRef, 0, -postInputTranslateY.value, true);
            });
        }
        setShowScrollToEndBtn(false);

        // postInputTranslateY is a SharedValue
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listRef]);

    const handleScrollToEndPress = useCallback(() => {
        const resetToRecentPosts = onScrollToEnd?.();
        if (resetToRecentPosts) {
            logDebug('[PostList] reset to recent posts before scroll to end', {channelId, location});
            setTimeout(scrollToEnd, HIGHLIGHT_SCROLL_RETRY_TIMEOUT);
            return;
        }

        scrollToEnd();
    }, [channelId, location, onScrollToEnd, scrollToEnd]);

    useEffect(() => {
        if (activeScrollTargetId || forceShowScrollToEndBtn) {
            return undefined;
        }

        const t = setTimeout(() => {
            scrollToEnd();
        }, 300);

        return () => clearTimeout(t);
    }, [activeScrollTargetId, channelId, forceShowScrollToEndBtn, rootId, scrollToEnd]);

    useEffect(() => {
        if (previousScrollTargetId.current !== activeScrollTargetId) {
            previousScrollTargetId.current = activeScrollTargetId;
            didHandleInitialHighlightedScroll.current = false;
            hasUserTouchedList.current = false;
            highlightedScrollRetryCount.current = 0;
            scrolledToHighlighted.current = false;
        }
    }, [activeScrollTargetId]);

    useEffect(() => {
        const scrollToBottom = (screen: string) => {
            if (screen === location) {
                const scrollToBottomTimer = setTimeout(() => {
                    handleScrollToEndPress();
                    clearTimeout(scrollToBottomTimer);
                }, 400);
            }
        };
        setLimit(EphemeralStore.serverHasLimit(serverUrl));

        const scrollBottomListener = DeviceEventEmitter.addListener(Events.POST_LIST_SCROLL_TO_BOTTOM, scrollToBottom);

        return () => {
            scrollBottomListener.remove();
        };
    }, [handleScrollToEndPress, location, serverUrl]);

    const onRefresh = useCallback(async () => {
        if (disablePullToRefresh) {
            return;
        }
        setRefreshing(true);
        if (location === Screens.CHANNEL && channelId) {
            await fetchPosts(serverUrl, channelId);
        } else if (location === Screens.THREAD && rootId) {
            const options: FetchPaginatedThreadOptions = {};
            const lastPost = posts[0];
            if (lastPost) {
                options.fromCreateAt = lastPost.createAt;
                options.fromPost = lastPost.id;
                options.direction = 'down';
            }
            await fetchPostThread(serverUrl, rootId, options);
        }
        const removalPromises = posts.
            filter((post) => post.type === PostTypes.EPHEMERAL).
            map((post) => removePost(serverUrl, post));
        await Promise.all(removalPromises);
        setRefreshing(false);
        setLimit(EphemeralStore.serverHasLimit(serverUrl));
    }, [disablePullToRefresh, location, channelId, rootId, posts, serverUrl]);

    const scrollToIndex = useCallback((index: number, animated = true, applyOffset = true) => {
        if (index < 0 || !listRef?.current) {
            return;
        }

        listRef?.current?.scrollToIndex({
            animated,
            index,
            viewOffset: applyOffset ? Platform.select({ios: -45, default: 0}) : 0,
            viewPosition: 1,
        });
    }, [listRef]);

    const scrollToHighlightedIndex = useCallback((index: number, animated = true) => {
        if (index < 0 || !listRef?.current) {
            return;
        }

        listRef.current.scrollToIndex({animated, index, viewOffset: 0, viewPosition: 0.5});
    }, [listRef]);

    const handleTouchMove = useCallback(() => {
        hasUserTouchedList.current = true;
    }, []);

    const internalOnScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const {y} = event.nativeEvent.contentOffset;
        const isThresholdReached = y > CONTENT_OFFSET_THRESHOLD;

        if (forceShowScrollToEndBtn && y <= 0 && hasUserTouchedList.current) {
            logDebug('[PostList] reset to recent posts from manual scroll', {channelId, location});
            hasUserTouchedList.current = false;
            handleScrollToEndPress();
            return;
        }
        if (isThresholdReached !== showScrollToEndBtn) {
            setShowScrollToEndBtn(isThresholdReached);
        }
        if (!y && lastPostId !== firstIdInPosts) {
            setLastPostId(firstIdInPosts);
        }
    }, [channelId, firstIdInPosts, forceShowScrollToEndBtn, handleScrollToEndPress, lastPostId, location, showScrollToEndBtn]);

    const onScrollToIndexFailed = useCallback((info: ScrollIndexFailed) => {
        if (activeScrollTargetId) {
            logDebug('[PostList] scroll to highlighted post failed', {channelId, highlightedId: activeScrollTargetId, requestedIndex: info.index, highestMeasuredFrameIndex: info.highestMeasuredFrameIndex, averageItemLength: info.averageItemLength, location});
            if (highlightedScrollRetryCount.current >= MAX_HIGHLIGHT_SCROLL_RETRIES) {
                return;
            }
            highlightedScrollRetryCount.current += 1;
            setTimeout(() => scrollToHighlightedIndex(info.index, false), HIGHLIGHT_SCROLL_RETRY_TIMEOUT);
            return;
        }

        const index = Math.min(info.highestMeasuredFrameIndex, info.index);
        if (onScrollEndIndexListener.current) {
            onScrollEndIndexListener.current(index);
        }
        scrollToIndex(index);
    }, [activeScrollTargetId, channelId, location, scrollToHighlightedIndex, scrollToIndex]);

    const onViewableItemsChanged = useCallback(({viewableItems}: ViewableItemsChanged) => {
        if (!viewableItems.length) {
            return;
        }

        const viewableItemsMap = viewableItems.reduce((acc: Record<string, boolean>, {item, isViewable}) => {
            if (isViewable && item.type === 'post') {
                acc[`${location}-${item.value.currentPost.id}`] = true;
            }
            return acc;
        }, {});

        DeviceEventEmitter.emit(Events.ITEM_IN_VIEWPORT, viewableItemsMap);

        if (onViewableItemsChangedListener.current) {
            onViewableItemsChangedListener.current(viewableItems);
        }
    }, [location]);

    function onCloseLimitView() {
        if (!limit) {
            return;
        }
        setLimit({limit: limit.limit, ignored: true});
        EphemeralStore.setServerIgnoredLimit(serverUrl, true);
    }

    const registerScrollEndIndexListener = useCallback((listener: onScrollEndIndexListenerEvent) => {
        onScrollEndIndexListener.current = listener;
        const removeListener = () => {
            onScrollEndIndexListener.current = undefined;
        };

        return removeListener;
    }, []);

    const registerViewableItemsListener = useCallback((listener: ViewableItemsChangedListenerEvent) => {
        onViewableItemsChangedListener.current = listener;
        const removeListener = () => {
            onViewableItemsChangedListener.current = undefined;
        };

        return removeListener;
    }, []);

    const renderItem = useCallback(({item}: ListRenderItemInfo<PostListItem | PostListOtherItem>) => {
        switch (item.type) {
            case 'start-of-new-messages':
                return (
                    <NewMessagesLine
                        key={item.value}
                        theme={theme}
                        testID={`${testID}.new_messages_line`}
                    />
                );
            case 'date':
                return (
                    <DateSeparator
                        key={item.value}
                        date={getDateForDateLine(item.value)}
                        timezone={currentTimezone}
                    />
                );
            case 'thread-overview':
                return (
                    <ThreadOverview
                        key={item.value}
                        rootId={rootId!}
                        testID={`${testID}.thread_overview`}
                    />
                );
            case 'user-activity': {
                const postProps = {
                    currentUsername,
                    postId: item.value,
                    location,
                    style: styles.container,
                    testID: `${testID}.combined_user_activity`,
                    showJoinLeave: shouldShowJoinLeaveMessages,
                    theme,
                };

                return (
                    <CombinedUserActivity
                        {...postProps}
                        key={item.value}
                    />);
            }
            default: {
                const post = item.value.currentPost;
                const {isSaved, nextPost, previousPost} = item.value;
                const skipSaveddHeader = (location === Screens.THREAD && post.id === rootId);
                const postProps = {
                    appsEnabled,
                    customEmojiNames,
                    isCRTEnabled,
                    isPostAcknowledgementEnabled,
                    highlight: highlightedId === post.id,
                    highlightPinnedOrSaved,
                    isSaved,
                    location,
                    nextPost,
                    post,
                    previousPost,
                    rootId,
                    shouldRenderReplyButton,
                    skipSaveddHeader,
                    testID: `${testID}.post`,
                    isChannelAutotranslated,
                };

                return (
                    <Post
                        {...postProps}
                        key={post.id}
                    />
                );
            }
        }
    }, [appsEnabled, currentTimezone, currentUsername, customEmojiNames, highlightPinnedOrSaved, highlightedId, isCRTEnabled, isChannelAutotranslated, isPostAcknowledgementEnabled, location, rootId, shouldRenderReplyButton, shouldShowJoinLeaveMessages, testID, theme]);

    useEffect(() => {
        if (!didHandleInitialHighlightedScroll.current) {
            didHandleInitialHighlightedScroll.current = true;

            if (scrollTargetId && scrollTargetIndex >= 0) {
                scrolledToHighlighted.current = true;
                logDebug('[PostList] using target window for highlighted post', {channelId, highlightedId: activeScrollTargetId, index: scrollTargetIndex, orderedPostsCount: orderedPosts.length, location});
                return undefined;
            }

            if (shouldUseInitialScrollIndex && scrollTargetIndex >= 0) {
                logDebug('[PostList] using initial scroll index for highlighted post', {channelId, highlightedId: activeScrollTargetId, index: scrollTargetIndex, orderedPostsCount: orderedPosts.length, location});
            }
        }

        const t = setTimeout(() => {
            if (activeScrollTargetId && orderedPosts && !scrolledToHighlighted.current) {
                scrolledToHighlighted.current = true;
                logDebug('[PostList] attempting scroll to highlighted post', {
                    channelId,
                    highlightedId: activeScrollTargetId,
                    index: scrollTargetIndex,
                    orderedPostsCount: orderedPosts.length,
                    location,
                });
                if (scrollTargetIndex >= 0 && listRef?.current) {
                    scrollToHighlightedIndex(scrollTargetIndex);
                }
            }
        }, 500);

        return () => clearTimeout(t);

    // - listRef and scrolledToHighlighted are stable refs; only re-run when posts/highlighted post change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeScrollTargetId, scrollTargetId, scrollTargetIndex, orderedPosts, shouldUseInitialScrollIndex]);

    useAnimatedReaction(
        () => {
            const shouldAddEmojiPickerPadding = Platform.OS === 'android' && !isAndroidEdgeToEdge && !isControllerKeyboardVisible && stateMachine.isEmojiPickerActive();
            return shouldAddEmojiPickerPadding ? (inputAccessoryHeight.value || DEFAULT_INPUT_ACCESSORY_HEIGHT) : 0;
        },
        (emojiPickerHeight) => {
            scheduleOnRN(setEmojiPickerPadding, emojiPickerHeight);
        },
        [isControllerKeyboardVisible],
    );

    const contentContainerStyleWithMargin = useMemo(() => {
        const marginStyle = {marginTop: location === Screens.PERMALINK || !isEdgeToEdge ? 0 : postInputContainerHeight + emojiPickerPadding};
        return contentContainerStyle ? [contentContainerStyle, marginStyle] : marginStyle;
    }, [location, postInputContainerHeight, emojiPickerPadding, contentContainerStyle]);

    const animatedProps = useAnimatedProps(
        () => ({
            contentInset: {
                top: Math.max(postInputTranslateY.value, 0),
            },
        }),
        [postInputTranslateY],
    );

    const androidExtra = useAnimatedStyle(() => (isAndroidEdgeToEdge ? {marginBottom: Math.max(postInputTranslateY.value, 0)} : {}));

    const nativeGesture = Gesture.Native();
    const composedGesture = emojiPickerGesture ? Gesture.Simultaneous(nativeGesture, emojiPickerGesture) : nativeGesture;

    return (
        <>
            <Animated.View style={[styles.flex, androidExtra]}>
                <GestureDetector gesture={composedGesture}>
                    <Animated.FlatList
                        animatedProps={animatedProps}
                        automaticallyAdjustContentInsets={false}
                        contentInsetAdjustmentBehavior='never'
                        contentContainerStyle={contentContainerStyleWithMargin}
                        data={orderedPosts}
                        keyboardDismissMode={isEmojiSearchFocused ? 'none' : 'interactive'}
                        keyboardShouldPersistTaps='handled'
                        keyExtractor={keyExtractor}
                        initialNumToRender={initialNumToRender}
                        initialScrollIndex={shouldUseInitialScrollIndex && scrollTargetIndex >= 0 ? scrollTargetIndex : undefined}
                        ListHeaderComponent={header}
                        ListFooterComponent={footer}
                        maintainVisibleContentPosition={SCROLL_POSITION_CONFIG}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.9}
                        onScroll={onScrollProp}
                        onMomentumScrollEnd={internalOnScroll}
                        onScrollToIndexFailed={onScrollToIndexFailed}
                        onViewableItemsChanged={onViewableItemsChanged}
                        progressViewOffset={progressViewOffset}
                        ref={listRef}
                        removeClippedSubviews={Platform.OS === 'android'}
                        renderItem={renderItem}
                        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
                        style={styles.flex}
                        viewabilityConfig={VIEWABILITY_CONFIG}
                        testID={`${testID}.flat_list`}
                        inverted={true}
                        refreshing={refreshing}
                        onTouchMove={handleTouchMove}
                        onRefresh={onRefresh}
                    />
                </GestureDetector>
            </Animated.View>
            {location !== Screens.PERMALINK &&
            <ScrollToEndView
                onPress={handleScrollToEndPress}
                isNewMessage={isNewMessage}
                showScrollToEndBtn={showScrollToEndBtn || Boolean(forceShowScrollToEndBtn)}
                location={location}
                testID={'scroll-to-end-view'}
            />
            }
            {showMoreMessages &&
            <MoreMessages
                channelId={channelId}
                isCRTEnabled={isCRTEnabled}
                newMessageLineIndex={initialIndex}
                posts={orderedPosts}
                registerScrollEndIndexListener={registerScrollEndIndexListener}
                registerViewableItemsListener={registerViewableItemsListener}
                rootId={rootId}
                scrollToIndex={scrollToIndex}
                theme={theme}
                testID={`${testID}.more_messages_button`}
            />
            }
            {limit && !limit.ignored &&
                <LimitedMessages
                    theme={theme}
                    testID={`${testID}.limited_messages_button`}
                    onClose={onCloseLimitView}
                />
            }
        </>
    );
};

export default PostList;
