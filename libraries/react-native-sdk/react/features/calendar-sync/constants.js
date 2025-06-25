"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_LIST_LENGTH = exports.FETCH_START_DAYS = exports.FETCH_END_DAYS = exports.ERRORS = exports.CALENDAR_TYPE = void 0;
/**
 * An enumeration of support calendar integration types.
 *
 * @enum {string}
 */
exports.CALENDAR_TYPE = {
    GOOGLE: 'google',
    MICROSOFT: 'microsoft'
};
/**
 * An enumeration of known errors that can occur while interacting with the
 * calendar integration.
 *
 * @enum {string}
 */
exports.ERRORS = {
    AUTH_FAILED: 'sign_in_failed',
    GOOGLE_APP_MISCONFIGURED: 'idpiframe_initialization_failed'
};
/**
 * The number of days to fetch.
 */
exports.FETCH_END_DAYS = 10;
/**
 * The number of days to go back when fetching.
 */
exports.FETCH_START_DAYS = -1;
/**
 * The max number of events to fetch from the calendar.
 */
exports.MAX_LIST_LENGTH = 10;
