"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const functions_1 = require("../base/redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Reduces the redux actions of noise detection feature.
 */
ReducerRegistry_1.default.register('features/noise-detection', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_1.SET_NOISY_AUDIO_INPUT_NOTIFICATION_UID:
            return (0, functions_1.set)(state, 'noisyAudioInputNotificationUid', action.uid);
    }
    return state;
});
