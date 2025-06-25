/**
 * Default last-n value used to be used for "HD" video quality setting when no channelLastN value is specified.
 *
 * @type {number}
 */
export declare const DEFAULT_LAST_N = 20;
/**
 * The supported remote video resolutions. The values are currently based on
 * available simulcast layers.
 *
 * @type {object}
 */
export declare const VIDEO_QUALITY_LEVELS: {
    ULTRA: number;
    HIGH: number;
    STANDARD: number;
    LOW: number;
    NONE: number;
};
/**
 * Indicates unlimited video quality.
 */
export declare const VIDEO_QUALITY_UNLIMITED = -1;
/**
 * The maximum video quality from the VIDEO_QUALITY_LEVELS map.
 */
export declare const MAX_VIDEO_QUALITY: number;
/**
 * Maps quality level names used in the config.videoQuality.minHeightForQualityLvl to the quality level constants used
 * by the application.
 *
 * @type {Object}
 */
export declare const CFG_LVL_TO_APP_QUALITY_LVL: {
    low: number;
    standard: number;
    high: number;
    ultra: number;
};
