// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {syncMultiTeam} from '@actions/remote/entry/ikcommon';
import DatabaseManager from '@database/manager';

import type ClientError from '@client/rest/error';

export interface IKLoginActionResponse {
    error?: ClientErrorProps | Error | string;
    serverUrl?: string;
    failed: boolean;
}

export const infomaniakLogin = async (accessToken: string): Promise<IKLoginActionResponse> => {
    const database = DatabaseManager.appDatabase?.database;
    if (!database) {
        return {error: 'App database not found', failed: true};
    }

    try {
        const createdServerUrls = await syncMultiTeam(accessToken);
        const firstNotNullServerUrl = createdServerUrls.find((serverUrl) => serverUrl !== null);

        if (firstNotNullServerUrl) {
            return {failed: false, serverUrl: firstNotNullServerUrl};
        }

        // Fallback: check for existing active server
        const activeServerUrl = await DatabaseManager.getActiveServerUrl();
        if (activeServerUrl) {
            return {failed: false, serverUrl: activeServerUrl};
        }

        return {error: 'No server found', failed: true};
    } catch (e) {
        return {error: e as ClientError, failed: true};
    }
};
