"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRequestingSubtitles = exports.toggleRequestingSubtitles = exports.updateTranscriptMessage = exports.removeTranscriptMessage = void 0;
const i18next_1 = require("../base/i18n/i18next");
const actionTypes_1 = require("./actionTypes");
/**
 * Signals that a transcript has to be removed from the state.
 *
 * @param {string} transcriptMessageID - The message_id to be removed.
 * @returns {{
 *      type: REMOVE_TRANSCRIPT_MESSAGE,
 *      transcriptMessageID: string,
 * }}
 */
function removeTranscriptMessage(transcriptMessageID) {
    return {
        type: actionTypes_1.REMOVE_TRANSCRIPT_MESSAGE,
        transcriptMessageID
    };
}
exports.removeTranscriptMessage = removeTranscriptMessage;
/**
 * Signals that a transcript with the given message_id to be added or updated
 * is received.
 *
 * @param {string} transcriptMessageID -The transcript message_id to be updated.
 * @param {Object} newTranscriptMessage - The updated transcript message.
 * @returns {{
 *      type: UPDATE_TRANSCRIPT_MESSAGE,
 *      transcriptMessageID: string,
 *      newTranscriptMessage: Object
 * }}
 */
function updateTranscriptMessage(transcriptMessageID, newTranscriptMessage) {
    return {
        type: actionTypes_1.UPDATE_TRANSCRIPT_MESSAGE,
        transcriptMessageID,
        newTranscriptMessage
    };
}
exports.updateTranscriptMessage = updateTranscriptMessage;
/**
 * Signals that the local user has toggled the ClosedCaption button.
 *
 * @returns {{
 *      type: TOGGLE_REQUESTING_SUBTITLES
 * }}
 */
function toggleRequestingSubtitles() {
    return {
        type: actionTypes_1.TOGGLE_REQUESTING_SUBTITLES
    };
}
exports.toggleRequestingSubtitles = toggleRequestingSubtitles;
/**
 * Signals that the local user has enabled or disabled the subtitles.
 *
 * @param {boolean} enabled - The new state of the subtitles.
 * @param {boolean} displaySubtitles - Whether to display subtitles or not.
 * @param {string} language - The language of the subtitles.
 * @returns {{
 *    type: SET_REQUESTING_SUBTITLES,
 *    enabled: boolean,
 *    displaySubtitles: boolean,
 *    language: string
 * }}
 */
function setRequestingSubtitles(enabled, displaySubtitles = true, language = `translation-languages:${i18next_1.DEFAULT_LANGUAGE}`) {
    return {
        type: actionTypes_1.SET_REQUESTING_SUBTITLES,
        displaySubtitles,
        enabled,
        language
    };
}
exports.setRequestingSubtitles = setRequestingSubtitles;
