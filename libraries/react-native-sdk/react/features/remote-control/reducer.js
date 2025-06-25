"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * The default state.
 */
const DEFAULT_STATE = {
    active: false,
    controller: {
        isCapturingEvents: false
    },
    receiver: {
        enabled: false
    }
};
/**
 * Listen for actions that mutate the remote control state.
 */
ReducerRegistry_1.default.register('features/remote-control', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CAPTURE_EVENTS:
            return {
                ...state,
                controller: (0, functions_1.set)(state.controller, 'isCapturingEvents', action.isCapturingEvents)
            };
        case actionTypes_1.REMOTE_CONTROL_ACTIVE:
            return (0, functions_1.set)(state, 'active', action.active);
        case actionTypes_1.SET_RECEIVER_TRANSPORT:
            return {
                ...state,
                receiver: (0, functions_1.set)(state.receiver, 'transport', action.transport)
            };
        case actionTypes_1.SET_RECEIVER_ENABLED:
            return {
                ...state,
                receiver: (0, functions_1.set)(state.receiver, 'enabled', action.enabled)
            };
        case actionTypes_1.SET_REQUESTED_PARTICIPANT:
            return {
                ...state,
                controller: (0, functions_1.set)(state.controller, 'requestedParticipant', action.requestedParticipant)
            };
        case actionTypes_1.SET_CONTROLLED_PARTICIPANT:
            return {
                ...state,
                controller: (0, functions_1.set)(state.controller, 'controlled', action.controlled)
            };
        case actionTypes_1.SET_CONTROLLER:
            return {
                ...state,
                receiver: (0, functions_1.set)(state.receiver, 'controller', action.controller)
            };
    }
    return state;
});
