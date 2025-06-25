"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.participantVerified = exports.startVerification = exports.setMediaEncryptionKey = exports.setE2EEMaxMode = exports.toggleE2EE = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Dispatches an action to enable / disable E2EE.
 *
 * @param {boolean} enabled - Whether E2EE is to be enabled or not.
 * @returns {Object}
 */
function toggleE2EE(enabled) {
    return {
        type: actionTypes_1.TOGGLE_E2EE,
        enabled
    };
}
exports.toggleE2EE = toggleE2EE;
/**
 * Dispatches an action to set E2EE maxMode.
 *
 * @param {string} maxMode - The new value.
 * @returns {Object}
 */
function setE2EEMaxMode(maxMode) {
    return {
        type: actionTypes_1.SET_MAX_MODE,
        maxMode
    };
}
exports.setE2EEMaxMode = setE2EEMaxMode;
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
function setMediaEncryptionKey(keyInfo) {
    return {
        type: actionTypes_1.SET_MEDIA_ENCRYPTION_KEY,
        keyInfo
    };
}
exports.setMediaEncryptionKey = setMediaEncryptionKey;
/**
 * Dispatches an action to start participant e2ee verficiation process.
 *
 * @param {string} pId - The participant id.
 * @returns {{
 *     type: START_VERIFICATION,
 *     pId: string
 * }}
 */
function startVerification(pId) {
    return {
        type: actionTypes_1.START_VERIFICATION,
        pId
    };
}
exports.startVerification = startVerification;
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
function participantVerified(pId, isVerified) {
    return {
        type: actionTypes_1.PARTICIPANT_VERIFIED,
        pId,
        isVerified
    };
}
exports.participantVerified = participantVerified;
