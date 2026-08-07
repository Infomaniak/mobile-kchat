// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {defineMessages, type IntlShape} from 'react-intl';
import {Alert, DeviceEventEmitter, type AlertButton} from 'react-native';

import {doPing} from '@actions/remote/general';
import {Database, Events} from '@constants';
import {SYSTEM_IDENTIFIERS} from '@constants/database';
import DatabaseManager from '@database/manager';
import {getAllServerCredentials} from '@init/credentials';
import NetworkManager from '@managers/network_manager';
import WebsocketManager from '@managers/websocket_manager';
import {getDeviceToken} from '@queries/app/global';
import {getCurrentUserId} from '@queries/servers/system';
import {resetToHome} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';
import {getFullErrorMessage, isErrorWithStatusCode, isErrorWithUrl} from '@utils/errors';
import {getIntlShape} from '@utils/general';
import {logWarning, logError, logDebug} from '@utils/log';
import {canReceiveNotifications} from '@utils/push_proxy';
import {getCSRFFromCookie} from '@utils/security';
import {captureException} from '@utils/sentry';
import {getServerUrlAfterRedirect} from '@utils/url';

import {loginEntry} from './entry';

import type {LoginArgs} from '@typings/database/database';

const HTTP_UNAUTHORIZED = 401;

const logoutMessages = defineMessages({
    title: {
        id: 'logout.fail.title',
        defaultMessage: 'Logout not complete',
    },
    bodyForced: {
        id: 'logout.fail.message.forced',
        defaultMessage: 'We could not log you out of the server. Some data may continue to be accessible to this device once the device goes back online.',
    },
    body: {
        id: 'logout.fail.message',
        defaultMessage: 'We could not log you out of the server. Please check your connection and try again.',
    },
    cancel: {
        id: 'logout.fail.cancel',
        defaultMessage: 'Cancel',
    },
    retry: {
        id: 'logout.fail.retry',
        defaultMessage: 'Retry',
    },
    ok: {
        id: 'logout.fail.ok',
        defaultMessage: 'OK',
    },
});

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

        return {};
    } catch (error) {
        logDebug('error setting the push proxy verification state on login', error);
        return {error};
    }
};
export const forceLogoutIfNecessary = async (serverUrl: string, err: unknown) => {
    const database = DatabaseManager.serverDatabases[serverUrl]?.database;
    if (!database) {
        return {error: `${serverUrl} database not found`, logout: false};
    }

    const currentUserId = await getCurrentUserId(database);

    if (isErrorWithStatusCode(err) && err.status_code === HTTP_UNAUTHORIZED && isErrorWithUrl(err) && err.url?.indexOf('/login') === -1 && currentUserId) {
        await logout(serverUrl, undefined, {skipServerLogout: true});
        return {error: null, logout: true};
    }

    return {error: null, logout: false};
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

type LogoutOptions = {
    skipServerLogout?: boolean;
    removeServer?: boolean;
    skipEvents?: boolean;
    logoutOnAlert?: boolean;
    skipAlert?: boolean; // Skip showing alert dialog (for automated wipes)
};

export const logout = async (
    serverUrl: string,
    intl: IntlShape | undefined,
    {
        skipServerLogout = false,
        removeServer = true,
        skipEvents = false,
        logoutOnAlert = false,
        skipAlert = false,
    }: LogoutOptions = {}) => {
    let loggedOut = false;
    if (!skipServerLogout) {
        try {
            const appDatabase = DatabaseManager.appDatabase?.database;
            const serverCredentials = await getAllServerCredentials();

            await Promise.allSettled(
                serverCredentials.map(async (credential) => {
                    const savedServerUrl = credential.serverUrl;
                    try {
                        const client = NetworkManager.getClient(savedServerUrl);
                        const deviceToken = appDatabase ? await getDeviceToken() : undefined;

                        if (!deviceToken) {
                            captureException(
                                new Error(`Logout called without deviceToken for server=${savedServerUrl}`),
                            );
                        }

                        const response = await client.logout(deviceToken);

                        if (response.status === 'OK') {
                            loggedOut = true;
                            WebsocketManager.getClient(savedServerUrl)?.close(true);

                            if (!skipEvents) {
                                DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {serverUrl: savedServerUrl, removeServer});
                            }
                        }
                    } catch (error) {
                        logWarning('An error occurred logging out from the server', savedServerUrl, error);
                    }
                }),
            );
        } catch (error) {
            logWarning('An error occurred logging out from the server', serverUrl, getFullErrorMessage(error));
        }

        if (!loggedOut && !skipAlert) {
            const title = intl?.formatMessage(logoutMessages.title) || logoutMessages.title.defaultMessage;

            const bodyMessage = logoutOnAlert ? logoutMessages.bodyForced : logoutMessages.body;
            const confirmMessage = logoutOnAlert ? logoutMessages.ok : logoutMessages.retry;
            const body = intl?.formatMessage(bodyMessage) || bodyMessage.defaultMessage;
            const cancel = intl?.formatMessage(logoutMessages.cancel) || logoutMessages.cancel.defaultMessage;
            const confirm = intl?.formatMessage(confirmMessage) || confirmMessage.defaultMessage;

            const buttons: AlertButton[] = logoutOnAlert ? [] : [{text: cancel, style: 'cancel'}];
            buttons.push({
                text: confirm,
                onPress: logoutOnAlert ? undefined : () => {
                    logout(serverUrl, intl, {skipEvents, removeServer});
                },
            });
            Alert.alert(
                title,
                body,
                buttons,
            );

            if (!logoutOnAlert) {
                return {data: false};
            }
        }
    }

    if (skipServerLogout || loggedOut || logoutOnAlert || skipAlert) {
        WebsocketManager.getClient(serverUrl)?.close(true);
        if (!skipEvents) {
            DeviceEventEmitter.emit(Events.SERVER_LOGOUT, {serverUrl, removeServer});
        }

        return {data: true};
    }

    return {data: false};
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

export const getUserLoginType = async (serverUrl: string, loginId: string) => {
    try {
        const client = NetworkManager.getClient(serverUrl);
        return await client.getUserLoginType(loginId);
    } catch (error) {
        logError('error on getUserLoginType', getFullErrorMessage(error));
        return {error};
    }
};

export const magicLinkLogin = async (serverUrl: string, token: string): Promise<LoginActionResponse> => {
    const httpsHeadRequest = await getServerUrlAfterRedirect(serverUrl);
    let serverUrlToUse;
    if (httpsHeadRequest.error || !httpsHeadRequest.url) {
        // Retry with HTTP
        const httpHeadRequest = await getServerUrlAfterRedirect(serverUrl, true);
        if (httpHeadRequest.error || !httpHeadRequest.url) {
            return {error: httpsHeadRequest.error || httpHeadRequest.error || 'empty server url', failed: true};
        }
        serverUrlToUse = httpHeadRequest.url;
    } else {
        serverUrlToUse = httpsHeadRequest.url;
    }

    const database = DatabaseManager.appDatabase?.database;
    if (!database) {
        return {error: 'App database not found', failed: true};
    }

    try {
        const client = await NetworkManager.createClient(serverUrlToUse, undefined);
        const config = await client.getClientConfigOld();
        const deviceId = await getDeviceToken();
        const serverDisplayName = config.SiteName;

        const user = await client.loginByMagicLinkLogin(token, deviceId);

        const server = await DatabaseManager.createServerDatabase({
            config: {
                dbName: serverUrlToUse,
                serverUrl: serverUrlToUse,
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
        const csrfToken = await getCSRFFromCookie(serverUrlToUse);
        client.setCSRFToken(csrfToken);

        // Check push notification capability (similar to normal login flow)
        const pingResult = await doPing(
            serverUrlToUse,
            true, // verifyPushProxy
            undefined, // timeoutInterval
            client, // client
        );
        if (!pingResult.error && pingResult.canReceiveNotifications) {
            const intl = getIntlShape(user.locale);
            await canReceiveNotifications(serverUrlToUse, pingResult.canReceiveNotifications as string, intl);
        }
    } catch (error) {
        return {error, failed: true};
    }

    try {
        await addPushProxyVerificationStateFromLogin(serverUrlToUse);
        const {error} = await loginEntry({serverUrl: serverUrlToUse});
        await DatabaseManager.setActiveServerDatabase(serverUrlToUse);
        await resetToHome();
        return {error, failed: false};
    } catch (error) {
        return {error, failed: false};
    }
};
