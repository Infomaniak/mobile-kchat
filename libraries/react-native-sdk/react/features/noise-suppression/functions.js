"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canEnableNoiseSuppression = exports.isNoiseSuppressionEnabled = void 0;
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const functions_1 = require("../screen-share/functions");
/**
 * Is noise suppression currently enabled.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
function isNoiseSuppressionEnabled(state) {
    return state['features/noise-suppression'].enabled;
}
exports.isNoiseSuppressionEnabled = isNoiseSuppressionEnabled;
/**
 * Verify if noise suppression can be enabled in the current state.
 *
 * @param {*} state - Redux state.
 * @param {*} dispatch - Redux dispatch.
 * @param {*} localAudio - Current local audio track.
 * @returns {boolean}
 */
function canEnableNoiseSuppression(state, dispatch, localAudio) {
    const { channelCount } = localAudio.track.getSettings();
    // Sharing screen audio implies an effect being applied to the local track, because currently we don't support
    // more then one effect at a time the user has to choose between sharing audio or having noise suppression active.
    if ((0, functions_1.isScreenAudioShared)(state)) {
        dispatch((0, actions_1.showWarningNotification)({
            titleKey: 'notify.noiseSuppressionFailedTitle',
            descriptionKey: 'notify.noiseSuppressionDesktopAudioDescription'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        return false;
    }
    // Stereo audio tracks aren't currently supported, make sure the current local track is mono
    if (channelCount > 1) {
        dispatch((0, actions_1.showWarningNotification)({
            titleKey: 'notify.noiseSuppressionFailedTitle',
            descriptionKey: 'notify.noiseSuppressionStereoDescription'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        return false;
    }
    return true;
}
exports.canEnableNoiseSuppression = canEnableNoiseSuppression;
