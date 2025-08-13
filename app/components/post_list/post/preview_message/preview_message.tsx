// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useCallback, useMemo, useState, type FC} from 'react';
import {useIntl} from 'react-intl';
import {Text, View, Alert, TouchableOpacity, type LayoutChangeEvent, useWindowDimensions, ScrollView} from 'react-native';
import Animated from 'react-native-reanimated';

import Files from '@components/files';
import FormattedRelativeTime from '@components/formatted_relative_time';
import Markdown from '@components/markdown';
import ProfilePicture from '@components/post_list/post/profile_picture/profile_picture';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useShowMoreAnimatedStyle} from '@hooks/show_more';
import {handleDeepLink, matchDeepLink} from '@utils/deep_link';
import {tryOpenURL, normalizeProtocol} from '@utils/url';
import {displayUsername} from '@utils/user';

import MessageAttachment from '../body/content/message_attachments/message_attachment';
import ShowMoreButton from '../body/message/show_more_button';

import {getStyleSheet} from './styles';

import type {UserModel} from '@database/models/server';
import type PostModel from '@typings/database/models/servers/post';
import type {MarkdownTextStyles} from '@typings/global/markdown';
import type {AvailableScreens} from '@typings/screens/navigation';

type PreviewMessageProps = {
    channelDisplayName: string;
    post: PostModel;
    theme: Theme;
    user?: UserModel;
    postLink: string;
    location: AvailableScreens;
    textStyles?: MarkdownTextStyles;
    siteURL: string;
    metadata: PostPreviewMetadata;
};

const SHOW_MORE_HEIGHT = 54;

export const PreviewMessage: FC<PreviewMessageProps> = ({channelDisplayName, post, metadata, theme, user, postLink, location, siteURL, textStyles}) => {
    const [open, setOpen] = useState(false);
    const [layoutWidth, setLayoutWidth] = useState(0);
    const [height, setHeight] = useState<number|undefined>();
    const styles = getStyleSheet(theme);
    const dimensions = useWindowDimensions();
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const {formatMessage} = intl;

    const onPress = () => setOpen(!open);

    const maxHeight = useMemo(() => {
        return Math.round((dimensions.height * 0.5) + SHOW_MORE_HEIGHT);
    }, [dimensions]);

    const animatedStyle = useShowMoreAnimatedStyle(height, maxHeight, open);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setHeight(event.nativeEvent.layout.height);
        if (location === Screens.CHANNEL) {
            setLayoutWidth(event.nativeEvent.layout.width);
        }
    }, []);

    const displayName = useMemo(() => {
        const postMetadata = metadata.post;
        const props = postMetadata?.props;

        if (user) {
            if (props?.from_webhook === 'true' && typeof props.override_username === 'string') {
                return props.override_username;
            }
            return displayUsername(user, undefined, 'full_name', true);
        }
        return '';
    }, [metadata.post, user]);

    const handlePress = async () => {
        const url = normalizeProtocol(postLink);
        if (!url) {
            return;
        }
        const onError = () => {
            Alert.alert(
                formatMessage({
                    id: 'mobile.link.error.title',
                    defaultMessage: 'Error',
                }),
                formatMessage({
                    id: 'mobile.link.error.text',
                    defaultMessage: 'Unable to open the link.',
                }),
            );
        };

        const match = matchDeepLink(url, serverUrl, siteURL);

        if (match) {
            const result = await handleDeepLink(match.url, intl);
            if (result?.error) {
                tryOpenURL(match.url, onError);
            }
        } else {
            tryOpenURL(url, onError);
        }
    };

    if (metadata && 'post_id' in metadata && metadata.post_id && metadata.post && post.metadata?.embeds) {
        const message = metadata?.post?.message;
        let messageEdit;
        if (metadata?.post?.edit_at) {
            messageEdit = true;
        } else {
            messageEdit = false;
        }
        const postFile = metadata.post as unknown as PostModel;

        return (
            <TouchableOpacity
                onPress={handlePress}
            >
                <View
                    style={styles.previewMessageContainer}
                >
                    <View
                        style={styles.previewHeader}
                    >
                        <ProfilePicture
                            author={metadata.post}
                        />

                        <Text
                            style={styles.displayNameHeader}
                        >
                            <Markdown
                                baseTextStyle={styles.message}
                                value={displayName}
                                theme={theme}
                                location={location}
                                disableGallery={true}
                                textStyles={textStyles}
                            />
                        </Text>
                        <FormattedRelativeTime
                            value={metadata?.post?.create_at}
                            testID='post_header.date_time'
                            updateIntervalInSeconds={1}
                            style={styles.time}
                        />
                    </View>
                    <Animated.View
                        style={animatedStyle}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps={'always'}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            <View
                                onLayout={onLayout}
                            >
                                <Markdown
                                    baseTextStyle={styles.message}
                                    value={message}
                                    theme={theme}
                                    location={location}
                                    layoutWidth={layoutWidth}
                                    imagesMetadata={post as unknown as Record<string, PostImage | undefined>}
                                    textStyles={textStyles}
                                    isEdited={messageEdit}
                                />

                                {Array.isArray(metadata?.post?.props?.attachments) && metadata.post.props.attachments[0] && (
                                    <MessageAttachment
                                        attachment={metadata.post.props.attachments[0]}
                                        channelId={post.channelId}
                                        layoutWidth={layoutWidth}
                                        location={location}
                                        metadata={post.metadata}
                                        postId={post.id}
                                        theme={theme}
                                    />
                                )}
                                <Files
                                    layoutWidth={layoutWidth}
                                    location={location}
                                    post={postFile}
                                    isReplyPost={false}
                                />
                            </View>
                        </ScrollView>
                    </Animated.View>
                    {(height || 0) > maxHeight &&
                    <ShowMoreButton
                        highlight={false}
                        theme={theme}
                        showMore={!open}
                        onPress={onPress}
                    />
                    }
                    <Text
                        style={styles.channelDisplayName}
                    >
                        {channelDisplayName === '' ? `~${displayName}` : `~${channelDisplayName}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
    return null;
};

export default PreviewMessage;
