// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment-timezone';
import React from 'react';
import {type IntlShape, useIntl} from 'react-intl';
import {type StyleProp, Text, type TextStyle, View, type ViewStyle} from 'react-native';

import Markdown from '@components/markdown';
import {postTypeMessages} from '@components/post_list/combined_user_activity/messages';
import PreviewMessage from '@components/post_list/post/preview_message';
import {Post} from '@constants';
import {useTheme} from '@context/theme';
import {t} from '@i18n';
import {getMarkdownTextStyles} from '@utils/markdown';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {secureGetFromRecord, ensureString} from '@utils/types';
import {typography} from '@utils/typography';
import {getUserTimezone} from '@utils/user';

import type PostModel from '@typings/database/models/servers/post';
import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';
import type {PrimitiveType} from 'intl-messageformat';

type SystemMessageProps = {
    author?: UserModel;
    location: AvailableScreens;
    post: PostModel;
    currentUser?: UserModel;
}

type RenderersProps = SystemMessageProps & {
    intl: IntlShape;
    styles: {
        containerStyle: StyleProp<ViewStyle>;
        messageStyle: StyleProp<TextStyle>;
        textStyles: {
            [key: string]: TextStyle;
        };
    };
    theme: Theme;
}

type RenderMessageProps = Omit<RenderersProps, 'currentUser'> & {
    localeHolder: {
        id: string;
        defaultMessage: string;
    };
    skipMarkdown?: boolean;
    values: Record<string, PrimitiveType>;
    theme: Theme;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            marginBottom: 5,
        },
        systemMessage: {
            color: changeOpacity(theme.centerChannelColor, 0.6),
            ...typography('Body', 200, 'Regular'),
        },
    };
});

const renderUsername = (value = '') => {
    if (value) {
        return (value[0] === '@') ? value : `@${value}`;
    }

    return value;
};

const renderMessage = ({location, post, styles, intl, localeHolder, theme, values, skipMarkdown = false}: RenderMessageProps) => {
    const {containerStyle, messageStyle, textStyles} = styles;
    let previewUserId = null;

    if (skipMarkdown) {
        return (
            <Text style={messageStyle}>
                {intl.formatMessage(localeHolder, values)}
            </Text>
        );
    }

    if (post.metadata && post.metadata.embeds && post.metadata.embeds.length > 0) {
        previewUserId = post.metadata.embeds[0].data.post.user_id;
    }

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

    return (
        <View style={containerStyle}>
            <Markdown
                baseTextStyle={messageStyle}
                channelId={post.channelId}
                disableGallery={true}
                location={location}
                textStyles={textStyles}
                value={intl.formatMessage(localeHolder, values)}
                theme={theme}
            />
            {(
                post.type === Post.POST_TYPES.USER_MENTIONED_IN_CHANNEL ||
                post.type === Post.POST_TYPES.IK_SYSTEM_POST_REMINDER
            ) &&
            previewUserId &&
            embed != null && (
                <View>
                    <PreviewMessage
                        metadata={embed.data}
                        post={post}
                        previewUserId={previewUserId}
                        theme={theme}
                        postLink={post.type === Post.POST_TYPES.IK_SYSTEM_POST_REMINDER ? post.props?.link as string : post.props?.post_link as string}
                        location={location}
                        textStyles={textStyles}
                    />
                </View>
            )}
        </View>
    );
};

const renderHeaderChangeMessage = ({post, author, location, styles, intl, theme}: RenderersProps) => {
    let values;

    if (!author?.username) {
        return null;
    }

    const username = renderUsername(author.username);
    const oldHeader = ensureString(post.props?.old_header);
    const newHeader = ensureString(post.props?.new_header);
    let localeHolder;

    if (post.props?.new_header) {
        if (post.props?.old_header) {
            localeHolder = {
                id: t('mobile.system_message.update_channel_header_message_and_forget.updated_from'),
                defaultMessage: '{username} updated the channel header from: {oldHeader} to: {newHeader}',
            };

            values = {username, oldHeader, newHeader};
            return renderMessage({post, styles, intl, location, localeHolder, values, theme});
        }

        localeHolder = {
            id: t('mobile.system_message.update_channel_header_message_and_forget.updated_to'),
            defaultMessage: '{username} updated the channel header to: {newHeader}',
        };

        values = {username, oldHeader, newHeader};
        return renderMessage({post, styles, intl, location, localeHolder, values, theme});
    } else if (post.props?.old_header) {
        localeHolder = {
            id: t('mobile.system_message.update_channel_header_message_and_forget.removed'),
            defaultMessage: '{username} removed the channel header (was: {oldHeader})',
        };

        values = {username, oldHeader, newHeader};
        return renderMessage({post, styles, intl, location, localeHolder, values, theme});
    }

    return null;
};

