"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirect = exports.setAssumedBandwidthBps = exports.setLocalSubject = exports.setSubject = exports.setStartMutedPolicy = exports.setRoom = exports.setObfuscatedRoom = exports.setPassword = exports.setStartReactionsMuted = exports.setFollowMe = exports.sendTones = exports.p2pStatusChanged = exports.onStartMutedPolicyChanged = exports.nonParticipantMessageReceived = exports.lockStateChanged = exports.leaveConference = exports.kickedOut = exports.endConference = exports.endpointMessageReceived = exports.dataChannelClosed = exports.dataChannelOpened = exports.checkIfCanJoin = exports.createConference = exports.conferenceWillLeave = exports.conferenceWillJoin = exports.conferenceWillInit = exports._conferenceWillJoin = exports.conferenceUniqueIdSet = exports.conferenceTimestampChanged = exports.conferenceSubjectChanged = exports.conferenceLeft = exports.conferenceJoinInProgress = exports.conferenceJoined = exports.conferenceFailed = exports.authStatusChanged = exports.e2eRttChanged = exports.updateConferenceMetadata = void 0;
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../visitors/actions");
const functions_2 = require("../../visitors/functions");
const actions_2 = require("../config/actions");
const functions_3 = require("../config/functions");
const actions_3 = require("../connection/actions");
const constants_1 = require("../connection/constants");
const functions_any_1 = require("../devices/functions.any");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const actions_4 = require("../media/actions");
const constants_2 = require("../media/constants");
const actions_5 = require("../participants/actions");
const functions_4 = require("../participants/functions");
const functions_5 = require("../redux/functions");
const actions_any_1 = require("../tracks/actions.any");
const functions_6 = require("../tracks/functions");
const uri_1 = require("../util/uri");
const actionTypes_1 = require("./actionTypes");
const actions_6 = require("./actions");
const constants_3 = require("./constants");
const functions_7 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Adds conference (event) listeners.
 *
 * @param {JitsiConference} conference - The JitsiConference instance.
 * @param {Dispatch} dispatch - The Redux dispatch function.
 * @param {Object} state - The Redux state.
 * @private
 * @returns {void}
 */
