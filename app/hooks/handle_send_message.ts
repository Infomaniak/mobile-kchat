// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// import {handleCallsSlashCommand} from '@calls/actions';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl, type IntlShape} from 'react-intl';
import {Alert, DeviceEventEmitter} from 'react-native';

import {sendEphemeralPost} from '@actions/local/post';
import {getChannelTimezones} from '@actions/remote/channel';
import {executeCommand, handleGotoLocation} from '@actions/remote/command';
import {checkUserInOverlappingGroups} from '@actions/remote/groups';
import {createPost} from '@actions/remote/post';
import {handleReactionToLatestPost} from '@actions/remote/reactions';
import {createScheduledPost} from '@actions/remote/scheduled_post';
import {setStatus} from '@actions/remote/user';
import {Events, General, Permissions, Screens} from '@constants';
import {MENTIONS_REGEX} from '@constants/autocomplete';
import {PostTypes} from '@constants/post';
import {NOTIFY_ALL_MEMBERS} from '@constants/post_draft';
import {MESSAGE_TYPE, SNACK_BAR_TYPE} from '@constants/snack_bar';
import {useServerUrl} from '@context/server';
import DatabaseManager from '@database/manager';
import DraftUploadManager from '@managers/draft_upload_manager';
import {getChannelById, getMyChannel, queryUsersOnChannel} from '@queries/servers/channel';
import {queryRolesByNames} from '@queries/servers/role';
import {getMyTeamById} from '@queries/servers/team';
import {getCurrentUser, queryUsersByUsername} from '@queries/servers/user';
import * as DraftUtils from '@utils/draft';
import {isReactionMatch} from '@utils/emoji/helpers';
import {getErrorMessage, getFullErrorMessage} from '@utils/errors';
import {logError} from '@utils/log';
import {scheduledPostFromPost} from '@utils/post';
import {hasPermission} from '@utils/role';
import {canPostDraftInChannelOrThread} from '@utils/scheduled_post';
import {showSnackBar} from '@utils/snack_bar';
import {confirmOutOfOfficeDisabled} from '@utils/user';

import type CustomEmojiModel from '@typings/database/models/servers/custom_emoji';

export type CreateResponse = {
    data?: boolean;
    error?: unknown;
    response?: Post | ScheduledPost;
}

type Props = {
    value: string;
    channelId: string;
    rootId: string;
    maxMessageLength: number;
    files: FileInfo[];
    customEmojis: CustomEmojiModel[];
    enableConfirmNotificationsToChannel?: boolean;
    useChannelMentions: boolean;
    membersCount: number;
    userIsOutOfOffice: boolean;
    currentUserId: string;
    channelType: ChannelType | undefined;
    postPriority: PostPriority;
    isFromDraftView?: boolean;
    clearDraft: () => void;
    canPost?: boolean;
    channelIsArchived?: boolean;
    channelIsReadOnly?: boolean;
    deactivatedChannel?: boolean;
    onPostCreated?: (postId: string) => void;
}

