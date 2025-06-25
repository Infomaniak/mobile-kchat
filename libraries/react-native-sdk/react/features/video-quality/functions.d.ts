/**
 * Selects {@code VIDEO_QUALITY_LEVELS} for the given {@link availableHeight} and threshold to quality mapping.
 *
 * @param {number} availableHeight - The height to which a matching video quality level should be found.
 * @param {Map<number, number>} heightToLevel - The threshold to quality level mapping. The keys are sorted in the
 * ascending order.
 * @returns {number} The matching value from {@code VIDEO_QUALITY_LEVELS}.
 */
export declare function getReceiverVideoQualityLevel(availableHeight: number, heightToLevel: Map<number, number>): number;
/**
 * Converts {@code Object} passed in the config which represents height thresholds to vide quality level mapping to
 * a {@code Map}.
 *
 * @param {Object} minHeightForQualityLvl - The 'config.videoQuality.minHeightForQualityLvl' Object from
 * the configuration. See config.js for more details.
 * @returns {Map<number, number>|undefined} - A mapping of minimal thumbnail height required for given quality level or
 * {@code undefined} if the map contains invalid values.
 */
export declare function validateMinHeightForQualityLvl(minHeightForQualityLvl?: {
    [key: number]: string;
}): Map<any, any> | undefined;