function _addConferenceListeners(conference, dispatch, state) {
    // A simple logger for conference errors received through
    // the listener. These errors are not handled now, but logged.
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_ERROR, (error) => logger_1.default.error('Conference error.', error));
    // Dispatches into features/base/conference follow:
    // we want to ignore this event in case of tokenAuthUrl config
    // we are deprecating this and at some point will get rid of it
    if (!state['features/base/config'].tokenAuthUrl) {
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.AUTH_STATUS_CHANGED, (authEnabled, authLogin) => dispatch(authStatusChanged(authEnabled, authLogin)));
    }
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_FAILED, (err, ...args) => dispatch(conferenceFailed(conference, err, ...args)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_JOINED, (..._args) => dispatch(conferenceJoined(conference)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_UNIQUE_ID_SET, (..._args) => dispatch(conferenceUniqueIdSet(conference)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_JOIN_IN_PROGRESS, (..._args) => dispatch(conferenceJoinInProgress(conference)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_LEFT, (..._args) => {
        dispatch(conferenceTimestampChanged(0));
        dispatch(conferenceLeft(conference));
    });
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.SUBJECT_CHANGED, (subject) => dispatch(conferenceSubjectChanged(subject)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_CREATED_TIMESTAMP, (timestamp) => dispatch(conferenceTimestampChanged(timestamp)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.KICKED, (participant) => dispatch(kickedOut(conference, participant)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.PARTICIPANT_KICKED, (kicker, kicked) => dispatch((0, actions_5.participantKicked)(kicker, kicked)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.PARTICIPANT_SOURCE_UPDATED, (jitsiParticipant) => dispatch((0, actions_5.participantSourcesUpdated)(jitsiParticipant)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.LOCK_STATE_CHANGED, (locked) => dispatch(lockStateChanged(conference, locked)));
    // Dispatches into features/base/media follow:
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.STARTED_MUTED, () => {
        const audioMuted = Boolean(conference.isStartAudioMuted());
        const videoMuted = Boolean(conference.isStartVideoMuted());
        const localTracks = (0, functions_6.getLocalTracks)(state['features/base/tracks']);
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createStartMutedConfigurationEvent)('remote', audioMuted, videoMuted));
        logger_1.default.log(`Start muted: ${audioMuted ? 'audio, ' : ''}${videoMuted ? 'video' : ''}`);
        // XXX Jicofo tells lib-jitsi-meet to start with audio and/or video
        // muted i.e. Jicofo expresses an intent. Lib-jitsi-meet has turned
        // Jicofo's intent into reality by actually muting the respective
        // tracks. The reality is expressed in base/tracks already so what
        // is left is to express Jicofo's intent in base/media.
        // TODO Maybe the app needs to learn about Jicofo's intent and
        // transfer that intent to lib-jitsi-meet instead of lib-jitsi-meet
        // acting on Jicofo's intent without the app's knowledge.
        dispatch((0, actions_4.setAudioMuted)(audioMuted));
        dispatch((0, actions_4.setVideoMuted)(videoMuted));
        // Remove the tracks from peerconnection as well.
        for (const track of localTracks) {
            const trackType = track.jitsiTrack.getType();
            // Do not remove the audio track on RN. Starting with iOS 15 it will fail to unmute otherwise.
            if ((audioMuted && trackType === constants_2.MEDIA_TYPE.AUDIO && navigator.product !== 'ReactNative')
                || (videoMuted && trackType === constants_2.MEDIA_TYPE.VIDEO)) {
                dispatch((0, actions_any_1.replaceLocalTrack)(track.jitsiTrack, null, conference));
            }
        }
    });
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.AUDIO_UNMUTE_PERMISSIONS_CHANGED, (disableAudioMuteChange) => {
        dispatch((0, actions_4.setAudioUnmutePermissions)(disableAudioMuteChange));
    });
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.VIDEO_UNMUTE_PERMISSIONS_CHANGED, (disableVideoMuteChange) => {
        dispatch((0, actions_4.setVideoUnmutePermissions)(disableVideoMuteChange));
    });
    // Dispatches into features/base/tracks follow:
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.TRACK_ADDED, (t) => t && !t.isLocal() && dispatch((0, actions_any_1.trackAdded)(t)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.TRACK_REMOVED, (t) => t && !t.isLocal() && dispatch((0, actions_any_1.trackRemoved)(t)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.TRACK_MUTE_CHANGED, (track, participantThatMutedUs) => {
        if (participantThatMutedUs) {
            dispatch((0, actions_5.participantMutedUs)(participantThatMutedUs, track));
        }
    });
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.TRACK_UNMUTE_REJECTED, (track) => dispatch((0, actions_any_1.destroyLocalTracks)(track)));
    // Dispatches into features/base/participants follow:
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.DISPLAY_NAME_CHANGED, (id, displayName) => dispatch((0, actions_5.participantUpdated)({
        conference,
        id,
        name: (0, functions_4.getNormalizedDisplayName)(displayName)
    })));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.DOMINANT_SPEAKER_CHANGED, (dominant, previous, silence) => {
        dispatch((0, actions_5.dominantSpeakerChanged)(dominant, previous, Boolean(silence), conference));
    });
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED, (participant, json) => dispatch(endpointMessageReceived(participant, json)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.NON_PARTICIPANT_MESSAGE_RECEIVED, (id, json) => dispatch(nonParticipantMessageReceived(id, json)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.USER_JOINED, (_id, user) => (0, functions_7.commonUserJoinedHandling)({ dispatch }, conference, user));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.USER_LEFT, (_id, user) => (0, functions_7.commonUserLeftHandling)({ dispatch }, conference, user));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.USER_ROLE_CHANGED, (id, role) => dispatch((0, actions_5.participantRoleChanged)(id, role)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.USER_STATUS_CHANGED, (id, presence) => dispatch((0, actions_5.participantPresenceChanged)(id, presence)));
    conference.on(lib_jitsi_meet_1.JitsiE2ePingEvents.E2E_RTT_CHANGED, (participant, rtt) => dispatch(e2eRttChanged(participant, rtt)));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.BOT_TYPE_CHANGED, (id, botType) => dispatch((0, actions_5.participantUpdated)({
        conference,
        id,
        botType
    })));
    conference.addCommandListener(constants_3.AVATAR_URL_COMMAND, (data, id) => dispatch((0, actions_5.participantUpdated)({
        conference,
        id,
        avatarURL: data.value
    })));
    conference.addCommandListener(constants_3.EMAIL_COMMAND, (data, id) => dispatch((0, actions_5.participantUpdated)({
        conference,
        id,
        email: data.value
    })));
}
/**
 * Action for updating the conference metadata.
 *
 * @param {IConferenceMetadata} metadata - The metadata object.
 * @returns {{
 *    type: UPDATE_CONFERENCE_METADATA,
 *    metadata: IConferenceMetadata
 * }}
 */
