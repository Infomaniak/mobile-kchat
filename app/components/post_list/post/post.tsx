// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, Platform, type StyleProp, View, type ViewStyle, TouchableHighlight, TouchableOpacity} from 'react-native';

import {removePost} from '@actions/local/post';
import {showPermalink} from '@actions/remote/permalink';
import {markPostReminderAsDone} from '@actions/remote/post';
import {fetchAndSwitchToThread} from '@actions/remote/thread';
import FormattedText from '@app/components/formatted_text';
import {getMarkdownTextStyles} from '@app/utils/markdown';
import IkCallsCustomMessage from '@calls/components/ik_calls_custom_message';
import {isCallsCustomMessage} from '@calls/utils';
import PreviewMessage from '@components/post_list/post/preview_message';
import SystemAvatar from '@components/system_avatar';
import SystemHeader from '@components/system_header';
import {POST_TIME_TO_FAIL} from '@constants/post';
import * as Screens from '@constants/screens';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {openAsBottomSheet} from '@screens/navigation';
import {buttonBackgroundStyle, buttonTextStyle} from '@utils/buttonStyles';
import {hasJumboEmojiOnly} from '@utils/emoji/helpers';
import {fromAutoResponder, isFromWebhook, isPostFailed, isPostPendingOrFailed, isSystemMessage} from '@utils/post';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import Avatar from './avatar';
import Body from './body';
import Footer from './footer';
import Header from './header';
import PreHeader from './pre_header';
import SystemMessage from './system_message';
import UnreadDot from './unread_dot';

import type PostModel from '@typings/database/models/servers/post';
import type ThreadModel from '@typings/database/models/servers/thread';
import type UserModel from '@typings/database/models/servers/user';
import type {SearchPattern} from '@typings/global/markdown';

type PostProps = {
    appsEnabled: boolean;
    canDelete: boolean;
    currentUser?: UserModel;
    customEmojiNames: string[];
    differentThreadSequence: boolean;
    hasFiles: boolean;
    hasReplies: boolean;
    highlight?: boolean;
    highlightPinnedOrSaved?: boolean;
    highlightReplyBar: boolean;
    isConsecutivePost?: boolean;
    isCRTEnabled?: boolean;
    isEphemeral: boolean;
    isFirstReply?: boolean;
    isPostAcknowledgementEnabled?: boolean;
    isSaved?: boolean;
    isLastReply?: boolean;
    isPostAddChannelMember: boolean;
    isPostPriorityEnabled: boolean;
    location: string;
    post: PostModel;
    rootId?: string;
    previousPost?: PostModel;
    hasReactions: boolean;
    searchPatterns?: SearchPattern[];
    shouldRenderReplyButton?: boolean;
    showAddReaction?: boolean;
    skipSavedHeader?: boolean;
    skipPinnedHeader?: boolean;
    style?: StyleProp<ViewStyle>;
    testID?: string;
    thread?: ThreadModel;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        consecutive: {marginTop: 0},
        consecutivePostContainer: {
            marginBottom: 10,
            marginRight: 10,
            marginLeft: Platform.select({ios: 34, android: 33}),
            marginTop: 10,
        },
        container: {flexDirection: 'row'},
        highlight: {backgroundColor: changeOpacity(theme.mentionHighlightBg, 0.5)},
        highlightBar: {
            backgroundColor: theme.mentionHighlightBg,
            opacity: 1,
        },
        highlightPinnedOrSaved: {
            backgroundColor: changeOpacity(theme.mentionHighlightBg, 0.2),
        },
        pendingPost: {opacity: 0.5},
        postContent: {paddingHorizontal: 16},
        postStyle: {
            overflow: 'hidden',
            flex: 1,
        },
        profilePictureContainer: {
            marginBottom: 5,
            marginRight: 10,
            marginTop: 10,
        },
        rightColumn: {
            flex: 1,
            flexDirection: 'column',
        },
        rightColumnPadding: {paddingBottom: 3},
    };
});

