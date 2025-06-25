"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAudioOnly = exports.setAudioOnly = void 0;
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actionTypes_1 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
/**
 * Sets the audio-only flag for the current JitsiConference.
 *
 * @param {boolean} audioOnly - True if the conference should be audio only; false, otherwise.
 * @returns {{
 *     type: SET_AUDIO_ONLY,
 *     audioOnly: boolean
 * }}
 */
function setAudioOnly(audioOnly) {
    return (dispatch, getState) => {
        const { enabled: oldValue } = getState()['features/base/audio-only'];
        if (oldValue !== audioOnly) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createAudioOnlyChangedEvent)(audioOnly));
            logger_1.default.log(`Audio-only ${audioOnly ? 'enabled' : 'disabled'}`);
            dispatch({
                type: actionTypes_1.SET_AUDIO_ONLY,
                audioOnly
            });
            if (typeof APP !== 'undefined') {
                // TODO This should be a temporary solution that lasts only until video
                // tracks and all ui is moved into react/redux on the web.
                APP.conference.onToggleAudioOnly();
            }
        }
    };
}
exports.setAudioOnly = setAudioOnly;
/**
 * Toggles the audio-only flag for the current JitsiConference.
 *
 * @returns {Function}
 */
function toggleAudioOnly() {
    return (dispatch, getState) => {
        const { enabled } = getState()['features/base/audio-only'];
        return dispatch(setAudioOnly(!enabled));
    };
}
exports.toggleAudioOnly = toggleAudioOnly;
