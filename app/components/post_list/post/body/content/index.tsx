// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {getMarkdownTextStyles} from '@utils/markdown';
import {isMessageAttachmentArray} from '@utils/message_attachment';
import {isPostEphemeral} from '@utils/post';
import {isYoutubeLink} from '@utils/url';

import PreviewMessage from '../../preview_message';

import EmbeddedBindings from './embedded_bindings';
import ImagePreview from './image_preview';
import MessageAttachments from './message_attachments';
import Opengraph from './opengraph';
import YouTube from './youtube';

import type PostModel from '@typings/database/models/servers/post';
import type {AvailableScreens} from '@typings/screens/navigation';

type ContentProps = {
    isReplyPost: boolean;
    layoutWidth?: number;
    location: AvailableScreens;
    post: PostModel;
    theme: Theme;
}

const contentType: Record<string, string> = {
    app_bindings: 'app_bindings',
    image: 'image',
    message_attachment: 'message_attachment',
    opengraph: 'opengraph',
    youtube: 'youtube',
    permalink: 'permalink',
};

const Content = ({isReplyPost, layoutWidth, location, post, theme}: ContentProps) => {
    let type: string | undefined = post.metadata?.embeds?.[0].type;

    const nAppBindings = Array.isArray(post.props?.app_bindings) ? post.props.app_bindings.length : 0;
    if (!type && nAppBindings) {
        type = contentType.app_bindings;
    }

    if (!type) {
        return null;
    }
    const textStyles = getMarkdownTextStyles(theme);
    const isEphemeral = isPostEphemeral(post);

    const getEmbedFromMetadata = (metadata: PostMetadata) => {
        if (!metadata || !metadata.embeds || metadata.embeds.length === 0) {
            return null;
        }
        return metadata.embeds[0];
    };
    const getEmbed = () => {
        const {metadata} = post;
        if (metadata) {
            return getEmbedFromMetadata(metadata);
        }
        return null;
    };
    const embed = getEmbed();

    const attachments = isMessageAttachmentArray(post.props?.attachments) ? post.props.attachments : [];
    switch (contentType[type]) {
        case contentType.image:
            return (
                <ImagePreview
                    isReplyPost={isReplyPost}
                    layoutWidth={layoutWidth}
                    location={location}
                    metadata={post.metadata}
                    postId={post.id}
                    theme={theme}
                />
            );
        case contentType.opengraph:
            if (isYoutubeLink(post.metadata!.embeds![0].url)) {
                return (
                    <YouTube
                        isReplyPost={isReplyPost}
                        layoutWidth={layoutWidth}
                        metadata={post.metadata}
                    />
                );
            }

            return (
                <Opengraph
                    isReplyPost={isReplyPost}
                    layoutWidth={layoutWidth}
                    location={location}
                    metadata={post.metadata}
                    postId={post.id}
                    removeLinkPreview={post.props?.remove_link_preview === 'true'}
                    theme={theme}
                />
            );
        case contentType.message_attachment:
            if (attachments.length) {
                return (
                    <MessageAttachments
                        attachments={attachments}
                        channelId={post.channelId}
                        layoutWidth={layoutWidth}
                        location={location}
                        metadata={post.metadata}
                        postId={post.id}
                        theme={theme}
                    />
                );
            }
            break;

        case contentType.permalink:
            if (!embed) {
                return null;
            }

            // Ik change: There is a case where a ephemeral message has a permalink in the metadata embed
            // (e.g., when a reminder is triggered — Mattermost does not send a regular ephemeral message in this case).
            // In such cases, we want to render the attachment list instead of the post preview.
            // For now, we assume that all ephemeral messages should display the attachment list.

            if (isEphemeral) {
                return (
                    <MessageAttachments
                        attachments={attachments}
                        channelId={post.channelId}
                        layoutWidth={layoutWidth}
                        location={location}
                        metadata={post.metadata}
                        postId={post.id}
                        theme={theme}
                    />
                );
            } else if (embed.data?.post_id && post.props && !post.props.reschedule && !post.props.completed) {
                const postLink = `/${embed.data.team_name}/pl/${embed.data.post_id}`;
                return (
                    <PreviewMessage
                        metadata={embed.data}
                        post={post}
                        theme={theme}
                        location={location}
                        postLink={postLink}
                        previewUserId={embed.data.post.user_id}
                        textStyles={textStyles}
                    />
                );
            }
            break;
        case contentType.app_bindings:
            if (nAppBindings) {
                return (
                    <EmbeddedBindings
                        location={location}
                        post={post}
                        theme={theme}
                    />
                );
            }
            break;
    }

    return null;
};

export default Content;
