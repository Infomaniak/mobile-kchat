"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CFG_LVL_TO_APP_QUALITY_LVL = exports.MAX_VIDEO_QUALITY = exports.VIDEO_QUALITY_UNLIMITED = exports.VIDEO_QUALITY_LEVELS = exports.DEFAULT_LAST_N = void 0;
/**
 * Default last-n value used to be used for "HD" video quality setting when no channelLastN value is specified.
 *
 * @type {number}
 */
exports.DEFAULT_LAST_N = 20;
/**
 * The supported remote video resolutions. The values are currently based on
 * available simulcast layers.
 *
 * @type {object}
 */
exports.VIDEO_QUALITY_LEVELS = {
    ULTRA: 2160,
    HIGH: 720,
    STANDARD: 360,
    LOW: 180,
    NONE: 0
};
/**
 * Indicates unlimited video quality.
 */
exports.VIDEO_QUALITY_UNLIMITED = -1;
/**
 * The maximum video quality from the VIDEO_QUALITY_LEVELS map.
 */
exports.MAX_VIDEO_QUALITY = Math.max(...Object.values(exports.VIDEO_QUALITY_LEVELS));
/**
 * Maps quality level names used in the config.videoQuality.minHeightForQualityLvl to the quality level constants used
 * by the application.
 *
 * @type {Object}
 */
exports.CFG_LVL_TO_APP_QUALITY_LVL = {
    'low': exports.VIDEO_QUALITY_LEVELS.LOW,
    'standard': exports.VIDEO_QUALITY_LEVELS.STANDARD,
    'high': exports.VIDEO_QUALITY_LEVELS.HIGH,
    'ultra': exports.VIDEO_QUALITY_LEVELS.ULTRA
};
