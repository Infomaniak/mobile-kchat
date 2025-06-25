"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../flags/functions");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actions_1 = require("../settings/actions");
const actionTypes_1 = require("./actionTypes");
const actions_2 = require("./actions");
/**
 * The middleware of the feature {@code base/config}.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.SET_CONFIG:
            return _setConfig(store, next, action);
        case actionTypes_1.OVERWRITE_CONFIG:
            return _updateSettings(store, next, action);
    }
    return next(action);
});
/**
 * Notifies the feature {@code base/config} that the {@link SET_CONFIG} redux
 * action is being {@code dispatch}ed in a specific redux store.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} in the specified {@code store}.
 * @param {Action} action - The redux action which is being {@code dispatch}ed
 * in the specified {@code store}.
 * @private
 * @returns {*} The return value of {@code next(action)}.
 */
function _setConfig({ dispatch, getState }, next, action) {
    // The reducer is doing some alterations to the config passed in the action,
    // so make sure it's the final state by waiting for the action to be
    // reduced.
    const result = next(action);
    const state = getState();
    // Update the config with user defined settings.
    const settings = state['features/base/settings'];
    const config = {};
    if (typeof settings.disableP2P !== 'undefined') {
        config.p2p = { enabled: !settings.disableP2P };
    }
    const resolutionFlag = (0, functions_1.getFeatureFlag)(state, 'resolution');
    if (typeof resolutionFlag !== 'undefined') {
        config.resolution = resolutionFlag;
    }
    if (action.config.doNotFlipLocalVideo === true) {
        dispatch((0, actions_1.updateSettings)({
            localFlipX: false
        }));
    }
    if (action.config.disableSelfView !== undefined) {
        dispatch((0, actions_1.updateSettings)({
            disableSelfView: action.config.disableSelfView
        }));
    }
    if (action.config.filmstrip?.stageFilmstripParticipants !== undefined) {
        dispatch((0, actions_1.updateSettings)({
            maxStageParticipants: action.config.filmstrip.stageFilmstripParticipants
        }));
    }
    dispatch((0, actions_2.updateConfig)(config));
    // FIXME On Web we rely on the global 'config' variable which gets altered
    // multiple times, before it makes it to the reducer. At some point it may
    // not be the global variable which is being modified anymore due to
    // different merge methods being used along the way. The global variable
    // must be synchronized with the final state resolved by the reducer.
    if (typeof window.config !== 'undefined') {
        window.config = state['features/base/config'];
    }
    return result;
}
/**
 * Updates settings based on some config values.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} in the specified {@code store}.
 * @param {Action} action - The redux action which is being {@code dispatch}ed
 * in the specified {@code store}.
 * @private
 * @returns {*} The return value of {@code next(action)}.
 */
function _updateSettings({ dispatch }, next, action) {
    const { config: { doNotFlipLocalVideo } } = action;
    if (doNotFlipLocalVideo === true) {
        dispatch((0, actions_1.updateSettings)({
            localFlipX: false
        }));
    }
    return next(action);
}
