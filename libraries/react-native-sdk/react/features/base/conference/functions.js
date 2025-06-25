"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLocalParticipant = exports._removeLocalTracksFromConference = exports.isRoomValid = exports._handleParticipantError = exports.getAnalyticsRoomName = exports.getOrCreateObfuscatedRoomName = exports.getRoomName = exports.isP2pActive = exports.getCurrentConference = exports.getConferenceTimestamp = exports.getVisitorOptions = exports.restoreConferenceOptions = exports.getConferenceOptions = exports.getConferenceNameForTitle = exports.getConferenceName = exports.forEachConference = exports.commonUserLeftHandling = exports.commonUserJoinedHandling = exports._addLocalTracksToConference = exports.getIsConferenceJoined = exports.getConferenceState = void 0;
const js_sha512_1 = require("js-sha512");
const lodash_1 = __importDefault(require("lodash"));
const functions_1 = require("../../app/functions");
const functions_2 = require("../../transcribing/functions");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const actions_1 = require("../participants/actions");
const functions_3 = require("../participants/functions");
const functions_4 = require("../redux/functions");
const uri_1 = require("../util/uri");
const actions_2 = require("./actions");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
/**
 * Returns root conference state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {Object} Conference state.
 */
const getConferenceState = (state) => state['features/base/conference'];
exports.getConferenceState = getConferenceState;
/**
 * Is the conference joined or not.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
const getIsConferenceJoined = (state) => Boolean((0, exports.getConferenceState)(state).conference);
exports.getIsConferenceJoined = getIsConferenceJoined;
/**
 * Attach a set of local tracks to a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @protected
 * @returns {Promise}
 */
function _addLocalTracksToConference(conference, localTracks) {
    const conferenceLocalTracks = conference.getLocalTracks();
    const promises = [];
    for (const track of localTracks) {
        // XXX The library lib-jitsi-meet may be draconian, for example, when
        // adding one and the same video track multiple times.
        if (conferenceLocalTracks.indexOf(track) === -1) {
            promises.push(conference.addTrack(track).catch((err) => {
                _reportError('Failed to add local track to conference', err);
            }));
        }
    }
    return Promise.all(promises);
}
exports._addLocalTracksToConference = _addLocalTracksToConference;
/**
 * Logic shared between web and RN which processes the {@code USER_JOINED}
 * conference event and dispatches either {@link participantJoined} or
 * {@link hiddenParticipantJoined}.
 *
 * @param {Object} store - The redux store.
 * @param {JitsiMeetConference} conference - The conference for which the
 * {@code USER_JOINED} event is being processed.
 * @param {JitsiParticipant} user - The user who has just joined.
 * @returns {void}
 */
function commonUserJoinedHandling({ dispatch }, conference, user) {
    const id = user.getId();
    const displayName = user.getDisplayName();
    if (user.isHidden()) {
        dispatch((0, actions_1.hiddenParticipantJoined)(id, displayName));
    }
    else {
        const isReplacing = user?.isReplacing();
        dispatch((0, actions_1.participantJoined)({
            botType: user.getBotType(),
            conference,
            id,
            name: displayName,
            presence: user.getStatus(),
            role: user.getRole(),
            isReplacing,
            sources: user.getSources()
        }));
    }
}
exports.commonUserJoinedHandling = commonUserJoinedHandling;
/**
 * Logic shared between web and RN which processes the {@code USER_LEFT}
 * conference event and dispatches either {@link participantLeft} or
 * {@link hiddenParticipantLeft}.
 *
 * @param {Object} store - The redux store.
 * @param {JitsiMeetConference} conference - The conference for which the
 * {@code USER_LEFT} event is being processed.
 * @param {JitsiParticipant} user - The user who has just left.
 * @returns {void}
 */
function commonUserLeftHandling({ dispatch }, conference, user) {
    const id = user.getId();
    if (user.isHidden()) {
        dispatch((0, actions_1.hiddenParticipantLeft)(id));
    }
    else {
        const isReplaced = user.isReplaced?.();
        dispatch((0, actions_1.participantLeft)(id, conference, { isReplaced }));
    }
}
exports.commonUserLeftHandling = commonUserLeftHandling;
/**
 * Evaluates a specific predicate for each {@link JitsiConference} known to the
 * redux state features/base/conference while it returns {@code true}.
 *
 * @param {IStateful} stateful - The redux store, state, or
 * {@code getState} function.
 * @param {Function} predicate - The predicate to evaluate for each
 * {@code JitsiConference} know to the redux state features/base/conference
 * while it returns {@code true}.
 * @returns {boolean} If the specified {@code predicate} returned {@code true}
 * for all {@code JitsiConference} instances known to the redux state
 * features/base/conference.
 */
