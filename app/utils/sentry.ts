// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Config from '@assets/config.json';
import ClientError from '@client/rest/error';
import DatabaseManager from '@database/manager';
import {getConfig} from '@queries/servers/system';
import {getCurrentUser} from '@queries/servers/user';
import {getFullErrorMessage} from '@utils/errors';

import {logDebug, logError, logWarning} from './log';

import type {Database} from '@nozbe/watermelondb';
import type {Breadcrumb, Span} from '@sentry/types';
import type {ComponentType} from 'react';

export const BREADCRUMB_UNCAUGHT_APP_ERROR = 'uncaught-app-error';
export const BREADCRUMB_UNCAUGHT_NON_ERROR = 'uncaught-non-error';

let Sentry: any;

const CHANNEL_SWITCH_SPAN_OP = 'mobile.channel_switch';

// A channel open outliving this limit missed its end hook (empty channel,
// interrupted navigation): the span is abandoned at the next switch.
const MAX_CHANNEL_SWITCH_SPAN_MS = 30_000;
let channelSwitchSpan: Span | undefined;
let channelSwitchSpanChannelId = '';
let channelSwitchSpanStartedAt = 0;
let sentryReady = false;

// The app root must be wrapped for Sentry to create the app-start transaction
// that carries auto-instrumented spans (app start, HTTP client) and standalone
// spans such as mobile.channel_switch. The Expo Router refactor dropped the
// wrap from the root registration, silencing all performance data on 1.1.0.
export function wrapSentryRoot<P>(Component: ComponentType<P>): ComponentType<P> {
    if (!Config.SentryEnabled) {
        return Component;
    }

    Sentry = Sentry || require('@sentry/react-native');

    return Sentry.wrap(Component);
}

export function initializeSentry() {
    sentryReady = false;
    if (!Config.SentryEnabled) {
        return;
    }

    if (!Sentry) {
        Sentry = require('@sentry/react-native');
    }

    const dsn = getDsn();

    if (!dsn) {
        logWarning('Sentry is enabled, but not configured on this platform');
        return;
    }

    const mmConfig = {
        environment: resolveSentryEnvironment(),
        tracesSampleRate: 0.2,
        sampleRate: 0.2,
        attachStacktrace: false,
    };

    const sentryOptions = {...Config.SentryOptions};
    Reflect.deleteProperty(sentryOptions, 'severityLevelFilter');

    Sentry.init({
        dsn,
        sendDefaultPii: false,
        ...mmConfig,
        ...sentryOptions,
        enableCaptureFailedRequests: false,
    });
    sentryReady = true;

    const installSource = DeviceInfo.getInstallerPackageNameSync();
    Sentry.setTag('install_source', installSource?.toLowerCase() ?? 'other');
}

// Beta and App Store builds share the same bundle id, so the install source is
// the only iOS discriminator: TestFlight installs resolve to "rc", App Store
// installs to "production", whatever the binary was originally built for.
function resolveSentryEnvironment() {
    if (__DEV__) {
        return 'development';
    }

    if (Platform.OS === 'ios') {
        return DeviceInfo.getInstallerPackageNameSync() === 'AppStore' ? 'production' : 'rc';
    }

    return Config.SentryEnvironment;
}

function getDsn() {
    if (Platform.OS === 'android') {
        return Config.SentryDsnAndroid;
    } else if (Platform.OS === 'ios') {
        return Config.SentryDsnIos;
    }

    return '';
}

export function captureException(error: unknown) {
    if (!Config.SentryEnabled) {
        return;
    }

    if (!error) {
        logWarning('captureException called with missing arguments', error);
        return;
    }
    Sentry.captureException(error);
}

export function captureMessage(message: string) {
    if (!Config.SentryEnabled) {
        return;
    }

    Sentry.captureMessage(message);
}

export function captureJSException(error: unknown, isFatal: boolean) {
    if (!Config.SentryEnabled) {
        return;
    }

    if (!error) {
        logWarning('captureJSException called with missing arguments', error);
        return;
    }

    if (error instanceof ClientError) {
        captureClientErrorAsBreadcrumb(error, isFatal);
    } else {
        captureException(error);
    }
}

