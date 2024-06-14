// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchMyChannel, switchToChannelById} from '@actions/remote/channel';
import {fetchConference, switchToConferenceByChannelId} from '@actions/remote/conference';
import {fetchPostById} from '@actions/remote/post';
import {fetchMyTeam} from '@actions/remote/team';
import {fetchAndSwitchToThread} from '@actions/remote/thread';
import {getDefaultThemeByAppearance} from '@context/theme';
import DatabaseManager from '@database/manager';
import WebsocketManager from '@managers/websocket_manager';
import {getMyChannel} from '@queries/servers/channel';
import {getPostById} from '@queries/servers/post';
import {queryThemePreferences} from '@queries/servers/preference';
import {getCurrentTeamId} from '@queries/servers/system';
import {getMyTeamById} from '@queries/servers/team';
import {getIsCRTEnabled} from '@queries/servers/thread';
import EphemeralStore from '@store/ephemeral_store';
import {isErrorWithStatusCode} from '@utils/errors';
import {emitNotificationError} from '@utils/notification';
import {setThemeDefaults, updateThemeIfNeeded} from '@utils/theme';

import type MyChannelModel from '@typings/database/models/servers/my_channel';
import type MyTeamModel from '@typings/database/models/servers/my_team';
import type PostModel from '@typings/database/models/servers/post';

export async function pushNotificationEntry(serverUrl: string, notification: NotificationData) {
    // We only reach this point if we have a channel Id in the notification payload
    const channelId = notification.channel_id!;
    const conferenceId = notification.conference_id;
    const rootId = notification.root_id!;

    const operator = DatabaseManager.serverDatabases[serverUrl]?.operator;
    if (!operator) {
        return {error: `${serverUrl} database not found`};
    }
    const {database} = operator;

    const currentTeamId = await getCurrentTeamId(database);
    const currentServerUrl = await DatabaseManager.getActiveServerUrl();

    let teamId = notification.team_id;
    if (!teamId) {
        // If the notification payload does not have a teamId we assume is a DM/GM
        teamId = currentTeamId;
    }

    if (currentServerUrl !== serverUrl) {
        await DatabaseManager.setActiveServerDatabase(serverUrl);
    }

    if (!EphemeralStore.theme) {
        // When opening the app from a push notification the theme may not be set in the EphemeralStore
        // causing the goToScreen to use the Appearance theme instead and that causes the screen background color to potentially
        // not match the theme
        const themes = await queryThemePreferences(database, teamId).fetch();
        let theme = getDefaultThemeByAppearance();
        if (themes.length) {
            theme = setThemeDefaults(JSON.parse(themes[0].value) as Theme);
        }
        updateThemeIfNeeded(theme, true);
    }

    // To make the switch faster we determine if we already have the team & channel
    let myChannel: MyChannelModel | ChannelMembership | undefined = await getMyChannel(database, channelId);
    let myTeam: MyTeamModel | TeamMembership | undefined = await getMyTeamById(database, teamId);

    if (!myTeam) {
        const resp = await fetchMyTeam(serverUrl, teamId);
        if (resp.error) {
            if (isErrorWithStatusCode(resp.error) && resp.error.status_code === 403) {
                emitNotificationError('Team');
            } else {
                emitNotificationError('Connection');
            }
        } else {
            myTeam = resp.memberships?.[0];
        }
    }

    if (!myChannel) {
        const resp = await fetchMyChannel(serverUrl, teamId, channelId);
        if (resp.error) {
            if (isErrorWithStatusCode(resp.error) && resp.error.status_code === 403) {
                emitNotificationError('Channel');
            } else {
                emitNotificationError('Connection');
            }
        } else {
            myChannel = resp.memberships?.[0];
        }
    }

    const isCRTEnabled = await getIsCRTEnabled(database);
    const isThreadNotification = isCRTEnabled && Boolean(rootId);
    const isConferenceNotification = typeof conferenceId === 'string';

    if (myChannel && myTeam) {
        let redirected = false;
        if (isConferenceNotification) {
            const {conference} = await fetchConference(serverUrl, conferenceId);
            if (conference) {
                switchToConferenceByChannelId(serverUrl, conference.channelId, {initiator: 'native'});
                redirected = true;
            } else {
                // Conference not found, maybe it was terminated?
                // redirect to channel instead
            }
        }

        if (!redirected) {
            if (isThreadNotification) {
                let post: PostModel | Post | undefined = await getPostById(database, rootId);
                if (!post) {
                    const resp = await fetchPostById(serverUrl, rootId);
                    post = resp.post;
                }

                const actualRootId = post && ('root_id' in post ? post.root_id : post.rootId);

                if (actualRootId) {
                    await fetchAndSwitchToThread(serverUrl, actualRootId, true);
                } else if (post) {
                    await fetchAndSwitchToThread(serverUrl, rootId, true);
                } else {
                    emitNotificationError('Post');
                }
            } else {
                await switchToChannelById(serverUrl, channelId, teamId);
            }
        }
    }

    WebsocketManager.openAll();

    return {};
}
