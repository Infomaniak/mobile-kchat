"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoiseSuppressionEffect_1 = require("../../stream-effects/noise-suppression/NoiseSuppressionEffect");
const virtual_background_1 = require("../../stream-effects/virtual-background");
const logger_1 = __importDefault(require("./logger"));
/**
 * Loads the enabled stream effects.
 *
 * @param {Object} store - The Redux store.
 * @returns {Promise} - A Promise which resolves when all effects are created.
 */
function loadEffects(store) {
    const state = store.getState();
    const virtualBackground = state['features/virtual-background'];
    const noiseSuppression = state['features/noise-suppression'];
    const { noiseSuppression: nsOptions } = state['features/base/config'];
    const backgroundPromise = virtualBackground.backgroundEffectEnabled
        ? (0, virtual_background_1.createVirtualBackgroundEffect)(virtualBackground)
            .catch((error) => {
            logger_1.default.error('Failed to obtain the background effect instance with error: ', error);
            return Promise.resolve();
        })
        : Promise.resolve();
    const noiseSuppressionPromise = noiseSuppression?.enabled
        ? Promise.resolve(new NoiseSuppressionEffect_1.NoiseSuppressionEffect(nsOptions))
        : Promise.resolve();
    return Promise.all([backgroundPromise, noiseSuppressionPromise]);
}
exports.default = loadEffects;
