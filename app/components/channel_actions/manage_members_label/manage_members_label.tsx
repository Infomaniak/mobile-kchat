// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Alert, DeviceEventEmitter} from 'react-native';

import {fetchChannelStats, removeMemberFromChannel, updateChannelMemberSchemeRoles} from '@actions/remote/channel';
import OptionItem from '@components/option_item';
import {Events, Members} from '@constants';
import {useServerUrl} from '@context/server';
import NetworkManager from '@managers/network_manager';
import {dismissBottomSheet} from '@screens/navigation';
import {alertErrorWithFallback} from '@utils/draft';

import type {ManageOptionsTypes} from '@constants/members';

const {MAKE_CHANNEL_ADMIN, MAKE_CHANNEL_MEMBER, REMOVE_USER} = Members.ManageOptions;

const messages = defineMessages({
    role_change_error: {
        id: 'mobile.manage_members.change_role.error',
        defaultMessage: 'An error occurred while trying to update the role. Please check your connection and try again.',
    },
    make_channel_admin: {
        id: 'mobile.manage_members.make_channel_admin',
        defaultMessage: 'Make Channel Admin',
    },
    make_channel_member: {
        id: 'mobile.manage_members.make_channel_member',
        defaultMessage: 'Make Channel Member',
    },
    remove_title: {
        id: 'mobile.manage_members.remove_member',
        defaultMessage: 'Remove From Channel',
    },
    remove_message: {
        id: 'mobile.manage_members.message',
        defaultMessage: 'Are you sure you want to remove the selected member from the channel?',
    },
    remove_cancel: {
        id: 'mobile.manage_members.cancel',
        defaultMessage: 'Cancel',
    },
    remove_confirm: {
        id: 'mobile.manage_members.remove',
        defaultMessage: 'Remove',
    },
});

type Props = {
    canRemoveUser: boolean;
    channelId: string;
    manageOption: ManageOptionsTypes;
    testID?: string;
    userId: string;
}

const ManageMembersLabel = ({canRemoveUser, channelId, manageOption, testID, userId}: Props) => {
    const intl = useIntl();
    const {formatMessage} = intl;
    const serverUrl = useServerUrl();

    const handleRemoveUser = useCallback(async () => {
        removeMemberFromChannel(serverUrl, channelId, userId).then(
            (res) => {
                if (!res.error) {
                    fetchChannelStats(serverUrl, channelId, false);
                }
            },
        );
        await dismissBottomSheet();
        DeviceEventEmitter.emit(Events.REMOVE_USER_FROM_CHANNEL, userId);
    }, [channelId, serverUrl, userId]);

    const removeFromChannel = useCallback(async () => {
        try {
            const client = NetworkManager.getClient(serverUrl);
            const channelGroups = await client.getGroupsAssociatedToChannel(channelId);
            if (Array.isArray(channelGroups) && channelGroups.length > 0) {
                const userGroups = await client.getAllGroupsAssociatedToMembership(userId);
                const userGroupIds = new Set((Array.isArray(userGroups) ? userGroups : []).map((g: Group) => g.id));
                const overlap = channelGroups.filter((g: Group) => userGroupIds.has(g.id));
                if (overlap.length > 0) {
                    Alert.alert(
                        formatMessage({id: 'ik_member_in_group.title', defaultMessage: "Retirer l'accès au canal"}),
                        formatMessage({id: 'ik_member_in_group.body', defaultMessage: "Ce membre fait partie d'équipes ayant accès à ce canal de discussion. Rendez-vous sur l'application web pour le retirer de toutes ces équipes."}),
                        [{text: formatMessage({id: 'mobile.server_upgrade.button', defaultMessage: 'OK'})}],
                    );
                    return;
                }
            }
        } catch {
            // If group check fails, fall through to normal flow
        }

        Alert.alert(
            formatMessage(messages.remove_title),
            formatMessage(messages.remove_message),
            [{
                text: formatMessage(messages.remove_cancel),
                style: 'cancel',
            }, {
                text: formatMessage(messages.remove_confirm),
                style: 'destructive',
                onPress: handleRemoveUser,
            }], {cancelable: false},
        );
    }, [formatMessage, handleRemoveUser, serverUrl, channelId, userId]);

    const updateChannelMemberSchemeRole = useCallback(async (schemeAdmin: boolean) => {
        const result = await updateChannelMemberSchemeRoles(serverUrl, channelId, userId, true, schemeAdmin);
        if ('error' in result) {
            alertErrorWithFallback(intl, result.error, messages.role_change_error);
        }
        await dismissBottomSheet();
        DeviceEventEmitter.emit(Events.MANAGE_USER_CHANGE_ROLE, {userId, schemeAdmin});
    }, [channelId, userId, intl, serverUrl]);

    const onAction = useCallback(() => {
        switch (manageOption) {
            case REMOVE_USER:
                removeFromChannel();
                break;
            case MAKE_CHANNEL_ADMIN:
                updateChannelMemberSchemeRole(true);
                break;
            case MAKE_CHANNEL_MEMBER:
                updateChannelMemberSchemeRole(false);
                break;
            default:
                break;
        }
    }, [manageOption, removeFromChannel, updateChannelMemberSchemeRole]);

    let actionText;
    let icon;
    let isDestructive = false;
    switch (manageOption) {
        case REMOVE_USER:
            actionText = (formatMessage(messages.remove_title));
            icon = 'trash-can-outline';
            isDestructive = true;
            break;
        case MAKE_CHANNEL_ADMIN:
            actionText = formatMessage(messages.make_channel_admin);
            icon = 'account-outline';
            break;
        case MAKE_CHANNEL_MEMBER:
            actionText = formatMessage(messages.make_channel_member);
            icon = 'account-outline';
            break;
        default:
            break;
    }

    if (manageOption === REMOVE_USER && !canRemoveUser) {
        return null;
    }

    if (!actionText) {
        return null;
    }

    return (
        <OptionItem
            action={onAction}
            destructive={isDestructive}
            icon={icon}
            label={actionText}
            testID={testID}
            type='default'
        />
    );
};

export default ManageMembersLabel;
