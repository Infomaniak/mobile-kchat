"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
// @ts-ignore
const constants_1 = require("../../../../modules/API/constants");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actions_1 = require("../../app/actions");
const actions_any_1 = require("../../chat/actions.any");
const actions_2 = require("../../display-name/actions");
const functions_2 = require("../../jaas/functions");
const actions_3 = require("../../notifications/actions");
const constants_2 = require("../../notifications/constants");
const utils_1 = require("../../prejoin/utils");
const actions_any_2 = require("../../recording/actions.any");
const LocalRecordingManager_1 = __importDefault(require("../../recording/components/Recording/LocalRecordingManager"));
const functions_3 = require("../../visitors/functions");
const actions_4 = require("../config/actions");
const actionTypes_1 = require("../connection/actionTypes");
const actions_5 = require("../connection/actions");
const functions_4 = require("../jwt/functions");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const actionTypes_2 = require("../participants/actionTypes");
const constants_3 = require("../participants/constants");
const functions_5 = require("../participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../redux/StateListenerRegistry"));
const actionTypes_3 = require("../tracks/actionTypes");
const functions_any_1 = require("../tracks/functions.any");
const actionTypes_4 = require("./actionTypes");
const actions_6 = require("./actions");
const constants_4 = require("./constants");
const functions_6 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Handler for before unload event.
 */
let beforeUnloadHandler;
/**
 * Implements the middleware of the feature base/conference.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_4.CONFERENCE_FAILED:
            return _conferenceFailed(store, next, action);
        case actionTypes_4.CONFERENCE_JOINED:
            return _conferenceJoined(store, next, action);
        case actionTypes_1.CONNECTION_ESTABLISHED:
            return _connectionEstablished(store, next, action);
        case actionTypes_1.CONNECTION_FAILED:
            return _connectionFailed(store, next, action);
        case actionTypes_4.CONFERENCE_SUBJECT_CHANGED:
            return _conferenceSubjectChanged(store, next, action);
        case actionTypes_4.CONFERENCE_WILL_LEAVE:
            _conferenceWillLeave(store);
            break;
        case actionTypes_4.P2P_STATUS_CHANGED:
            return _p2pStatusChanged(next, action);
        case actionTypes_2.PARTICIPANT_UPDATED:
            return _updateLocalParticipantInConference(store, next, action);
        case actionTypes_2.PIN_PARTICIPANT:
            return _pinParticipant(store, next, action);
        case actionTypes_4.SEND_TONES:
            return _sendTones(store, next, action);
        case actionTypes_4.SET_ROOM:
            return _setRoom(store, next, action);
        case actionTypes_3.TRACK_ADDED:
        case actionTypes_3.TRACK_REMOVED:
            return _trackAddedOrRemoved(store, next, action);
        case actionTypes_4.SET_ASSUMED_BANDWIDTH_BPS:
            return _setAssumedBandwidthBps(store, next, action);
    }
    return next(action);
});
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed.
 */
