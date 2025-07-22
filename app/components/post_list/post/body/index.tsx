// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// TODO UPSTREAM : check ce file

import React, {useCallback, useState} from 'react';
import {type LayoutChangeEvent, type StyleProp, View, type ViewStyle} from 'react-native';

import Files from '@components/files';
import FormattedText from '@components/formatted_text';
import JumboEmoji from '@components/jumbo_emoji';
import {Screens} from '@constants';
import {THREAD} from '@constants/screens';
import {isEdited as postEdited, isPostFailed} from '@utils/post';
import {makeStyleSheetFromTheme} from '@utils/theme';

import Acknowledgements from './acknowledgements';
import AddMembers from './add_members';
import Content from './content';
import Failed from './failed';
import Message from './message';
import Reactions from './reactions';


import { withObservables} from '@nozbe/watermelondb/react';

import {observeVoiceMessagesEnabled} from '@queries/servers/system';

import Body from './body';

import type {WithDatabaseArgs} from '@typings/database/database';

const enhanced = withObservables([], ({database}: WithDatabaseArgs) => {
import type PostModel from '@typings/database/models/servers/post';
import type {SearchPattern} from '@typings/global/markdown';
import type {AvailableScreens} from '@typings/screens/navigation';

type BodyProps = {
    appsEnabled: boolean;
    hasFiles: boolean;
    hasReactions: boolean;
    highlight: boolean;
    highlightReplyBar: boolean;
    isCRTEnabled?: boolean;
    isEphemeral: boolean;
    isFirstReply?: boolean;
    isJumboEmoji: boolean;
    isLastReply?: boolean;
    isPendingOrFailed: boolean;
    isPostAcknowledgementEnabled?: boolean;
    isPostAddChannelMember: boolean;
    location: AvailableScreens;
    post: PostModel;
    searchPatterns?: SearchPattern[];
    showAddReaction?: boolean;
    theme: Theme;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        voiceMessageEnabled: observeVoiceMessagesEnabled(database),
    };
});


const Body = ({
    appsEnabled, hasFiles, hasReactions, highlight, highlightReplyBar,
    isCRTEnabled, isEphemeral, isFirstReply, isJumboEmoji, isLastReply, isPendingOrFailed, isPostAcknowledgementEnabled, isPostAddChannelMember,
    location, post, searchPatterns, showAddReaction, theme,
}: BodyProps) => {
    const style = getStyleSheet(theme);
    const isEdited = postEdited(post);
    const isFailed = isPostFailed(post);
    const [layoutWidth, setLayoutWidth] = useState(0);
    const hasBeenDeleted = Boolean(post.deleteAt);
    let body;
    let message;

    const nBindings = Array.isArray(post.props?.app_bindings) ? post.props?.app_bindings.length : 0;
    const nAttachments = Array.isArray(post.props?.attachments) ? post.props?.attachments.length : 0;

    const isReplyPost = Boolean(post.rootId && (!isEphemeral || !hasBeenDeleted) && location !== THREAD);
    const hasContent = Boolean((post.metadata?.embeds?.length || (appsEnabled && nBindings)) || nAttachments);

    const replyBarStyle = useCallback((): StyleProp<ViewStyle>|undefined => {
        if (!isReplyPost || (isCRTEnabled && location === Screens.PERMALINK)) {
            return undefined;
        }

        const barStyle: StyleProp<ViewStyle> = [style.replyBar];

        if (isFirstReply) {
            barStyle.push(style.replyBarFirst);
        }

        if (isLastReply) {
            barStyle.push(style.replyBarLast);
        }

        if (highlightReplyBar) {
            barStyle.push(style.replyMention);
        }

        return barStyle;
    }, []);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        if (location === Screens.SAVED_MESSAGES) {
            setLayoutWidth(e.nativeEvent.layout.width);
        }
    }, [location]);

    if (hasBeenDeleted) {
        body = (
            <FormattedText
                style={style.message}
                id='post_body.deleted'
                defaultMessage='(message deleted)'
            />
        );
    } else if (isPostAddChannelMember) {
        message = (
            <AddMembers
                location={location}
                post={post}
                theme={theme}
            />
        );
    } else if (isJumboEmoji) {
        message = (
            <JumboEmoji
                baseTextStyle={style.message}
                isEdited={isEdited}
                value={post.message}
            />
        );
    } else if (post.message.length || isEdited) { // isEdited is added to handle the case where the post is edited and the message is empty
        message = (
            <Message
                highlight={highlight}
                isEdited={isEdited}
                isPendingOrFailed={isPendingOrFailed}
                isReplyPost={isReplyPost}
                layoutWidth={layoutWidth}
                location={location}
                post={post}
                searchPatterns={searchPatterns}
                theme={theme}
            />
        );
    }

    const acknowledgementsVisible = isPostAcknowledgementEnabled && post.metadata?.priority?.requested_ack;
    const reactionsVisible = hasReactions && showAddReaction;
    if (!hasBeenDeleted) {
        body = (
            <View style={style.messageBody}>
                {message}
                {hasContent &&
                <Content
                    isReplyPost={isReplyPost}
                    layoutWidth={layoutWidth}
                    location={location}
                    post={post}
                    theme={theme}
                />
                }
                {hasFiles &&
                <Files
                    failed={isFailed}
                    layoutWidth={layoutWidth}
                    location={location}
                    post={post}
                    isReplyPost={isReplyPost}
                />
                }
                {(acknowledgementsVisible || reactionsVisible) && (
                    <View style={style.ackAndReactionsContainer}>
                        {acknowledgementsVisible && (
                            <Acknowledgements
                                hasReactions={hasReactions}
                                location={location}
                                post={post}
                                theme={theme}
                            />
                        )}
                        {reactionsVisible && (
                            <Reactions
                                location={location}
                                post={post}
                                theme={theme}
                            />
                        )}
                    </View>
                )}
            </View>
        );
    }

    return (
        <View
            style={style.messageContainerWithReplyBar}
            onLayout={onLayout}
        >
            <View style={replyBarStyle()}/>
            {body}
            {isFailed &&
            <Failed
                post={post}
                theme={theme}
            />
            }
        </View>
    );
};

export default withDatabase(enhanced(Body));