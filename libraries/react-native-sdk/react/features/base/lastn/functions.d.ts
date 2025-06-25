/**
 * Determines the lastN value to be used for the conference based on the video quality selected.
 *
 * @param {string} qualityLevel - Quality level (height) selected.
 * @param {number} channelLastN - LastN value set for the whole conference.
 * @returns {number} LastN value applicable to the quality level specified.
 */
export declare function getLastNForQualityLevel(qualityLevel: number, channelLastN: number): number;
