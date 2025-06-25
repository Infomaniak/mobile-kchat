"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Listen for actions that contain the Follow Me feature active state, so that it can be stored.
 */
ReducerRegistry_1.default.register('features/follow-me', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.SET_FOLLOW_ME_MODERATOR: {
            let newState = (0, functions_1.set)(state, 'moderator', action.id);
            if (!action.id) {
                // clear the state if feature becomes disabled
                newState = (0, functions_1.set)(newState, 'state', undefined);
            }
            return newState;
        }
        case actionTypes_1.SET_FOLLOW_ME_STATE: {
            return (0, functions_1.set)(state, 'state', action.state);
        }
    }
    return state;
});
