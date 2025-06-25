"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Reduces the redux actions of the feature power monitor.
 */
ReducerRegistry_1.default.register('features/power-monitor', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.SET_TRANSPORT:
            return _setTransport(state, action.transport);
        case actionTypes_1.SUSPEND_DETECTED:
            return _suspendDetected(state);
    }
    return state;
});
/**
 * Reduces a specific redux action SET_TRANSPORT of the feature power monitor.
 *
 * @param {Object} state - The redux state of the feature power monitor.
 * @param {?Transport} transport - The transport to store in state.
 * @private
 * @returns {Object} The new state of the feature power monitor after the reduction of
 * the specified action.
 */
function _setTransport(state, transport) {
    return (0, functions_1.set)(state, 'transport', transport);
}
/**
 * Reduces a specific redux action SUSPEND_DETECTED of the feature overlay.
 *
 * @param {Object} state - The redux state of the feature overlay.
 * @private
 * @returns {Object} The new state of the feature overlay after the reduction of
 * the specified action.
 */
function _suspendDetected(state) {
    return (0, functions_1.set)(state, 'suspendDetected', true);
}
