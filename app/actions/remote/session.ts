// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import NetInfo from '@react-native-community/netinfo';
import {DeviceEventEmitter} from 'react-native';

import {Database, Events} from '@constants';
import {SYSTEM_IDENTIFIERS} from '@constants/database';
import DatabaseManager from '@database/manager';
import {getAllServerCredentials} from '@init/credentials';
import PushNotifications from '@init/push_notifications';
import NetworkManager from '@managers/network_manager';
import {getDeviceToken} from '@queries/app/global';
import {getCurrentUserId, getExpiredSession} from '@queries/servers/system';
import EphemeralStore from '@store/ephemeral_store';
import {getFullErrorMessage, isErrorWithStatusCode, isErrorWithUrl} from '@utils/errors';
import {logWarning, logError, logDebug} from '@utils/log';
import {getCSRFFromCookie} from '@utils/security';

import {loginEntry} from './entry';

import type {LoginArgs} from '@typings/database/database';

const HTTP_UNAUTHORIZED = 401;

export const addPushProxyVerificationStateFromLogin = async (serverUrl: string) => {
    try {
        const {operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);

        const systems: IdValue[] = [];

        // Set push proxy verification
        const ppVerification = EphemeralStore.getPushProxyVerificationState(serverUrl);
        if (ppVerification) {
            systems.push({id: SYSTEM_IDENTIFIERS.PUSH_VERIFICATION_STATUS, value: ppVerification});
        }

        if (systems.length) {
            await operator.handleSystem({systems, prepareRecordsOnly: false});
        }
    } catch (error) {
        logDebug('error setting the push proxy verification state on login', error);
    }
};
export const forceLogoutIfNecessary = async (serverUrl: string, err: unknown) => {
    const database = DatabaseManager.serverDatabases[serverUrl]?.database;
    if (!database) {
        return {error: `${serverUrl} database not found`};
    }

    const currentUserId = await getCurrentUserId(database);

    if (isErrorWithStatusCode(err) && err.status_code === HTTP_UNAUTHORIZED && isErrorWithUrl(err) && err.url?.indexOf('/login') === -1 && currentUserId) {
        await logout(serverUrl);
    }

    return {error: null};
};

export const fetchSessions = async (serverUrl: string, currentUserId: string) => {
    let client;
    try {
        client = NetworkManager.getClient(serverUrl);
    } catch {
        return undefined;
    }

    try {
        return await client.getSessions(currentUserId);
    } catch (error) {
        logDebug('error on fetchSessions', getFullErrorMessage(error));
        await forceLogoutIfNecessary(serverUrl, error);
    }

    return undefined;
};

export const login = async (serverUrl: string, {ldapOnly = false, loginId, mfaToken, password, config, serverDisplayName}: LoginArgs): Promise<LoginActionResponse> => {
    let deviceToken;
    let user: UserProfile;

    const appDatabase = DatabaseManager.appDatabase?.database;
    if (!appDatabase) {
        return {error: 'App database not found.', failed: true};
    }

    try {
        const client = NetworkManager.getClient(serverUrl);
        deviceToken = await getDeviceToken();
        user = await client.login(
            loginId,
            password,
            mfaToken,
            deviceToken,
            ldapOnly,
        );

        const server = await DatabaseManager.createServerDatabase({
            config: {
                dbName: serverUrl,
                serverUrl,
                identifier: config.DiagnosticId,
                displayName: serverDisplayName,
            },
        });

        await server?.operator.handleUsers({users: [user], prepareRecordsOnly: false});
        await server?.operator.handleSystem({
            systems: [{
                id: Database.SYSTEM_IDENTIFIERS.CURRENT_USER_ID,
                value: user.id,
            }],
            prepareRecordsOnly: false,
        });
        const csrfToken = await getCSRFFromCookie(serverUrl);
        client.setCSRFToken(csrfToken);
    } catch (error) {
        logDebug('error on login', getFullErrorMessage(error));
        return {error, failed: true};
    }

    try {
        await addPushProxyVerificationStateFromLogin(serverUrl);
        const {error} = await loginEntry({serverUrl});
        await DatabaseManager.setActiveServerDatabase(serverUrl);
        return {error, failed: false};
    } catch (error) {
        return {error, failed: false};
    }
};

export const logout = async (serverUrl: string, skipServerLogout = false, removeServer = false, skipEvents = false) => {
    if (!skipServerLogout) {
        const appDatabase = DatabaseManager.appDatabase?.database;
        const serverCredentials = await getAllServerCredentials();
        for (const credential of serverCredentials) {
            const savedServerUrl = credential.serverUrl;
            try {
                const client = NetworkManager.getClient(savedServerUrl);
                let deviceToken: string | undefined;
                if (appDatabase) {
                    // eslint-disable-next-line no-await-in-loop
                    deviceToken = await getDeviceToken();
                }
                // eslint-disable-next-line no-await-in-loop
                await client.logout(deviceToken);
            } catch (error) {
                // We want to log the user even if logging out from the server failed
                logWarning('An error occurred logging out from the server', savedServerUrl, error);
            }
        }
        if (!skipEvents) {
            DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {serverUrl, removeServer});
        }
        NetworkManager.invalidateGlobalClient();
    }
};

export const cancelSessionNotification = async (serverUrl: string) => {
    try {
        const {database, operator} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const expiredSession = await getExpiredSession(database);
        const rechable = (await NetInfo.fetch()).isInternetReachable;

        if (expiredSession?.notificationId && rechable) {
            PushNotifications.cancelScheduleNotification(parseInt(expiredSession.notificationId, 10));
            operator.handleSystem({
                systems: [{
                    id: SYSTEM_IDENTIFIERS.SESSION_EXPIRATION,
                    value: '',
                }],
                prepareRecordsOnly: false,
            });
        }
    } catch (e) {
        logError('cancelSessionNotification', e);
    }
};

export const sendPasswordResetEmail = async (serverUrl: string, email: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        const response = await client.sendPasswordResetEmail(email);
        return {status: response.status};
    } catch (error) {
        logDebug('error on sendPasswordResetEmail', getFullErrorMessage(error));
        return {error};
    }
};

export const ssoLogin = async (serverUrl: string, serverDisplayName: string, serverIdentifier: string, bearerToken: string, csrfToken: string): Promise<LoginActionResponse> => {
    const database = DatabaseManager.appDatabase?.database;
    if (!database) {
        return {error: 'App database not found', failed: true};
    }

    try {
        const client = NetworkManager.getClient(serverUrl);

        client.setBearerToken(bearerToken);
        client.setCSRFToken(csrfToken);

        // Setting up active database for this SSO login flow
        const server = await DatabaseManager.createServerDatabase({
            config: {
                dbName: serverUrl,
                serverUrl,
                identifier: serverIdentifier,
                displayName: serverDisplayName,
            },
        });
        const user = await client.getMe();
        await server?.operator.handleUsers({users: [user], prepareRecordsOnly: false});
        await server?.operator.handleSystem({
            systems: [{
                id: Database.SYSTEM_IDENTIFIERS.CURRENT_USER_ID,
                value: user.id,
            }],
            prepareRecordsOnly: false,
        });
    } catch (error) {
        logDebug('error on ssoLogin', getFullErrorMessage(error));
        return {error, failed: true};
    }

    try {
        await addPushProxyVerificationStateFromLogin(serverUrl);
        const {error} = await loginEntry({serverUrl});
        await DatabaseManager.setActiveServerDatabase(serverUrl);
        return {error, failed: false};
    } catch (error) {
        return {error, failed: false};
    }
};
