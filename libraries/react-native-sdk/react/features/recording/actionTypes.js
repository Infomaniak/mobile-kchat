"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_START_RECORDING_NOTIFICATION_SHOWN = exports.STOP_LOCAL_RECORDING = exports.START_LOCAL_RECORDING = exports.SET_MEETING_HIGHLIGHT_BUTTON_STATE = exports.SET_STREAM_KEY = exports.SET_SELECTED_RECORDING_SERVICE = exports.SET_PENDING_RECORDING_NOTIFICATION_UID = exports.RECORDING_SESSION_UPDATED = exports.CLEAR_RECORDING_SESSIONS = void 0;
/**
 * The type of Redux action which clears all the data of every sessions.
 *
 * {
 *     type: CLEAR_RECORDING_SESSIONS
 * }
 * @public
 */
exports.CLEAR_RECORDING_SESSIONS = 'CLEAR_RECORDING_SESSIONS';
/**
 * The type of Redux action which updates the current known state of a recording
 * session.
 *
 * {
 *     type: RECORDING_SESSION_UPDATED,
 *     sessionData: Object
 * }
 * @public
 */
exports.RECORDING_SESSION_UPDATED = 'RECORDING_SESSION_UPDATED';
/**
 * The type of Redux action which sets the pending recording notification UID to
 * use it for when hiding the notification is necessary, or unsets it when
 * undefined (or no param) is passed.
 *
 * {
 *     type: SET_PENDING_RECORDING_NOTIFICATION_UID,
 *     streamType: string,
 *     uid: ?number
 * }
 * @public
 */
exports.SET_PENDING_RECORDING_NOTIFICATION_UID = 'SET_PENDING_RECORDING_NOTIFICATION_UID';
/**
 * The type of Redux action which sets the selected recording service.
 *
 * {
 *     type: SET_SELECTED_RECORDING_SERVICE
 * }
 * @public
 */
exports.SET_SELECTED_RECORDING_SERVICE = 'SET_SELECTED_RECORDING_SERVICE';
/**
 * Sets the stream key last used by the user for later reuse.
 *
 * {
 *     type: SET_STREAM_KEY,
 *     streamKey: string
 * }
 */
exports.SET_STREAM_KEY = 'SET_STREAM_KEY';
/**
 * Sets the enable state of the meeting highlight button.
 *
 * {
 *     type: SET_MEETING_HIGHLIGHT_BUTTON_STATE,
 *     disabled: boolean
 * }
 */
exports.SET_MEETING_HIGHLIGHT_BUTTON_STATE = 'SET_MEETING_HIGHLIGHT_BUTTON_STATE';
/**
 * Attempts to start the local recording.
 *
 * {
 *     type: START_LOCAL_RECORDING,
 *     onlySelf: boolean
 * }
 */
exports.START_LOCAL_RECORDING = 'START_LOCAL_RECORDING';
/**
 * Stops local recording.
 *
 * {
 *     type: STOP_LOCAL_RECORDING
 * }
 */
exports.STOP_LOCAL_RECORDING = 'STOP_LOCAL_RECORDING';
/**
 * Indicates that the start recording notification has been shown.
 *
 * {
 *    type: SET_START_RECORDING_NOTIFICATION_SHOWN
 * }
 */
exports.SET_START_RECORDING_NOTIFICATION_SHOWN = 'SET_START_RECORDING_NOTIFICATION_SHOWN';