const Post = ({
    appsEnabled, canDelete, currentUser, customEmojiNames, differentThreadSequence, hasFiles, hasReplies, highlight, highlightPinnedOrSaved = true, highlightReplyBar,
    isCRTEnabled, isConsecutivePost, isEphemeral, isFirstReply, isSaved, isLastReply, isPostAcknowledgementEnabled, isPostAddChannelMember, isPostPriorityEnabled,
    location, post, rootId, hasReactions, searchPatterns, shouldRenderReplyButton, skipSavedHeader, skipPinnedHeader, showAddReaction = true, style,
    testID, thread, previousPost,
}: PostProps) => {
    const pressDetected = useRef(false);
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const theme = useTheme();
    const isTablet = useIsTablet();
    const styles = getStyleSheet(theme);
    const textStyles = getMarkdownTextStyles(theme);
    const isAutoResponder = fromAutoResponder(post);
    const isPendingOrFailed = isPostPendingOrFailed(post);
    const isFailed = isPostFailed(post);
    const isSystemPost = isSystemMessage(post);
    const isCallsPost = isCallsCustomMessage(post);
    const hasBeenDeleted = (post.deleteAt !== 0);
    const isWebHook = isFromWebhook(post);
    const hasSameRoot = useMemo(() => {
        if (isFirstReply) {
            return false;
        } else if (!post.rootId && !previousPost?.rootId && isConsecutivePost) {
            return true;
        } else if (post.rootId) {
            return true;
        }

        return false;
    }, [isConsecutivePost, post, previousPost, isFirstReply]);
    const isJumboEmoji = useMemo(() => {
        if (post.message.length && !(/^\s{4}/).test(post.message)) {
            return hasJumboEmojiOnly(post.message, customEmojiNames);
        }
        return false;
    }, [customEmojiNames, post.message]);

    const handlePostPress = () => {
        if ([Screens.SAVED_MESSAGES, Screens.MENTIONS, Screens.SEARCH, Screens.PINNED_MESSAGES].includes(location)) {
            showPermalink(serverUrl, '', post.id);
            return;
        }

        const isValidSystemMessage = isAutoResponder || !isSystemPost;
        if (isEphemeral || hasBeenDeleted) {
            removePost(serverUrl, post);
        } else if (isValidSystemMessage && !hasBeenDeleted && !isPendingOrFailed) {
            if ([Screens.CHANNEL, Screens.PERMALINK].includes(location)) {
                const postRootId = post.rootId || post.id;
                fetchAndSwitchToThread(serverUrl, postRootId);
            }
        }

        setTimeout(() => {
            pressDetected.current = false;
        }, 300);
    };

    const handlePress = preventDoubleTap(() => {
        pressDetected.current = true;

        if (post) {
            Keyboard.dismiss();

            setTimeout(handlePostPress, 300);
        }
    });

    const handlePostponePress = useCallback(async () => {
        const postId = post.props.post_id;

        openAsBottomSheet({
            closeButtonId: 'close-quota-exceeded',
            screen: Screens.INFOMANIAK_REMINDER,
            theme,
            title: '',
            props: {
                postId,
                postpone: true,
            },
        });
    }, [post]);

    const handleMarkRemindAsDone = async () => {
        const postId = post.id;
        markPostReminderAsDone(serverUrl, postId);
    };

    const showPostOptions = () => {
        if (!post) {
            return;
        }

        if (isSystemPost && (!canDelete || hasBeenDeleted)) {
            return;
        }

        if (isPendingOrFailed || isEphemeral) {
            return;
        }

        Keyboard.dismiss();
        const passProps = {sourceScreen: location, post, showAddReaction, serverUrl};
        const title = isTablet ? intl.formatMessage({id: 'post.options.title', defaultMessage: 'Options'}) : '';

        openAsBottomSheet({
            closeButtonId: 'close-post-options',
            screen: Screens.POST_OPTIONS,
            theme,
            title,
            props: passProps,
        });
    };

    const [, rerender] = useState(false);
    useEffect(() => {
        let t: NodeJS.Timeout|undefined;
        if (post.pendingPostId === post.id && !isFailed) {
            t = setTimeout(() => rerender(true), POST_TIME_TO_FAIL - (Date.now() - post.updateAt));
        }

        return () => {
            if (t) {
                clearTimeout(t);
            }
        };
    }, [post.id]);

    const highlightSaved = isSaved && !skipSavedHeader;
    const hightlightPinned = post.isPinned && !skipPinnedHeader;
    const itemTestID = `${testID}.${post.id}`;
    const rightColumnStyle: StyleProp<ViewStyle> = [styles.rightColumn, (Boolean(post.rootId) && isLastReply && styles.rightColumnPadding)];
    const pendingPostStyle: StyleProp<ViewStyle> | undefined = isPendingOrFailed ? styles.pendingPost : undefined;

    let highlightedStyle: StyleProp<ViewStyle>;
    if (highlight) {
        highlightedStyle = styles.highlight;
    } else if ((highlightSaved || hightlightPinned) && highlightPinnedOrSaved) {
        highlightedStyle = styles.highlightPinnedOrSaved;
    }

    let header: ReactNode;
    let postAvatar: ReactNode;
    let consecutiveStyle: StyleProp<ViewStyle>;

    // If the post is a priority post:
    // 1. Show the priority label in channel screen
    // 2. Show the priority label in thread screen for the root post
    const showPostPriority = Boolean(isPostPriorityEnabled && post.metadata?.priority?.priority) && (location !== Screens.THREAD || !post.rootId);

    const sameSequence = hasReplies ? (hasReplies && post.rootId) : !post.rootId;
    if (!showPostPriority && hasSameRoot && isConsecutivePost && sameSequence) {
        consecutiveStyle = styles.consecutive;
        postAvatar = <View style={styles.consecutivePostContainer}/>;
    } else {
        postAvatar = (
            <View style={[styles.profilePictureContainer, pendingPostStyle]}>
                {(isAutoResponder || isSystemPost) ? (
                    <SystemAvatar/>
                ) : (
                    <Avatar
                        isAutoReponse={isAutoResponder}
                        location={location}
                        post={post}
                    />
                )}
            </View>
        );

        if (isSystemPost && !isAutoResponder) {
            header = (
                <SystemHeader
                    createAt={post.createAt}
                    theme={theme}
                />
            );
        } else {
            header = (
                <Header
                    currentUser={currentUser}
                    differentThreadSequence={differentThreadSequence}
                    isAutoResponse={isAutoResponder}
                    isCRTEnabled={isCRTEnabled}
                    isEphemeral={isEphemeral}
                    isPendingOrFailed={isPendingOrFailed}
                    isSystemPost={isSystemPost}
                    isWebHook={isWebHook}
                    location={location}
                    post={post}
                    showPostPriority={showPostPriority}
                    shouldRenderReplyButton={shouldRenderReplyButton}
                />
            );
        }
    }

    let body;
    if (isSystemPost && !isEphemeral && !isAutoResponder) {
        body = (
            <>
                <SystemMessage
                    location={location}
                    post={post}
                />
                {post.type === 'system_post_reminder' && !(post.props.reschedule || post.props.completed) && (
                    <View>
                        <TouchableOpacity
                            style={[buttonBackgroundStyle(theme, 'm', 'primary'), {width: '100%'}]}
                            onPress={handlePostponePress}
                        >
                            <FormattedText
                                id='infomaniak.post.reminder.postpone'
                                defaultMessage='Postpone the reminder'
                                style={buttonTextStyle(theme, 's', 'primary')}
                            />
                        </TouchableOpacity>
                        <View style={{marginTop: 10}}>
                            <TouchableOpacity
                                style={[buttonBackgroundStyle(theme, 'm', 'secondary'), {width: '100%'}]}
                                onPress={handleMarkRemindAsDone}
                            >
                                <FormattedText
                                    id='infomaniak.post.reminder.markAsCompleted'
                                    defaultMessage='Mark as completed'
                                    style={buttonTextStyle(theme, 's', 'secondary')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </>

        );
    } else if (isCallsPost && !hasBeenDeleted) {
        body = <IkCallsCustomMessage post={post}/>;
    } else if (post.metadata && post.metadata.embeds && post.metadata.embeds.length > 0 && post.metadata.embeds[0].type === 'permalink') {
        const postLink = `/${post.metadata.embeds[0].data.team_name}/pl/${post.metadata.embeds[0].data.post_id}`;
        body = (
            <>
                <Body
                    appsEnabled={appsEnabled}
                    hasFiles={hasFiles}
                    hasReactions={hasReactions}
                    highlight={Boolean(highlightedStyle)}
                    highlightReplyBar={highlightReplyBar}
                    isCRTEnabled={isCRTEnabled}
                    isEphemeral={isEphemeral}
                    isFirstReply={isFirstReply}
                    isJumboEmoji={isJumboEmoji}
                    isLastReply={isLastReply}
                    isPendingOrFailed={isPendingOrFailed}
                    isPostAcknowledgementEnabled={isPostAcknowledgementEnabled}
                    isPostAddChannelMember={isPostAddChannelMember}
                    location={location}
                    post={post}
                    searchPatterns={searchPatterns}
                    showAddReaction={showAddReaction}
                    theme={theme}
                />

                <PreviewMessage
                    post={post}
                    channelDisplayName={post.metadata.embeds[0].data.channel_display_name}
                    theme={theme}
                    location={location}
                    postLink={postLink}
                    previewUserId={post.metadata.embeds[0].data.post.user_id}
                    textStyles={textStyles}
                />
            </>
        );
    } else {
        body = (
            <Body
                appsEnabled={appsEnabled}
                hasFiles={hasFiles}
                hasReactions={hasReactions}
                highlight={Boolean(highlightedStyle)}
                highlightReplyBar={highlightReplyBar}
                isCRTEnabled={isCRTEnabled}
                isEphemeral={isEphemeral}
                isFirstReply={isFirstReply}
                isJumboEmoji={isJumboEmoji}
                isLastReply={isLastReply}
                isPendingOrFailed={isPendingOrFailed}
                isPostAcknowledgementEnabled={isPostAcknowledgementEnabled}
                isPostAddChannelMember={isPostAddChannelMember}
                location={location}
                post={post}
                searchPatterns={searchPatterns}
                showAddReaction={showAddReaction}
                theme={theme}
            />
        );
    }

    let unreadDot;
    let footer;
    if (isCRTEnabled && thread && location !== Screens.THREAD && !(rootId && location === Screens.PERMALINK)) {
        if (thread.replyCount > 0 || thread.isFollowing) {
            footer = (
                <Footer
                    channelId={post.channelId}
                    location={location}
                    thread={thread}
                />
            );
        }
        if (thread.unreadMentions || thread.unreadReplies) {
            unreadDot = (
                <UnreadDot/>
            );
        }
    }

    return (
        <View
            testID={testID}
            style={[styles.postStyle, style, highlightedStyle]}
        >
            <TouchableHighlight
                testID={itemTestID}
                onPress={handlePress}
                onLongPress={showPostOptions}
                delayLongPress={200}
                underlayColor={changeOpacity(theme.centerChannelColor, 0.1)}
                style={styles.postContent}
            >
                <>
                    <PreHeader
                        isConsecutivePost={isConsecutivePost}
                        isSaved={isSaved}
                        isPinned={post.isPinned}
                        skipSavedHeader={skipSavedHeader}
                        skipPinnedHeader={skipPinnedHeader}
                    />
                    <View style={[styles.container, consecutiveStyle]}>
                        {postAvatar}
                        <View style={rightColumnStyle}>
                            {header}
                            {body}
                            {footer}
                        </View>
                        {unreadDot}
                    </View>
                </>
            </TouchableHighlight>
        </View>
    );
};

export default Post;
