// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {type ReactNode} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from 'react-native';

import {removePost, sendAddToChannelEphemeralPost} from '@actions/local/post';
import {addMembersToChannel, notifyChannelMember} from '@actions/remote/channel';
import FormattedText from '@components/formatted_text';
import AtMention from '@components/markdown/at_mention';
import {General} from '@constants';
import {useServerUrl} from '@context/server';
import {getMarkdownTextStyles} from '@utils/markdown';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {isStringArray} from '@utils/types';

import type PostModel from '@typings/database/models/servers/post';
import type UserModel from '@typings/database/models/servers/user';
import type {AvailableScreens} from '@typings/screens/navigation';

type ChannelMemberMentionProps = {
    channelType: string | null;
    currentUser?: UserModel;
    location: AvailableScreens;
    post: PostModel;
    theme: Theme;
}

export type AddMemberPostProps = {
    post_id: string;
    not_in_channel_user_ids?: string[];
    not_in_groups_usernames?: string[];
    not_in_channel_usernames?: string[];
    user_ids?: string[];
    usernames?: string[];
    original_post_id?: string;
}

export function isAddMemberProps(v: unknown): v is AddMemberPostProps {
    if (typeof v !== 'object' || !v) {
        return false;
    }

    if (!('post_id' in v) || typeof v.post_id !== 'string') {
        return false;
    }

    if (('not_in_channel_user_ids' in v) && !isStringArray(v.not_in_channel_user_ids)) {
        return false;
    }

    if (('not_in_groups_usernames' in v) && !isStringArray(v.not_in_groups_usernames)) {
        return false;
    }

    if (('not_in_channel_usernames' in v) && !isStringArray(v.not_in_channel_usernames)) {
        return false;
    }

    return true;
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        message: {
            color: changeOpacity(theme.centerChannelColor, 0.6),
            fontSize: 16,
            lineHeight: 20,
        },
    };
});

const definedMessages = defineMessages({
    linkIdPrivate: {
        id: 'post_body.check_for_out_of_channel_mentions.link.private',
        defaultMessage: 'add them to this private channel',
    },
    linkIdPublic: {
        id: 'post_body.check_for_out_of_channel_mentions.link.public',
        defaultMessage: 'add them to the channel',
    },
    messageOne: {
        id: 'post_body.check_for_out_of_channel_mentions.message.one',
        defaultMessage: 'was mentioned but is not in the channel. Would you like to ',
    },
    messageMultiple: {
        id: 'post_body.check_for_out_of_channel_mentions.message.multiple',
        defaultMessage: 'were mentioned but they are not in the channel. Would you like to ',
    },
    askPublic: {
        id: 'post_body.check_for_out_of_channel_ephemeral.ask',
        defaultMessage: '{count, plural, one {did not get notified by this mention because they are not in the channel. Please contact an administrator to add them to the channel.} other {did not get notified by this mention because they are not in the channel. Please contact an administrator to add them to the channel.}}',
    },
    askPrivate: {
        id: 'post_body.check_for_out_of_channel_ephemeral.private_no_manage',
        defaultMessage: '{count, plural, one {did not get notified by this mention because they are not in the channel. Please contact an administrator to add them to this private channel.} other {did not get notified by this mention because they are not in the channel. Please contact an administrator to add them to this private channel.}}',
    },
    outOfGroupsMessage: {
        id: 'post_body.check_for_out_of_channel_groups_mentions.message',
        defaultMessage: 'did not get notified by this mention because they are not in the channel. They are also not a member of the groups linked to this channel.',
    },
});