StateListenerRegistry_1.default.register(state => (0, functions_6.getCurrentConference)(state), (conference, { dispatch }, previousConference) => {
    if (conference && !previousConference) {
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.METADATA_UPDATED, (metadata) => {
            dispatch((0, actions_6.updateConferenceMetadata)(metadata));
        });
    }
    if (conference !== previousConference) {
        dispatch((0, actions_6.updateConferenceMetadata)(null));
    }
});
/**
 * Makes sure to leave a failed conference in order to release any allocated
 * resources like peer connections, emit participant left events, etc.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONFERENCE_FAILED} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _conferenceFailed({ dispatch, getState }, next, action) {
    const { conference, error } = action;
    const result = next(action);
    const { enableForcedReload } = getState()['features/base/config'];
    if (LocalRecordingManager_1.default.isRecordingLocally()) {
        dispatch((0, actions_any_2.stopLocalVideoRecording)());
    }
    // Handle specific failure reasons.
    switch (error.name) {
        case lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_RESTARTED: {
            if (enableForcedReload) {
                dispatch((0, actions_3.showErrorNotification)({
                    description: 'Restart initiated because of a bridge failure',
                    titleKey: 'dialog.sessionRestarted'
                }, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
            }
            break;
        }
        case lib_jitsi_meet_1.JitsiConferenceErrors.CONNECTION_ERROR: {
            const [msg] = error.params;
            dispatch((0, actions_5.connectionDisconnected)(getState()['features/base/connection'].connection));
            dispatch((0, actions_3.showErrorNotification)({
                descriptionArguments: { msg },
                descriptionKey: msg ? 'dialog.connectErrorWithMsg' : 'dialog.connectError',
                titleKey: 'connection.CONNFAIL'
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
            break;
        }
        case lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_MAX_USERS: {
            dispatch((0, actions_3.showErrorNotification)({
                hideErrorSupportLink: true,
                descriptionKey: 'dialog.maxUsersLimitReached',
                titleKey: 'dialog.maxUsersLimitReachedTitle'
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
            // In case of max users(it can be from a visitor node), let's restore
            // oldConfig if any as we will be back to the main prosody.
            const newConfig = (0, functions_6.restoreConferenceOptions)(getState);
            if (newConfig) {
                dispatch((0, actions_4.overwriteConfig)(newConfig)) // @ts-ignore
                    .then(() => dispatch((0, actions_6.conferenceWillLeave)(conference)))
                    .then(() => conference.leave())
                    .then(() => dispatch((0, actions_5.disconnect)()))
                    .then(() => dispatch((0, actions_5.connect)()))
                    .then(() => {
                    // FIXME: Workaround for the web version. To be removed once we get rid of conference.js
                    if (typeof APP !== 'undefined') {
                        const localTracks = (0, functions_any_1.getLocalTracks)(getState()['features/base/tracks']);
                        const jitsiTracks = localTracks.map((t) => t.jitsiTrack);
                        APP.conference.startConference(jitsiTracks).catch(logger_1.default.error);
                    }
                });
            }
            break;
        }
        case lib_jitsi_meet_1.JitsiConferenceErrors.NOT_ALLOWED_ERROR: {
            const [type, msg] = error.params;
            let descriptionKey;
            let titleKey = 'dialog.tokenAuthFailed';
            if (type === lib_jitsi_meet_1.JitsiConferenceErrors.AUTH_ERROR_TYPES.NO_MAIN_PARTICIPANTS) {
                descriptionKey = 'visitors.notification.noMainParticipantsDescription';
                titleKey = 'visitors.notification.noMainParticipantsTitle';
            }
            else if (type === lib_jitsi_meet_1.JitsiConferenceErrors.AUTH_ERROR_TYPES.NO_VISITORS_LOBBY) {
                descriptionKey = 'visitors.notification.noVisitorLobby';
            }
            else if (type === lib_jitsi_meet_1.JitsiConferenceErrors.AUTH_ERROR_TYPES.PROMOTION_NOT_ALLOWED) {
                descriptionKey = 'visitors.notification.notAllowedPromotion';
            }
            else if (type === lib_jitsi_meet_1.JitsiConferenceErrors.AUTH_ERROR_TYPES.ROOM_CREATION_RESTRICTION) {
                descriptionKey = 'dialog.errorRoomCreationRestriction';
            }
            dispatch((0, actions_3.showErrorNotification)({
                descriptionKey,
                hideErrorSupportLink: true,
                titleKey
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.STICKY));
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createNotAllowedErrorEvent)(type, msg));
            break;
        }
        case lib_jitsi_meet_1.JitsiConferenceErrors.OFFER_ANSWER_FAILED:
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createOfferAnswerFailedEvent)());
            break;
    }
    !error.recoverable
        && conference
        && conference.leave(constants_4.CONFERENCE_LEAVE_REASONS.UNRECOVERABLE_ERROR).catch((reason) => {
            // Even though we don't care too much about the failure, it may be
            // good to know that it happen, so log it (on the info level).
            logger_1.default.info('JitsiConference.leave() rejected with:', reason);
        });
    // FIXME: Workaround for the web version. Currently, the creation of the
    // conference is handled by /conference.js and appropriate failure handlers
    // are set there.
    if (typeof APP !== 'undefined') {
        _removeUnloadHandler(getState);
    }
    if (enableForcedReload && error?.name === lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_RESTARTED) {
        dispatch((0, actions_6.conferenceWillLeave)(conference));
        dispatch((0, actions_1.reloadNow)());
    }
    return result;
}
/**
 * Does extra sync up on properties that may need to be updated after the
 * conference was joined.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONFERENCE_JOINED} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _conferenceJoined({ dispatch, getState }, next, action) {
    const result = next(action);
    const { conference } = action;
    const { pendingSubjectChange } = getState()['features/base/conference'];
    const { disableBeforeUnloadHandlers = false, requireDisplayName } = getState()['features/base/config'];
    dispatch((0, actions_any_1.removeLobbyChatParticipant)(true));
    pendingSubjectChange && dispatch((0, actions_6.setSubject)(pendingSubjectChange));
    // FIXME: Very dirty solution. This will work on web only.
    // When the user closes the window or quits the browser, lib-jitsi-meet
    // handles the process of leaving the conference. This is temporary solution
    // that should cover the described use case as part of the effort to
    // implement the conferenceWillLeave action for web.
    beforeUnloadHandler = (e) => {
        if (LocalRecordingManager_1.default.isRecordingLocally()) {
            dispatch((0, actions_any_2.stopLocalVideoRecording)());
            if (e) {
                e.preventDefault();
                e.returnValue = null;
            }
        }
        dispatch((0, actions_6.conferenceWillLeave)(conference));
    };
    if (!(0, functions_3.iAmVisitor)(getState())) {
        // if a visitor is promoted back to main room and want to join an empty breakout room
        // we need to send iq to jicofo, so it can join/create the breakout room
        dispatch((0, actions_4.overwriteConfig)({ disableFocus: false }));
    }
    window.addEventListener(disableBeforeUnloadHandlers ? 'unload' : 'beforeunload', beforeUnloadHandler);
    if (requireDisplayName
        && !(0, functions_5.getLocalParticipant)(getState)?.name
        && !conference.isHidden()) {
        dispatch((0, actions_2.openDisplayNamePrompt)({
            validateInput: utils_1.hasDisplayName
        }));
    }
    return result;
}
/**
 * Notifies the feature base/conference that the action
 * {@code CONNECTION_ESTABLISHED} is being dispatched within a specific redux
 * store.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONNECTION_ESTABLISHED}
 * which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
async function _connectionEstablished({ dispatch, getState }, next, action) {
    const result = next(action);
    const { tokenAuthUrl = false } = getState()['features/base/config'];
    // if there is token auth URL defined and local participant is using jwt
    // this means it is logged in when connection is established, so we can change the state
    if (tokenAuthUrl && !(0, functions_2.isVpaasMeeting)(getState())) {
        let email;
        if (getState()['features/base/jwt'].jwt) {
            email = (0, functions_5.getLocalParticipant)(getState())?.email;
        }
        dispatch((0, actions_6.authStatusChanged)(true, email || ''));
    }
    // FIXME: Workaround for the web version. Currently, the creation of the
    // conference is handled by /conference.js.
    if (typeof APP === 'undefined') {
        dispatch((0, actions_6.createConference)());
        return result;
    }
    return result;
}
/**
 * Logs jwt validation errors from xmpp and from the client-side validator.
 *
 * @param {string} message - The error message from xmpp.
 * @param {string} errors - The detailed errors.
 * @returns {void}
 */