const checkAndSendEphemeralForMentions = async (
    serverUrl: string,
    channelId: string,
    rootId: string,
    message: string,
    intl: IntlShape,
) => {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        const channel = await getChannelById(database, channelId);
        if (!channel || channel.type !== General.PRIVATE_CHANNEL) {
            return;
        }

        const mentions = new Set<string>();
        const regex = new RegExp(MENTIONS_REGEX.source, MENTIONS_REGEX.flags);
        let match;
        while ((match = regex.exec(message)) !== null) {
            const mention = match[1].toLowerCase().replace(/[.,;:!?]+$/, '');
            if (mention && mention !== 'all' && mention !== 'channel' && mention !== 'here') {
                mentions.add(mention);
            }
        }

        if (mentions.size === 0) {
            return;
        }

        const currentUser = await getCurrentUser(database);
        if (!currentUser) {
            return;
        }

        const mentionedUsers = await queryUsersByUsername(database, Array.from(mentions)).fetch();
        const channelMembers = await queryUsersOnChannel(database, channelId).fetch();
        const memberIds = new Set(channelMembers.map((u) => u.id));

        const outOfChannelUsernames: string[] = [];
        for (const user of mentionedUsers) {
            if (!memberIds.has(user.id)) {
                outOfChannelUsernames.push(user.username);
            }
        }

        if (outOfChannelUsernames.length === 0) {
            return;
        }

        const myChannel = await getMyChannel(database, channelId);
        const myTeam = channel.teamId ? await getMyTeamById(database, channel.teamId) : undefined;

        const roleNames = new Set<string>();
        currentUser.roles.split(' ').forEach(roleNames.add, roleNames);
        if (myChannel?.roles) {
            myChannel.roles.split(' ').forEach(roleNames.add, roleNames);
        }
        if (myTeam?.roles) {
            myTeam.roles.split(' ').forEach(roleNames.add, roleNames);
        }

        const roles = await queryRolesByNames(database, Array.from(roleNames)).fetch();
        if (hasPermission(roles, Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS)) {
            return;
        }

        const mentionsList = outOfChannelUsernames.map((u) => '@' + u).join(', ');
        const count = outOfChannelUsernames.length;
        const ephemeralMessage = intl.formatMessage(
            {
                id: 'post_body.check_for_out_of_channel_ephemeral.private_no_manage',
                defaultMessage: '{mentions} {count, plural, one {did not get notified by this mention because they are not in the channel. Please contact an administrator to add them to this private channel.} other {did not get notified by this mention because they are not in the channel. Please contact an administrator to add them to this private channel.}}',
            },
            {mentions: mentionsList, count},
        );
        await sendEphemeralPost(serverUrl, ephemeralMessage, channelId, rootId, currentUser.id);
    } catch (error) {
        logError('Failed checkAndSendEphemeralForMentions', error);
    }
};

