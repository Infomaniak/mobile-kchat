"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeatureFlag = void 0;
const functions_1 = require("../app/functions");
const functions_2 = require("../redux/functions");
/**
 * Gets the value of a specific feature flag.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @param {string} flag - The name of the React {@code Component} prop of
 * the currently mounted {@code App} to get.
 * @param {*} defaultValue - A default value for the flag, in case it's not defined.
 * @returns {*} The value of the specified React {@code Component} prop of the
 * currently mounted {@code App}.
 */
function getFeatureFlag(stateful, flag, defaultValue) {
    const state = (0, functions_2.toState)(stateful)['features/base/flags'];
    if (state) {
        const value = state[flag];
        if (typeof value !== 'undefined') {
            return value;
        }
    }
    // Maybe the value hasn't made it to the redux store yet, check the app props.
    const flags = (0, functions_1.getAppProp)(stateful, 'flags') || {};
    return flags[flag] || defaultValue;
}
exports.getFeatureFlag = getFeatureFlag;