const renderPurposeChangeMessage = ({post, author, location, styles, intl, theme}: RenderersProps) => {
    let values;

    if (!author?.username) {
        return null;
    }

    const username = renderUsername(author.username);
    const oldPurpose = ensureString(post.props?.old_purpose);
    const newPurpose = ensureString(post.props?.new_purpose);
    let localeHolder;

    if (newPurpose) {
        if (oldPurpose) {
            localeHolder = {
                id: t('mobile.system_message.update_channel_purpose_message.updated_from'),
                defaultMessage: '{username} updated the channel purpose from: {oldPurpose} to: {newPurpose}',
            };

            values = {username, oldPurpose, newPurpose};
            return renderMessage({post, styles, intl, location, localeHolder, values, skipMarkdown: true, theme});
        }

        localeHolder = {
            id: t('mobile.system_message.update_channel_purpose_message.updated_to'),
            defaultMessage: '{username} updated the channel purpose to: {newPurpose}',
        };

        values = {username, oldPurpose, newPurpose};
        return renderMessage({post, styles, intl, location, localeHolder, values, skipMarkdown: true, theme});
    } else if (oldPurpose) {
        localeHolder = {
            id: t('mobile.system_message.update_channel_purpose_message.removed'),
            defaultMessage: '{username} removed the channel purpose (was: {oldPurpose})',
        };

        values = {username, oldPurpose, newPurpose};
        return renderMessage({post, styles, intl, location, localeHolder, values, skipMarkdown: true, theme});
    }

    localeHolder = {
        id: t('mobile.system_message.update_channel_purpose'),
        defaultMessage: '{username} updated the channel purpose.',
    };

    values = {username, oldPurpose, newPurpose};
    return renderMessage({post, styles, intl, location, localeHolder, values, skipMarkdown: true, theme});
};

const renderDisplayNameChangeMessage = ({post, author, location, styles, intl, theme}: RenderersProps) => {
    const oldDisplayName = ensureString(post.props?.old_displayname);
    const newDisplayName = ensureString(post.props?.new_displayname);

    if (!(author?.username)) {
        return null;
    }

    const username = renderUsername(author.username);
    const localeHolder = {
        id: t('mobile.system_message.update_channel_displayname_message_and_forget.updated_from'),
        defaultMessage: '{username} updated the channel display name from: {oldDisplayName} to: {newDisplayName}',
    };

    const values = {username, oldDisplayName, newDisplayName};
    return renderMessage({post, styles, intl, location, localeHolder, values, theme});
};

const renderArchivedMessage = ({post, author, location, styles, intl, theme}: RenderersProps) => {
    const username = renderUsername(author?.username);
    const localeHolder = {
        id: t('mobile.system_message.channel_archived_message'),
        defaultMessage: '{username} archived the channel',
    };

    const values = {username};
    return renderMessage({post, styles, intl, location, localeHolder, values, theme});
};

const renderUnarchivedMessage = ({post, author, location, styles, intl, theme}: RenderersProps) => {
    if (!author?.username) {
        return null;
    }

    const username = renderUsername(author.username);
    const localeHolder = {
        id: t('mobile.system_message.channel_unarchived_message'),
        defaultMessage: '{username} unarchived the channel',
    };

    const values = {username};
    return renderMessage({post, styles, intl, location, localeHolder, values, theme});
};

const renderAddGuestToChannelMessage = ({post, location, styles, intl, theme}: RenderersProps, hideGuestTags: boolean) => {
    const username = renderUsername(ensureString(post.props?.username));
    const addedUsername = renderUsername(ensureString(post.props?.addedUsername));

    if (!username || !addedUsername) {
        return null;
    }

    const localeHolder = hideGuestTags ? postTypeMessages[Post.POST_TYPES.ADD_TO_CHANNEL].one : {
        id: t('api.channel.add_guest.added'),
        defaultMessage: '{addedUsername} added to the channel as a guest by {username}.',
    };

    const values = hideGuestTags ? {firstUser: addedUsername, actor: username} : {username, addedUsername};
    return renderMessage({post, styles, intl, location, localeHolder, values, theme});
};

const renderUserMentionedInChannelMessage = ({post, styles, intl, theme, location}: RenderersProps) => {
    const username = renderUsername(post.props?.username as string);
    const channelDisplayName: string = post.props?.channel_name as string;
    const postLink = post.props?.post_link as string;

    const localeHolder = {
        id: t('api.channel.mention.user_mentioned_in_channel'),
        defaultMessage: '{username} mentioned your name in the channel ~{channelDisplayName} \n{postLink}',
    };

    const values = {username, channelDisplayName, postLink};

    return renderMessage({post, styles, intl, location, localeHolder, values, theme});
};

