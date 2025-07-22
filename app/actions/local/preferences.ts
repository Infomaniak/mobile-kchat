// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Preferences} from '@constants';
import {getCurrentTeamId, getCurrentUserId} from '@queries/servers/system';
import DatabaseManager from '@database/manager';

export const saveThemePreference = async (theme: Theme) => {
    if (!theme) {
        return;
    }

    const servers = DatabaseManager.serverDatabases;

    for (const key of Object.keys(servers)) {
        const server = servers[key];

        if (server) {
            const {operator, database} = server;
            // eslint-disable-next-line no-await-in-loop
            const teamId = await getCurrentTeamId(database);
            // eslint-disable-next-line no-await-in-loop
            const userId = await getCurrentUserId(database);

            const pref: PreferenceType = {
                category: Preferences.CATEGORIES.THEME,
                name: teamId,
                user_id: userId,
                value: JSON.stringify({...theme, forced: true}),
            };

            // eslint-disable-next-line no-await-in-loop
            await operator.handlePreferences({
                preferences: [pref],
                prepareRecordsOnly: false,
                sync: true,
            });
        }
    }
};