export const useHandleSendMessage = ({
    value,
    channelId,
    rootId,
    files,
    maxMessageLength,
    customEmojis,
    enableConfirmNotificationsToChannel,
    useChannelMentions,
    membersCount = 0,
    userIsOutOfOffice,
    currentUserId,
    channelType,
    postPriority,
    isFromDraftView,
    canPost,
    channelIsArchived,
    channelIsReadOnly,
    deactivatedChannel,
    clearDraft,
    onPostCreated,
}: Props) => {
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const [sendingMessage, setSendingMessage] = useState(false);
    const [channelTimezoneCount, setChannelTimezoneCount] = useState(0);

    const canSend = useMemo(() => {
        if (sendingMessage) {
            return false;
        }

        const messageLength = value.trim().length;

        if (messageLength > maxMessageLength) {
            return false;
        }

        if (files.length) {
            const loadingComplete = !files.some((file) => DraftUploadManager.isUploading(file.clientId!));
            return loadingComplete;
        }

        return messageLength > 0;
    }, [sendingMessage, value, files, maxMessageLength]);

    const handleReaction = useCallback((emoji: string, add: boolean) => {
        handleReactionToLatestPost(serverUrl, emoji, add, rootId);
        clearDraft();
        setSendingMessage(false);
    }, [serverUrl, rootId, clearDraft]);

    const doSubmitMessage = useCallback(async (schedulingInfo?: SchedulingInfo) => {
        const postFiles = files.filter((f) => !f.failed);
        const post = {
            user_id: currentUserId,
            channel_id: channelId,
            root_id: rootId,
            message: value,
            type: (files[0]?.is_voice_recording ? PostTypes.VOICE_MESSAGE : '') as PostType,
        } as Post;

        if (!rootId && (
            postPriority.priority ||
            postPriority.requested_ack ||
            postPriority.persistent_notifications)
        ) {
            post.metadata = {
                priority: postPriority,
            };
        }

        let response: CreateResponse;
        if (schedulingInfo) {
            response = await createScheduledPost(serverUrl, scheduledPostFromPost(post, schedulingInfo, postPriority, postFiles));
            if (response.error) {
                showSnackBar({
                    barType: SNACK_BAR_TYPE.SCHEDULED_POST_CREATION_ERROR,
                    customMessage: getErrorMessage(response.error),
                    type: MESSAGE_TYPE.ERROR,
                });
            } else {
                clearDraft();
            }
        } else if (isFromDraftView) {
            const shouldClearDraft = await canPostDraftInChannelOrThread({
                serverUrl,
                rootId,
                intl,
                canPost,
                channelIsArchived,
                channelIsReadOnly,
                deactivatedChannel,
            });

            if (!shouldClearDraft) {
                return;
            }

            createPost(serverUrl, post, postFiles).then(({post: createdPost}) => {
                if (createdPost?.id && onPostCreated) {
                    // Use post ID or root ID for thread navigation
                    const threadRootId = createdPost.root_id || createdPost.id;
                    onPostCreated(threadRootId);
                }
                checkAndSendEphemeralForMentions(serverUrl, channelId, rootId, value, intl);
            });
            clearDraft();

            // Early return to avoid calling DeviceEventEmitter.emit
            return;
        } else {
            // Response error is handled at the post level so don't have to wait to clear draft
            createPost(serverUrl, post, postFiles).then(({post: createdPost}) => {
                if (createdPost?.id && onPostCreated) {
                    // Use post ID or root ID for thread navigation
                    const threadRootId = createdPost.root_id || createdPost.id;
                    onPostCreated(threadRootId);
                }
                checkAndSendEphemeralForMentions(serverUrl, channelId, rootId, value, intl);
            });
            clearDraft();
        }

        setSendingMessage(false);
        DeviceEventEmitter.emit(Events.POST_LIST_SCROLL_TO_BOTTOM, rootId ? Screens.THREAD : Screens.CHANNEL);
    }, [files, currentUserId, channelId, rootId, value, postPriority, isFromDraftView, serverUrl, intl, canPost, channelIsArchived, channelIsReadOnly, deactivatedChannel, clearDraft, onPostCreated]);

    const showSendToAllOrChannelOrHereAlert = useCallback((calculatedMembersCount: number, atHere: boolean, schedulingInfo?: SchedulingInfo) => {
        const notifyAllMessage = DraftUtils.buildChannelWideMentionMessage(intl, calculatedMembersCount, channelTimezoneCount, atHere);
        const cancel = () => {
            setSendingMessage(false);
        };

        // Creating a wrapper function to pass the schedulingInfo to the doSubmitMessage function as the accepted
        // function signature causes conflict.
        // TODO for later - change alert message if this is a scheduled post
        const doSubmitMessageScheduledPostWrapper = () => doSubmitMessage(schedulingInfo);
        DraftUtils.alertChannelWideMention(intl, notifyAllMessage, doSubmitMessageScheduledPostWrapper, cancel);
    }, [intl, channelTimezoneCount, doSubmitMessage]);

    const sendCommand = useCallback(async () => {
        // ik: disable
        // if (value.trim().startsWith('/call')) {
        //     const {handled, error} = await handleCallsSlashCommand(value.trim(), serverUrl, channelId, channelType ?? '', rootId, currentUserId, intl);
        //     if (handled) {
        //         setSendingMessage(false);
        //         clearDraft();
        //         return;
        //     }
        //     if (error) {
        //         setSendingMessage(false);
        //         DraftUtils.alertSlashCommandFailed(intl, error);
        //         return;
        //     }
        // }

        const status = DraftUtils.getStatusFromSlashCommand(value);
        if (userIsOutOfOffice && status) {
            const updateStatus = (newStatus: string) => {
                setStatus(serverUrl, {
                    status: newStatus,
                    last_activity_at: Date.now(),
                    manual: true,
                    user_id: currentUserId,
                });
            };
            confirmOutOfOfficeDisabled(intl, status, updateStatus);
            setSendingMessage(false);
            return;
        }

        // IK: block /leave if user is in a group associated to this channel
        if (value.trim().startsWith('/leave') && (channelType === General.OPEN_CHANNEL || channelType === General.PRIVATE_CHANNEL)) {
            const hasOverlappingGroups = await checkUserInOverlappingGroups(serverUrl, channelId, currentUserId);
            if (hasOverlappingGroups) {
                Alert.alert(
                    intl.formatMessage({id: 'ik_leave_channel_group_blocked.title', defaultMessage: 'Leave channel'}),
                    intl.formatMessage({id: 'ik_leave_channel_group_blocked.body', defaultMessage: 'This channel is linked to one of your teams to facilitate collaboration among its members. To leave it, contact an administrator if needed.'}),
                    [{text: intl.formatMessage({id: 'mobile.managed.OK', defaultMessage: 'OK'})}],
                );
                setSendingMessage(false);
                return;
            }
        }

        const {data, error} = await executeCommand(serverUrl, intl, value, channelId, rootId);
        setSendingMessage(false);

        if (error) {
            const errorMessage = getFullErrorMessage(error);
            DraftUtils.alertSlashCommandFailed(intl, errorMessage);
            return;
        }

        clearDraft();

        if (data?.goto_location && value && !value.startsWith('/leave')) {
            handleGotoLocation(serverUrl, intl, data.goto_location);
        }
    }, [value, userIsOutOfOffice, serverUrl, intl, channelId, rootId, clearDraft, channelType, currentUserId]);

    const sendMessage = useCallback(async (schedulingInfo?: SchedulingInfo) => {
        const notificationsToChannel = enableConfirmNotificationsToChannel && useChannelMentions;
        const toAllOrChannel = value ? DraftUtils.textContainsAtAllAtChannel(value) : false;
        const toHere = value ? DraftUtils.textContainsAtHere(value) : false;

        if (value.indexOf('/') === 0 && !schedulingInfo) {
            // Don't execute slash command when scheduling message
            sendCommand();
        } else if (notificationsToChannel && membersCount > NOTIFY_ALL_MEMBERS && (toAllOrChannel || toHere)) {
            showSendToAllOrChannelOrHereAlert(membersCount, toHere && !toAllOrChannel, schedulingInfo);
        } else {
            return doSubmitMessage(schedulingInfo);
        }

        return Promise.resolve();
    }, [enableConfirmNotificationsToChannel, useChannelMentions, value, membersCount, sendCommand, showSendToAllOrChannelOrHereAlert, doSubmitMessage]);

    const handleSendMessage = useCallback(async (schedulingInfo?: SchedulingInfo) => {
        if (!canSend) {
            return Promise.resolve();
        }

        setSendingMessage(true);

        const match = isReactionMatch(value, customEmojis);
        if (match && !files.length) {
            handleReaction(match.emoji, match.add);
            return Promise.resolve();
        }

        const hasFailedAttachments = files.some((f) => f.failed);
        if (hasFailedAttachments) {
            const cancel = () => {
                setSendingMessage(false);
            };
            const accept = () => {
                // Files are filtered on doSubmitMessage
                sendMessage(schedulingInfo);
            };

            DraftUtils.alertAttachmentFail(intl, accept, cancel);
        } else {
            return sendMessage(schedulingInfo);
        }

        return Promise.resolve();
    }, [canSend, value, customEmojis, files, handleReaction, intl, sendMessage]);

    useEffect(() => {
        getChannelTimezones(serverUrl, channelId).then(({channelTimezones}) => {
            setChannelTimezoneCount(channelTimezones?.length || 0);
        });
    }, [serverUrl, channelId]);

    return {
        handleSendMessage,
        canSend,
    };
};