function updateConferenceMetadata(metadata) {
    return {
        type: actionTypes_1.UPDATE_CONFERENCE_METADATA,
        metadata
    };
}
exports.updateConferenceMetadata = updateConferenceMetadata;
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
function e2eRttChanged(participant, rtt) {
    return {
        type: actionTypes_1.E2E_RTT_CHANGED,
        e2eRtt: {
            rtt,
            participant
        }
    };
}
exports.e2eRttChanged = e2eRttChanged;
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
function authStatusChanged(authEnabled, authLogin) {
    return {
        type: actionTypes_1.AUTH_STATUS_CHANGED,
        authEnabled,
        authLogin
    };
}
exports.authStatusChanged = authStatusChanged;
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
function conferenceFailed(conference, error, ...params) {
    return {
        type: actionTypes_1.CONFERENCE_FAILED,
        conference,
        // Make the error resemble an Error instance (to the extent that
        // jitsi-meet needs it).
        error: {
            name: error,
            params,
            recoverable: undefined
        }
    };
}
exports.conferenceFailed = conferenceFailed;
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
function conferenceJoined(conference) {
    return {
        type: actionTypes_1.CONFERENCE_JOINED,
        conference
    };
}
exports.conferenceJoined = conferenceJoined;
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
function conferenceJoinInProgress(conference) {
    return {
        type: actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS,
        conference
    };
}
exports.conferenceJoinInProgress = conferenceJoinInProgress;
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
function conferenceLeft(conference) {
    return {
        type: actionTypes_1.CONFERENCE_LEFT,
        conference
    };
}
exports.conferenceLeft = conferenceLeft;
/**
 * Signals that the conference subject has been changed.
 *
 * @param {string} subject - The new subject.
 * @returns {{
 *     type: CONFERENCE_SUBJECT_CHANGED,
 *     subject: string
 * }}
 */
function conferenceSubjectChanged(subject) {
    return {
        type: actionTypes_1.CONFERENCE_SUBJECT_CHANGED,
        subject
    };
}
exports.conferenceSubjectChanged = conferenceSubjectChanged;
/**
* Signals that the conference timestamp has been changed.
*
* @param {number} conferenceTimestamp - The UTC timestamp.
* @returns {{
*       type: CONFERENCE_TIMESTAMP_CHANGED,
*       conferenceTimestamp
* }}
*/
function conferenceTimestampChanged(conferenceTimestamp) {
    return {
        type: actionTypes_1.CONFERENCE_TIMESTAMP_CHANGED,
        conferenceTimestamp
    };
}
exports.conferenceTimestampChanged = conferenceTimestampChanged;
/**
* Signals that the unique identifier for conference has been set.
*
* @param {JitsiConference} conference - The JitsiConference instance, where the uuid has been set.
* @returns {{
*   type: CONFERENCE_UNIQUE_ID_SET,
*   conference: JitsiConference,
* }}
*/
function conferenceUniqueIdSet(conference) {
    return {
        type: actionTypes_1.CONFERENCE_UNIQUE_ID_SET,
        conference
    };
}
exports.conferenceUniqueIdSet = conferenceUniqueIdSet;
/**
 * Adds any existing local tracks to a specific conference before the conference
 * is joined. Then signals the intention of the application to have the local
 * participant join the specified conference.
 *
 * @param {JitsiConference} conference - The {@code JitsiConference} instance
 * the local participant will (try to) join.
 * @returns {Function}
 */
function _conferenceWillJoin(conference) {
    return (dispatch, getState) => {
        const state = getState();
        const localTracks = (0, functions_6.getLocalTracks)(state['features/base/tracks'])
            .map(t => t.jitsiTrack);
        if (localTracks.length && !(0, functions_2.iAmVisitor)(state)) {
            (0, functions_7._addLocalTracksToConference)(conference, localTracks);
        }
        dispatch(conferenceWillJoin(conference));
    };
}
exports._conferenceWillJoin = _conferenceWillJoin;
/**
 * Signals the intention of the application to have a conference initialized.
 *
 * @returns {{
 *     type: CONFERENCE_WILL_INIT
 * }}
 */
