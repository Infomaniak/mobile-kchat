// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export function buildAuthorizedImageSource(
    serverUrl: string,
    uri: string | undefined,
    token?: string,
): {uri?: string; headers?: {Authorization: string}} {
    const serverOrigin = new URL(serverUrl).origin;

    // (a) undefined/empty → {}
    if (!uri) {
        return {};
    }

    // (b) starts with '/' → serverUrl + uri + auth headers when token
    if (uri.startsWith('/')) {
        const headers = token ? {Authorization: token} : undefined;
        return {uri: serverUrl + uri, headers};
    }

    // (c) absolute URI parseable by new URL() with same-origin → auth headers when token
    try {
        const url = new URL(uri);

        // (d) absolute URI with different origin → {uri} (no headers)
        if (url.origin !== serverOrigin) {
            return {uri};
        }

        // same origin
        const headers = token ? {Authorization: token} : undefined;
        return {uri, headers};
    } catch {
        // (d) new URL() throws → {uri} (no headers)
        return {uri};
    }
}
