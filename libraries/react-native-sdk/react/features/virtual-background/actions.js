"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundEnabled = exports.setVirtualBackground = exports.toggleBackgroundEffect = void 0;
const virtual_background_1 = require("../stream-effects/virtual-background");
const actionTypes_1 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
/**
 * Signals the local participant activate the virtual background video or not.
 *
 * @param {Object} options - Represents the virtual background set options.
 * @param {Object} jitsiTrack - Represents the jitsi track that will have backgraund effect applied.
 * @returns {Promise}
 */
function toggleBackgroundEffect(options, jitsiTrack) {
    return async function (dispatch, getState) {
        await dispatch(backgroundEnabled(options.backgroundEffectEnabled));
        await dispatch(setVirtualBackground(options));
        const state = getState();
        const virtualBackground = state['features/virtual-background'];
        if (jitsiTrack) {
            try {
                if (options.backgroundEffectEnabled) {
                    await jitsiTrack.setEffect(await (0, virtual_background_1.createVirtualBackgroundEffect)(virtualBackground, dispatch));
                }
                else {
                    await jitsiTrack.setEffect(undefined);
                    dispatch(backgroundEnabled(false));
                }
            }
            catch (error) {
                dispatch(backgroundEnabled(false));
                logger_1.default.error('Error on apply background effect:', error);
            }
        }
    };
}
exports.toggleBackgroundEffect = toggleBackgroundEffect;
/**
 * Sets the selected virtual background image object.
 *
 * @param {Object} options - Represents the virtual background set options.
 * @returns {{
 *     type: SET_VIRTUAL_BACKGROUND,
 *     virtualSource: string,
 *     blurValue: number,
 *     type: string,
 * }}
 */
function setVirtualBackground(options) {
    return {
        type: actionTypes_1.SET_VIRTUAL_BACKGROUND,
        virtualSource: options?.virtualSource,
        blurValue: options?.blurValue,
        backgroundType: options?.backgroundType,
        selectedThumbnail: options?.selectedThumbnail
    };
}
exports.setVirtualBackground = setVirtualBackground;
/**
 * Signals the local participant that the background effect has been enabled.
 *
 * @param {boolean} backgroundEffectEnabled - Indicate if virtual background effect is activated.
 * @returns {{
 *      type: BACKGROUND_ENABLED,
 *      backgroundEffectEnabled: boolean
 * }}
 */
function backgroundEnabled(backgroundEffectEnabled) {
    return {
        type: actionTypes_1.BACKGROUND_ENABLED,
        backgroundEffectEnabled
    };
}
exports.backgroundEnabled = backgroundEnabled;
