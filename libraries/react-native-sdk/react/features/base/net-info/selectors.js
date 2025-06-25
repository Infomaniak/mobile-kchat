"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOnline = void 0;
const constants_1 = require("./constants");
/**
 * A selector for the internet online status.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean}
 */
function isOnline(state) {
    return state[constants_1.STORE_NAME].isOnline;
}
exports.isOnline = isOnline;
