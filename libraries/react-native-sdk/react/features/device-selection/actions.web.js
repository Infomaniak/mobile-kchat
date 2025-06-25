"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitVideoDeviceSelectionTab = exports.submitAudioDeviceSelectionTab = void 0;
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_1 = require("../base/devices/actions");
const functions_2 = require("../base/devices/functions");
const actions_2 = require("../base/settings/actions");
const actions_3 = require("../noise-suppression/actions");
const actions_4 = require("../screen-share/actions");
const functions_3 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Submits the settings related to audio device selection.
 *
 * @param {Object} newState - The new settings.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Function}
 */
function submitAudioDeviceSelectionTab(newState, isDisplayedOnWelcomePage) {
    return (dispatch, getState) => {
        const currentState = (0, functions_3.getAudioDeviceSelectionDialogProps)(getState(), isDisplayedOnWelcomePage);
        if (newState.selectedAudioInputId && newState.selectedAudioInputId !== currentState.selectedAudioInputId) {
            dispatch((0, actions_2.updateSettings)({
                userSelectedMicDeviceId: newState.selectedAudioInputId,
                userSelectedMicDeviceLabel: (0, functions_2.getDeviceLabelById)(getState(), newState.selectedAudioInputId, 'audioInput')
            }));
            dispatch((0, actions_1.setAudioInputDevice)(newState.selectedAudioInputId));
        }
        if (newState.selectedAudioOutputId
            && newState.selectedAudioOutputId
                !== currentState.selectedAudioOutputId) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeviceChangedEvent)('audio', 'output'));
            (0, functions_2.setAudioOutputDeviceId)(newState.selectedAudioOutputId, dispatch, true, (0, functions_2.getDeviceLabelById)(getState(), newState.selectedAudioOutputId, 'audioOutput'))
                .then(() => logger_1.default.log('changed audio output device'))
                .catch(err => {
                logger_1.default.warn('Failed to change audio output device.', 'Default or previously set audio output device will', ' be used instead.', err);
            });
        }
        if (newState.noiseSuppressionEnabled !== currentState.noiseSuppressionEnabled) {
            dispatch((0, actions_3.toggleNoiseSuppression)());
        }
    };
}
exports.submitAudioDeviceSelectionTab = submitAudioDeviceSelectionTab;
/**
 * Submits the settings related to device selection.
 *
 * @param {Object} newState - The new settings.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Function}
 */
function submitVideoDeviceSelectionTab(newState, isDisplayedOnWelcomePage) {
    return (dispatch, getState) => {
        const currentState = (0, functions_3.getVideoDeviceSelectionDialogProps)(getState(), isDisplayedOnWelcomePage);
        if (newState.selectedVideoInputId && (newState.selectedVideoInputId !== currentState.selectedVideoInputId)) {
            dispatch((0, actions_2.updateSettings)({
                userSelectedCameraDeviceId: newState.selectedVideoInputId,
                userSelectedCameraDeviceLabel: (0, functions_2.getDeviceLabelById)(getState(), newState.selectedVideoInputId, 'videoInput')
            }));
            dispatch((0, actions_1.setVideoInputDevice)(newState.selectedVideoInputId));
        }
        if (newState.localFlipX !== currentState.localFlipX) {
            dispatch((0, actions_2.updateSettings)({
                localFlipX: newState.localFlipX
            }));
        }
        if (newState.currentFramerate !== currentState.currentFramerate) {
            const frameRate = parseInt(newState.currentFramerate, 10);
            dispatch((0, actions_4.setScreenshareFramerate)(frameRate));
        }
    };
}
exports.submitVideoDeviceSelectionTab = submitVideoDeviceSelectionTab;
