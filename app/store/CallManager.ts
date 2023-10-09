// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

//import JitsiMeet from '@philippeweidmann/react-native-jitsimeet';

import {Linking} from 'react-native';

import ClientError from '@client/rest/error';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import {getCurrentUser} from '@queries/servers/user';
import {logError, logInfo} from '@utils/log';

import type {UserModel} from '@database/models/server';

export type Call = {
    id: string;
    url: string;
    serverUrl: string;
    channelId: string;
    users: UserModel[];
}

class CallManager {
    startCall = async (serverUrl: string, channelId: string) => {
        const client = NetworkManager.getClient(serverUrl);
        try {
            const apiCall = await client.startCall(channelId);
            await this.setCurrentCall(apiCall.url, serverUrl);
        } catch (error) {
            if (error instanceof ClientError) {
                if (error.responseData?.url) {
                    await this.setCurrentCall(error.responseData.url, serverUrl);
                }
            }
        }
    };
    private setCurrentCall = async (callUrl: string, serverUrl: string) => {
        let kMeetCallUrl = callUrl;
        try {
            const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
            const currentUser = await getCurrentUser(database);
            if (currentUser) {
                kMeetCallUrl += '?username=' + currentUser.username;
            }
        } catch (error) {
            logError(error);
        }

        logInfo('CallManager.setCurrentCall', kMeetCallUrl);
        await Linking.openURL(kMeetCallUrl);
    };
}

export default new CallManager();
