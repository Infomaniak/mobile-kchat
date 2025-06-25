"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.potentialTranscriberJoined = exports.transcriberLeft = exports.transcriberJoined = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Notify that the transcriber, with a unique ID, has joined.
 *
 * @param {string} participantId - The participant id of the transcriber.
 * @returns {{
 *     type: _TRANSCRIBER_JOINED,
 *     participantId: string
 * }}
 */
function transcriberJoined(participantId) {
    return {
        type: actionTypes_1._TRANSCRIBER_JOINED,
        transcriberJID: participantId
    };
}
exports.transcriberJoined = transcriberJoined;
/**
 * Notify that the transcriber, with a unique ID, has left.
 *
 * @param {string} participantId - The participant id of the transcriber.
 * @returns {{
 *     type: _TRANSCRIBER_LEFT,
 *     participantId: string
 * }}
 */
function transcriberLeft(participantId) {
    return {
        type: actionTypes_1._TRANSCRIBER_LEFT,
        transcriberJID: participantId
    };
}
exports.transcriberLeft = transcriberLeft;
/**
 * Notify that a potential transcriber, with a unique ID, has joined.
 *
 * @param {string} participantId - The participant id of the transcriber.
 * @returns {{
 *     type: _POTENTIAL_TRANSCRIBER_JOINED,
 *     participantId: string
 * }}
 */
function potentialTranscriberJoined(participantId) {
    return {
        type: actionTypes_1._POTENTIAL_TRANSCRIBER_JOINED,
        transcriberJID: participantId
    };
}
exports.potentialTranscriberJoined = potentialTranscriberJoined;