function conferenceWillInit() {
    return {
        type: actionTypes_1.CONFERENCE_WILL_INIT
    };
}
exports.conferenceWillInit = conferenceWillInit;
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
function conferenceWillJoin(conference) {
    return {
        type: actionTypes_1.CONFERENCE_WILL_JOIN,
        conference
    };
}
exports.conferenceWillJoin = conferenceWillJoin;
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
function conferenceWillLeave(conference, isRedirect) {
    return {
        type: actionTypes_1.CONFERENCE_WILL_LEAVE,
        conference,
        isRedirect
    };
}
exports.conferenceWillLeave = conferenceWillLeave;
/**
 * Initializes a new conference.
 *
 * @param {string} overrideRoom - Override the room to join, instead of taking it
 * from Redux.
 * @returns {Function}
 */
function createConference(overrideRoom) {
    return (dispatch, getState) => {
        const state = getState();
        const { connection, locationURL } = state['features/base/connection'];
        if (!connection) {
            throw new Error('Cannot create a conference without a connection!');
        }
        const { password, room } = state['features/base/conference'];
        if (!room) {
            throw new Error('Cannot join a conference without a room name!');
        }
        // XXX: revisit this.
        // Hide the custom domain in the room name.
        const tmp = overrideRoom || room;
        let _room = (0, uri_1.getBackendSafeRoomName)(tmp);
        if (tmp.domain) {
            // eslint-disable-next-line no-new-wrappers
            _room = new String(tmp);
            _room.domain = tmp.domain;
        }
        const conference = connection.initJitsiConference(_room, (0, functions_7.getConferenceOptions)(state));
        // @ts-ignore
        connection[constants_1.JITSI_CONNECTION_CONFERENCE_KEY] = conference;
        conference[constants_3.JITSI_CONFERENCE_URL_KEY] = locationURL;
        dispatch(_conferenceWillJoin(conference));
        _addConferenceListeners(conference, dispatch, state);
        (0, functions_7.sendLocalParticipant)(state, conference);
        const replaceParticipant = (0, functions_3.getReplaceParticipant)(state);
        conference.join(password, replaceParticipant);
    };
}
exports.createConference = createConference;
/**
 * Will try to join the conference again in case it failed earlier with
 * {@link JitsiConferenceErrors.AUTHENTICATION_REQUIRED}. It means that Jicofo
 * did not allow to create new room from anonymous domain, but it can be tried
 * again later in case authenticated user created it in the meantime.
 *
 * @returns {Function}
 */
function checkIfCanJoin() {
    return (dispatch, getState) => {
        const { authRequired, password } = getState()['features/base/conference'];
        const replaceParticipant = (0, functions_3.getReplaceParticipant)(getState());
        authRequired && dispatch(_conferenceWillJoin(authRequired));
        authRequired?.join(password, replaceParticipant);
    };
}
exports.checkIfCanJoin = checkIfCanJoin;
/**
 * Signals the data channel with the bridge has successfully opened.
 *
 * @returns {{
 *     type: DATA_CHANNEL_OPENED
 * }}
 */
function dataChannelOpened() {
    return {
        type: actionTypes_1.DATA_CHANNEL_OPENED
    };
}
exports.dataChannelOpened = dataChannelOpened;
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
function dataChannelClosed(code, reason) {
    return {
        type: actionTypes_1.DATA_CHANNEL_CLOSED,
        code,
        reason
    };
}
exports.dataChannelClosed = dataChannelClosed;
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
function endpointMessageReceived(participant, data) {
    return {
        type: actionTypes_1.ENDPOINT_MESSAGE_RECEIVED,
        participant,
        data
    };
}
exports.endpointMessageReceived = endpointMessageReceived;
/**
 * Action to end a conference for all participants.
 *
 * @returns {Function}
 */
function endConference() {
    return async (dispatch, getState) => {
        const { conference } = (0, functions_7.getConferenceState)((0, functions_5.toState)(getState));
        conference?.end();
    };
}
exports.endConference = endConference;
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
function kickedOut(conference, participant) {
    return {
        type: actionTypes_1.KICKED_OUT,
        conference,
        participant
    };
}
exports.kickedOut = kickedOut;
/**
 * Action to leave a conference.
 *
 * @returns {Function}
 */
