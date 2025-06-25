"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Reduces redux actions which affect the JSON Web Token (JWT) stored in the
 * redux store.
 *
 * @param {Object} state - The current redux state.
 * @param {Object} action - The redux action to reduce.
 * @returns {Object} The next redux state which is the result of reducing the
 * specified {@code action}.
 */
ReducerRegistry_1.default.register('features/base/jwt', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.SET_JWT: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, ...payload } = action;
            const nextState = {
                ...payload
            };
            return (0, functions_1.equals)(state, nextState) ? state : nextState;
        }
    }
    return state;
});
