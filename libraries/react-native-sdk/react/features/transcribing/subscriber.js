"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_1 = require("../base/sounds/actions");
const actions_2 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const constants_2 = require("../recording/constants");
const functions_1 = require("./functions");
/**
 * Listens for large video participant ID changes.
 */
StateListenerRegistry_1.default.register(
/* selector */ functions_1.isRecorderTranscriptionsRunning, 
/* listener */ (isRecorderTranscriptionsRunningValue, { getState, dispatch }) => {
    if (isRecorderTranscriptionsRunningValue) {
        notifyTranscribingStatusChanged(true);
        maybeEmitRecordingNotification(dispatch, getState, true);
    }
    else {
        notifyTranscribingStatusChanged(false);
        maybeEmitRecordingNotification(dispatch, getState, false);
    }
});
/**
 * Emit a recording started / stopped notification if the transcription started / stopped. Only
 * if there is no recording in progress.
 *
 * @param {Dispatch} dispatch - The Redux dispatch function.
 * @param {Function} getState - The Redux state.
 * @param {boolean} on - Whether the transcription is on or not.
 *
 * @returns {void}
 */
function maybeEmitRecordingNotification(dispatch, getState, on) {
    const state = getState();
    const { sessionDatas } = state['features/recording'];
    const { mode: modeConstants, status: statusConstants } = lib_jitsi_meet_1.JitsiRecordingConstants;
    if (sessionDatas.some(sd => sd.mode === modeConstants.FILE && sd.status === statusConstants.ON)) {
        // If a recording is still ongoing, don't send any notification.
        return;
    }
    (0, react_redux_1.batch)(() => {
        dispatch((0, actions_2.showNotification)({
            descriptionKey: on ? 'recording.on' : 'recording.off',
            titleKey: 'dialog.recording'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT));
        dispatch((0, actions_1.playSound)(on ? constants_2.RECORDING_ON_SOUND_ID : constants_2.RECORDING_OFF_SOUND_ID));
    });
}
/**
 * Notify external application (if API is enabled) that transcribing has started or stopped.
 *
 * @param {boolean} on - True if transcribing is on, false otherwise.
 * @returns {void}
 */
function notifyTranscribingStatusChanged(on) {
    if (typeof APP !== 'undefined') {
        APP.API.notifyTranscribingStatusChanged(on);
    }
}