function forEachConference(stateful, predicate) {
    const state = (0, exports.getConferenceState)((0, functions_4.toState)(stateful));
    for (const v of Object.values(state)) {
        // Does the value of the base/conference's property look like a
        // JitsiConference?
        if (v && typeof v === 'object') {
            const url = v[constants_1.JITSI_CONFERENCE_URL_KEY];
            // XXX The Web version of Jitsi Meet does not utilize
            // JITSI_CONFERENCE_URL_KEY at the time of this writing. An
            // alternative is necessary then to recognize JitsiConference
            // instances and myUserId is as good as any other property.
            if ((url || typeof v.myUserId === 'function')
                && !predicate(v, url)) {
                return false;
            }
        }
    }
    return true;
}
exports.forEachConference = forEachConference;
/**
 * Returns the display name of the conference.
 *
 * @param {IStateful} stateful - Reference that can be resolved to Redux
 * state with the {@code toState} function.
 * @returns {string}
 */
function getConferenceName(stateful) {
    const state = (0, functions_4.toState)(stateful);
    const { callee } = state['features/base/jwt'];
    const { callDisplayName, localSubject: configLocalSubject, subject: configSubject } = state['features/base/config'];
    const { localSubject, pendingSubjectChange, room, subject } = (0, exports.getConferenceState)(state);
    return (pendingSubjectChange
        || configSubject
        || subject
        || configLocalSubject
        || localSubject
        || callDisplayName
        || callee?.name
        || (room && safeStartCase((0, uri_1.safeDecodeURIComponent)(room)))) ?? '';
}
exports.getConferenceName = getConferenceName;
/**
 * Returns the name of the conference formatted for the title.
 *
 * @param {IStateful} stateful - Reference that can be resolved to Redux state with the {@code toState}
 * function.
 * @returns {string} - The name of the conference formatted for the title.
 */
function getConferenceNameForTitle(stateful) {
    return safeStartCase((0, uri_1.safeDecodeURIComponent)((0, exports.getConferenceState)((0, functions_4.toState)(stateful)).room ?? ''));
}
exports.getConferenceNameForTitle = getConferenceNameForTitle;
/**
 * Returns an object aggregating the conference options.
 *
 * @param {IStateful} stateful - The redux store state.
 * @returns {Object} - Options object.
 */
function getConferenceOptions(stateful) {
    const state = (0, functions_4.toState)(stateful);
    const config = state['features/base/config'];
    const { locationURL } = state['features/base/connection'];
    const { tenant } = state['features/base/jwt'];
    const { email, name: nick } = (0, functions_3.getLocalParticipant)(state) ?? {};
    const options = { ...config };
    if (tenant) {
        options.siteID = tenant;
    }
    if (options.enableDisplayNameInStats && nick) {
        options.statisticsDisplayName = nick;
    }
    if (options.enableEmailInStats && email) {
        options.statisticsId = email;
    }
    if (locationURL) {
        options.confID = `${locationURL.host}${(0, uri_1.getBackendSafePath)(locationURL.pathname)}`;
    }
    options.applicationName = (0, functions_1.getName)();
    options.transcriptionLanguage = (0, functions_2.determineTranscriptionLanguage)(options);
    // Disable analytics, if requested.
    if (options.disableThirdPartyRequests) {
        delete config.analytics?.scriptURLs;
        delete config.analytics?.amplitudeAPPKey;
        delete config.analytics?.googleAnalyticsTrackingId;
    }
    return options;
}
exports.getConferenceOptions = getConferenceOptions;
/**
 * Returns the restored conference options if anything is available to be restored or undefined.
 *
 * @param {IStateful} stateful - The redux store state.
 * @returns {Object?}
 */
function restoreConferenceOptions(stateful) {
    const config = (0, functions_4.toState)(stateful)['features/base/config'];
    if (config.oldConfig) {
        return {
            hosts: {
                domain: config.oldConfig.hosts.domain,
                muc: config.oldConfig.hosts.muc
            },
            focusUserJid: config.oldConfig.focusUserJid,
            disableFocus: false,
            bosh: config.oldConfig.bosh,
            websocket: config.oldConfig.websocket,
            oldConfig: undefined
        };
    }
    // nothing to return
    return;
}
exports.restoreConferenceOptions = restoreConferenceOptions;
/**
 * Override the global config (that is, window.config) with XMPP configuration required to join as a visitor.
 *
 * @param {IStateful} stateful - The redux store state.
 * @param {string|undefined} vnode - The received parameters.
 * @param {string} focusJid - The received parameters.
 * @param {string|undefined} username - The received parameters.
 * @returns {Object}
 */
