"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../room-lock/constants");
const actionTypes_1 = require("../connection/actionTypes");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_2 = require("./actionTypes");
const functions_2 = require("./functions");
const DEFAULT_STATE = {
    assumedBandwidthBps: undefined,
    conference: undefined,
    dataChannelOpen: undefined,
    e2eeSupported: undefined,
    joining: undefined,
    leaving: undefined,
    locked: undefined,
    membersOnly: undefined,
    metadata: undefined,
    password: undefined,
    passwordRequired: undefined
};
/**
 * Listen for actions that contain the conference object, so that it can be
 * stored for use by other action creators.
 */
ReducerRegistry_1.default.register('features/base/conference', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_2.AUTH_STATUS_CHANGED:
            return _authStatusChanged(state, action);
        case actionTypes_2.CONFERENCE_FAILED:
            return _conferenceFailed(state, action);
        case actionTypes_2.CONFERENCE_JOINED:
            return _conferenceJoined(state, action);
        case actionTypes_2.CONFERENCE_SUBJECT_CHANGED:
            return (0, functions_1.set)(state, 'subject', action.subject);
        case actionTypes_2.CONFERENCE_LOCAL_SUBJECT_CHANGED:
            return (0, functions_1.set)(state, 'localSubject', action.localSubject);
        case actionTypes_2.CONFERENCE_TIMESTAMP_CHANGED:
            return (0, functions_1.set)(state, 'conferenceTimestamp', action.conferenceTimestamp);
        case actionTypes_2.CONFERENCE_LEFT:
        case actionTypes_2.CONFERENCE_WILL_LEAVE:
            return _conferenceLeftOrWillLeave(state, action);
        case actionTypes_2.CONFERENCE_WILL_JOIN:
            return _conferenceWillJoin(state, action);
        case actionTypes_1.CONNECTION_WILL_CONNECT:
            return (0, functions_1.set)(state, 'authRequired', undefined);
        case actionTypes_2.DATA_CHANNEL_CLOSED:
            return (0, functions_1.set)(state, 'dataChannelOpen', false);
        case actionTypes_2.DATA_CHANNEL_OPENED:
            return (0, functions_1.set)(state, 'dataChannelOpen', true);
        case actionTypes_2.LOCK_STATE_CHANGED:
            return _lockStateChanged(state, action);
        case actionTypes_2.P2P_STATUS_CHANGED:
            return _p2pStatusChanged(state, action);
        case actionTypes_2.SET_ASSUMED_BANDWIDTH_BPS: {
            const assumedBandwidthBps = action.assumedBandwidthBps >= 0
                ? Number(action.assumedBandwidthBps)
                : undefined;
            return (0, functions_1.set)(state, 'assumedBandwidthBps', assumedBandwidthBps);
        }
        case actionTypes_2.SET_FOLLOW_ME:
            return (0, functions_1.set)(state, 'followMeEnabled', action.enabled);
        case actionTypes_2.SET_START_REACTIONS_MUTED:
            return (0, functions_1.set)(state, 'startReactionsMuted', action.muted);
        case actionTypes_1.SET_LOCATION_URL:
            return (0, functions_1.set)(state, 'room', undefined);
        case actionTypes_2.SET_OBFUSCATED_ROOM:
            return { ...state,
                obfuscatedRoom: action.obfuscatedRoom,
                obfuscatedRoomSource: action.obfuscatedRoomSource
            };
        case actionTypes_2.SET_PASSWORD:
            return _setPassword(state, action);
        case actionTypes_2.SET_PENDING_SUBJECT_CHANGE:
            return (0, functions_1.set)(state, 'pendingSubjectChange', action.subject);
        case actionTypes_2.SET_ROOM:
            return _setRoom(state, action);
        case actionTypes_2.SET_START_MUTED_POLICY:
            return {
                ...state,
                startAudioMutedPolicy: action.startAudioMutedPolicy,
                startVideoMutedPolicy: action.startVideoMutedPolicy
            };
        case actionTypes_2.UPDATE_CONFERENCE_METADATA:
            return {
                ...state,
                metadata: action.metadata
            };
    }
    return state;
});
/**
 * Reduces a specific Redux action AUTH_STATUS_CHANGED of the feature
 * base/conference.
 *
 * @param {Object} state - The Redux state of the feature base/conference.
 * @param {Action} action - The Redux action AUTH_STATUS_CHANGED to reduce.
 * @private
 * @returns {Object} The new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _authStatusChanged(state, { authEnabled, authLogin }) {
    return (0, functions_1.assign)(state, {
        authEnabled,
        authLogin
    });
}
/**
 * Reduces a specific Redux action CONFERENCE_FAILED of the feature
 * base/conference.
 *
 * @param {Object} state - The Redux state of the feature base/conference.
 * @param {Action} action - The Redux action CONFERENCE_FAILED to reduce.
 * @private
 * @returns {Object} The new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _conferenceFailed(state, { conference, error }) {
    // The current (similar to getCurrentConference in
    // base/conference/functions.any.js) conference which is joining or joined:
    const conference_ = state.conference || state.joining;
    if (conference_ && conference_ !== conference) {
        return state;
    }
    let authRequired;
    let membersOnly;
    let passwordRequired;
    let lobbyWaitingForHost;
    switch (error.name) {
        case lib_jitsi_meet_1.JitsiConferenceErrors.AUTHENTICATION_REQUIRED:
            authRequired = conference;
            break;
        case lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_ACCESS_DENIED:
        case lib_jitsi_meet_1.JitsiConferenceErrors.MEMBERS_ONLY_ERROR: {
            membersOnly = conference;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_lobbyJid, _lobbyWaitingForHost] = error.params;
            lobbyWaitingForHost = _lobbyWaitingForHost;
            break;
        }
        case lib_jitsi_meet_1.JitsiConferenceErrors.PASSWORD_REQUIRED:
            passwordRequired = conference;
            break;
    }
    return (0, functions_1.assign)(state, {
        authRequired,
        conference: undefined,
        e2eeSupported: undefined,
        error,
        joining: undefined,
        leaving: undefined,
        lobbyWaitingForHost,
        /**
         * The indicator of how the conference/room is locked. If falsy, the
         * conference/room is unlocked; otherwise, it's either
         * {@code LOCKED_LOCALLY} or {@code LOCKED_REMOTELY}.
         *
         * @type {string}
         */
        locked: passwordRequired ? constants_1.LOCKED_REMOTELY : undefined,
        membersOnly,
        password: undefined,
        /**
         * The JitsiConference instance which requires a password to join.
         *
         * @type {JitsiConference}
         */
        passwordRequired
    });
}
/**
 * Reduces a specific Redux action CONFERENCE_JOINED of the feature
 * base/conference.
 *
 * @param {Object} state - The Redux state of the feature base/conference.
 * @param {Action} action - The Redux action CONFERENCE_JOINED to reduce.
 * @private
 * @returns {Object} The new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _conferenceJoined(state, { conference }) {
    // FIXME The indicator which determines whether a JitsiConference is locked
    // i.e. password-protected is private to lib-jitsi-meet. However, the
    // library does not fire LOCK_STATE_CHANGED upon joining a JitsiConference
    // with a password.
    // FIXME Technically JitsiConference.room is a private field.
    const locked = conference.room?.locked ? constants_1.LOCKED_REMOTELY : undefined;
    return (0, functions_1.assign)(state, {
        authRequired: undefined,
        /**
         * The JitsiConference instance represented by the Redux state of the
         * feature base/conference.
         *
         * @type {JitsiConference}
         */
        conference,
        e2eeSupported: conference.isE2EESupported(),
        joining: undefined,
        membersOnly: undefined,
        leaving: undefined,
        lobbyWaitingForHost: undefined,
        /**
         * The indicator which determines whether the conference is locked.
         *
         * @type {boolean}
         */
        locked,
        passwordRequired: undefined
    });
}
/**
 * Reduces a specific redux action {@link CONFERENCE_LEFT} or
 * {@link CONFERENCE_WILL_LEAVE} for the feature base/conference.
 *
 * @param {Object} state - The redux state of the feature base/conference.
 * @param {Action} action - The redux action {@code CONFERENCE_LEFT} or
 * {@code CONFERENCE_WILL_LEAVE} to reduce.
 * @private
 * @returns {Object} The next/new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _conferenceLeftOrWillLeave(state, { conference, type }) {
    const nextState = { ...state };
    // The redux action CONFERENCE_LEFT is the last time that we should be
    // hearing from a JitsiConference instance.
    //
    // The redux action CONFERENCE_WILL_LEAVE represents the order of the user
    // to leave a JitsiConference instance. From the user's perspective, there's
    // no going back (with respect to the instance itself). The app will perform
    // due clean-up like leaving the associated room, but the instance is no
    // longer the focus of the attention of the user and, consequently, the app.
    for (const p in state) {
        if (state[p] === conference) {
            nextState[p] = undefined;
            switch (p) {
                case 'conference':
                case 'passwordRequired':
                    // XXX Clear/unset locked & password for a conference which has
                    // been LOCKED_LOCALLY or LOCKED_REMOTELY.
                    delete nextState.locked;
                    delete nextState.password;
                    break;
            }
        }
    }
    if (type === actionTypes_2.CONFERENCE_WILL_LEAVE) {
        // A CONFERENCE_WILL_LEAVE is of further consequence only if it is
        // expected i.e. if the specified conference is joining or joined.
        if (conference === state.joining || conference === state.conference) {
            /**
             * The JitsiConference instance which is currently in the process of
             * being left.
             *
             * @type {JitsiConference}
             */
            nextState.leaving = conference;
        }
    }
    return nextState;
}
/**
 * Reduces a specific Redux action CONFERENCE_WILL_JOIN of the feature
 * base/conference.
 *
 * @param {Object} state - The Redux state of the feature base/conference.
 * @param {Action} action - The Redux action CONFERENCE_WILL_JOIN to reduce.
 * @private
 * @returns {Object} The new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _conferenceWillJoin(state, { conference }) {
    return (0, functions_1.assign)(state, {
        error: undefined,
        joining: conference
    });
}
/**
 * Reduces a specific Redux action LOCK_STATE_CHANGED of the feature
 * base/conference.
 *
 * @param {Object} state - The Redux state of the feature base/conference.
 * @param {Action} action - The Redux action LOCK_STATE_CHANGED to reduce.
 * @private
 * @returns {Object} The new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _lockStateChanged(state, { conference, locked }) {
    if (state.conference !== conference) {
        return state;
    }
    return (0, functions_1.assign)(state, {
        locked: locked ? state.locked || constants_1.LOCKED_REMOTELY : undefined,
        password: locked ? state.password : undefined
    });
}
/**
 * Reduces a specific Redux action P2P_STATUS_CHANGED of the feature
 * base/conference.
 *
 * @param {Object} state - The Redux state of the feature base/conference.
 * @param {Action} action - The Redux action P2P_STATUS_CHANGED to reduce.
 * @private
 * @returns {Object} The new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _p2pStatusChanged(state, action) {
    return (0, functions_1.set)(state, 'p2p', action.p2p);
}
/**
 * Reduces a specific Redux action SET_PASSWORD of the feature base/conference.
 *
 * @param {Object} state - The Redux state of the feature base/conference.
 * @param {Action} action - The Redux action SET_PASSWORD to reduce.
 * @private
 * @returns {Object} The new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _setPassword(state, { conference, method, password }) {
    switch (method) {
        case conference.join:
            return (0, functions_1.assign)(state, {
                // 1. The JitsiConference which transitions away from
                // passwordRequired MUST remain in the redux state
                // features/base/conference until it transitions into
                // conference; otherwise, there is a span of time during which
                // the redux state does not even know that there is a
                // JitsiConference whatsoever.
                //
                // 2. The redux action setPassword will attempt to join the
                // JitsiConference so joining is an appropriate transitional
                // redux state.
                //
                // 3. The redux action setPassword will perform the same check
                // before it proceeds with the re-join.
                joining: state.conference ? state.joining : conference,
                locked: constants_1.LOCKED_REMOTELY,
                /**
                 * The password with which the conference is to be joined.
                 *
                 * @type {string}
                 */
                password
            });
        case conference.lock:
            return (0, functions_1.assign)(state, {
                locked: password ? constants_1.LOCKED_LOCALLY : undefined,
                password
            });
    }
    return state;
}
/**
 * Reduces a specific Redux action SET_ROOM of the feature base/conference.
 *
 * @param {Object} state - The Redux state of the feature base/conference.
 * @param {Action} action - The Redux action SET_ROOM to reduce.
 * @private
 * @returns {Object} The new state of the feature base/conference after the
 * reduction of the specified action.
 */
function _setRoom(state, action) {
    let { room } = action;
    if (!(0, functions_2.isRoomValid)(room)) {
        // Technically, there are multiple values which don't represent valid
        // room names. Practically, each of them is as bad as the rest of them
        // because we can't use any of them to join a conference.
        room = undefined;
    }
    /**
     * The name of the room of the conference (to be) joined.
     *
     * @type {string}
     */
    return (0, functions_1.assign)(state, {
        error: undefined,
        localSubject: undefined,
        pendingSubjectChange: undefined,
        room,
        subject: undefined
    });
}
