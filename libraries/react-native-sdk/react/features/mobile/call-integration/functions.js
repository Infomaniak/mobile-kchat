"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCallIntegrationEnabled = void 0;
const constants_1 = require("../../base/flags/constants");
const functions_1 = require("../../base/flags/functions");
const functions_2 = require("../../base/redux/functions");
/**
 * Checks if call integration is enabled or not.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {string} - Default URL for the app.
 */
function isCallIntegrationEnabled(stateful) {
    const state = (0, functions_2.toState)(stateful);
    const { disableCallIntegration } = state['features/base/settings'];
    const flag = (0, functions_1.getFeatureFlag)(state, constants_1.CALL_INTEGRATION_ENABLED);
    // The feature flag has precedence.
    return flag ?? !disableCallIntegration;
}
exports.isCallIntegrationEnabled = isCallIntegrationEnabled;
