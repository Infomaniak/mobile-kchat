// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Platform, NativeModules} from 'react-native';
import * as KeyChain from 'react-native-keychain';

import DatabaseManager from '@database/manager';
import {logWarning} from '@utils/log';
import {getIOSAppGroupDetails} from '@utils/mattermost_managed';
const {IkStorage} = NativeModules;

export const getAllServerCredentials = async (): Promise<ServerCredential[]> => {
    const serverCredentials: ServerCredential[] = [];

    let serverUrls: string[];
    if (Platform.OS === 'ios') {
        serverUrls = await KeyChain.getAllInternetPasswordServers();
    } else {
        serverUrls = await KeyChain.getAllGenericPasswordServices();
    }

    for await (const serverUrl of serverUrls) {
        const serverCredential = await getServerCredentials(serverUrl);

        if (serverCredential) {
            serverCredentials.push(serverCredential);
        }
    }

    return serverCredentials;
};

export const getActiveServerUrl = async () => {
    let serverUrl = await DatabaseManager.getActiveServerUrl();
    if (!serverUrl) {
        let serverUrls: string[];
        if (Platform.OS === 'ios') {
            serverUrls = await KeyChain.getAllInternetPasswordServers();
        } else {
            serverUrls = await KeyChain.getAllGenericPasswordServices();
        }

        serverUrl = serverUrls[0];
    }
    return serverUrl || undefined;
};

export const setServerCredentials = (serverUrl: string, token: string) => {
    if (!(serverUrl && token)) {
        return;
    }

    try {
        let accessGroup;
        if (Platform.OS === 'ios') {
            const appGroup = getIOSAppGroupDetails();
            accessGroup = appGroup.appGroupIdentifier;
        }

        const options: KeyChain.SetOptions = {
            accessGroup,
            securityLevel: KeyChain.SECURITY_LEVEL.SECURE_SOFTWARE,
        };
        KeyChain.setInternetCredentials(serverUrl, token, token, options);

        // ik: ensure the credentials are also stored in IkStorage for Android Reply receiver
        if (Platform.OS === 'android') {
            IkStorage.setItem(serverUrl, token);
        }
    } catch (e) {
        logWarning('could not set credentials', e);
    }
};

export const removeServerCredentials = async (serverUrl: string) => {
    return KeyChain.resetInternetCredentials({server: serverUrl});
};

export const removeActiveServerCredentials = async () => {
    const serverUrl = await getActiveServerUrl();
    if (serverUrl) {
        await removeServerCredentials(serverUrl);
    }
};

export const getServerCredentials = async (serverUrl: string): Promise<ServerCredential|null> => {
    try {
        const credentials = await KeyChain.getInternetCredentials(serverUrl);

        if (credentials) {
            // TODO: Pre-Gekidou we were concatenating the deviceToken and the userId in
            // credentials.username so we need to check the length of credentials.username.split(',').
            // This check should be removed at some point. https://mattermost.atlassian.net/browse/MM-43483
            const parts = credentials.username.split(',');
            const userId = parts[parts.length - 1];

            const token = credentials.password;

            if (token && token !== 'undefined') {
                return {serverUrl, userId, token};
            }
        }

        return null;
    } catch (e) {
        return null;
    }
};
