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
export declare function setConferenceTimestamp(conferenceTimestamp: number): {
    type: symbol;
    conferenceTimestamp: number;
};
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
export declare function setSessionId(): {
    type: symbol;
    sessionID: number;
};
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
export declare function setWatchReachable(isReachable: boolean): {
    type: symbol;
    watchReachable: boolean;
};
