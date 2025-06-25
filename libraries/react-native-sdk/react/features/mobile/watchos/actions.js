"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWatchReachable = exports.setSessionId = exports.setConferenceTimestamp = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Stores a timestamp when the conference is joined, so that the watch counterpart can start counting from when
 * the meeting has really started.
 *
 * @param {number} conferenceTimestamp - A timestamp retrieved with {@code newDate.getTime()}.
 * @returns {{
 *      type: SET_CONFERENCE_TIMESTAMP,
 *      conferenceTimestamp: number
 * }}
 */
function setConferenceTimestamp(conferenceTimestamp) {
    return {
        type: actionTypes_1.SET_CONFERENCE_TIMESTAMP,
        conferenceTimestamp
    };
}
exports.setConferenceTimestamp = setConferenceTimestamp;
/**
 * Updates the session ID which is sent to the Watch app and then used by the app to send commands. Commands from
 * the watch are accepted only if the 'sessionID' passed by the Watch matches the one currently stored in Redux. It is
 * supposed to prevent from processing outdated commands.
 *
 * @returns {{
 *     type: SET_SESSION_ID,
 *     sessionID: number
 * }}
 */
function setSessionId() {
    return {
        type: actionTypes_1.SET_SESSION_ID,
        sessionID: new Date().getTime()
    };
}
exports.setSessionId = setSessionId;
/**
 * Updates the reachable status of the watch. It's used to get in sync with the watch counterpart when it gets
 * reconnected, but also to prevent from sending updates if the app is not installed at all (which would fail with
 * an error).
 *
 * @param {boolean} isReachable - Indicates whether the watch is currently reachable or not.
 * @returns {{
 *      type: SET_WATCH_REACHABLE,
 *      watchReachable: boolean
 * }}
 */
function setWatchReachable(isReachable) {
    return {
        type: actionTypes_1.SET_WATCH_REACHABLE,
        watchReachable: isReachable
    };
}
exports.setWatchReachable = setWatchReachable;
