"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFollowMeActive = void 0;
const functions_1 = require("../base/redux/functions");
/**
 * Returns true if follow me is active and false otherwise.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean} - True if follow me is active and false otherwise.
 */
function isFollowMeActive(stateful) {
    const state = (0, functions_1.toState)(stateful);
    return Boolean(state['features/follow-me'].moderator);
}
exports.isFollowMeActive = isFollowMeActive;
