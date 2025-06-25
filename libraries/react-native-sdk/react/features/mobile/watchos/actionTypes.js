"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_WATCH_REACHABLE = exports.SET_SESSION_ID = exports.SET_CONFERENCE_TIMESTAMP = void 0;
/**
 * See {@link setConferenceTimestamp} for more details.
 * {
 *      type: SET_CONFERENCE_TIMESTAMP,
 *      conferenceTimestamp: number
 * }
 */
exports.SET_CONFERENCE_TIMESTAMP = Symbol('WATCH_OS_SET_CONFERENCE_TIMESTAMP');
/**
 * See {@link setSessionId} action for more details.
 * {
 *     type: SET_SESSION_ID,
 *     sessionID: number
 * }
 */
exports.SET_SESSION_ID = Symbol('WATCH_OS_SET_SESSION_ID');
/**
 * See {@link setWatchReachable} for more details.
 * {
 *     type: SET_WATCH_REACHABLE,
 *     watchReachable: boolean
 * }
 */
exports.SET_WATCH_REACHABLE = Symbol('WATCH_OS_SET_WATCH_REACHABLE');
