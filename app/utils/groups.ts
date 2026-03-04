// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import NetworkManager from '@managers/network_manager';

export const generateGroupAssociationId = (groupId: string, otherId: string) => `${groupId}-${otherId}`;

/**
 * Checks if a user belongs to any group that is associated with a given channel.
 * Used to prevent users from leaving a channel or being removed from it when
 * they are part of a team that has access to the channel.
 */
export const checkUserInOverlappingGroups = async (serverUrl: string, channelId: string, userId: string): Promise<boolean> => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        const channelGroups = await client.getGroupsAssociatedToChannel(channelId);

        if (!Array.isArray(channelGroups) || channelGroups.length === 0) {
            return false;
        }

        const userGroups = await client.getAllGroupsAssociatedToMembership(userId);
        const userGroupIds = new Set((Array.isArray(userGroups) ? userGroups : []).map((g: Group) => g.id));

        return channelGroups.some((g: Group) => userGroupIds.has(g.id));
    } catch {
        // If the check fails, we default to allowing the action
        return false;
    }
};
