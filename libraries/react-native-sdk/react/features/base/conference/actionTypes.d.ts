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
export declare const AUTH_STATUS_CHANGED = "AUTH_STATUS_CHANGED";
/**
 * The type of (redux) action which signals that a specific conference failed.
 *
 * {
 *     type: CONFERENCE_FAILED,
 *     conference: JitsiConference,
 *     error: Error
 * }
 */
export declare const CONFERENCE_FAILED = "CONFERENCE_FAILED";
/**
 * The type of (redux) action which signals that a specific conference was
 * joined.
 *
 * {
 *     type: CONFERENCE_JOINED,
 *     conference: JitsiConference
 * }
 */
export declare const CONFERENCE_JOINED = "CONFERENCE_JOINED";
/**
 * The type of (redux) action which signals that a specific conference joining is in progress.
 * A CONFERENCE_JOINED is guaranteed to follow.
 *
 * {
 *     type: CONFERENCE_JOIN_IN_PROGRESS,
 *     conference: JitsiConference
 * }
 */
export declare const CONFERENCE_JOIN_IN_PROGRESS = "CONFERENCE_JOIN_IN_PROGRESS";
/**
 * The type of (redux) action which signals that a specific conference was left.
 *
 * {
 *     type: CONFERENCE_LEFT,
 *     conference: JitsiConference
 * }
 */
export declare const CONFERENCE_LEFT = "CONFERENCE_LEFT";
/**
 * The type of (redux) action which signals that the conference is out of focus.
 * For example, if the user navigates to the Chat screen.
 *
 * {
 *      type: CONFERENCE_BLURRED,
 * }
 */
export declare const CONFERENCE_BLURRED = "CONFERENCE_BLURRED";
/**
 * The type of (redux) action which signals that the conference is in focus.
 *
 * {
 *      type: CONFERENCE_FOCUSED,
 * }
 */
export declare const CONFERENCE_FOCUSED = "CONFERENCE_FOCUSED";
/**
 * The type of (redux) action, which indicates conference local subject changes.
 *
 * {
 *     type: CONFERENCE_LOCAL_SUBJECT_CHANGED
 *     subject: string
 * }
 */
export declare const CONFERENCE_LOCAL_SUBJECT_CHANGED = "CONFERENCE_LOCAL_SUBJECT_CHANGED";
/**
* The type of (redux) action, which indicates conference subject changes.
*
* {
*     type: CONFERENCE_SUBJECT_CHANGED
*     subject: string
* }
*/
export declare const CONFERENCE_SUBJECT_CHANGED = "CONFERENCE_SUBJECT_CHANGED";
/**
* The type of (redux) action, which indicates conference UTC timestamp changes.
*
* {
*      type: CONFERENCE_TIMESTAMP_CHANGED
*      timestamp: number
* }
*/
export declare const CONFERENCE_TIMESTAMP_CHANGED = "CONFERENCE_TIMESTAMP_CHANGED";
/**
 * The type of (redux) action which signals that an uuid for a conference has been set.
 *
 * {
 *     type: CONFERENCE_UNIQUE_ID_SET,
 *     conference: JitsiConference
 * }
 */
export declare const CONFERENCE_UNIQUE_ID_SET = "CONFERENCE_UNIQUE_ID_SET";
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
export declare const E2E_RTT_CHANGED = "E2E_RTT_CHANGED";
/**
 * The type of (redux) action which signals that a conference will be initialized.
 *
 * {
 *     type: CONFERENCE_WILL_INIT
 * }
 */
export declare const CONFERENCE_WILL_INIT = "CONFERENCE_WILL_INIT";
/**
 * The type of (redux) action which signals that a specific conference will be
 * joined.
 *
 * {
 *     type: CONFERENCE_WILL_JOIN,
 *     conference: JitsiConference
 * }
 */
export declare const CONFERENCE_WILL_JOIN = "CONFERENCE_WILL_JOIN";
/**
 * The type of (redux) action which signals that a specific conference will be
 * left.
 *
 * {
 *     type: CONFERENCE_WILL_LEAVE,
 *     conference: JitsiConference
 * }
 */
