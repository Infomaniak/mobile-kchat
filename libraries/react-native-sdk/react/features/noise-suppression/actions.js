"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNoiseSuppressionEnabled = exports.toggleNoiseSuppression = exports.setNoiseSuppressionEnabledState = void 0;
const functions_1 = require("../base/tracks/functions");
const actions_1 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const NoiseSuppressionEffect_1 = require("../stream-effects/noise-suppression/NoiseSuppressionEffect");
const actionTypes_1 = require("./actionTypes");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Updates the noise suppression active state.
 *
 * @param {boolean} enabled - Is noise suppression enabled.
 * @returns {{
 *      type: SET_NOISE_SUPPRESSION_STATE,
 *      enabled: boolean
 * }}
 */
function setNoiseSuppressionEnabledState(enabled) {
    return {
        type: actionTypes_1.SET_NOISE_SUPPRESSION_ENABLED,
        enabled
    };
}
exports.setNoiseSuppressionEnabledState = setNoiseSuppressionEnabledState;
/**
 *  Enabled/disable noise suppression depending on the current state.
 *
 * @returns {Function}
 */
function toggleNoiseSuppression() {
    return (dispatch, getState) => {
        if ((0, functions_2.isNoiseSuppressionEnabled)(getState())) {
            dispatch(setNoiseSuppressionEnabled(false));
        }
        else {
            dispatch(setNoiseSuppressionEnabled(true));
        }
    };
}
exports.toggleNoiseSuppression = toggleNoiseSuppression;
/**
 * Attempt to enable or disable noise suppression using the {@link NoiseSuppressionEffect}.
 *
 * @param {boolean} enabled - Enable or disable noise suppression.
 *
 * @returns {Function}
 */
function setNoiseSuppressionEnabled(enabled) {
    return async (dispatch, getState) => {
        const state = getState();
        const { noiseSuppression: nsOptions } = state['features/base/config'];
        const localAudio = (0, functions_1.getLocalJitsiAudioTrack)(state);
        const noiseSuppressionEnabled = (0, functions_2.isNoiseSuppressionEnabled)(state);
        logger_1.default.info(`Attempting to set noise suppression enabled state: ${enabled}`);
        if (enabled === noiseSuppressionEnabled) {
            logger_1.default.warn(`Noise suppression enabled state already: ${enabled}`);
            return;
        }
        // If there is no local audio, simply set the enabled state. Once an audio track is created
        // the effects list will be applied.
        if (!localAudio) {
            dispatch(setNoiseSuppressionEnabledState(enabled));
            return;
        }
        try {
            if (enabled) {
                if (!(0, functions_2.canEnableNoiseSuppression)(state, dispatch, localAudio)) {
                    return;
                }
                await localAudio.setEffect(new NoiseSuppressionEffect_1.NoiseSuppressionEffect(nsOptions));
                dispatch(setNoiseSuppressionEnabledState(true));
                logger_1.default.info('Noise suppression enabled.');
            }
            else {
                await localAudio.setEffect(undefined);
                dispatch(setNoiseSuppressionEnabledState(false));
                logger_1.default.info('Noise suppression disabled.');
            }
        }
        catch (error) {
            logger_1.default.error(`Failed to set noise suppression enabled to: ${enabled}`, error);
            dispatch((0, actions_1.showErrorNotification)({
                titleKey: 'notify.noiseSuppressionFailedTitle'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        }
    };
}
exports.setNoiseSuppressionEnabled = setNoiseSuppressionEnabled;