function _logJwtErrors(message, errors) {
    message && logger_1.default.error(`JWT error: ${message}`);
    errors && logger_1.default.error('JWT parsing errors:', errors);
}
/**
 * Notifies the feature base/conference that the action
 * {@code CONNECTION_FAILED} is being dispatched within a specific redux
 * store.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONNECTION_FAILED} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _connectionFailed({ dispatch, getState }, next, action) {
    const { connection, error } = action;
    const { jwt } = getState()['features/base/jwt'];
    if (jwt) {
        const errors = (0, functions_4.validateJwt)(jwt).map((err) => i18next_1.default.t(`dialog.tokenAuthFailedReason.${err.key}`, err.args))
            .join(' ');
        _logJwtErrors(error.message, errors);
        // do not show the notification when we will prompt the user
        // for username and password
        if (error.name === lib_jitsi_meet_1.JitsiConnectionErrors.PASSWORD_REQUIRED) {
            dispatch((0, actions_3.showErrorNotification)({
                descriptionKey: errors ? 'dialog.tokenAuthFailedWithReasons' : 'dialog.tokenAuthFailed',
                descriptionArguments: { reason: errors },
                titleKey: 'dialog.tokenAuthFailedTitle'
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.STICKY));
        }
    }
    const result = next(action);
    _removeUnloadHandler(getState);
    (0, functions_6.forEachConference)(getState, conference => {
        // TODO: revisit this
        // It feels that it would make things easier if JitsiConference
        // in lib-jitsi-meet would monitor it's connection and emit
        // CONFERENCE_FAILED when it's dropped. It has more knowledge on
        // whether it can recover or not. But because the reload screen
        // and the retry logic is implemented in the app maybe it can be
        // left this way for now.
        if (conference.getConnection() === connection) {
            // XXX Note that on mobile the error type passed to
            // connectionFailed is always an object with .name property.
            // This fact needs to be checked prior to enabling this logic on
            // web.
            const conferenceAction = (0, actions_6.conferenceFailed)(conference, error.name);
            // Copy the recoverable flag if set on the CONNECTION_FAILED
            // action to not emit recoverable action caused by
            // a non-recoverable one.
            if (typeof error.recoverable !== 'undefined') {
                conferenceAction.error.recoverable = error.recoverable;
            }
            dispatch(conferenceAction);
        }
        return true;
    });
    return result;
}
/**
 * Notifies the feature base/conference that the action
 * {@code CONFERENCE_SUBJECT_CHANGED} is being dispatched within a specific
 *  redux store.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONFERENCE_SUBJECT_CHANGED}
 * which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _conferenceSubjectChanged({ dispatch, getState }, next, action) {
    const result = next(action);
    const { subject } = getState()['features/base/conference'];
    if (subject) {
        dispatch({
            type: actionTypes_4.SET_PENDING_SUBJECT_CHANGE,
            subject: undefined
        });
    }
    typeof APP === 'object' && APP.API.notifySubjectChanged(subject);
    return result;
}
/**
 * Notifies the feature base/conference that the action
 * {@code CONFERENCE_WILL_LEAVE} is being dispatched within a specific redux
 * store.
 *
 * @private
 * @param {Object} store - The redux store.
 * @returns {void}
 */