function captureClientErrorAsBreadcrumb(error: ClientError, isFatal: boolean) {
    const isAppError = Boolean(error.server_error_id);
    const breadcrumb: Breadcrumb = {
        category: isAppError ? BREADCRUMB_UNCAUGHT_APP_ERROR : BREADCRUMB_UNCAUGHT_NON_ERROR,
        data: {
            isFatal: String(isFatal),
        },
        level: 'warning',
        message: getFullErrorMessage(error),
    };

    if (breadcrumb.data) {
        if (error.server_error_id) {
            breadcrumb.data.server_error_id = error.server_error_id;
        }

        if (error.status_code) {
            breadcrumb.data.status_code = error.status_code;
        }

        const match = (/^(?:https?:\/\/)[^/]+(\/.*)$/).exec(error.url);

        if (match && match.length >= 2) {
            breadcrumb.data.url = match[1];
        }
    }

    try {
        Sentry.addBreadcrumb(breadcrumb);
    } catch (e) {
        // Do nothing since this is only here to make sure we don't crash when handling an exception
        logWarning('Failed to capture breadcrumb of non-error', e);
    }
}

const getUserContext = async (database: Database) => {
    const currentUser = {
        id: 'currentUserId',
        locale: 'en',
        roles: 'multi-server-test-role',
    };

    const user = await getCurrentUser(database);

    return {
        id: user?.id ?? currentUser.id,
        userID: user?.id ?? currentUser.id,
        email: user?.email,
        username: user?.username,
        locale: user?.locale ?? currentUser.locale,
        roles: user?.roles ?? currentUser.roles,
    };
};

const getExtraContext = async (database: Database) => {
    const context = {
        config: {},
        currentChannel: {},
        currentTeam: {},
    };

    const config = await getConfig(database);
    if (config) {
        context.config = {
            BuildDate: config.BuildDate,
            BuildEnterpriseReady: config.BuildEnterpriseReady,
            BuildHash: config.BuildHash,
            BuildHashEnterprise: config.BuildHashEnterprise,
            BuildNumber: config.BuildNumber,
        };
    }

    return context;
};

const getBuildTags = async (database: Database) => {
    const tags = {
        serverBuildHash: '',
        serverBuildNumber: '',
    };

    const config = await getConfig(database);
    if (config) {
        tags.serverBuildHash = config.BuildHash;
        tags.serverBuildNumber = config.BuildNumber;
    }

    return tags;
};

export const addSentryContext = async (serverUrl: string) => {
    if (!Config.SentryEnabled || !Sentry) {
        return;
    }

    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const userContext = await getUserContext(database);
        Sentry.setContext('User-Information', userContext);
        Sentry.setUser(userContext);

        const buildContext = await getBuildTags(database);
        Sentry.setContext('App-Build Information', buildContext);

        const extraContext = await getExtraContext(database);
        Sentry.setContext('Server-Information', extraContext);
    } catch (e) {
        logError(`addSentryContext for serverUrl ${serverUrl}`, e);
    }
};

export function startChannelSwitchSpan(channelId: string) {
    if (!sentryReady) {
        return;
    }

    // A new tap before the previous channel rendered would truncate its span:
    // skip this measurement instead of corrupting the previous one.
    if (channelSwitchSpan) {
        if (Date.now() - channelSwitchSpanStartedAt < MAX_CHANNEL_SWITCH_SPAN_MS) {
            logDebug('startChannelSwitchSpan skipped: previous channel switch span still in flight');
            return;
        }

        channelSwitchSpan.setAttribute('kchat.channel_switch.abandoned', true);
        channelSwitchSpan.end();
        channelSwitchSpan = undefined;
    }

    channelSwitchSpan = Sentry.startInactiveSpan({
        name: 'channel_switch',
        op: CHANNEL_SWITCH_SPAN_OP,
        attributes: {'kchat.channel_id': channelId},
    });
    channelSwitchSpanChannelId = channelId;
    channelSwitchSpanStartedAt = Date.now();
}

export function endChannelSwitchSpan(channelId: string) {
    if (!channelSwitchSpan) {
        return;
    }

    if (channelSwitchSpanChannelId !== channelId) {
        logDebug(`endChannelSwitchSpan ignored for ${channelId}: span belongs to ${channelSwitchSpanChannelId}`);
        return;
    }

    const span = channelSwitchSpan;
    channelSwitchSpan = undefined;
    span.end();
}
