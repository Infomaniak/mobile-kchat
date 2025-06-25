"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMinHeightForQualityLvl = exports.getReceiverVideoQualityLevel = void 0;
const constants_1 = require("./constants");
/**
 * Selects {@code VIDEO_QUALITY_LEVELS} for the given {@link availableHeight} and threshold to quality mapping.
 *
 * @param {number} availableHeight - The height to which a matching video quality level should be found.
 * @param {Map<number, number>} heightToLevel - The threshold to quality level mapping. The keys are sorted in the
 * ascending order.
 * @returns {number} The matching value from {@code VIDEO_QUALITY_LEVELS}.
 */
function getReceiverVideoQualityLevel(availableHeight, heightToLevel) {
    let selectedLevel = constants_1.VIDEO_QUALITY_LEVELS.LOW;
    for (const [levelThreshold, level] of heightToLevel.entries()) {
        if (availableHeight >= levelThreshold) {
            selectedLevel = level;
        }
    }
    return selectedLevel;
}
exports.getReceiverVideoQualityLevel = getReceiverVideoQualityLevel;
/**
 * Converts {@code Object} passed in the config which represents height thresholds to vide quality level mapping to
 * a {@code Map}.
 *
 * @param {Object} minHeightForQualityLvl - The 'config.videoQuality.minHeightForQualityLvl' Object from
 * the configuration. See config.js for more details.
 * @returns {Map<number, number>|undefined} - A mapping of minimal thumbnail height required for given quality level or
 * {@code undefined} if the map contains invalid values.
 */
function validateMinHeightForQualityLvl(minHeightForQualityLvl) {
    if (typeof minHeightForQualityLvl !== 'object'
        || Object.keys(minHeightForQualityLvl).map(lvl => Number(lvl))
            .find(lvl => lvl === null || isNaN(lvl) || lvl < 0)) {
        return undefined;
    }
    const levelsSorted = Object.keys(minHeightForQualityLvl)
        .map(k => Number(k))
        .sort((a, b) => a - b);
    const map = new Map();
    Object.values(constants_1.VIDEO_QUALITY_LEVELS).sort()
        .forEach(value => {
        if (value > constants_1.VIDEO_QUALITY_LEVELS.NONE) {
            map.set(value, value);
        }
    });
    for (const level of levelsSorted) {
        const configQuality = minHeightForQualityLvl[level];
        const appQuality = constants_1.CFG_LVL_TO_APP_QUALITY_LVL[configQuality];
        if (!appQuality) {
            return undefined;
        }
        map.delete(appQuality);
        map.set(level, appQuality);
    }
    return map;
}
exports.validateMinHeightForQualityLvl = validateMinHeightForQualityLvl;
