// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {match} from 'path-to-regexp';
import {type IntlShape} from 'react-intl';
import {Navigation} from 'react-native-navigation';
import urlParse from 'url-parse';

import {makeDirectChannel, switchToChannelByName} from '@actions/remote/channel';
import {switchToConferenceByChannelId} from '@actions/remote/conference';
import {showPermalink} from '@actions/remote/permalink';
import {fetchUsersByUsernames} from '@actions/remote/user';
import {DeepLink, Launch, Screens} from '@constants';
import DeepLinkType from '@constants/deep_linking';
import {getDefaultThemeByAppearance} from '@context/theme';
import DatabaseManager from '@database/manager';
import {DEFAULT_LOCALE, t} from '@i18n';
import WebsocketManager from '@managers/websocket_manager';
import {getActiveServerUrl} from '@queries/app/servers';
import {getCurrentUser, queryUsersByUsername} from '@queries/servers/user';
import {dismissAllModalsAndPopToRoot} from '@screens/navigation';
import EphemeralStore from '@store/ephemeral_store';
import NavigationStore from '@store/navigation_store';
import {alertErrorWithFallback, errorBadChannel, errorUnkownUser} from '@utils/draft';
import {getIntlShape} from '@utils/general';
import {logError} from '@utils/log';
import {escapeRegex} from '@utils/markdown';
import {addNewServer} from '@utils/server';
import {removeProtocol, stripTrailingSlashes} from '@utils/url';
import {
    TEAM_NAME_PATH_PATTERN,
    IDENTIFIER_PATH_PATTERN,
    ID_PATH_PATTERN,
} from '@utils/url/path';

import type {DeepLinkChannel, DeepLinkConference, DeepLinkDM, DeepLinkGM, DeepLinkPermalink, DeepLinkWithData, LaunchProps} from '@typings/launch';
import type {AvailableScreens} from '@typings/screens/navigation';

const deepLinkScreens: AvailableScreens[] = [Screens.HOME, Screens.CHANNEL, Screens.GLOBAL_THREADS, Screens.THREAD];

export async function handleDeepLink(deepLinkUrl: string, intlShape?: IntlShape, location?: string, asServer = false) {
    try {
        const parsed = parseDeepLink(deepLinkUrl, asServer);
        if (parsed.type === DeepLink.Invalid || !parsed.data || !parsed.data.serverUrl) {
            return {error: true};
        }

        const currentServerUrl = await getActiveServerUrl();
        const existingServerUrl = DatabaseManager.searchUrl(parsed.data.serverUrl);

        // After checking the server for http & https then we add it
        if (!existingServerUrl) {
            const theme = EphemeralStore.theme || getDefaultThemeByAppearance();
            if (NavigationStore.getVisibleScreen() === Screens.SERVER) {
                Navigation.updateProps(Screens.SERVER, {serverUrl: parsed.data.serverUrl});
            } else if (!NavigationStore.getScreensInStack().includes(Screens.SERVER)) {
                addNewServer(theme, parsed.data.serverUrl, undefined, parsed);
            }
            return {error: false};
        }

        if (existingServerUrl !== currentServerUrl && NavigationStore.getVisibleScreen()) {
            await dismissAllModalsAndPopToRoot();
            DatabaseManager.setActiveServerDatabase(existingServerUrl);
            WebsocketManager.initializeClient(existingServerUrl, 'DeepLink');
            await NavigationStore.waitUntilScreenHasLoaded(Screens.HOME);
        }

        const {database} = DatabaseManager.getServerDatabaseAndOperator(existingServerUrl);
        const currentUser = await getCurrentUser(database);
        const locale = currentUser?.locale || DEFAULT_LOCALE;
        const intl = intlShape || getIntlShape(locale);

        switch (parsed.type) {
            case DeepLink.Channel: {
                const deepLinkData = parsed.data as DeepLinkChannel;
                switchToChannelByName(existingServerUrl, deepLinkData.channelName, deepLinkData.teamName, errorBadChannel, intl);
                break;
            }
            case DeepLink.DirectMessage: {
                const deepLinkData = parsed.data as DeepLinkDM;
                const userIds = await queryUsersByUsername(database, [deepLinkData.userName]).fetchIds();
                let userId = userIds.length ? userIds[0] : undefined;
                if (!userId) {
                    const {users} = await fetchUsersByUsernames(existingServerUrl, [deepLinkData.userName], false);
                    if (users?.length) {
                        userId = users[0].id;
                    }
                }

                if (userId) {
                    makeDirectChannel(existingServerUrl, userId, '', true);
                } else {
                    errorUnkownUser(intl);
                }
                break;
            }
            case DeepLink.GroupMessage: {
                const deepLinkData = parsed.data as DeepLinkGM;
                switchToChannelByName(existingServerUrl, deepLinkData.channelName, deepLinkData.teamName, errorBadChannel, intl);
                break;
            }
            case DeepLink.Permalink: {
                const deepLinkData = parsed.data as DeepLinkPermalink;
                if (
                    NavigationStore.hasModalsOpened() ||
                    !deepLinkScreens.includes(NavigationStore.getVisibleScreen())
                ) {
                    await dismissAllModalsAndPopToRoot();
                }
                showPermalink(existingServerUrl, deepLinkData.teamName, deepLinkData.postId);
                break;
            }
            case DeepLink.Conference: {
                const deepLinkData = parsed.data as DeepLinkConference;
                switchToConferenceByChannelId(existingServerUrl, deepLinkData.channelId, {
                    conferenceJWT: deepLinkData.conferenceJWT,
                    initiator: 'native',
                });
                break;
            }
        }
        return {error: false};
    } catch (error) {
        logError('Failed to open channel from deeplink', error, location);
        return {error: true};
    }
}

