// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {DeviceEventEmitter} from 'react-native';

import {loginEntry} from '@actions/remote/entry/login';
import {completeLogin} from '@actions/remote/session';
import {fetchConfigAndLicense} from '@actions/remote/systems';
import {BASE_SERVER_URL} from '@client/rest/constants';
import {Events} from '@constants';
import {SYSTEM_IDENTIFIERS} from '@constants/database';
import {PUSH_PROXY_STATUS_VERIFIED} from '@constants/push_proxy';
import DatabaseManager from '@database/manager';
import {getAllServerCredentials, removeServerCredentials, setServerCredentials} from '@init/credentials';
import NetworkManager from '@managers/network_manager';
import {getDeviceToken} from '@queries/app/global';
import EphemeralStore from '@store/ephemeral_store';

import type {TeamServer} from '@client/rest/ikteams';

const configureServer = async (teamServer: TeamServer, accessToken: string) => {
    const database = DatabaseManager.appDatabase?.database;
    if (!database) {
        throw new Error('Database not initialized');
    }

    const serverUrl = teamServer.url;
    EphemeralStore.setPushProxyVerificationState(serverUrl, PUSH_PROXY_STATUS_VERIFIED);
    const client = await NetworkManager.createClient(serverUrl, accessToken);

    setServerCredentials(serverUrl, accessToken);

    const {config} = await fetchConfigAndLicense(serverUrl, true);
    if (!config) {
        await removeServerCredentials(serverUrl);
        return null;
    }

    try {
        const server = await DatabaseManager.createServerDatabase({
            config: {
                dbName: serverUrl,
                serverUrl,
                identifier: config!.DiagnosticId,
                displayName: teamServer.display_name,
            },
        });
        const deviceToken = await getDeviceToken();
        const user = await client.getMe();
        await server?.operator.handleUsers({users: [user], prepareRecordsOnly: false});
        await server?.operator.handleSystem({
            systems: [{
                id: SYSTEM_IDENTIFIERS.CURRENT_USER_ID,
                value: user.id,
            }],
            prepareRecordsOnly: false,
        });

        await loginEntry({serverUrl, user, deviceToken});
        await completeLogin(serverUrl);
        return serverUrl;
    } catch (e) {
        await removeServerCredentials(serverUrl);
        throw new Error('Server creation failed');
    }
};

export const syncMultiTeam = async (accessToken: string) => {
    try {
        const client = await NetworkManager.createGlobalClient(accessToken);
        const teamServers = await client.getMultiTeams();
        await removeServerCredentials(BASE_SERVER_URL);

        const serverCredentials = await getAllServerCredentials();
        const serverCreationPromises = [];
        for (const teamServer of teamServers) {
            // The server doesn't exist, create it
            if (!serverCredentials.some((element) => element.serverUrl === teamServer.url)) {
                serverCreationPromises.push(configureServer(teamServer, accessToken));
            }
        }

        const serverCreationResults = await Promise.all(serverCreationPromises);
        for (const serverCredential of serverCredentials) {
            // The server doesn't exist anymore, remove it
            if (!teamServers.some((element) => element.url === serverCredential.serverUrl)) {
                DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {serverUrl: serverCredential.serverUrl, removeServer: true});
            }
        }
        return serverCreationResults;
    } catch (e) {
        await removeServerCredentials(BASE_SERVER_URL);
        return [];
    }
};
