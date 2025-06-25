"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLastN = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sets the last-n, i.e., the number of remote videos to be requested from the bridge for the conference.
 *
 * @param {number} lastN - The number of remote videos to be requested.
 * @returns {{
 *     type: SET_LAST_N,
 *     lastN: number
 * }}
 */
function setLastN(lastN) {
    return {
        type: actionTypes_1.SET_LAST_N,
        lastN
    };
}
exports.setLastN = setLastN;
