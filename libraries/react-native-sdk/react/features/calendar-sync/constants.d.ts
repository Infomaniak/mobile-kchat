/**
 * An enumeration of support calendar integration types.
 *
 * @enum {string}
 */
export declare const CALENDAR_TYPE: {
    GOOGLE: string;
    MICROSOFT: string;
};
/**
 * An enumeration of known errors that can occur while interacting with the
 * calendar integration.
 *
 * @enum {string}
 */
export declare const ERRORS: {
    AUTH_FAILED: string;
    GOOGLE_APP_MISCONFIGURED: string;
};
/**
 * The number of days to fetch.
 */
export declare const FETCH_END_DAYS = 10;
/**
 * The number of days to go back when fetching.
 */
export declare const FETCH_START_DAYS = -1;
/**
 * The max number of events to fetch from the calendar.
 */
export declare const MAX_LIST_LENGTH = 10;