function _conferenceWillLeave({ getState }) {
    _removeUnloadHandler(getState);
}
/**
 * Notifies the feature base/conference that the action {@code PIN_PARTICIPANT}
 * is being dispatched within a specific redux store. Pins the specified remote
 * participant in the associated conference, ignores the local participant.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code PIN_PARTICIPANT} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _pinParticipant({ getState }, next, action) {
    const state = getState();
    const { conference } = state['features/base/conference'];
    if (!conference) {
        return next(action);
    }
    const id = action.participant.id;
    const participantById = (0, functions_5.getParticipantById)(state, id);
    const pinnedParticipant = (0, functions_5.getPinnedParticipant)(state);
    const actionName = id ? AnalyticsEvents_1.ACTION_PINNED : AnalyticsEvents_1.ACTION_UNPINNED;
    const local = participantById?.local
        || (!id && pinnedParticipant && pinnedParticipant.local);
    let participantIdForEvent;
    if (local) {
        participantIdForEvent = local;
    }
    else {
        participantIdForEvent
            = actionName === AnalyticsEvents_1.ACTION_PINNED ? id : pinnedParticipant?.id;
    }
    (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPinnedEvent)(actionName, participantIdForEvent, {
        local,
        'participant_count': conference.getParticipantCount()
    }));
    return next(action);
}
/**
 * Removes the unload handler.
 *
 * @param {Function} getState - The redux getState function.
 * @returns {void}
 */
