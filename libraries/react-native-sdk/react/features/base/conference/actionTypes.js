"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_CONFERENCE_METADATA = exports.SET_ASSUMED_BANDWIDTH_BPS = exports.SET_START_MUTED_POLICY = exports.SET_ROOM = exports.SET_PENDING_SUBJECT_CHANGE = exports.SET_PASSWORD_FAILED = exports.SET_PASSWORD = exports.SET_START_REACTIONS_MUTED = exports.SET_OBFUSCATED_ROOM = exports.SET_FOLLOW_ME = exports.SEND_TONES = exports.P2P_STATUS_CHANGED = exports.NON_PARTICIPANT_MESSAGE_RECEIVED = exports.LOCK_STATE_CHANGED = exports.KICKED_OUT = exports.ENDPOINT_MESSAGE_RECEIVED = exports.DATA_CHANNEL_CLOSED = exports.DATA_CHANNEL_OPENED = exports.CONFERENCE_WILL_LEAVE = exports.CONFERENCE_WILL_JOIN = exports.CONFERENCE_WILL_INIT = exports.E2E_RTT_CHANGED = exports.CONFERENCE_UNIQUE_ID_SET = exports.CONFERENCE_TIMESTAMP_CHANGED = exports.CONFERENCE_SUBJECT_CHANGED = exports.CONFERENCE_LOCAL_SUBJECT_CHANGED = exports.CONFERENCE_FOCUSED = exports.CONFERENCE_BLURRED = exports.CONFERENCE_LEFT = exports.CONFERENCE_JOIN_IN_PROGRESS = exports.CONFERENCE_JOINED = exports.CONFERENCE_FAILED = exports.AUTH_STATUS_CHANGED = void 0;
/**
 * The type of (redux) action which signals that server authentication has
 * becoming available or unavailable or logged in user has changed.
 *
 * {
 *     type: AUTH_STATUS_CHANGED,
 *     authEnabled: boolean,
 *     authLogin: string
 * }
 */
exports.AUTH_STATUS_CHANGED = 'AUTH_STATUS_CHANGED';
/**
 * The type of (redux) action which signals that a specific conference failed.
 *
 * {
 *     type: CONFERENCE_FAILED,
 *     conference: JitsiConference,
 *     error: Error
 * }
 */
exports.CONFERENCE_FAILED = 'CONFERENCE_FAILED';
/**
 * The type of (redux) action which signals that a specific conference was
 * joined.
 *
 * {
 *     type: CONFERENCE_JOINED,
 *     conference: JitsiConference
 * }
 */
exports.CONFERENCE_JOINED = 'CONFERENCE_JOINED';
/**
 * The type of (redux) action which signals that a specific conference joining is in progress.
 * A CONFERENCE_JOINED is guaranteed to follow.
 *
 * {
 *     type: CONFERENCE_JOIN_IN_PROGRESS,
 *     conference: JitsiConference
 * }
 */
exports.CONFERENCE_JOIN_IN_PROGRESS = 'CONFERENCE_JOIN_IN_PROGRESS';
/**
 * The type of (redux) action which signals that a specific conference was left.
 *
 * {
 *     type: CONFERENCE_LEFT,
 *     conference: JitsiConference
 * }
 */
exports.CONFERENCE_LEFT = 'CONFERENCE_LEFT';
/**
 * The type of (redux) action which signals that the conference is out of focus.
 * For example, if the user navigates to the Chat screen.
 *
 * {
 *      type: CONFERENCE_BLURRED,
 * }
 */
exports.CONFERENCE_BLURRED = 'CONFERENCE_BLURRED';
/**
 * The type of (redux) action which signals that the conference is in focus.
 *
 * {
 *      type: CONFERENCE_FOCUSED,
 * }
 */
exports.CONFERENCE_FOCUSED = 'CONFERENCE_FOCUSED';
/**
 * The type of (redux) action, which indicates conference local subject changes.
 *
 * {
 *     type: CONFERENCE_LOCAL_SUBJECT_CHANGED
 *     subject: string
 * }
 */