function leaveConference() {
    return async (dispatch) => dispatch((0, actions_3.hangup)(true));
}
exports.leaveConference = leaveConference;
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
function lockStateChanged(conference, locked) {
    return {
        type: actionTypes_1.LOCK_STATE_CHANGED,
        conference,
        locked
    };
}
exports.lockStateChanged = lockStateChanged;
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
function nonParticipantMessageReceived(id, json) {
    return {
        type: actionTypes_1.NON_PARTICIPANT_MESSAGE_RECEIVED,
        id,
        json
    };
}
exports.nonParticipantMessageReceived = nonParticipantMessageReceived;
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
function onStartMutedPolicyChanged(audioMuted, videoMuted) {
    return {
        type: actionTypes_1.SET_START_MUTED_POLICY,
        startAudioMutedPolicy: audioMuted,
        startVideoMutedPolicy: videoMuted
    };
}
exports.onStartMutedPolicyChanged = onStartMutedPolicyChanged;
/**
 * Sets whether or not peer2peer is currently enabled.
 *
 * @param {boolean} p2p - Whether or not peer2peer is currently active.
 * @returns {{
 *     type: P2P_STATUS_CHANGED,
 *     p2p: boolean
 * }}
 */
function p2pStatusChanged(p2p) {
    return {
        type: actionTypes_1.P2P_STATUS_CHANGED,
        p2p
    };
}
exports.p2pStatusChanged = p2pStatusChanged;
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
function sendTones(tones, duration, pause) {
    return {
        type: actionTypes_1.SEND_TONES,
        tones,
        duration,
        pause
    };
}
exports.sendTones = sendTones;
/**
 * Enables or disables the Follow Me feature.
 *
 * @param {boolean} enabled - Whether or not Follow Me should be enabled.
 * @returns {{
 *     type: SET_FOLLOW_ME,
 *     enabled: boolean
 * }}
 */
function setFollowMe(enabled) {
    return {
        type: actionTypes_1.SET_FOLLOW_ME,
        enabled
    };
}
exports.setFollowMe = setFollowMe;
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
function setStartReactionsMuted(muted, updateBackend = false) {
    return {
        type: actionTypes_1.SET_START_REACTIONS_MUTED,
        muted,
        updateBackend
    };
}
exports.setStartReactionsMuted = setStartReactionsMuted;
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
function setPassword(conference, method, password) {
    return (dispatch, getState) => {
        if (!conference) {
            return;
        }
        switch (method) {
            case conference.join: {
                let state = getState()['features/base/conference'];
                dispatch({
                    type: actionTypes_1.SET_PASSWORD,
                    conference,
                    method,
                    password
                });
                // Join the conference with the newly-set password.
                // Make sure that the action did set the password.
                state = getState()['features/base/conference'];
                if (state.password === password
                    // Make sure that the application still wants the
                    // conference joined.
                    && !state.conference) {
                    method.call(conference, password);
                }
                break;
            }
            case conference.lock: {
                const state = getState()['features/base/conference'];
                if (state.conference === conference) {
                    return (method.call(conference, password)
                        .then(() => dispatch({
                        type: actionTypes_1.SET_PASSWORD,
                        conference,
                        method,
                        password
                    }))
                        .catch((error) => dispatch({
                        type: actionTypes_1.SET_PASSWORD_FAILED,
                        error
                    })));
                }
                return Promise.reject();
            }
        }
    };
}
exports.setPassword = setPassword;
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
function setObfuscatedRoom(obfuscatedRoom, obfuscatedRoomSource) {
    return {
        type: actionTypes_1.SET_OBFUSCATED_ROOM,
        obfuscatedRoom,
        obfuscatedRoomSource
    };
}
exports.setObfuscatedRoom = setObfuscatedRoom;
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
function setRoom(room) {
    return {
        type: actionTypes_1.SET_ROOM,
        room
    };
}
exports.setRoom = setRoom;
/**
 * Sets whether or not members should join audio and/or video muted.
 *
 * @param {boolean} startAudioMuted - Whether or not members will join the
 * conference as audio muted.
 * @param {boolean} startVideoMuted - Whether or not members will join the
 * conference as video muted.
 * @returns {Function}
 */
