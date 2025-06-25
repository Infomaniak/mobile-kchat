"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientHeight = exports.getClientWidth = void 0;
const functions_1 = require("../../redux/functions");
/**
 *
 * Returns the client width.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/config.
 * @returns {number}
 */
function getClientWidth(stateful) {
    const state = (0, functions_1.toState)(stateful)['features/base/responsive-ui'];
    return state.clientWidth;
}
exports.getClientWidth = getClientWidth;
/**
 *
 * Returns the client height.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/config.
 * @returns {number}
 */
function getClientHeight(stateful) {
    const state = (0, functions_1.toState)(stateful)['features/base/responsive-ui'];
    return state.clientHeight;
}
exports.getClientHeight = getClientHeight;
