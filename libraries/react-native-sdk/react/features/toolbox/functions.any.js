"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtDisabledButtons = exports.isAudioMuteButtonDisabled = void 0;
const constants_1 = require("../base/jwt/constants");
const functions_1 = require("../base/jwt/functions");
const types_1 = require("../base/media/types");
/**
 * Indicates if the audio mute button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
function isAudioMuteButtonDisabled(state) {
    const { available, muted, unmuteBlocked, gumPending } = state['features/base/media'].audio;
    const { startSilent } = state['features/base/config'];
    return Boolean(!available || startSilent || (muted && unmuteBlocked) || gumPending !== types_1.IGUMPendingState.NONE);
}
exports.isAudioMuteButtonDisabled = isAudioMuteButtonDisabled;
/**
 * Returns the buttons corresponding to features disabled through jwt.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {string[]} - The disabled by jwt buttons array.
 */
function getJwtDisabledButtons(state) {
    return Object.keys(constants_1.FEATURES_TO_BUTTONS_MAPPING).reduce((acc, current) => {
        if (!(0, functions_1.isJwtFeatureEnabled)(state, current, true)) {
            acc.push(constants_1.FEATURES_TO_BUTTONS_MAPPING[current]);
        }
        return acc;
    }, []);
}
exports.getJwtDisabledButtons = getJwtDisabledButtons;
