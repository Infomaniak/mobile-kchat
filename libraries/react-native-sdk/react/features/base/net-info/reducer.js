"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const DEFAULT_STATE = {
    isOnline: true
};
/**
 * The base/net-info feature's reducer.
 */
ReducerRegistry_1.default.register(constants_1.STORE_NAME, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_NETWORK_INFO:
            return (0, functions_1.assign)(state, {
                isOnline: action.isOnline,
                networkType: action.networkType,
                cellularGeneration: action.cellularGeneration,
                details: action.details
            });
        case actionTypes_1._STORE_NETWORK_INFO_CLEANUP:
            return (0, functions_1.assign)(state, {
                _cleanup: action.cleanup
            });
        default:
            return state;
    }
});
