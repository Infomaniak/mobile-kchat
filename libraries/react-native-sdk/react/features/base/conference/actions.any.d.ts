import { IStore } from '../../app/types';
import { IConferenceMetadata, IJitsiConference } from './reducer';
/**
 * Action for updating the conference metadata.
 *
 * @param {IConferenceMetadata} metadata - The metadata object.
 * @returns {{
 *    type: UPDATE_CONFERENCE_METADATA,
 *    metadata: IConferenceMetadata
 * }}
 */
export declare function updateConferenceMetadata(metadata: IConferenceMetadata | null): {
    type: string;
    metadata: IConferenceMetadata | null;
};
/**
 * Create an action for when the end-to-end RTT against a specific remote participant has changed.
 *
 * @param {Object} participant - The participant against which the rtt is measured.
 * @param {number} rtt - The rtt.
 * @returns {{
 *     type: E2E_RTT_CHANGED,
 *     e2eRtt: {
 *         participant: Object,
 *         rtt: number
 *     }
 * }}
 */
export declare function e2eRttChanged(participant: Object, rtt: number): {
    type: string;
    e2eRtt: {
        rtt: number;
        participant: Object;
    };
};
/**
 * Updates the current known state of server-side authentication.
 *
 * @param {boolean} authEnabled - Whether or not server authentication is
 * enabled.
 * @param {string} authLogin - The current name of the logged in user, if any.
 * @returns {{
 *     type: AUTH_STATUS_CHANGED,
 *     authEnabled: boolean,
 *     authLogin: string
 * }}
 */
export declare function authStatusChanged(authEnabled: boolean, authLogin: string): {
    type: string;
    authEnabled: boolean;
    authLogin: string;
};
/**
 * Signals that a specific conference has failed.
 *
 * @param {JitsiConference} conference - The JitsiConference that has failed.
 * @param {string} error - The error describing/detailing the cause of the
 * failure.
 * @param {any} params - Rest of the params that we receive together with the event.
 * @returns {{
 *     type: CONFERENCE_FAILED,
 *     conference: JitsiConference,
 *     error: Error
 * }}
 * @public
 */
export declare function conferenceFailed(conference: IJitsiConference, error: string, ...params: any): {
    type: string;
    conference: IJitsiConference;
    error: {
        name: string;
        params: any;
        recoverable: undefined;
    };
};
/**
 * Signals that a specific conference has been joined.
 *
 * @param {JitsiConference} conference - The JitsiConference instance which was
 * joined by the local participant.
 * @returns {{
 *     type: CONFERENCE_JOINED,
 *     conference: JitsiConference
 * }}
 */
export declare function conferenceJoined(conference: IJitsiConference): {
    type: string;
    conference: IJitsiConference;
};
/**
 * Signals that a specific conference join is in progress.
 *
 * @param {JitsiConference} conference - The JitsiConference instance for which join by the local participant
 * is in progress.
 * @returns {{
 *     type: CONFERENCE_JOIN_IN_PROGRESS,
 *     conference: JitsiConference
 * }}
 */
export declare function conferenceJoinInProgress(conference: IJitsiConference): {
    type: string;
    conference: IJitsiConference;
};
/**
 * Signals that a specific conference has been left.
 *
 * @param {JitsiConference} conference - The JitsiConference instance which was
 * left by the local participant.
 * @returns {{
 *     type: CONFERENCE_LEFT,
 *     conference: JitsiConference
 * }}
 */
export declare function conferenceLeft(conference?: IJitsiConference): {
    type: string;
    conference: IJitsiConference | undefined;
};
/**
 * Signals that the conference subject has been changed.
 *
 * @param {string} subject - The new subject.
 * @returns {{
 *     type: CONFERENCE_SUBJECT_CHANGED,
 *     subject: string
 * }}
 */
