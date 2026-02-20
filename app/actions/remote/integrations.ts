// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
//

import DatabaseManager from '@database/manager';
import IntegrationsMananger from '@managers/integrations_manager';
import NetworkManager from '@managers/network_manager';
import {getPostById} from '@queries/servers/post';
import {getCurrentChannelId, getCurrentTeamId} from '@queries/servers/system';
import {getFullErrorMessage} from '@utils/errors';
import {logDebug} from '@utils/log';
import {isMessageAttachmentArray} from '@utils/message_attachment';

import {forceLogoutIfNecessary} from './session';

export const submitInteractiveDialog = async (serverUrl: string, submission: DialogSubmission) => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        submission.channel_id = await getCurrentChannelId(database);
        submission.team_id = await getCurrentTeamId(database);
        const data = await client.submitInteractiveDialog(submission);
        return {data};
    } catch (error) {
        logDebug('error on submitInteractiveDialog', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
        return {error};
    }
};

export const postActionWithCookie = async (serverUrl: string, postId: string, actionId: string, actionCookie: string, selectedOption = '') => {
    try {
        const client = NetworkManager.getClient(serverUrl);

        const data = await client.doPostActionWithCookie(postId, actionId, actionCookie, selectedOption);
        if (data?.trigger_id) {
            IntegrationsMananger.getManager(serverUrl)?.setTriggerId(data.trigger_id);
        }

        return {data};
    } catch (error) {
        logDebug('error on postActionWithCookie', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
        return {error};
    }
};

export const selectAttachmentMenuAction = (serverUrl: string, postId: string, actionId: string, selectedOption: string) => {
    return postActionWithCookie(serverUrl, postId, actionId, '', selectedOption);
};

export const fetchPollMetadataIfPoll = async (serverUrl: string, postId: string) => {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const client = NetworkManager.getClient(serverUrl);

        const post = await getPostById(database, postId);
        if (!post) {
            return;
        }

        const attachments = post.props?.attachments;
        if (!isMessageAttachmentArray(attachments) || !attachments.length) {
            return;
        }

        const pollId = attachments[0]?.actions?.[0]?.integration?.context?.['poll-id'];
        if (!pollId) {
            return;
        }

        const metadata = await client.getPollMetadata(pollId);
        if (!metadata?.voted_answers) {
            return;
        }

        const votedAnswers = metadata.voted_answers;
        const settingProgress = metadata.setting_progress;

        const updatedAttachments = attachments.map((attachment) => {
            if (!attachment.actions) {
                return attachment;
            }

            const updatedActions = attachment.actions.map((action) => {
                if (!action.name) {
                    return action;
                }

                const actionName = settingProgress ? action.name.replace(/\s\(\d+\)$/, '') : action.name;
                const isVoted = votedAnswers.includes(actionName);

                return {...action, isVoted};
            });

            return {...attachment, actions: updatedActions};
        });

        await database.write(async () => {
            await post.update((p) => {
                p.props = {...p.props, attachments: updatedAttachments};
            });
        });
    } catch (error) {
        logDebug('error on fetchPollMetadataIfPoll', getFullErrorMessage(error));
        forceLogoutIfNecessary(serverUrl, error);
    }
};