export declare const CONFERENCE_WILL_LEAVE = "CONFERENCE_WILL_LEAVE";
/**
 * The type of (redux) action which signals that the data channel with the
 * bridge has been established.
 *
 * {
 *     type: DATA_CHANNEL_OPENED
 * }
 */
export declare const DATA_CHANNEL_OPENED = "DATA_CHANNEL_OPENED";
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
export declare const DATA_CHANNEL_CLOSED = "DATA_CHANNEL_CLOSED";
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
export declare const ENDPOINT_MESSAGE_RECEIVED = "ENDPOINT_MESSAGE_RECEIVED";
/**
 * The type of action which signals that the user has been kicked out from
 * the conference.
 *
 * {
 *     type: KICKED_OUT,
 *     conference: JitsiConference
 * }
 */
export declare const KICKED_OUT = "KICKED_OUT";
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
export declare const LOCK_STATE_CHANGED = "LOCK_STATE_CHANGED";
/**
 * The type of (redux) action which signals that a system (non-participant) message has been received.
 *
 * {
 *     type: NON_PARTICIPANT_MESSAGE_RECEIVED,
 *     id: String,
 *     json: Object
 * }
 */
export declare const NON_PARTICIPANT_MESSAGE_RECEIVED = "NON_PARTICIPANT_MESSAGE_RECEIVED";
/**
 * The type of (redux) action which sets the peer2peer flag for the current
 * conference.
 *
 * {
 *     type: P2P_STATUS_CHANGED,
 *     p2p: boolean
 * }
 */
export declare const P2P_STATUS_CHANGED = "P2P_STATUS_CHANGED";
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
export declare const SEND_TONES = "SEND_TONES";
/**
 * The type of (redux) action which updates the current known status of the
 * Follow Me feature.
 *
 * {
 *     type: SET_FOLLOW_ME,
 *     enabled: boolean
 * }
 */
export declare const SET_FOLLOW_ME = "SET_FOLLOW_ME";
/**
 * The type of (redux) action which sets the obfuscated room name.
 *
 * {
 *     type: SET_OBFUSCATED_ROOM,
 *     obfuscatedRoom: string
 * }
 */
export declare const SET_OBFUSCATED_ROOM = "SET_OBFUSCATED_ROOM";
/**
 * The type of (redux) action which updates the current known status of the
 * Mute Reactions Sound feature.
 *
 * {
 *     type: SET_START_REACTIONS_MUTED,
 *     enabled: boolean
 * }
 */
export declare const SET_START_REACTIONS_MUTED = "SET_START_REACTIONS_MUTED";
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
export declare const SET_PASSWORD = "SET_PASSWORD";
/**
 * The type of (redux) action which signals that setting a password on a
 * {@code JitsiConference} failed (with an error).
 *
 * {
 *     type: SET_PASSWORD_FAILED,
 *     error: string
 * }
 */
export declare const SET_PASSWORD_FAILED = "SET_PASSWORD_FAILED";
/**
 * The type of (redux) action which signals for pending subject changes.
 *
 * {
 *     type: SET_PENDING_SUBJECT_CHANGE,
 *     subject: string
 * }
 */
export declare const SET_PENDING_SUBJECT_CHANGE = "SET_PENDING_SUBJECT_CHANGE";
/**
 * The type of (redux) action which sets the name of the room of the
 * conference to be joined.
 *
 * {
 *     type: SET_ROOM,
 *     room: string
 * }
 */
export declare const SET_ROOM = "SET_ROOM";
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
export declare const SET_START_MUTED_POLICY = "SET_START_MUTED_POLICY";
/**
 * The type of (redux) action which updates the assumed bandwidth bps.
 *
 * {
 *      type: SET_ASSUMED_BANDWIDTH_BPS,
 *      assumedBandwidthBps: number
 * }
 */
export declare const SET_ASSUMED_BANDWIDTH_BPS = "SET_ASSUMED_BANDWIDTH_BPS";
/**
 * The type of (redux) action which updated the conference metadata.
 *
 * {
 *     type: UPDATE_CONFERENCE_METADATA,
 *     metadata: Object
 * }
 */
export declare const UPDATE_CONFERENCE_METADATA = "UPDATE_CONFERENCE_METADATA";