export declare function conferenceSubjectChanged(subject: string): {
    type: string;
    subject: string;
};
/**
* Signals that the conference timestamp has been changed.
*
* @param {number} conferenceTimestamp - The UTC timestamp.
* @returns {{
*       type: CONFERENCE_TIMESTAMP_CHANGED,
*       conferenceTimestamp
* }}
*/
export declare function conferenceTimestampChanged(conferenceTimestamp: number): {
    type: string;
    conferenceTimestamp: number;
};
/**
* Signals that the unique identifier for conference has been set.
*
* @param {JitsiConference} conference - The JitsiConference instance, where the uuid has been set.
* @returns {{
*   type: CONFERENCE_UNIQUE_ID_SET,
*   conference: JitsiConference,
* }}
*/
export declare function conferenceUniqueIdSet(conference: IJitsiConference): {
    type: string;
    conference: IJitsiConference;
};
/**
 * Adds any existing local tracks to a specific conference before the conference
 * is joined. Then signals the intention of the application to have the local
 * participant join the specified conference.
 *
 * @param {JitsiConference} conference - The {@code JitsiConference} instance
 * the local participant will (try to) join.
 * @returns {Function}
 */
export declare function _conferenceWillJoin(conference: IJitsiConference): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Signals the intention of the application to have a conference initialized.
 *
 * @returns {{
 *     type: CONFERENCE_WILL_INIT
 * }}
 */
export declare function conferenceWillInit(): {
    type: string;
};
/**
 * Signals the intention of the application to have the local participant
 * join the specified conference.
 *
 * @param {JitsiConference} conference - The {@code JitsiConference} instance
 * the local participant will (try to) join.
 * @returns {{
 *     type: CONFERENCE_WILL_JOIN,
 *     conference: JitsiConference
 * }}
 */
export declare function conferenceWillJoin(conference?: IJitsiConference): {
    type: string;
    conference: IJitsiConference | undefined;
};
/**
 * Signals the intention of the application to have the local participant leave
 * a specific conference. Similar in fashion to CONFERENCE_LEFT. Contrary to it
 * though, it's not guaranteed because CONFERENCE_LEFT may be triggered by
 * lib-jitsi-meet and not the application.
 *
 * @param {JitsiConference} conference - The JitsiConference instance which will
 * be left by the local participant.
 * @param {boolean} isRedirect - Indicates if the action has been dispatched as part of visitor promotion.
 * @returns {{
 *     type: CONFERENCE_LEFT,
 *     conference: JitsiConference,
 *     isRedirect: boolean
 * }}
 */
export declare function conferenceWillLeave(conference?: IJitsiConference, isRedirect?: boolean): {
    type: string;
    conference: IJitsiConference | undefined;
    isRedirect: boolean | undefined;
};
/**
 * Initializes a new conference.
 *
 * @param {string} overrideRoom - Override the room to join, instead of taking it
 * from Redux.
 * @returns {Function}
 */
export declare function createConference(overrideRoom?: string | String): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Will try to join the conference again in case it failed earlier with
 * {@link JitsiConferenceErrors.AUTHENTICATION_REQUIRED}. It means that Jicofo
 * did not allow to create new room from anonymous domain, but it can be tried
 * again later in case authenticated user created it in the meantime.
 *
 * @returns {Function}
 */
