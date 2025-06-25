/**
 * Updates the noise suppression active state.
 *
 * @param {boolean} enabled - Is noise suppression enabled.
 * @returns {{
 *      type: SET_NOISE_SUPPRESSION_STATE,
 *      enabled: boolean
 * }}
 */
export declare function setNoiseSuppressionEnabledState(enabled: boolean): any;
/**
 *  Enabled/disable noise suppression depending on the current state.
 *
 * @returns {Function}
 */
export declare function toggleNoiseSuppression(): any;
/**
 * Attempt to enable or disable noise suppression using the {@link NoiseSuppressionEffect}.
 *
 * @param {boolean} enabled - Enable or disable noise suppression.
 *
 * @returns {Function}
 */
export declare function setNoiseSuppressionEnabled(enabled: boolean): any;
