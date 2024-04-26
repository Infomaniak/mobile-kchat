// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {Text, View, Alert, TouchableOpacity, type StyleProp, type TextStyle, type LayoutChangeEvent, useWindowDimensions, ScrollView} from 'react-native';
import Animated from 'react-native-reanimated';

import ProfilePicture from '@app/components/post_list/post/profile_picture/profile_picture';
import FormattedRelativeTime from '@components/formatted_relative_time';
import Markdown from '@components/markdown';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useShowMoreAnimatedStyle} from '@hooks/show_more';
import {handleDeepLink, matchDeepLink} from '@utils/deep_link';
import {makeStyleSheetFromTheme, blendColors, changeOpacity} from '@utils/theme';
import {typography} from '@utils/typography';
import {tryOpenURL, normalizeProtocol} from '@utils/url';
import {displayUsername} from '@utils/user';

import ShowMoreButton from '../body/message/show_more_button';

import type {UserModel} from '@app/database/models/server';
import type PostModel from '@typings/database/models/servers/post';
import type {MarkdownTextStyles} from '@typings/global/markdown';
type PreviewMessageProps = {
    channelDisplayName: string;
    post: PostModel;
    theme: Theme;
    user?: UserModel;
    postLink: string;
    location: string;
    baseTextStyle: StyleProp<TextStyle>;
    textStyles?: MarkdownTextStyles;
    siteURL: string;
    };

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        previewMessageContainer: {
            borderWidth: 1,
            borderColor: blendColors(theme.centerChannelBg, theme.centerChannelColor, 0.3),
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 5,
            marginRight: 5,
            padding: 11,
            borderRadius: 4,
        },
        previewHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
        },
        displayNameHeader: {
            marginRight: 5,
        },
        channelDisplayName: {
            color: changeOpacity(theme.centerChannelColor, 0.64),
        },
        message: {
            marginBottom: 20,
            color: theme.centerChannelColor,
            ...typography('Body', 200),
            lineHeight: undefined,
        },
        profilePicture: {
            width: 30, height: 30, borderRadius: 50, marginRight: 8,
        },
        time: {
            color: changeOpacity(theme.centerChannelColor, 0.64),
            ...typography('Body', 75),
        },
    };
});
const SHOW_MORE_HEIGHT = 54;

export const PreviewMessage = ({channelDisplayName, post, theme, user, postLink, location, baseTextStyle, textStyles, siteURL}: PreviewMessageProps) => {
    const [open, setOpen] = useState(false);
    const [layoutWidth, setLayoutWidth] = useState(0);
    const [height, setHeight] = useState<number|undefined>();
    const styles = getStyleSheet(theme);
    const dimensions = useWindowDimensions();
    const maxHeight = Math.round((dimensions.height * 0.5) + SHOW_MORE_HEIGHT);
    const animatedStyle = useShowMoreAnimatedStyle(height, maxHeight, open);
    const embed = getEmbed();
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const {formatMessage} = intl;
    let displayName = '';

    const onPress = () => setOpen(!open);

    if (user) {
        displayName = displayUsername(user, undefined, 'full_name', true);
    }

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setHeight(event.nativeEvent.layout.height);
        if (location === Screens.CHANNEL) {
            setLayoutWidth(event.nativeEvent.layout.width);
        }
    }, []);

    function getEmbedFromMetadata(metadata: PostMetadata) {
        if (!metadata || !metadata.embeds || metadata.embeds.length === 0) {
            return null;
        }
        return metadata.embeds[0];
    }

    function getEmbed() {
        const {metadata} = post;
        if (metadata) {
            return getEmbedFromMetadata(metadata);
        }
        return null;
    }

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

    if (embed?.data && 'post_id' in embed.data && embed.data.post_id && post.metadata?.embeds) {
        const message = embed.data.post.message;
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
                            author={embed.data.post}
                        />

                        <Text
                            style={styles.displayNameHeader}
                        >
                            <Markdown
                                baseTextStyle={baseTextStyle}
                                value={displayName}
                                theme={theme}
                                location={location}
                                textStyles={textStyles}
                                disableGallery={true}
                            />
                        </Text>
                        <FormattedRelativeTime
                            value={embed.data.post.create_at}
                            testID='post_header.date_time'
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
                                style={styles.message}
                            >
                                <Markdown
                                    baseTextStyle={styles.message}
                                    value={message}
                                    theme={theme}
                                    location={location}
                                    textStyles={textStyles}
                                    layoutWidth={layoutWidth}
                                    imagesMetadata={post.metadata.embeds[0].data.post.metadata.images}
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
                        {`~${channelDisplayName}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
    return null;
};

export default PreviewMessage;
