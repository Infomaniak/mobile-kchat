// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {LinearGradient} from 'expo-linear-gradient';
import React, {useMemo, useCallback, useEffect, useState} from 'react';
import {Text, View, Pressable, type LayoutChangeEvent} from 'react-native';

import {fetchReferencedPost, openPermalinkInChannel} from '@actions/remote/permalink';
import {fetchUsersByIds} from '@actions/remote/user';
import EditedIndicator from '@components/edited_indicator';
import FormattedText from '@components/formatted_text';
import FormattedTime from '@components/formatted_time';
import Markdown from '@components/markdown';
import ProfilePicture from '@components/post_list/post/profile_picture/profile_picture';
import {View as ViewConstants} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {useUserLocale} from '@context/user_locale';
import {useIsTablet, useWindowDimensions} from '@hooks/device';
import {usePreventDoubleTap} from '@hooks/utils';
import {logDebug} from '@utils/log';
import {isMessageAttachmentArray} from '@utils/message_attachment';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';
import {displayUsername, getUserTimezone} from '@utils/user';

import MessageAttachment from '../message_attachments/message_attachment';
import Opengraph from '../opengraph';

import PermalinkFiles from './permalink_files';

import type ChannelModel from '@typings/database/models/servers/channel';
import type FileModel from '@typings/database/models/servers/file';
import type PostModel from '@typings/database/models/servers/post';
import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

const MAX_PERMALINK_PREVIEW_CHARACTERS = 150;
const EDITED_INDICATOR_CONTEXT = ['paragraph'];
const MIN_PERMALINK_WIDTH = 340;
const TABLET_PADDING_OFFSET = 40;

type PermalinkPreviewProps = {
    embedData: PermalinkEmbedData;
    author?: UserModel;
    channel?: ChannelModel;
    currentUser?: UserModel;
    files?: FileModel[];
    isMilitaryTime: boolean;
    teammateNameDisplay: string;
    post?: PostModel;
    isOriginPostDeleted?: boolean;
    location: AvailableScreens;
    parentLocation?: string;
    parentPostId?: string;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            backgroundColor: theme.centerChannelBg,
            borderColor: changeOpacity(theme.centerChannelColor, 0.16),
            borderWidth: 1,
            borderRadius: 4,
            marginTop: 8,
            marginBottom: 8,
            padding: 12,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 1,
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        authorInfo: {
            flex: 1,
            marginLeft: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        authorName: {
            color: theme.centerChannelColor,
            ...typography('Body', 100, 'SemiBold'),
        },
        timestamp: {
            color: changeOpacity(theme.centerChannelColor, 0.64),
            ...typography('Body', 75),
        },
        messageContainer: {
            marginBottom: 8,
        },
        messageText: {
            color: theme.centerChannelColor,
            ...typography('Body', 100),
            lineHeight: 20,
        },
        channelContext: {
            marginTop: 8,
            color: changeOpacity(theme.centerChannelColor, 0.64),
            ...typography('Body', 75),
        },
        channelName: {
            color: theme.linkColor,
            ...typography('Body', 75, 'SemiBold'),
        },
        contentContainer: {
            position: 'relative',
        },
        gradientOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
        },
    };
});