function getVisitorOptions(stateful, vnode, focusJid, username) {
    const config = (0, functions_4.toState)(stateful)['features/base/config'];
    if (!config?.hosts) {
        logger_1.default.warn('Wrong configuration, missing hosts.');
        return;
    }
    if (!vnode) {
        // this is redirecting back to main, lets restore config
        // not updating disableFocus, as if the room capacity is full the promotion to the main room will fail
        // and the visitor will be redirected back to a vnode from jicofo
        if (config.oldConfig && username) {
            return {
                hosts: config.oldConfig.hosts,
                focusUserJid: focusJid,
                disableLocalStats: false,
                bosh: config.oldConfig.bosh && (0, uri_1.appendURLParam)(config.oldConfig.bosh, 'customusername', username),
                p2p: config.oldConfig.p2p,
                websocket: config.oldConfig.websocket
                    && (0, uri_1.appendURLParam)(config.oldConfig.websocket, 'customusername', username),
                oldConfig: undefined // clears it up
            };
        }
        return;
    }
    const oldConfig = {
        hosts: {
            domain: ''
        },
        focusUserJid: config.focusUserJid,
        bosh: config.bosh,
        p2p: config.p2p,
        websocket: config.websocket
    };
    // copy original hosts, to make sure we do not use a modified one later
    Object.assign(oldConfig.hosts, config.hosts);
    const domain = `${vnode}.meet.jitsi`;
    return {
        oldConfig,
        hosts: {
            domain,
            muc: config.hosts.muc.replace(oldConfig.hosts.domain, domain)
        },
        focusUserJid: focusJid,
        disableFocus: true,
        disableLocalStats: true,
        bosh: config.bosh && (0, uri_1.appendURLParam)(config.bosh, 'vnode', vnode),
        p2p: {
            ...config.p2p,
            enabled: false
        },
        websocket: config.websocket && (0, uri_1.appendURLParam)(config.websocket, 'vnode', vnode)
    };
}
exports.getVisitorOptions = getVisitorOptions;
/**
* Returns the UTC timestamp when the first participant joined the conference.
*
* @param {IStateful} stateful - Reference that can be resolved to Redux
* state with the {@code toState} function.
* @returns {number}
*/
function getConferenceTimestamp(stateful) {
    const state = (0, functions_4.toState)(stateful);
    const { conferenceTimestamp } = (0, exports.getConferenceState)(state);
    return conferenceTimestamp;
}
exports.getConferenceTimestamp = getConferenceTimestamp;
/**
 * Returns the current {@code JitsiConference} which is joining or joined and is
 * not leaving. Please note the contrast with merely reading the
 * {@code conference} state of the feature base/conference which is not joining
 * but may be leaving already.
 *
 * @param {IStateful} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {JitsiConference|undefined}
 */
function getCurrentConference(stateful) {
    const { conference, joining, leaving, membersOnly, passwordRequired } = (0, exports.getConferenceState)((0, functions_4.toState)(stateful));
    // There is a precedence
    if (conference) {
        return conference === leaving ? undefined : conference;
    }
    return joining || passwordRequired || membersOnly;
}
exports.getCurrentConference = getCurrentConference;
/**
 * Returns whether the current conference is a P2P connection.
 * Will return `false` if it's a JVB one, and `null` if there is no conference.
 *
 * @param {IStateful} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean|null}
 */
function isP2pActive(stateful) {
    const conference = getCurrentConference((0, functions_4.toState)(stateful));
    if (!conference) {
        return null;
    }
    return conference.isP2PActive();
}
exports.isP2pActive = isP2pActive;
/**
 * Returns the stored room name.
 *
 * @param {IReduxState} state - The current state of the app.
 * @returns {string}
 */
function getRoomName(state) {
    return (0, exports.getConferenceState)(state).room;
}
exports.getRoomName = getRoomName;
/**
 * Get an obfuscated room name or create and persist it if it doesn't exists.
 *
 * @param {IReduxState} state - The current state of the app.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {string} - Obfuscated room name.
 */
function getOrCreateObfuscatedRoomName(state, dispatch) {
    let { obfuscatedRoom } = (0, exports.getConferenceState)(state);
    const { obfuscatedRoomSource } = (0, exports.getConferenceState)(state);
    const room = getRoomName(state);
    if (!room) {
        return;
    }
    // On native mobile the store doesn't clear when joining a new conference so we might have the obfuscatedRoom
    // stored even though a different room was joined.
    // Check if the obfuscatedRoom was already computed for the current room.
    if (!obfuscatedRoom || (obfuscatedRoomSource !== room)) {
        obfuscatedRoom = (0, js_sha512_1.sha512_256)(room);
        dispatch((0, actions_2.setObfuscatedRoom)(obfuscatedRoom, room));
    }
    return obfuscatedRoom;
}
exports.getOrCreateObfuscatedRoomName = getOrCreateObfuscatedRoomName;
/**
 * Analytics may require an obfuscated room name, this functions decides based on a config if the normal or
 * obfuscated room name should be returned.
 *
 * @param {IReduxState} state - The current state of the app.
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {string} - Analytics room name.
 */