export declare function checkIfCanJoin(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Signals the data channel with the bridge has successfully opened.
 *
 * @returns {{
 *     type: DATA_CHANNEL_OPENED
 * }}
 */
export declare function dataChannelOpened(): {
    type: string;
};
/**
 * Signals the data channel with the bridge was abruptly closed.
 *
 * @param {number} code - Close code.
 * @param {string} reason - Close reason.
 *
 * @returns {{
 *     type: DATA_CHANNEL_CLOSED,
 *     code: number,
 *     reason: string
 * }}
 */
export declare function dataChannelClosed(code: number, reason: string): {
    type: string;
    code: number;
    reason: string;
};
/**
 * Signals that a participant sent an endpoint message on the data channel.
 *
 * @param {Object} participant - The participant details sending the message.
 * @param {Object} data - The data carried by the endpoint message.
 * @returns {{
*      type: ENDPOINT_MESSAGE_RECEIVED,
*      participant: Object,
*      data: Object
* }}
*/
export declare function endpointMessageReceived(participant: Object, data: Object): {
    type: string;
    participant: Object;
    data: Object;
};
/**
 * Action to end a conference for all participants.
 *
 * @returns {Function}
 */
export declare function endConference(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Signals that we've been kicked out of the conference.
 *
 * @param {JitsiConference} conference - The {@link JitsiConference} instance
 * for which the event is being signaled.
 * @param {JitsiParticipant} participant - The {@link JitsiParticipant}
 * instance which initiated the kick event.
 * @returns {{
 *     type: KICKED_OUT,
 *     conference: JitsiConference,
 *     participant: JitsiParticipant
 * }}
 */
export declare function kickedOut(conference: IJitsiConference, participant: Object): {
    type: string;
    conference: IJitsiConference;
    participant: Object;
};
/**
 * Action to leave a conference.
 *
 * @returns {Function}
 */
export declare function leaveConference(): (dispatch: IStore['dispatch']) => Promise<any>;
/**
 * Signals that the lock state of a specific JitsiConference changed.
 *
 * @param {JitsiConference} conference - The JitsiConference which had its lock
 * state changed.
 * @param {boolean} locked - If the specified conference became locked, true;
 * otherwise, false.
 * @returns {{
 *     type: LOCK_STATE_CHANGED,
 *     conference: JitsiConference,
 *     locked: boolean
 * }}
 */
export declare function lockStateChanged(conference: IJitsiConference, locked: boolean): {
    type: string;
    conference: IJitsiConference;
    locked: boolean;
};
/**
 * Signals that a non participant endpoint message has been received.
 *
 * @param {string} id - The resource id of the sender.
 * @param {Object} json - The json carried by the endpoint message.
 * @returns {{
 *      type: NON_PARTICIPANT_MESSAGE_RECEIVED,
 *      id: Object,
 *      json: Object
 * }}
 */
export declare function nonParticipantMessageReceived(id: string, json: Object): {
    type: string;
    id: string;
    json: Object;
};
/**
 * Updates the known state of start muted policies.
 *
 * @param {boolean} audioMuted - Whether or not members will join the conference
 * as audio muted.
 * @param {boolean} videoMuted - Whether or not members will join the conference
 * as video muted.
 * @returns {{
 *     type: SET_START_MUTED_POLICY,
 *     startAudioMutedPolicy: boolean,
 *     startVideoMutedPolicy: boolean
 * }}
 */
export declare function onStartMutedPolicyChanged(audioMuted: boolean, videoMuted: boolean): {
    type: string;
    startAudioMutedPolicy: boolean;
    startVideoMutedPolicy: boolean;
};
/**
 * Sets whether or not peer2peer is currently enabled.
 *
 * @param {boolean} p2p - Whether or not peer2peer is currently active.
 * @returns {{
 *     type: P2P_STATUS_CHANGED,
 *     p2p: boolean
 * }}
 */
export declare function p2pStatusChanged(p2p: boolean): {
    type: string;
    p2p: boolean;
};
/**
 * Signals to play touch tones.
 *
 * @param {string} tones - The tones to play.
 * @param {number} [duration] - How long to play each tone.
 * @param {number} [pause] - How long to pause between each tone.
 * @returns {{
 *     type: SEND_TONES,
 *     tones: string,
 *     duration: number,
 *     pause: number
 * }}
 */
export declare function sendTones(tones: string, duration: number, pause: number): {
    type: string;
    tones: string;
    duration: number;
    pause: number;
};
/**
 * Enables or disables the Follow Me feature.
 *
 * @param {boolean} enabled - Whether or not Follow Me should be enabled.
 * @returns {{
 *     type: SET_FOLLOW_ME,
 *     enabled: boolean
 * }}
 */
export declare function setFollowMe(enabled: boolean): {
    type: string;
    enabled: boolean;
};
/**
 * Enables or disables the Mute reaction sounds feature.
 *
 * @param {boolean} muted - Whether or not reaction sounds should be muted for all participants.
 * @param {boolean} updateBackend - Whether or not the moderator should notify all participants for the new setting.
 * @returns {{
 *     type: SET_START_REACTIONS_MUTED,
 *     muted: boolean
 * }}
 */
export declare function setStartReactionsMuted(muted: boolean, updateBackend?: boolean): {
    type: string;
    muted: boolean;
    updateBackend: boolean;
};
/**
 * Sets the password to join or lock a specific JitsiConference.
 *
 * @param {JitsiConference} conference - The JitsiConference which requires a
 * password to join or is to be locked with the specified password.
 * @param {Function} method - The JitsiConference method of password protection
 * such as join or lock.
 * @param {string} password - The password with which the specified conference
 * is to be joined or locked.
 * @returns {Function}
 */
export declare function setPassword(conference: IJitsiConference | undefined, method: Function | undefined, password?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => any;
/**
 * Sets the obfuscated room name of the conference to be joined.
 *
 * @param {(string)} obfuscatedRoom - Obfuscated room name.
 * @param {(string)} obfuscatedRoomSource - The room name that was obfuscated.
 * @returns {{
 *     type: SET_OBFUSCATED_ROOM,
 *     room: string
 * }}
 */
export declare function setObfuscatedRoom(obfuscatedRoom: string, obfuscatedRoomSource: string): {
    type: string;
    obfuscatedRoom: string;
    obfuscatedRoomSource: string;
};
/**
 * Sets (the name of) the room of the conference to be joined.
 *
 * @param {(string|undefined)} room - The name of the room of the conference to
 * be joined.
 * @returns {{
 *     type: SET_ROOM,
 *     room: string
 * }}
 */
export declare function setRoom(room?: string): {
    type: string;
    room: string | undefined;
};
/**
 * Sets whether or not members should join audio and/or video muted.
 *
 * @param {boolean} startAudioMuted - Whether or not members will join the
 * conference as audio muted.
 * @param {boolean} startVideoMuted - Whether or not members will join the
 * conference as video muted.
 * @returns {Function}
 */
export declare function setStartMutedPolicy(startAudioMuted: boolean, startVideoMuted: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    startAudioMutedPolicy: boolean;
    startVideoMutedPolicy: boolean;
};
/**
 * Sets the conference subject.
 *
 * @param {string} subject - The new subject.
 * @returns {void}
 */
export declare function setSubject(subject: string | undefined): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the conference local subject.
 *
 * @param {string} localSubject - The new local subject.
 * @returns {{
 *     type: CONFERENCE_LOCAL_SUBJECT_CHANGED,
 *     localSubject: string
 * }}
 */
export declare function setLocalSubject(localSubject: string | undefined): {
    type: string;
    localSubject: string | undefined;
};
/**
 * Sets the assumed bandwidth bps.
 *
 * @param {number} assumedBandwidthBps - The new assumed bandwidth.
 * @returns {{
*     type: SET_ASSUMED_BANDWIDTH_BPS,
*     assumedBandwidthBps: number
* }}
*/
export declare function setAssumedBandwidthBps(assumedBandwidthBps: number): {
    type: string;
    assumedBandwidthBps: number;
};
/**
 * Redirects to a new visitor node.
 *
 * @param {string | undefined} vnode - The vnode to use or undefined if moving back to the main room.
 * @param {string} focusJid - The focus jid to use.
 * @param {string} username - The username to use.
 * @returns {void}
 */
export declare function redirect(vnode: string, focusJid: string, username: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
