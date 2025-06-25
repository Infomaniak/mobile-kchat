"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arePollsDisabled = exports.shouldDisplayNotifications = void 0;
const functions_1 = require("../base/redux/functions");
const functions_2 = require("../visitors/functions");
/**
 * Tells whether or not the notifications should be displayed within
 * the conference feature based on the current Redux state.
 *
 * @param {Object|Function} stateful - The redux store state.
 * @returns {boolean}
 */
function shouldDisplayNotifications(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { calleeInfoVisible } = state['features/invite'];
    return !calleeInfoVisible;
}
exports.shouldDisplayNotifications = shouldDisplayNotifications;
/**
 *
 * Returns true if polls feature is disabled.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/config.
 * @returns {boolean}
 */
function arePollsDisabled(stateful) {
    const state = (0, functions_1.toState)(stateful);
    return state['features/base/config']?.disablePolls || (0, functions_2.iAmVisitor)(state);
}
exports.arePollsDisabled = arePollsDisabled;
