// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Config from '@assets/config.json';
import {ENABLE_PERF_MONITOR} from '@constants/dev_config';
import keyMirror from '@utils/key_mirror';

const SentryLevels = keyMirror({debug: null, info: null, warning: null, error: null});

const perfTimers = new Map<string, number>();

export function logError(...args: any[]) {
    // eslint-disable-next-line no-console
    console.error(...args);
    addBreadcrumb(SentryLevels.error, ...args);
}

export function logWarning(...args: any[]) {
    // eslint-disable-next-line no-console
    console.warn(...args);
    addBreadcrumb(SentryLevels.warning, ...args);
}

export function logInfo(...args: any[]) {
    // eslint-disable-next-line no-console
    console.log(...args);
    addBreadcrumb(SentryLevels.info, ...args);
}

export function logDebug(...args: any[]) {
    // eslint-disable-next-line no-console
    console.debug(...args);
    addBreadcrumb(SentryLevels.debug, ...args);
}

export function logTimestamp(label: string, timestamp: number | undefined) {
    let time = '';
    if (timestamp === 0) {
        time = '0';
    } else if (typeof timestamp !== 'undefined') {
        const date = new Date(timestamp);
        time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    }
    logInfo(label, timestamp, time);
}

export function perfStart(label: string) {
    if (!ENABLE_PERF_MONITOR) {
        return;
    }
    perfTimers.set(label, Date.now());
    logDebug(`[PERF] ${label} START`);
}

export function perfEnd(label: string) {
    if (!ENABLE_PERF_MONITOR) {
        return;
    }
    const start = perfTimers.get(label);
    if (start) {
        perfTimers.delete(label);
        const elapsed = Date.now() - start;
        logDebug(`[PERF] ${label} END ${elapsed}ms`);
    }
}

export function perfLog(label: string, elapsedMs: number) {
    if (!ENABLE_PERF_MONITOR) {
        return;
    }
    logDebug(`[PERF] ${label} ${elapsedMs}ms`);
}

const addBreadcrumb = (logLevel: keyof typeof SentryLevels, ...args: any[]) => {
    if (Config.SentryEnabled) {
        const Sentry = require('@sentry/react-native');
        Sentry.addBreadcrumb({
            level: logLevel,
            message: args.join(','),
            type: 'console-log',
        });
    }
};
