"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const DEFAULT_STATE = {
    isOpen: false,
    participantsVolume: {}
};
/**
 * Listen for actions that mutate the participants pane state.
 */
ReducerRegistry_1.default.register(constants_1.REDUCER_KEY, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.PARTICIPANTS_PANE_CLOSE:
            return {
                ...state,
                isOpen: false
            };
        case actionTypes_1.PARTICIPANTS_PANE_OPEN:
            return {
                ...state,
                isOpen: true
            };
        case actionTypes_1.SET_VOLUME:
            return {
                ...state,
                participantsVolume: {
                    ...state.participantsVolume,
                    [action.participantId]: action.volume
                }
            };
        default:
            return state;
    }
});
