"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    enabled: false
};
ReducerRegistry_1.default.register('features/base/audio-only', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.SET_AUDIO_ONLY:
            return {
                ...state,
                enabled: action.audioOnly
            };
        default:
            return state;
    }
});