function setStartMutedPolicy(startAudioMuted, startVideoMuted) {
    return (dispatch, getState) => {
        const conference = (0, functions_7.getCurrentConference)(getState());
        conference?.setStartMutedPolicy({
            audio: startAudioMuted,
            video: startVideoMuted
        });
        return dispatch(onStartMutedPolicyChanged(startAudioMuted, startVideoMuted));
    };
}
exports.setStartMutedPolicy = setStartMutedPolicy;
/**
 * Sets the conference subject.
 *
 * @param {string} subject - The new subject.
 * @returns {void}
 */
function setSubject(subject) {
    return (dispatch, getState) => {
        const { conference } = getState()['features/base/conference'];
        if (conference) {
            conference.setSubject(subject || '');
        }
        else {
            dispatch({
                type: actionTypes_1.SET_PENDING_SUBJECT_CHANGE,
                subject
            });
        }
    };
}
exports.setSubject = setSubject;
/**
 * Sets the conference local subject.
 *
 * @param {string} localSubject - The new local subject.
 * @returns {{
 *     type: CONFERENCE_LOCAL_SUBJECT_CHANGED,
 *     localSubject: string
 * }}
 */
function setLocalSubject(localSubject) {
    return {
        type: actionTypes_1.CONFERENCE_LOCAL_SUBJECT_CHANGED,
        localSubject
    };
}
exports.setLocalSubject = setLocalSubject;
/**
 * Sets the assumed bandwidth bps.
 *
 * @param {number} assumedBandwidthBps - The new assumed bandwidth.
 * @returns {{
*     type: SET_ASSUMED_BANDWIDTH_BPS,
*     assumedBandwidthBps: number
* }}
*/
function setAssumedBandwidthBps(assumedBandwidthBps) {
    return {
        type: actionTypes_1.SET_ASSUMED_BANDWIDTH_BPS,
        assumedBandwidthBps
    };
}
exports.setAssumedBandwidthBps = setAssumedBandwidthBps;
/**
 * Redirects to a new visitor node.
 *
 * @param {string | undefined} vnode - The vnode to use or undefined if moving back to the main room.
 * @param {string} focusJid - The focus jid to use.
 * @param {string} username - The username to use.
 * @returns {void}
 */
function redirect(vnode, focusJid, username) {
    return (dispatch, getState) => {
        const newConfig = (0, functions_7.getVisitorOptions)(getState, vnode, focusJid, username);
        if (!newConfig) {
            logger_1.default.warn('Not redirected missing params');
            return;
        }
        dispatch((0, actions_2.overwriteConfig)(newConfig)) // @ts-ignore
            .then(() => dispatch((0, actions_3.disconnect)(true)))
            .then(() => dispatch((0, actions_1.setIAmVisitor)(Boolean(vnode))))
            // we do not clear local tracks on error, so we need to manually clear them
            .then(() => dispatch((0, actions_any_1.destroyLocalTracks)()))
            .then(() => dispatch(conferenceWillInit()))
            .then(() => dispatch((0, actions_3.connect)()))
            .then(() => {
            const media = [];
            if (!vnode) {
                const state = getState();
                const { enableMediaOnPromote = {} } = state['features/base/config'].visitors ?? {};
                const { audio = false, video = false } = enableMediaOnPromote;
                if (audio) {
                    const { available, muted, unmuteBlocked } = state['features/base/media'].audio;
                    const { startSilent } = state['features/base/config'];
                    // do not unmute the user if he was muted before (on the prejoin, the config
                    // or URL param, etc.)
                    if (!unmuteBlocked && !muted && !startSilent && available) {
                        media.push(constants_2.MEDIA_TYPE.AUDIO);
                    }
                }
                if (video) {
                    const { muted, unmuteBlocked } = state['features/base/media'].video;
                    // do not unmute the user if he was muted before (on the prejoin, the config, URL param or
                    // audo only, etc)
                    if (!unmuteBlocked && !muted && (0, functions_any_1.hasAvailableDevices)(state, 'videoInput')) {
                        media.push(constants_2.MEDIA_TYPE.VIDEO);
                    }
                }
            }
            dispatch((0, actions_6.setupVisitorStartupMedia)(media));
        });
    };
}
exports.redirect = redirect;