function _removeUnloadHandler(getState) {
    if (typeof beforeUnloadHandler !== 'undefined') {
        const { disableBeforeUnloadHandlers = false } = getState()['features/base/config'];
        window.removeEventListener(disableBeforeUnloadHandlers ? 'unload' : 'beforeunload', beforeUnloadHandler);
        beforeUnloadHandler = undefined;
    }
}
/**
 * Requests the specified tones to be played.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code SEND_TONES} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _sendTones({ getState }, next, action) {
    const state = getState();
    const { conference } = state['features/base/conference'];
    if (conference) {
        const { duration, tones, pause } = action;
        conference.sendTones(tones, duration, pause);
    }
    return next(action);
}
/**
 * Notifies the feature base/conference that the action
 * {@code SET_ROOM} is being dispatched within a specific
 *  redux store.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code SET_ROOM}
 * which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _setRoom({ dispatch, getState }, next, action) {
    const state = getState();
    const { localSubject, subject } = state['features/base/config'];
    const { room } = action;
    if (room) {
        // Set the stored subject.
        localSubject && dispatch((0, actions_6.setLocalSubject)(localSubject));
        subject && dispatch((0, actions_6.setSubject)(subject));
    }
    return next(action);
}
/**
 * Synchronizes local tracks from state with local tracks in JitsiConference
 * instance.
 *
 * @param {Store} store - The redux store.
 * @param {Object} action - Action object.
 * @private
 * @returns {Promise}
 */
function _syncConferenceLocalTracksWithState({ getState }, action) {
    const state = getState();
    const conference = (0, functions_6.getCurrentConference)(state);
    let promise;
    if (conference) {
        const track = action.track.jitsiTrack;
        if (action.type === actionTypes_3.TRACK_ADDED) {
            // If gUM is slow and tracks are created after the user has already joined the conference, avoid
            // adding the tracks to the conference if the user is a visitor.
            if (!(0, functions_3.iAmVisitor)(state)) {
                promise = (0, functions_6._addLocalTracksToConference)(conference, [track]);
            }
        }
        else {
            promise = (0, functions_6._removeLocalTracksFromConference)(conference, [track]);
        }
    }
    return promise || Promise.resolve();
}
/**
 * Notifies the feature base/conference that the action {@code TRACK_ADDED}
 * or {@code TRACK_REMOVED} is being dispatched within a specific redux store.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code TRACK_ADDED} or
 * {@code TRACK_REMOVED} which is being dispatched in the specified
 * {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _trackAddedOrRemoved(store, next, action) {
    const track = action.track;
    // TODO All track swapping should happen here instead of conference.js.
    if (track?.local) {
        return (_syncConferenceLocalTracksWithState(store, action)
            .then(() => next(action)));
    }
    return next(action);
}
/**
 * Updates the conference object when the local participant is updated.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action which is being dispatched in the
 * specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _updateLocalParticipantInConference({ dispatch, getState }, next, action) {
    const { conference } = getState()['features/base/conference'];
    const { participant } = action;
    const result = next(action);
    const localParticipant = (0, functions_5.getLocalParticipant)(getState);
    if (conference && participant.id === localParticipant?.id) {
        if ('name' in participant) {
            conference.setDisplayName(participant.name);
        }
        if ('role' in participant && participant.role === constants_3.PARTICIPANT_ROLE.MODERATOR) {
            const { pendingSubjectChange, subject } = getState()['features/base/conference'];
            // When the local user role is updated to moderator and we have a pending subject change
            // which was not reflected we need to set it (the first time we tried was before becoming moderator).
            if (typeof pendingSubjectChange !== 'undefined' && pendingSubjectChange !== subject) {
                dispatch((0, actions_6.setSubject)(pendingSubjectChange));
            }
        }
    }
    return result;
}
/**
 * Notifies the external API that the action {@code P2P_STATUS_CHANGED}
 * is being dispatched within a specific redux store.
 *
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code P2P_STATUS_CHANGED}
 * which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _p2pStatusChanged(next, action) {
    const result = next(action);
    if (typeof APP !== 'undefined') {
        APP.API.notifyP2pStatusChanged(action.p2p);
    }
    return result;
}
/**
 * Notifies the feature base/conference that the action
 * {@code SET_ASSUMED_BANDWIDTH_BPS} is being dispatched within a specific
 *  redux store.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code SET_ASSUMED_BANDWIDTH_BPS}
 * which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _setAssumedBandwidthBps({ getState }, next, action) {
    const state = getState();
    const conference = (0, functions_6.getCurrentConference)(state);
    const payload = Number(action.assumedBandwidthBps);
    const assumedBandwidthBps = isNaN(payload) || payload < constants_1.MIN_ASSUMED_BANDWIDTH_BPS
        ? constants_1.MIN_ASSUMED_BANDWIDTH_BPS
        : payload;
    if (conference) {
        conference.setAssumedBandwidthBps(assumedBandwidthBps);
    }
    return next(action);
}
