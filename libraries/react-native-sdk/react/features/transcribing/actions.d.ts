/**
 * Notify that the transcriber, with a unique ID, has joined.
 *
 * @param {string} participantId - The participant id of the transcriber.
 * @returns {{
 *     type: _TRANSCRIBER_JOINED,
 *     participantId: string
 * }}
 */
export declare function transcriberJoined(participantId: string): {
    type: string;
    transcriberJID: string;
};
/**
 * Notify that the transcriber, with a unique ID, has left.
 *
 * @param {string} participantId - The participant id of the transcriber.
 * @returns {{
 *     type: _TRANSCRIBER_LEFT,
 *     participantId: string
 * }}
 */
export declare function transcriberLeft(participantId: string): {
    type: string;
    transcriberJID: string;
};
/**
 * Notify that a potential transcriber, with a unique ID, has joined.
 *
 * @param {string} participantId - The participant id of the transcriber.
 * @returns {{
 *     type: _POTENTIAL_TRANSCRIBER_JOINED,
 *     participantId: string
 * }}
 */
export declare function potentialTranscriberJoined(participantId: string): {
    type: string;
    transcriberJID: string;
};
