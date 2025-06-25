"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
/**
 * Reduces the Redux actions of the feature features/screen-share.
 */
ReducerRegistry_1.default.register('features/screen-share', (state = {}, action) => {
    const { captureFrameRate, isSharingAudio, desktopAudioTrack } = action;
    switch (action.type) {
        case actionTypes_1.SET_SCREEN_AUDIO_SHARE_STATE:
            return {
                ...state,
                isSharingAudio
            };
        case actionTypes_1.SET_SCREENSHARE_CAPTURE_FRAME_RATE:
            return {
                ...state,
                captureFrameRate
            };
        case actionTypes_1.SET_SCREENSHARE_TRACKS:
            return {
                ...state,
                desktopAudioTrack
            };
        default:
            return state;
    }
});
