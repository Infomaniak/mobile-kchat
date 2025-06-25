"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
ReducerRegistry_1.default.register('features/settings', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.SET_AUDIO_SETTINGS_VISIBILITY:
            return {
                ...state,
                audioSettingsVisible: action.value
            };
        case actionTypes_1.SET_VIDEO_SETTINGS_VISIBILITY:
            return {
                ...state,
                videoSettingsVisible: action.value
            };
    }
    return state;
});
