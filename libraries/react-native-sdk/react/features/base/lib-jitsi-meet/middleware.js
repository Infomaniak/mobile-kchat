"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../config/actionTypes");
const actionTypes_2 = require("../net-info/actionTypes");
const actionTypes_3 = require("../participants/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const _1 = __importDefault(require("./_"));
const actions_1 = require("./actions");
/**
 * Middleware that captures PARTICIPANT_LEFT action for a local participant
 * (which signalizes that we finally left the app) and disposes lib-jitsi-meet.
 * Also captures SET_CONFIG action and disposes previous instance (if any) of
 * lib-jitsi-meet, and initializes a new one with new config.
 *
 * @param {Store} store - Redux store.
 * @private
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_2.SET_NETWORK_INFO:
            _1.default.setNetworkInfo({
                isOnline: action.isOnline
            });
            break;
        case actionTypes_3.PARTICIPANT_LEFT:
            action.participant.local && store.dispatch((0, actions_1.disposeLib)());
            break;
        case actionTypes_1.SET_CONFIG:
            return _setConfig(store, next, action);
    }
    return next(action);
});
/**
 * Notifies the feature base/lib-jitsi-meet that the action SET_CONFIG is being
 * dispatched within a specific Redux store.
 *
 * @param {Store} store - The Redux store in which the specified action is being
 * dispatched.
 * @param {Dispatch} next - The Redux dispatch function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The Redux action SET_CONFIG which is being
 * dispatched in the specified store.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified action.
 */
function _setConfig({ dispatch, getState }, next, action) {
    const { initialized } = getState()['features/base/lib-jitsi-meet'];
    // XXX Since the config is changing, the library lib-jitsi-meet must be
    // initialized again with the new config. Consequently, it may need to be
    // disposed of first.
    // TODO Currently, disposeLib actually does not dispose of lib-jitsi-meet
    // because lib-jitsi-meet does not implement such functionality.
    if (initialized) {
        dispatch((0, actions_1.disposeLib)());
    }
    // Let the new config into the Redux store (because initLib will read it
    // from there).
    const result = next(action);
    dispatch((0, actions_1.initLib)());
    return result;
}
