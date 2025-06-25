"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * The default/initial redux state of the feature base/lib-jitsi-meet.
 *
 * @type {Object}
 */
const DEFAULT_STATE = {};
ReducerRegistry_1.default.register('features/base/lib-jitsi-meet', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.LIB_DID_DISPOSE:
            return DEFAULT_STATE;
        case actionTypes_1.LIB_DID_INIT:
            return {
                ...state,
                initError: undefined,
                initialized: true
            };
        case actionTypes_1.LIB_INIT_ERROR:
            return {
                ...state,
                initError: action.error,
                initialized: false
            };
        default:
            return state;
    }
});
