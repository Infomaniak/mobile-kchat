// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';

import {isMessageAttachmentArray} from '@utils/message_attachment';
import {isPostEphemeral} from '@utils/post';
import {getPermalinkInfoFromMessage, isYoutubeLink} from '@utils/url';

import EmbeddedBindings from './embedded_bindings';
import ImagePreview from './image_preview';
import MessageAttachments from './message_attachments';
import Opengraph from './opengraph';
import PermalinkPreview from './permalink_preview';
import YouTube from './youtube';

import type PostModel from '@typings/database/models/servers/post';
import type {AvailableScreens} from '@typings/screens/navigation';

type ContentProps = {
    isReplyPost: boolean;
    layoutWidth?: number;
    location: AvailableScreens;
    post: PostModel;
    theme: Theme;
    showPermalinkPreviews: boolean;
}

const contentType: Record<string, string> = {
    app_bindings: 'app_bindings',
    image: 'image',
    message_attachment: 'message_attachment',
    opengraph: 'opengraph',
    permalink: 'permalink',
    youtube: 'youtube',
};

const Content = ({isReplyPost, layoutWidth, location, post, theme, showPermalinkPreviews}: ContentProps) => {
    // A message that is only a permalink URL may have no embed data (stale server
    // metadata): treat it as a permalink so the preview renders from the referenced post.
    // Memoized so the synthetic embed data keeps a stable identity across renders.
    const barePermalink = useMemo(() => (
        post.metadata?.embeds?.[0]?.type ? null : getPermalinkInfoFromMessage(post.message)
    ), [post.metadata, post.message]);

    let type: string | undefined = post.metadata?.embeds?.[0]?.type;
    if (!type && barePermalink) {
        type = contentType.permalink;
    }

    const nAppBindings = Array.isArray(post.props?.app_bindings) ? post.props.app_bindings.length : 0;
    if (!type && nAppBindings) {
        type = contentType.app_bindings;
    }

    if (!type) {
        return null;
    }

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

    const fallbackEmbedData = useMemo<PermalinkEmbedData | undefined>(() => {
        if (!barePermalink) {
            return undefined;
        }
        return {
            post_id: barePermalink.postId,
            team_name: barePermalink.teamName,
        };
    }, [barePermalink]);
    const embedData: PermalinkEmbedData | undefined = embed ? embed.data as PermalinkEmbedData : fallbackEmbedData;

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
            if (!embedData) {
                return null;
            }
            if (!showPermalinkPreviews) {
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
            }

            return (
                <PermalinkPreview
                    embedData={embedData}
                    location={location}
                    parentLocation={location}
                    parentPostId={post.id}
                />
            );
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