exports.CONFERENCE_LOCAL_SUBJECT_CHANGED = 'CONFERENCE_LOCAL_SUBJECT_CHANGED';
/**
* The type of (redux) action, which indicates conference subject changes.
*
* {
*     type: CONFERENCE_SUBJECT_CHANGED
*     subject: string
* }
*/
exports.CONFERENCE_SUBJECT_CHANGED = 'CONFERENCE_SUBJECT_CHANGED';
/**
* The type of (redux) action, which indicates conference UTC timestamp changes.
*
* {
*      type: CONFERENCE_TIMESTAMP_CHANGED
*      timestamp: number
* }
*/
exports.CONFERENCE_TIMESTAMP_CHANGED = 'CONFERENCE_TIMESTAMP_CHANGED';
/**
 * The type of (redux) action which signals that an uuid for a conference has been set.
 *
 * {
 *     type: CONFERENCE_UNIQUE_ID_SET,
 *     conference: JitsiConference
 * }
 */
exports.CONFERENCE_UNIQUE_ID_SET = 'CONFERENCE_UNIQUE_ID_SET';
/**
 * The type of (redux) action which signals that the end-to-end RTT against a specific remote participant has changed.
 *
 * {
 *     type: E2E_RTT_CHANGED,
 *     e2eRtt: {
 *         rtt: number,
 *         participant: Object,
 *     }
 * }
 */
exports.E2E_RTT_CHANGED = 'E2E_RTT_CHANGED';
/**
 * The type of (redux) action which signals that a conference will be initialized.
 *
 * {
 *     type: CONFERENCE_WILL_INIT
 * }
 */
exports.CONFERENCE_WILL_INIT = 'CONFERENCE_WILL_INIT';
/**
 * The type of (redux) action which signals that a specific conference will be
 * joined.
 *
 * {
 *     type: CONFERENCE_WILL_JOIN,
 *     conference: JitsiConference
 * }
 */
exports.CONFERENCE_WILL_JOIN = 'CONFERENCE_WILL_JOIN';
/**
 * The type of (redux) action which signals that a specific conference will be
 * left.
 *
 * {
 *     type: CONFERENCE_WILL_LEAVE,
 *     conference: JitsiConference
 * }
 */
exports.CONFERENCE_WILL_LEAVE = 'CONFERENCE_WILL_LEAVE';
/**
 * The type of (redux) action which signals that the data channel with the
 * bridge has been established.
 *
 * {
 *     type: DATA_CHANNEL_OPENED
 * }
 */
exports.DATA_CHANNEL_OPENED = 'DATA_CHANNEL_OPENED';
/**
 * The type of (redux) action which signals that the data channel with the
 * bridge has been closed.
 *
 * {
 *     type: DATA_CHANNEL_CLOSED,
 *     code: number,
 *     reason: string
 * }
 */
exports.DATA_CHANNEL_CLOSED = 'DATA_CHANNEL_CLOSED';
/**
 * The type of (redux) action which indicates that an endpoint message
 * sent by another participant to the data channel is received.
 *
 * {
 *     type: ENDPOINT_MESSAGE_RECEIVED,
 *     participant: Object,
 *     data: Object
 * }
 */
exports.ENDPOINT_MESSAGE_RECEIVED = 'ENDPOINT_MESSAGE_RECEIVED';
/**
 * The type of action which signals that the user has been kicked out from
 * the conference.
 *
 * {
 *     type: KICKED_OUT,
 *     conference: JitsiConference
 * }
 */
exports.KICKED_OUT = 'KICKED_OUT';
/**
 * The type of (redux) action which signals that the lock state of a specific
 * {@code JitsiConference} changed.
 *
 * {
 *     type: LOCK_STATE_CHANGED,
 *     conference: JitsiConference,
 *     locked: boolean
 * }
 */
