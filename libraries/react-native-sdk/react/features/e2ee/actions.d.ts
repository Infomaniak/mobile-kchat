/**
 * Dispatches an action to enable / disable E2EE.
 *
 * @param {boolean} enabled - Whether E2EE is to be enabled or not.
 * @returns {Object}
 */
export declare function toggleE2EE(enabled: boolean): {
    type: string;
    enabled: boolean;
};
/**
 * Dispatches an action to set E2EE maxMode.
 *
 * @param {string} maxMode - The new value.
 * @returns {Object}
 */
export declare function setE2EEMaxMode(maxMode: string): {
    type: string;
    maxMode: string;
};
/**
 * Dispatches an action to set media encryption key.
 *
 * @param {Object} keyInfo - Json containing key information.
 * @param {string} [keyInfo.encryptionKey] - The exported encryption key.
 * @param {number} [keyInfo.index] - The index of the encryption key.
 * @returns {{
 *     type: SET_MEDIA_ENCRYPTION_KEY,
 *     keyInfo: Object
 * }}
 */
export declare function setMediaEncryptionKey(keyInfo: Object): {
    type: string;
    keyInfo: Object;
};
/**
 * Dispatches an action to start participant e2ee verficiation process.
 *
 * @param {string} pId - The participant id.
 * @returns {{
 *     type: START_VERIFICATION,
 *     pId: string
 * }}
 */
export declare function startVerification(pId: string): {
    type: string;
    pId: string;
};
/**
 * Dispatches an action to set participant e2ee verification status.
 *
 * @param {string} pId - The participant id.
 * @param {boolean} isVerified - The verifcation status.
 * @returns {{
 *     type: PARTICIPANT_VERIFIED,
 *     pId: string,
 *     isVerified: boolean
 * }}
 */
export declare function participantVerified(pId: string, isVerified: boolean): {
    type: string;
    pId: string;
    isVerified: boolean;
};