const renderGuestJoinChannelMessage = ({post, styles, location, intl, theme}: RenderersProps, hideGuestTags: boolean) => {
    const username = renderUsername(ensureString(post.props?.username));
    if (!username) {
        return null;
    }

    const localeHolder = hideGuestTags ? postTypeMessages[Post.POST_TYPES.JOIN_CHANNEL].one : {
        id: t('api.channel.guest_join_channel.post_and_forget'),
        defaultMessage: '{username} joined the channel as a guest.',
    };

    const values = hideGuestTags ? {firstUser: username} : {username};
    return renderMessage({post, styles, intl, location, localeHolder, values, theme});
};

const renderReminderSystemBotMessage = ({post, styles, location, intl, theme, currentUser}: RenderersProps) => {
    if (!post.props?.username) {
        return null;
    }

    const username = renderUsername(post.props.username as string);
    const permaLink = `[${post.props.link}](${post.props.link})`;
    const link = `[this message](${post.props.link})`;

    const timezone = getUserTimezone(currentUser);
    const targetMoment = moment.tz(post.props.target_time, timezone as string);
    const startOfDay = moment().startOf('day');
    const diffInDays = startOfDay.diff(targetMoment, 'days');

    let formattedTargetTime;

    switch (diffInDays) {
        case 0:
            formattedTargetTime = intl.formatMessage(
                {id: 'infomaniak.post.reminder.systemBot.today', defaultMessage: 'at {time}'},
                {time: targetMoment.format('LT')},
            );
            break;
        case 1:
            formattedTargetTime = intl.formatMessage(
                {id: 'infomaniak.post.reminder.systemBot.tomorrow', defaultMessage: 'tomorrow at {time}'},
                {time: targetMoment.format('LT')},
            );
            break;
        default:
            formattedTargetTime = targetMoment.format('MMMM D, h:mm A');
            break;
    }

    let localeHolder = {
        id: t('infomaniak.post.reminder.systemBot'),
        defaultMessage: 'Hi there, here\'s your reminder about this message from {username}:\n{permaLink}',
    };

    if (post.props.reschedule) {
        localeHolder = {
            id: t('infomaniak.post.reminder.reschedule'),
            defaultMessage: 'Alright, I will remind you of {link} {formattedTargetTime}.',
        };
    }

    if (post.props.completed) {
        localeHolder = {
            id: t('infomaniak.post.reminder.completed'),
            defaultMessage: 'Alright, I have marked the reminder for {link} as completed!',
        };
    }

    const values = {username, permaLink, link, formattedTargetTime};
    return renderMessage({post, styles, intl, location, localeHolder, values, theme});
};

const systemMessageRenderers = {
    [Post.POST_TYPES.HEADER_CHANGE]: renderHeaderChangeMessage,
    [Post.POST_TYPES.DISPLAYNAME_CHANGE]: renderDisplayNameChangeMessage,
    [Post.POST_TYPES.PURPOSE_CHANGE]: renderPurposeChangeMessage,
    [Post.POST_TYPES.CHANNEL_DELETED]: renderArchivedMessage,
    [Post.POST_TYPES.CHANNEL_UNARCHIVED]: renderUnarchivedMessage,
    [Post.POST_TYPES.IK_SYSTEM_POST_REMINDER]: renderReminderSystemBotMessage,
    [Post.POST_TYPES.IK_SYSTEM_WELCOME_MESSAGE]: () => null,
    [Post.POST_TYPES.USER_MENTIONED_IN_CHANNEL]: renderUserMentionedInChannelMessage,
};

export const SystemMessage = ({post, location, author, hideGuestTags, currentUser}: SystemMessageProps & { hideGuestTags: boolean}) => {
    const intl = useIntl();
    const theme = useTheme();
    const style = getStyleSheet(theme);
    const textStyles = getMarkdownTextStyles(theme);
    const styles = {messageStyle: style.systemMessage, textStyles, containerStyle: style.container};

    if (post.type === Post.POST_TYPES.GUEST_JOIN_CHANNEL) {
        return renderGuestJoinChannelMessage({post, author, location, styles, intl, theme}, hideGuestTags);
    }
    if (post.type === Post.POST_TYPES.ADD_GUEST_TO_CHANNEL) {
        return renderAddGuestToChannelMessage({post, author, location, styles, intl, theme}, hideGuestTags);
    }
    if (post.type === Post.POST_TYPES.USER_MENTIONED_IN_CHANNEL) {
        return renderUserMentionedInChannelMessage({post, styles, intl, location, theme});
    }

    const renderer = secureGetFromRecord(systemMessageRenderers, post.type);
    if (!renderer) {
        return (
            <Markdown
                baseTextStyle={styles.messageStyle}
                channelId={post.channelId}
                location={location}
                disableGallery={true}
                textStyles={styles.textStyles}
                value={post.message}
                theme={theme}
            />
        );
    }

    return renderer({post, author, location, styles, intl, theme, currentUser});
};

export default SystemMessage;
