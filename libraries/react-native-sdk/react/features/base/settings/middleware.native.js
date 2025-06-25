"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../app/actionTypes");
const actions_1 = require("../audio-only/actions");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_2 = require("./actionTypes");
const functions_native_1 = require("./functions.native");
require("./middleware.any");
/**
 * The middleware of the feature base/settings. Distributes changes to the state
 * of base/settings to the states of other features computed from the state of
 * base/settings.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            _initializeCallIntegration(store);
            break;
        case actionTypes_2.SETTINGS_UPDATED:
            _maybeHandleCallIntegrationChange(action);
            _maybeCrashReportingChange(action);
            _maybeSetAudioOnly(store, action);
            break;
    }
    return result;
});
/**
 * Initializes the audio device handler based on the `disableCallIntegration` setting.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _initializeCallIntegration({ getState }) {
    const { disableCallIntegration } = getState()['features/base/settings'];
    if (typeof disableCallIntegration === 'boolean') {
        (0, functions_native_1.handleCallIntegrationChange)(disableCallIntegration);
    }
}
/**
 * Handles a change in the `disableCallIntegration` setting.
 *
 * @param {Object} action - The redux action.
 * @private
 * @returns {void}
 */
function _maybeHandleCallIntegrationChange({ settings: { disableCallIntegration } }) {
    if (typeof disableCallIntegration === 'boolean') {
        (0, functions_native_1.handleCallIntegrationChange)(disableCallIntegration);
    }
}
/**
 * Handles a change in the `disableCrashReporting` setting.
 *
 * @param {Object} action - The redux action.
 * @private
 * @returns {void}
 */
function _maybeCrashReportingChange({ settings: { disableCrashReporting } }) {
    if (typeof disableCrashReporting === 'boolean') {
        (0, functions_native_1.handleCrashReportingChange)(disableCrashReporting);
    }
}
/**
 * Updates {@code startAudioOnly} flag if it's updated in the settings.
 *
 * @param {Store} store - The redux store.
 * @param {Object} action - The redux action.
 * @private
 * @returns {void}
 */
function _maybeSetAudioOnly({ dispatch }, { settings: { startAudioOnly } }) {
    if (typeof startAudioOnly === 'boolean') {
        dispatch((0, actions_1.setAudioOnly)(startAudioOnly));
    }
}
