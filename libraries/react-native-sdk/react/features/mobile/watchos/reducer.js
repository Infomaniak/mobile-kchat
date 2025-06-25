"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../../base/redux/ReducerRegistry"));
const functions_1 = require("../../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
const INITIAL_STATE = {
    sessionID: new Date().getTime()
};
/**
 * Reduces the Redux actions of the feature features/mobile/watchos.
 */
ReducerRegistry_1.default.register('features/mobile/watchos', (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_CONFERENCE_TIMESTAMP: {
            return (0, functions_1.assign)(state, {
                conferenceTimestamp: action.conferenceTimestamp
            });
        }
        case actionTypes_1.SET_SESSION_ID: {
            return (0, functions_1.assign)(state, {
                sessionID: action.sessionID,
                conferenceTimestamp: 0
            });
        }
        case actionTypes_1.SET_WATCH_REACHABLE: {
            return (0, functions_1.assign)(state, {
                watchReachable: action.watchReachable
            });
        }
        default:
            return state;
    }
});
