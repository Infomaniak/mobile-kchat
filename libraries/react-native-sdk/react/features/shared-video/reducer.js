"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const initialState = {};
/**
 * Reduces the Redux actions of the feature features/shared-video.
 */
ReducerRegistry_1.default.register('features/shared-video', (state = initialState, action) => {
    const { videoUrl, status, time, ownerId, disabled, muted, volume } = action;
    switch (action.type) {
        case actionTypes_1.RESET_SHARED_VIDEO_STATUS:
            return initialState;
        case actionTypes_1.SET_SHARED_VIDEO_STATUS:
            return {
                ...state,
                muted,
                ownerId,
                status,
                time,
                videoUrl,
                volume
            };
        case actionTypes_1.SET_DISABLE_BUTTON:
            return {
                ...state,
                disabled
            };
        default:
            return state;
    }
});
