"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastNForQualityLevel = void 0;
const constants_1 = require("../../video-quality/constants");
/**
 * Determines the lastN value to be used for the conference based on the video quality selected.
 *
 * @param {string} qualityLevel - Quality level (height) selected.
 * @param {number} channelLastN - LastN value set for the whole conference.
 * @returns {number} LastN value applicable to the quality level specified.
 */
function getLastNForQualityLevel(qualityLevel, channelLastN) {
    let lastN = channelLastN;
    const videoQualityLevels = Object.values(constants_1.VIDEO_QUALITY_LEVELS);
    for (const lvl in videoQualityLevels) {
        if (videoQualityLevels.hasOwnProperty(lvl)
            && qualityLevel === videoQualityLevels[lvl]
            && Number(lvl) > 1) {
            lastN = Math.floor(channelLastN / Math.pow(2, Number(lvl) - 1));
        }
    }
    return lastN;
}
exports.getLastNForQualityLevel = getLastNForQualityLevel;