exports.LOCK_STATE_CHANGED = 'LOCK_STATE_CHANGED';
/**
 * The type of (redux) action which signals that a system (non-participant) message has been received.
 *
 * {
 *     type: NON_PARTICIPANT_MESSAGE_RECEIVED,
 *     id: String,
 *     json: Object
 * }
 */
exports.NON_PARTICIPANT_MESSAGE_RECEIVED = 'NON_PARTICIPANT_MESSAGE_RECEIVED';
/**
 * The type of (redux) action which sets the peer2peer flag for the current
 * conference.
 *
 * {
 *     type: P2P_STATUS_CHANGED,
 *     p2p: boolean
 * }
 */
exports.P2P_STATUS_CHANGED = 'P2P_STATUS_CHANGED';
/**
 * The type of (redux) action which signals to play specified touch tones.
 *
 * {
 *     type: SEND_TONES,
 *     tones: string,
 *     duration: number,
 *     pause: number
 * }
 */
exports.SEND_TONES = 'SEND_TONES';
/**
 * The type of (redux) action which updates the current known status of the
 * Follow Me feature.
 *
 * {
 *     type: SET_FOLLOW_ME,
 *     enabled: boolean
 * }
 */
exports.SET_FOLLOW_ME = 'SET_FOLLOW_ME';
/**
 * The type of (redux) action which sets the obfuscated room name.
 *
 * {
 *     type: SET_OBFUSCATED_ROOM,
 *     obfuscatedRoom: string
 * }
 */
exports.SET_OBFUSCATED_ROOM = 'SET_OBFUSCATED_ROOM';
/**
 * The type of (redux) action which updates the current known status of the
 * Mute Reactions Sound feature.
 *
 * {
 *     type: SET_START_REACTIONS_MUTED,
 *     enabled: boolean
 * }
 */
exports.SET_START_REACTIONS_MUTED = 'SET_START_REACTIONS_MUTED';
/**
 * The type of (redux) action which sets the password to join or lock a specific
 * {@code JitsiConference}.
 *
 * {
 *     type: SET_PASSWORD,
 *     conference: JitsiConference,
 *     method: Function
 *     password: string
 * }
 */
exports.SET_PASSWORD = 'SET_PASSWORD';
/**
 * The type of (redux) action which signals that setting a password on a
 * {@code JitsiConference} failed (with an error).
 *
 * {
 *     type: SET_PASSWORD_FAILED,
 *     error: string
 * }
 */
exports.SET_PASSWORD_FAILED = 'SET_PASSWORD_FAILED';
/**
 * The type of (redux) action which signals for pending subject changes.
 *
 * {
 *     type: SET_PENDING_SUBJECT_CHANGE,
 *     subject: string
 * }
 */
exports.SET_PENDING_SUBJECT_CHANGE = 'SET_PENDING_SUBJECT_CHANGE';
/**
 * The type of (redux) action which sets the name of the room of the
 * conference to be joined.
 *
 * {
 *     type: SET_ROOM,
 *     room: string
 * }
 */
exports.SET_ROOM = 'SET_ROOM';
/**
 * The type of (redux) action which updates the current known status of the
 * moderator features for starting participants as audio or video muted.
 *
 * {
 *     type: SET_START_MUTED_POLICY,
 *     startAudioMutedPolicy: boolean,
 *     startVideoMutedPolicy: boolean
 * }
 */
exports.SET_START_MUTED_POLICY = 'SET_START_MUTED_POLICY';
/**
 * The type of (redux) action which updates the assumed bandwidth bps.
 *
 * {
 *      type: SET_ASSUMED_BANDWIDTH_BPS,
 *      assumedBandwidthBps: number
 * }
 */
exports.SET_ASSUMED_BANDWIDTH_BPS = 'SET_ASSUMED_BANDWIDTH_BPS';
/**
 * The type of (redux) action which updated the conference metadata.
 *
 * {
 *     type: UPDATE_CONFERENCE_METADATA,
 *     metadata: Object
 * }
 */
exports.UPDATE_CONFERENCE_METADATA = 'UPDATE_CONFERENCE_METADATA';
