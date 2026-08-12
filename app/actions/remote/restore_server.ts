// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import NetInfo from '@react-native-community/netinfo';
import {DeviceEventEmitter} from 'react-native';

import {loginEntry} from '@actions/remote/entry';
import {Events} from '@constants';
import DatabaseManager from '@database/manager';
import {getServerCredentials} from '@init/credentials';
import NetworkManager from '@managers/network_manager';
import {setCurrentUserId} from '@queries/servers/system';
import {isErrorWithStatusCode} from '@utils/errors';
import {logError} from '@utils/log';

const HTTP_UNAUTHORIZED = 401;

type Result = {error?: unknown};

export async function restoreServerAfterDatabaseWipe(serverUrl: string): Promise<Result> {
    try {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
            return {error: 'no_connection'};
        }

        const credentials = await getServerCredentials(serverUrl);
        if (!credentials?.token) {
            return {error: 'no_credentials'};
        }

        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const client = NetworkManager.getClient(serverUrl);

        let user: UserProfile;
        try {
            user = await client.getMe('Database Recovery');
        } catch (error) {
            return handleRestoreError(serverUrl, error);
        }

        await operator.handleUsers({users: [user], prepareRecordsOnly: false});
        await setCurrentUserId(operator, user.id);

        const {error: loginError} = await loginEntry({serverUrl});
        if (loginError) {
            return handleRestoreError(serverUrl, loginError);
        }

        try {
            await DatabaseManager.setActiveServerDatabase(serverUrl);
        } catch (e) {
            logError('restoreServerAfterDatabaseWipe: failed to update active server', e);
        }

        return {};
    } catch (error) {
        return {error};
    }
}

async function handleRestoreError(serverUrl: string, error: unknown): Promise<Result> {
    if (isErrorWithStatusCode(error) && error.status_code === HTTP_UNAUTHORIZED) {
        DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {serverUrl, removeServer: false});
        return {};
    }

    return {error};
}
