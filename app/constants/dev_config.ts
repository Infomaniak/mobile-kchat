// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/**
 * Devevelopment-only feature flags.
 * Change these values to enable debug features in TestFlight / beta builds.
 *
 * To enable for a TestFlight build, temporarily set:
 *   ENABLE_PERF_MONITOR = true
 * before building.
 */

// eslint-disable-next-line no-process-env
export const ENABLE_PERF_MONITOR = __DEV__ || Boolean(process.env.ENABLE_PERF_MONITOR);
