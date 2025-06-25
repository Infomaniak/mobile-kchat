"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const DEFAULT_STATE = {
    enabled: false,
    maxMode: constants_1.MAX_MODE.DISABLED
};
/**
 * Reduces the Redux actions of the feature features/e2ee.
 */
ReducerRegistry_1.default.register('features/e2ee', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.TOGGLE_E2EE:
            return {
                ...state,
                enabled: action.enabled
            };
        case actionTypes_1.SET_MAX_MODE: {
            return {
                ...state,
                maxMode: action.maxMode
            };
        }
        default:
            return state;
    }
});
