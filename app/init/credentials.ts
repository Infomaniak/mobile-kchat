// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Platform, NativeModules} from 'react-native';
import * as KeyChain from 'react-native-keychain';

import DatabaseManager from '@database/manager';
import {logDebug, logWarning} from '@utils/log';
import {getIOSAppGroupDetails} from '@utils/mattermost_managed';
import {captureException} from '@utils/sentry';

// After initialize(), this is the logged-in DB-active set — not a live Keystore listing.
// Skips enumerating every Android generic-password service on cold start (upstream #10056).
let cachedServerCredentials: ServerCredential[] | undefined;

export const clearCachedServerCredentials = () => {
    cachedServerCredentials = undefined;
};

const replaceCachedCredential = (serverUrl: string, credential: ServerCredential | null) => {
    if (cachedServerCredentials === undefined) {
        return;
    }

    const rest = cachedServerCredentials.filter((c) => c.serverUrl !== serverUrl);
    cachedServerCredentials = credential ? [...rest, credential] : rest;
};

// Full Keystore listing: rare operations only (logout sweep) — the listing cost is
// acceptable there, but it must not run on the cold-start path (upstream #10056).
export const listAllKeychainServerUrls = async (): Promise<string[]> => {
    if (Platform.OS === 'ios') {
        return KeyChain.getAllInternetPasswordServers();
    }
    return KeyChain.getAllGenericPasswordServices();
};

export const getAllServerCredentials = async (knownServerUrls?: string[]): Promise<ServerCredential[]> => {
    if (cachedServerCredentials !== undefined) {
        return cachedServerCredentials.map((c) => ({...c}));
    }

    let serverUrls: string[];

    // Empty knownServerUrls intentionally lists (wiped/fresh DB).
    if (knownServerUrls?.length) {
        serverUrls = knownServerUrls;
    } else {
        serverUrls = await listAllKeychainServerUrls();
    }

    const serverCredentials = (await Promise.all(
        serverUrls.map((serverUrl) => getServerCredentials(serverUrl)),
    )).filter((credential): credential is ServerCredential => Boolean(credential));

    cachedServerCredentials = serverCredentials;
    return serverCredentials.map((c) => ({...c}));
};

export const getActiveServerUrl = async () => {
    let serverUrl = await DatabaseManager.getActiveServerUrl();
    if (!serverUrl) {
        const serverUrls = await listAllKeychainServerUrls();
        serverUrl = serverUrls[0];
    }
    return serverUrl || undefined;
};

export const setServerCredentials = async (serverUrl: string, token: string) => {
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

        // Store main token credentials (clean format)
        const stored = await KeyChain.setInternetCredentials(serverUrl, token, token, options);
        if (stored === false) {
            throw new Error('failed to store credentials');
        }

        // ik: ensure the credentials are also stored in IkStorage for Android Reply receiver
        if (Platform.OS === 'android') {
            await NativeModules.IkStorage?.setItem(serverUrl, token);
        }

        replaceCachedCredential(serverUrl, {serverUrl, userId: token, token});
    } catch (e) {
        logWarning('could not set credentials', e);

        // Monitor keychain errors to understand the impact of keystore issues
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        captureException(new Error(`Keychain SET failed: ${errorMessage} | serverUrl: ${serverUrl} | platform: ${Platform.OS}`));
    }
};

export const removeServerCredentials = async (serverUrl: string) => {
    await KeyChain.resetInternetCredentials({server: serverUrl});
    replaceCachedCredential(serverUrl, null);
};

export const removeActiveServerCredentials = async () => {
    const serverUrl = await getActiveServerUrl();
    if (serverUrl) {
        await removeServerCredentials(serverUrl);
    }
};

export const getServerCredentials = async (serverUrl: string): Promise<ServerCredential|null> => {
    const cached = cachedServerCredentials?.find((c) => c.serverUrl === serverUrl);
    if (cached) {
        return {...cached};
    }

    try {
        // Get main credentials
        const credentials = await KeyChain.getInternetCredentials(serverUrl);

        if (!credentials) {
            return null;
        }

        // TODO: Pre-Gekidou we were concatenating the deviceToken and the userId in
        // credentials.username so we need to check the length of credentials.username.split(',').
        // This check should be removed at some point. https://mattermost.atlassian.net/browse/MM-43483
        const parts = credentials.username.split(',');
        const userId = parts[parts.length - 1];
        const token = credentials.password;

        if (!token || token === 'undefined') {
            return null;
        }

        return {
            serverUrl,
            userId,
            token,
        };
    } catch (e) {
        // Monitor keychain errors and clean up corrupted credentials
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        captureException(new Error(`Keychain GET failed: ${errorMessage} | serverUrl: ${serverUrl} | platform: ${Platform.OS}`));

        // Clean up corrupted credentials to force re-authentication on next launch
        try {
            await removeServerCredentials(serverUrl);
            logDebug('[Credentials] Cleaned up corrupted credentials for', serverUrl);
        } catch (cleanupError) {
            logWarning('[Credentials] Failed to clean up corrupted credentials', cleanupError);
        }

        return null;
    }
};