const ChannelMemberMention = ({channelType, currentUser, location, post, theme}: ChannelMemberMentionProps) => {
    const intl = useIntl();
    const styles = getStyleSheet(theme);
    const textStyles = getMarkdownTextStyles(theme);
    const serverUrl = useServerUrl();

    const memberProps = post.props?.ask_add_channel_member || post.props?.add_channel_member;
    const askMode = Boolean(post.props?.ask_add_channel_member);

    if (!isAddMemberProps(memberProps)) {
        return null;
    }

    const postId = memberProps.post_id;
    const noGroupsUsernames = memberProps.not_in_groups_usernames || [];
    const userIds = memberProps.not_in_channel_user_ids || memberProps.user_ids || [];
    const usernames = memberProps.not_in_channel_usernames || memberProps?.usernames || [];
    const originalPostId = memberProps.original_post_id || '';

    if (!postId || !channelType) {
        return null;
    }

    const handleAddChannelMember = () => {
        if (post && post.channelId && currentUser) {
            addMembersToChannel(serverUrl, post.channelId, userIds, post.rootId, false);
            if (post.rootId) {
                const messages = usernames.map((addedUsername) => {
                    return intl.formatMessage(
                        {
                            id: 'api.channel.add_member.added',
                            defaultMessage: '{addedUsername} added to the channel by {username}.',
                        },
                        {
                            username: currentUser.username,
                            addedUsername,
                        },
                    );
                });
                sendAddToChannelEphemeralPost(serverUrl, currentUser, usernames, messages, post.channelId, post.rootId);
            }

            removePost(serverUrl, post);
        }
    };

    const handleNotifyChannelMember = async () => {
        if (post && post.channelId && currentUser) {
            notifyChannelMember(serverUrl, post.channelId, userIds, originalPostId);
            removePost(serverUrl, post);
        }
    };

    const generateAtMentions = (names: string[]) => {
        if (names.length === 1) {
            return (
                <AtMention
                    channelId={post.channelId}
                    location={location}
                    mentionName={names[0]}
                    mentionStyle={textStyles.mention}
                    theme={theme}
                />
            );
        } else if (names.length > 1) {
            function andSeparator(key: string) {
                return (
                    <FormattedText
                        key={key}
                        id={'post_body.check_for_out_of_channel_mentions.link.and'}
                        defaultMessage={' and '}
                        style={styles.message}
                    />
                );
            }

            function commaSeparator(key: string) {
                return <Text key={key}>{', '}</Text>;
            }

            return (
                <Text>
                    {
                        names.map((username: string) => {
                            return (
                                <AtMention
                                    key={username}
                                    channelId={post.channelId}
                                    location={location}
                                    mentionStyle={textStyles.mention}
                                    mentionName={username}
                                    theme={theme}
                                />
                            );
                        }).reduce((acc: ReactNode[], el: ReactNode, idx: number, arr: ReactNode[]) => {
                            if (idx === 0) {
                                return [el];
                            } else if (idx === arr.length - 1) {
                                return [...acc, andSeparator(`separator-${idx}`), el];
                            }

                            return [...acc, commaSeparator(`commma-separator-${idx}`), el];
                        }, [])
                    }
                </Text>
            );
        }

        return '';
    };

    const linkMessageDescriptor = channelType === General.PRIVATE_CHANNEL ? definedMessages.linkIdPrivate : definedMessages.linkIdPublic;
    const outOfChannelMessageDescriptor = usernames.length === 1 ? definedMessages.messageOne : definedMessages.messageMultiple;
    const outOfChannelAtMentions = generateAtMentions(usernames);

    const outOfGroupsAtMentions = generateAtMentions(noGroupsUsernames);

    const renderOutOfChannelMessage = () => {
        if (!usernames.length) {
            return null;
        }

        if (askMode) {
            const askMessageDescriptor = channelType === General.OPEN_CHANNEL? definedMessages.askPublic: definedMessages.askPrivate;

            return (
                <Text style={styles.message}>
                    {outOfChannelAtMentions}
                    {' '}
                    <FormattedText
                        {...askMessageDescriptor}
                        values={{
                            count: usernames.length,
                        }}
                    />
                </Text>
            );
        }

        if (channelType === General.OPEN_CHANNEL) {
            return (
                <Text>
                    {outOfChannelAtMentions}
                    {' '}
                    <FormattedText
                        {...outOfChannelMessageDescriptor}
                        style={styles.message}
                    />
                    <Text
                        style={textStyles.link}
                        testID='add_channel_member_link'
                        onPress={handleAddChannelMember}
                    >
                        <FormattedText
                            {...definedMessages.linkIdPublic}
                        />
                    </Text>
                    {' '}
                    <FormattedText
                        style={styles.message}
                        id={'post_body.check_for_out_of_channel_groups_mentions_choice.message'}
                        defaultMessage='or'
                    />
                    {' '}
                    <Text
                        onPress={handleNotifyChannelMember}
                    >
                        <FormattedText
                            style={textStyles.link}
                            id={'post_body.check_for_out_of_channel_groups_mentions_notify.message'}
                            defaultMessage={'{count, plural, one {notify him} other {notify them}}'}
                            values={{
                                count: usernames.length,
                            }}
                        />
                    </Text>
                    <FormattedText
                        id={'post_body.check_for_out_of_channel_mentions.message'}
                        defaultMessage={'{count, plural, one {? He will then have access to all the message history for this channel.} other {? They will then have access to all the message history for this channel.}}'}
                        values={{
                            count: usernames.length,
                        }}
                        style={styles.message}
                    />
                </Text>
            );
        }

        return (
            <Text style={styles.message}>
                {outOfChannelAtMentions}
                {' '}
                <FormattedText
                    {...outOfChannelMessageDescriptor}
                />
                <Text
                    style={textStyles.link}
                    testID='add_channel_member_link'
                    onPress={handleAddChannelMember}
                >
                    <FormattedText
                        {...linkMessageDescriptor}
                    />
                </Text>
                <FormattedText
                    id={'post_body.check_for_out_of_channel_mentions.message_last'}
                    defaultMessage={'? They will have access to all message history.'}
                />
            </Text>
        );
    };

    const renderGroupsMessage = () => {
        if (!noGroupsUsernames?.length) {
            return null;
        }

        let groupsMessageDescriptor;
        if (askMode) {
            groupsMessageDescriptor = channelType === General.OPEN_CHANNEL ? definedMessages.askPublic : definedMessages.askPrivate;
        } else {
            groupsMessageDescriptor = definedMessages.outOfGroupsMessage;
        }

        return (
            <Text style={styles.message}>
                {outOfGroupsAtMentions}
                {' '}
                <FormattedText
                    {...groupsMessageDescriptor}
                    values={{
                        count: noGroupsUsernames.length,
                    }}
                />
            </Text>
        );
    };

    return (
        <>
            {renderOutOfChannelMessage()}
            {renderGroupsMessage()}
        </>
    );
};

export default ChannelMemberMention;
