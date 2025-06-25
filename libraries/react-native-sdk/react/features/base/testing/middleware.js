"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../conference/actionTypes");
const actionTypes_2 = require("../config/actionTypes");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const helpers_1 = require("../util/helpers");
const actions_1 = require("./actions");
const functions_1 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * The Redux middleware of the feature testing.
 *
 * @param {Store} store - The Redux store.
 * @returns {Function}
 * @private
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS:
            _bindConferenceConnectionListener(action.conference, store);
            break;
        case actionTypes_2.SET_CONFIG: {
            const result = next(action);
            _bindTortureHelpers(store);
            return result;
        }
    }
    return next(action);
});
/**
 * Binds a handler which will listen for the connection related conference
 * events (in the lib-jitsi-meet internals those are associated with the ICE
 * connection state).
 *
 * @param {JitsiConference} conference - The {@link JitsiConference} for which
 * the conference will join even is dispatched.
 * @param {Store} store - The redux store in which the specified action is being
 * dispatched.
 * @private
 * @returns {void}
 */
function _bindConferenceConnectionListener(conference, { dispatch }) {
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_ESTABLISHED, _onConnectionEvent.bind(null, lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_ESTABLISHED, dispatch));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_RESTORED, _onConnectionEvent.bind(null, lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_RESTORED, dispatch));
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_INTERRUPTED, _onConnectionEvent.bind(null, lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_INTERRUPTED, dispatch));
}
/**
 * Binds all the helper functions needed by torture.
 *
 * @param {IStore} store - The redux store.
 * @private
 * @returns {void}
 */
function _bindTortureHelpers(store) {
    const { getState } = store;
    // We bind helpers only if testing mode is enabled
    if (!(0, functions_1.isTestModeEnabled)(getState())) {
        return;
    }
    // All torture helper methods go in here
    (0, helpers_1.getJitsiMeetGlobalNS)().testing = {
        getRemoteVideoType: functions_1.getRemoteVideoType.bind(null, store),
        isLargeVideoReceived: functions_1.isLargeVideoReceived.bind(null, store),
        isRemoteVideoReceived: functions_1.isRemoteVideoReceived.bind(null, store)
    };
}
/**
 * The handler function for conference connection events which will store the
 * latest even name in the Redux store of feature testing.
 *
 * @param {string} event - One of the lib-jitsi-meet JitsiConferenceEvents.
 * @param {Function} dispatch - The dispatch function of the current Redux
 * store.
 * @returns {void}
 * @private
 */
function _onConnectionEvent(event, dispatch) {
    switch (event) {
        case lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_ESTABLISHED:
        case lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_INTERRUPTED:
        case lib_jitsi_meet_1.JitsiConferenceEvents.CONNECTION_RESTORED:
            dispatch((0, actions_1.setConnectionState)(event));
            break;
        default:
            logger_1.default.error(`onConnectionEvent - unsupported event type: ${event}`);
            break;
    }
}
