// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DeepLink} from '@constants';
import DatabaseManager from '@database/manager';
import {getCurrentTeam} from '@queries/servers/team';
import {getFullErrorMessage} from '@utils/errors';
import {logDebug} from '@utils/log';
import {displayPermalink} from '@utils/permalink';

import {jumpToPostInChannel} from './post_navigation';

import type TeamModel from '@typings/database/models/servers/team';

export const showPermalink = async (serverUrl: string, teamName: string, postId: string, openAsPermalink = true) => {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        let name = teamName;
        let team: TeamModel | undefined;
        if (!name || name === DeepLink.Redirect) {
            team = await getCurrentTeam(database);
            if (team) {
                name = team.name;
            }
        }

        await displayPermalink(name, postId, openAsPermalink);

        return {};
    } catch (error) {
        return {error};
    }
};

export const openPermalinkInChannel = async (serverUrl: string, teamName: string, postId: string) => {
    const result = await jumpToPostInChannel(serverUrl, {
        logPrefix: 'openPermalinkInChannel',
        postId,
    });
    if (!result.error) {
        return {};
    }

    logDebug('[openPermalinkInChannel] fallback to permalink preview', {
        postId,
        error: getFullErrorMessage(result.error),
    });
    return showPermalink(serverUrl, teamName, postId);
};