function getAnalyticsRoomName(state, dispatch) {
    const { analysis: { obfuscateRoomName = false } = {} } = state['features/base/config'];
    if (obfuscateRoomName) {
        return getOrCreateObfuscatedRoomName(state, dispatch);
    }
    return getRoomName(state);
}
exports.getAnalyticsRoomName = getAnalyticsRoomName;
/**
 * Handle an error thrown by the backend (i.e. {@code lib-jitsi-meet}) while
 * manipulating a conference participant (e.g. Pin or select participant).
 *
 * @param {Error} err - The Error which was thrown by the backend while
 * manipulating a conference participant and which is to be handled.
 * @protected
 * @returns {void}
 */
function _handleParticipantError(err) {
    // XXX DataChannels are initialized at some later point when the conference
    // has multiple participants, but code that pins or selects a participant
    // might be executed before. So here we're swallowing a particular error.
    // TODO Lib-jitsi-meet should be fixed to not throw such an exception in
    // these scenarios.
    if (err.message !== 'Data channels support is disabled!') {
        throw err;
    }
}
exports._handleParticipantError = _handleParticipantError;
/**
 * Determines whether a specific string is a valid room name.
 *
 * @param {(string|undefined)} room - The name of the conference room to check
 * for validity.
 * @returns {boolean} If the specified room name is valid, then true; otherwise,
 * false.
 */
function isRoomValid(room) {
    return typeof room === 'string' && room !== '';
}
exports.isRoomValid = isRoomValid;
/**
 * Remove a set of local tracks from a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @protected
 * @returns {Promise}
 */
function _removeLocalTracksFromConference(conference, localTracks) {
    return Promise.all(localTracks.map(track => conference.removeTrack(track)
        .catch((err) => {
        // Local track might be already disposed by direct
        // JitsiTrack#dispose() call. So we should ignore this error
        // here.
        if (err.name !== lib_jitsi_meet_1.JitsiTrackErrors.TRACK_IS_DISPOSED) {
            _reportError('Failed to remove local track from conference', err);
        }
    })));
}
exports._removeLocalTracksFromConference = _removeLocalTracksFromConference;
/**
 * Reports a specific Error with a specific error message. While the
 * implementation merely logs the specified msg and err via the console at the
 * time of this writing, the intention of the function is to abstract the
 * reporting of errors and facilitate elaborating on it in the future.
 *
 * @param {string} msg - The error message to report.
 * @param {Error} err - The Error to report.
 * @private
 * @returns {void}
 */
function _reportError(msg, err) {
    // TODO This is a good point to call some global error handler when we have
    // one.
    logger_1.default.error(msg, err);
}
/**
 * Sends a representation of the local participant such as her avatar (URL),
 * email address, and display name to (the remote participants of) a specific
 * conference.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @param {JitsiConference} conference - The {@code JitsiConference} to which
 * the representation of the local participant is to be sent.
 * @returns {void}
 */
function sendLocalParticipant(stateful, conference) {
    const { avatarURL, email, features, name } = (0, functions_3.getLocalParticipant)(stateful) ?? {};
    avatarURL && conference?.sendCommand(constants_1.AVATAR_URL_COMMAND, {
        value: avatarURL
    });
    email && conference?.sendCommand(constants_1.EMAIL_COMMAND, {
        value: email
    });
    if (features && features['screen-sharing'] === 'true') {
        conference?.setLocalParticipantProperty('features_screen-sharing', true);
    }
    conference?.setDisplayName(name);
}
exports.sendLocalParticipant = sendLocalParticipant;
/**
 * A safe implementation of lodash#startCase that doesn't deburr the string.
 *
 * NOTE: According to lodash roadmap, lodash v5 will have this function.
 *
 * Code based on https://github.com/lodash/lodash/blob/master/startCase.js.
 *
 * @param {string} s - The string to do start case on.
 * @returns {string}
 */
function safeStartCase(s = '') {
    return lodash_1.default.words(`${s}`.replace(/['\u2019]/g, '')).reduce((result, word, index) => result + (index ? ' ' : '') + lodash_1.default.upperFirst(word), '');
}
