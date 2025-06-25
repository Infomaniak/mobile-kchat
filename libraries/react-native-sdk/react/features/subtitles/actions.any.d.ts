/**
 * Signals that a transcript has to be removed from the state.
 *
 * @param {string} transcriptMessageID - The message_id to be removed.
 * @returns {{
 *      type: REMOVE_TRANSCRIPT_MESSAGE,
 *      transcriptMessageID: string,
 * }}
 */
export declare function removeTranscriptMessage(transcriptMessageID: string): {
    type: string;
    transcriptMessageID: string;
};
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
export declare function updateTranscriptMessage(transcriptMessageID: string, newTranscriptMessage: Object): {
    type: string;
    transcriptMessageID: string;
    newTranscriptMessage: Object;
};
/**
 * Signals that the local user has toggled the ClosedCaption button.
 *
 * @returns {{
 *      type: TOGGLE_REQUESTING_SUBTITLES
 * }}
 */
export declare function toggleRequestingSubtitles(): {
    type: string;
};
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
export declare function setRequestingSubtitles(enabled: boolean, displaySubtitles?: boolean, language?: string | null): {
    type: string;
    displaySubtitles: boolean;
    enabled: boolean;
    language: string | null;
};
