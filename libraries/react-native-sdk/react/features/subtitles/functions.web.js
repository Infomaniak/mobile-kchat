"use strict";
/* eslint-disable max-params, max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyTranscriptionChunkReceived = void 0;
/**
 * Logs when about the received transcription chunk.
 *
 * @param {string} transcriptMessageID - Transcription message id.
 * @param {string} language - The language of the transcribed message.
 * @param {Object} participant - The participant who send the message.
 * @param {any} text - The message text.
 * @param {any} _store - The store.
 * @returns {Event}
 */
const notifyTranscriptionChunkReceived = (transcriptMessageID, language, participant, text, _store) => APP.API.notifyTranscriptionChunkReceived({
    messageID: transcriptMessageID,
    language,
    participant,
    ...text
});
exports.notifyTranscriptionChunkReceived = notifyTranscriptionChunkReceived;