const PermalinkPreview = ({
    embedData,
    author,
    channel,
    currentUser,
    files,
    isMilitaryTime,
    teammateNameDisplay,
    post,
    isOriginPostDeleted,
    location,
    parentLocation,
    parentPostId,
}: PermalinkPreviewProps) => {
    const theme = useTheme();
    const serverUrl = useServerUrl();
    const locale = useUserLocale();
    const dimensions = useWindowDimensions();
    const isTablet = useIsTablet();
    const styles = getStyleSheet(theme);
    const [showGradient, setShowGradient] = useState(false);
    const [layoutWidth, setLayoutWidth] = useState(0);

    const maxWidth = useMemo(() => {
        if (!isTablet) {
            return undefined;
        }

        const deviceSize = Math.min(dimensions.width, dimensions.height);
        const availableWidth = deviceSize - ViewConstants.TABLET_SIDEBAR_WIDTH;

        return Math.max(availableWidth - TABLET_PADDING_OFFSET, MIN_PERMALINK_WIDTH);
    }, [dimensions.width, dimensions.height, isTablet]);

    const maxPermalinkHeight = Math.round(dimensions.height * 0.5);

    const embedPost = embedData?.post;
    const embedChannelType = embedData.channel_type ?? channel?.type;
    const embedChannelName = embedData.channel_display_name ?? channel?.displayName;

    // Bare permalink messages carry no embed post: fall back to the database record
    // (present, or brought in by fetchReferencedPost below).
    const referencedMessage = embedPost?.message ?? post?.message ?? '';
    const referencedCreateAt = embedPost?.create_at ?? post?.createAt ?? 0;
    const referencedEditAt = embedPost?.edit_at ?? post?.editAt ?? 0;

    const userId = embedData?.post?.user_id ?? post?.userId;

    useEffect(() => {
        if (userId && !author) {
            fetchUsersByIds(serverUrl, [userId], false);
        }
    }, [userId, author, serverUrl]);

    const referencedPostId = embedData?.post_id;
    const referencedPostDeleted = Boolean(embedData?.post?.delete_at) || embedData?.post?.state === 'DELETED';

    // The referenced post may not be in the local database yet (e.g. cross-channel permalink
    // or a bare permalink message whose embeds were never computed): one fetch brings the
    // full post in.
    useEffect(() => {
        if (referencedPostId && !post && !referencedPostDeleted) {
            fetchReferencedPost(serverUrl, referencedPostId);
        }
    }, [referencedPostId, post, referencedPostDeleted, serverUrl]);

    const truncatedMessage = useMemo(() => {
        if (!referencedMessage || typeof referencedMessage !== 'string') {
            return '';
        }

        const cleanMessage = referencedMessage.trim();

        if (cleanMessage.length > MAX_PERMALINK_PREVIEW_CHARACTERS) {
            return cleanMessage.substring(0, MAX_PERMALINK_PREVIEW_CHARACTERS) + '...';
        }

        return cleanMessage;
    }, [referencedMessage]);

    const isEdited = referencedEditAt > 0;

    const authorDisplayName = useMemo(() => {
        const props = embedPost?.props;
        if (props?.from_webhook === 'true' && typeof props.override_username === 'string') {
            return props.override_username;
        }
        return displayUsername(author, locale, teammateNameDisplay);
    }, [author, locale, teammateNameDisplay, embedPost?.props]);

    const channelContextText = useMemo(() => {
        if (embedChannelType === 'D') {
            return authorDisplayName ? `~${authorDisplayName}` : '';
        }
        return embedChannelName ? `~${embedChannelName}` : '';
    }, [embedChannelType, embedChannelName, authorDisplayName]);

    const filesInfo = useMemo(() => {
        return embedData?.post?.metadata?.files || [];
    }, [embedData?.post?.metadata?.files]);

    // Bare permalink messages resolve files and attachments from the database record
    // (embedded posts carry their own copies in the embed data).
    const hasFiles = filesInfo.length > 0 || (files?.length ?? 0) > 0;

    const attachmentsProp = embedPost?.props?.attachments ?? post?.props?.attachments;
    const firstAttachment = isMessageAttachmentArray(attachmentsProp) ? attachmentsProp[0] : undefined;
    const hasAttachments = Boolean(firstAttachment);

    const handlePress = usePreventDoubleTap(useCallback(() => {
        const teamName = embedData.team_name;
        const postId = embedData.post_id;

        if (postId) {
            logDebug('[PermalinkPreview] pressed', {postId, teamName});
            openPermalinkInChannel(serverUrl, teamName ?? '', postId);
        } else {
            logDebug('[PermalinkPreview] pressed without post id', {teamName});
        }
    }, [embedData.team_name, embedData.post_id, serverUrl]));

    const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;
        setShowGradient(!hasAttachments && height >= maxPermalinkHeight);
        setLayoutWidth(width);
    }, [maxPermalinkHeight, hasAttachments]);

    // We need to memoize this value because it is actually a getter that returns a new list
    // on every render. We need to trust that changes in the currentUser will trigger the recalculation.
    const mentionKeys = useMemo(() => currentUser?.mentionKeys ?? undefined, [currentUser]);

    if (isOriginPostDeleted) {
        return null;
    }

    if (!post && !embedPost) {
        return null;
    }

    return (
        <Pressable
            style={({pressed}) => [
                styles.container,
                {
                    opacity: pressed ? 0.8 : 1,
                    maxWidth,
                },
            ]}
            onPress={handlePress}
            testID='permalink-preview-container'
        >
            <View
                style={[
                    styles.contentContainer,
                    !hasAttachments && {maxHeight: maxPermalinkHeight, overflow: 'hidden'},
                ]}
            >
                <View onLayout={handleContentLayout}>
                    <View style={styles.header}>
                        {/* Prefer the user model: it carries last_picture_update, so
                            the avatar cache id matches the other surfaces (embedded
                            posts carry no picture timestamp). */}
                        <ProfilePicture
                            author={author ?? embedPost}
                        />
                        <View style={styles.authorInfo}>
                            <Text
                                style={styles.authorName}
                                numberOfLines={1}
                            >
                                {authorDisplayName}
                            </Text>
                            <FormattedTime
                                timezone={getUserTimezone(currentUser)}
                                isMilitaryTime={isMilitaryTime}
                                value={referencedCreateAt}
                                style={styles.timestamp}
                            />
                        </View>
                    </View>

                    <View style={styles.messageContainer}>
                        <Markdown
                            baseTextStyle={styles.messageText}
                            channelId={embedData.channel_id ?? post?.channelId ?? ''}
                            location={location}
                            theme={theme}
                            value={truncatedMessage}
                            mentionKeys={mentionKeys}
                        />
                        {isEdited ? (
                            <EditedIndicator
                                baseTextStyle={styles.messageText}
                                theme={theme}
                                context={EDITED_INDICATOR_CONTEXT}
                                iconSize={12}
                                testID='permalink_preview.edited_indicator_separate'
                            />
                        ) : null}
                    </View>

                    <Opengraph
                        isReplyPost={false}
                        removeLinkPreview={false}
                        location={location}
                        metadata={embedData?.post?.metadata || null}
                        postId={embedData?.post?.id || ''}
                        theme={theme}
                        isEmbedded={true}
                    />

                    {firstAttachment && (
                        <MessageAttachment
                            attachment={firstAttachment}
                            channelId={embedData.channel_id ?? post?.channelId ?? ''}
                            layoutWidth={layoutWidth}
                            location={location}
                            metadata={embedData?.post?.metadata || null}
                            postId={embedData?.post?.id || ''}
                            theme={theme}
                        />
                    )}

                    {hasFiles && post && (
                        <PermalinkFiles
                            post={post}
                            location='permalink_preview'
                            isReplyPost={false}
                            parentLocation={parentLocation}
                            parentPostId={parentPostId}
                        />
                    )}
                </View>

                {showGradient && !hasAttachments && (
                    <LinearGradient
                        colors={[changeOpacity(theme.centerChannelBg, 0), theme.centerChannelBg]}
                        style={styles.gradientOverlay}
                        pointerEvents='none'
                    />
                )}
            </View>

            {channelContextText ? (
                <Text style={styles.channelContext}>
                    <FormattedText
                        id='mobile.permalink_preview.originally_posted'
                        defaultMessage='Originally posted in '
                        style={styles.channelContext}
                    />
                    <Text style={styles.channelName}>
                        {channelContextText}
                    </Text>
                </Text>
            ) : null}
        </Pressable>
    );
};

export default PermalinkPreview;
