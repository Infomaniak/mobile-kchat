"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const DEFAULT_STATE = {
    rooms: {},
    roomCounter: 0
};
/**
 * Listen for actions for the breakout-rooms feature.
 */
ReducerRegistry_1.default.register(constants_1.FEATURE_KEY, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1._UPDATE_ROOM_COUNTER:
            return {
                ...state,
                roomCounter: action.roomCounter
            };
        case actionTypes_1.UPDATE_BREAKOUT_ROOMS: {
            const { roomCounter, rooms } = action;
            return {
                ...state,
                roomCounter,
                rooms
            };
        }
        case actionTypes_1._RESET_BREAKOUT_ROOMS: {
            return DEFAULT_STATE;
        }
    }
    return state;
});
