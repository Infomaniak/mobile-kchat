"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFollowMeState = exports.setFollowMeModerator = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sets the current moderator id or clears it.
 *
 * @param {?string} id - The Follow Me moderator participant id.
 * @returns {{
 *     type: SET_FOLLOW_ME_MODERATOR,
 *     id, string
 * }}
 */
function setFollowMeModerator(id) {
    return {
        type: actionTypes_1.SET_FOLLOW_ME_MODERATOR,
        id
    };
}
exports.setFollowMeModerator = setFollowMeModerator;
/**
 * Sets the Follow Me feature state.
 *
 * @param {?Object} state - The current state.
 * @returns {{
 *     type: SET_FOLLOW_ME_STATE,
 *     state: Object
 * }}
 */
function setFollowMeState(state) {
    return {
        type: actionTypes_1.SET_FOLLOW_ME_STATE,
        state
    };
}
exports.setFollowMeState = setFollowMeState;
