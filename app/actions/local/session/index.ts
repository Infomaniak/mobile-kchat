// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {removePushDisabledInServerAcknowledged} from '@actions/app/global';
import DatabaseManager from '@database/manager';
import {resetMomentLocale} from '@i18n';
import {removeServerCredentials} from '@init/credentials';
import PushNotifications from '@init/push_notifications';
import NetworkManager from '@managers/network_manager';
import WebsocketManager from '@managers/websocket_manager';
import {getCurrentUser} from '@queries/servers/user';
import {deleteFileCache, deleteFileCacheByDir} from '@utils/file';
import {logWarning} from '@utils/log';
import {clearCookiesForServer, urlSafeBase64Encode} from '@utils/security';

const resetLocale = async () => {
    if (Object.keys(DatabaseManager.serverDatabases).length) {
        const serverDatabase = await DatabaseManager.getActiveServerDatabase();
        const user = await getCurrentUser(serverDatabase!);
        resetMomentLocale(user?.locale);
    } else {
        resetMomentLocale();
    }
};

export const terminateSession = async (serverUrl: string, removeServer: boolean) => {
    const errors: Array<{operation: string; error: unknown}> = [];

    // Helper to safely execute operations and optionally track errors
    const safeExecute = async (operation: string, fn: () => Promise<unknown>, critical = true) => {
        try {
            const result = await fn();

            // Check if function returned {error}
            if (result && typeof result === 'object' && 'error' in result && critical) {
                errors.push({operation, error: result.error});
            }
        } catch (error) {
            if (critical) {
                errors.push({operation, error});
            } else {
                // Log but don't track as failure
                logWarning(`terminateSession: ${operation} failed (non-critical)`, error);
            }
        }
    };

    // Remove server credentials (critical)
    await safeExecute('removeServerCredentials', async () => {
        await removeServerCredentials(serverUrl);
    });

    // Remove push notifications (synchronous, no error handling needed)
    PushNotifications.removeServerNotifications(serverUrl);
    if (removeServer) {
        PushNotifications.clearAllNotifications();
    }

    // Invalidate clients (synchronous, no error handling needed)
    NetworkManager.invalidateClient(serverUrl);
    WebsocketManager.invalidateClient(serverUrl);

    // Remove push disabled acknowledgment (non-critical)
    if (removeServer) {
        await safeExecute('removePushDisabledInServerAcknowledged', async () => {
            const result = await removePushDisabledInServerAcknowledged(urlSafeBase64Encode(serverUrl));
            if (result && typeof result === 'object' && 'error' in result) {
                throw result.error;
            }
        }, false);
    }

    // Database operations (critical)
    await safeExecute('databaseOperation', async () => {
        if (removeServer) {
            await DatabaseManager.destroyServerDatabase(serverUrl);
        } else {
            await DatabaseManager.deleteServerDatabase(serverUrl);
        }
    });

    // Reset locale (non-critical)
    await safeExecute('resetLocale', async () => {
        await resetLocale();
    }, false);

    // Clear cookies (synchronous)
    clearCookiesForServer(serverUrl);

    // Delete file caches (critical - we need to wipe local data)
    await safeExecute('deleteFileCache', async () => {
        await deleteFileCache(serverUrl);
    });

    await safeExecute('deleteFileCacheMmPasteInput', async () => {
        await deleteFileCacheByDir('mmPasteInput');
    });

    await safeExecute('deleteFileCacheThumbnails', async () => {
        await deleteFileCacheByDir('thumbnails');
    });

    if (errors.length > 0) {
        return {error: errors};
    }

    return {};
};
