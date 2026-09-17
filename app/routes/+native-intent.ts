// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Linking} from 'react-native';
import urlParse from 'url-parse';

import {DEFAULT_LOCALE} from '@i18n';
import {alertInvalidDeepLink, parseAndHandleDeepLink} from '@utils/deep_link';
import {getIntlShape} from '@utils/general';

/**
 * Custom native intent handler for expo-router
 * This replaces expo-router's default deep link handling with our custom logic
 *
 * Expo-router will use this instead of setting up its own Linking.addEventListener
 * This prevents the "multiple linking configurations" error
 */

// Schemes consumed natively by their own libraries (OAuth login via
// react-native-app-auth, legacy SSO) must never reach expo-router, where they
// would resolve to unregistered routes. Other custom schemes (e.g.
// kchat://server/team/channels/general) are valid deep links:
// parseAndHandleDeepLink strips the protocol before matching server URLs.
const LIBRARY_URL_SCHEMES = ['com.infomaniak.chat://', 'mmauth://', 'mmauthbeta://'];

const isCustomSchemeUrl = (url: string) => LIBRARY_URL_SCHEMES.some((scheme) => url.startsWith(scheme));

const handleUrl = async (event: {url: string}) => {
    // Custom scheme URLs with no host (e.g. kchat:/// redelivered by iOS as
    // the initial URL after a previous session was opened with a kchat://
    // link, or mailto:) carry no deep link destination: ignore them silently
    // like upstream instead of alerting on cold start.
    const parsed = urlParse(event.url);
    if (parsed.protocol && !parsed.host) {
        return false;
    }

    if (isCustomSchemeUrl(event.url)) {
        return false;
    }

    if (event.url) {
        const {error} = await parseAndHandleDeepLink(
            event.url,
            undefined,
            undefined,
            true,
        );

        if (error) {
            alertInvalidDeepLink(getIntlShape(DEFAULT_LOCALE));
            return false;
        }

        return true;
    }

    return false;
};

/**
 * Set up custom deep link event listener
 * Expo-router calls this function to subscribe to URL events
 */
export const addEventListener = () => {
    const subscription = Linking.addEventListener('url', handleUrl);

    return () => {
        subscription.remove();
    };
};

/**
 * Optional: Redirect system paths if needed
 *
 * Returning null keeps the app on its current path:
 * - for custom scheme URLs consumed by their own libraries (OAuth login)
 * - for deep links already handled by our custom handler above
 */
export async function redirectSystemPath(options: {path: string; initial: boolean}) {
    if (isCustomSchemeUrl(options.path)) {
        return null;
    }

    const handled = await handleUrl({url: options.path});
    if (handled) {
        return null;
    }

    return options.path;
}