type ChannelPathParams = {
    hostname: string;
    serverUrl: string[];
    teamName: string;
    path: 'channels' | 'messages';
    identifier: string;
};

const CHANNEL_PATH = '*serverUrl/:teamName/:path/:identifier';
export const matchChannelDeeplink = match<ChannelPathParams>(CHANNEL_PATH);

type PermalinkPathParams = {
    serverUrl: string[];
    teamName: string;
    postId: string;
};
const PERMALINK_PATH = '*serverUrl/:teamName/pl/:postId';
export const matchPermalinkDeeplink = match<PermalinkPathParams>(PERMALINK_PATH);

type ConferencePathParams = {
    serverUrl: string;
    channelId: string;
};
const CONFERENCE_PATH = `:serverUrl(.*)/channels/:channelId(${IDENTIFIER_PATH_PATTERN})/conference(\\?conference_jwt=.+)?`;
export const matchConferenceDeeplink = match<ConferencePathParams>(CONFERENCE_PATH);

function isValidTeamName(teamName: string): boolean {
    const regex = new RegExp(`^${TEAM_NAME_PATH_PATTERN}$`);
    return regex.test(teamName);
}

function isValidIdentifierPathPattern(id: string): boolean {
    const regex = new RegExp(`^${IDENTIFIER_PATH_PATTERN}$`);
    return regex.test(id);
}

function isValidPostId(id: string): boolean {
    const regex = new RegExp(`^${ID_PATH_PATTERN}$`);
    return regex.test(id);
}

export function parseDeepLink(deepLinkUrl: string): DeepLinkWithData {
    try {
        const url = removeProtocol(deepLinkUrl);

        const channelMatch = matchChannelDeeplink(url);
        if (channelMatch && isValidTeamName(channelMatch.params.teamName) && isValidIdentifierPathPattern(channelMatch.params.identifier)) {
            const {params: {serverUrl, teamName, path, identifier}} = channelMatch;

            if (path === 'channels') {
                return {type: DeepLink.Channel, url: deepLinkUrl, data: {serverUrl: serverUrl.join('/'), teamName, channelName: identifier}};
            }

            if (path === 'messages') {
                if (identifier.startsWith('@')) {
                    return {type: DeepLink.DirectMessage, url: deepLinkUrl, data: {serverUrl: serverUrl.join('/'), teamName, userName: identifier.substring(1)}};
                }

                return {type: DeepLink.GroupMessage, url: deepLinkUrl, data: {serverUrl: serverUrl.join('/'), teamName, channelName: identifier}};
            }
        }

        const permalinkMatch = matchPermalinkDeeplink(url);
        if (permalinkMatch && isValidTeamName(permalinkMatch.params.teamName) && isValidPostId(permalinkMatch.params.postId)) {
            const {params: {serverUrl, teamName, postId}} = permalinkMatch;
            return {type: DeepLink.Permalink, url: deepLinkUrl, data: {serverUrl: serverUrl.join('/'), teamName, postId}};
        }

        const conferenceMatch = matchConferenceDeeplink(url);
        if (conferenceMatch) {
            const {params: {serverUrl, channelId}} = conferenceMatch;

            // Parse the conferenceJWT from search params
            const params = new URLSearchParams(deepLinkUrl);
            const conferenceJWT = params.get('conference_jwt');

            return {
                type: DeepLink.Conference,
                url: deepLinkUrl,
                data: {
                    serverUrl,
                    channelId,
                    conferenceJWT: typeof conferenceJWT === 'string' ? conferenceJWT : undefined,
                },
            };
        }
    } catch (err) {
        // do nothing just return invalid deeplink
    }

    return {type: DeepLink.Invalid, url: deepLinkUrl};
}

export function matchDeepLink(url: string, serverURL?: string, siteURL?: string) {
    if (!url || (!serverURL && !siteURL)) {
        return null;
    }

    let urlToMatch = url;
    const urlBase = serverURL || siteURL || '';
    const parsedUrl = urlParse(url);

    if (!parsedUrl.protocol) {
        // If url doesn't contain site or server URL, tack it on.
        // e.g. <jump to convo> URLs from autolink plugin.
        const deepLinkMatch = new RegExp(escapeRegex(urlBase)).exec(url);
        if (!deepLinkMatch) {
            urlToMatch = urlBase + url;
        }
    }

    const parsed = parseDeepLink(urlToMatch);

    if (parsed.type === DeepLinkType.Invalid) {
        return null;
    }

    return parsed;
}

export const getLaunchPropsFromDeepLink = (deepLinkUrl: string, coldStart = false): LaunchProps => {
    const parsed = parseDeepLink(deepLinkUrl);
    const launchProps: LaunchProps = {
        launchType: Launch.DeepLink,
        coldStart,
    };

    switch (parsed.type) {
        case DeepLink.Invalid:
            launchProps.launchError = true;
            launchProps.extra = parsed;
            break;
        default: {
            launchProps.extra = parsed;
            break;
        }
    }

    return launchProps;
};

export function alertInvalidDeepLink(intl: IntlShape) {
    const message = {
        id: t('mobile.deep_link.invalid'),
        defaultMessage: 'This link you are trying to open is invalid.',
    };

    return alertErrorWithFallback(intl, {}, message);
}
