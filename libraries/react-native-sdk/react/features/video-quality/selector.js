"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinHeightForQualityLvlMap = void 0;
/**
 * Selects the thumbnail height to the quality level mapping from the config.
 *
 * @param {Object} state - The redux state.
 * @returns {Map<number,number>}
 */
function getMinHeightForQualityLvlMap(state) {
    return state['features/video-quality'].minHeightForQualityLvl;
}
exports.getMinHeightForQualityLvlMap = getMinHeightForQualityLvlMap;
