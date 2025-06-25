"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * The initial state of the feature testing.
 *
 * @type {{
 *     connectionState: string
 * }}
 */
const INITIAL_STATE = {
    connectionState: ''
};
ReducerRegistry_1.default.register('features/testing', (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_CONNECTION_STATE:
            return _setConnectionState(state, action);
        default:
            return state;
    }
});
/**
 * Reduces a specific Redux action SET_CONNECTION_STATE of the feature
 * testing.
 *
 * @param {Object} state - The Redux state of the feature base/logging.
 * @param {Action} action - The Redux action SET_CONNECTION_STATE to reduce.
 * @private
 * @returns {Object} The new state of the feature testing after the
 * reduction of the specified action.
 */
function _setConnectionState(state, action) {
    return (0, functions_1.assign)(state, { connectionState: action.connectionState });
}
