"use strict";
/* eslint-disable max-params, max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyTranscriptionChunkReceived = void 0;
const functions_1 = require("../mobile/external-api/functions");
/**
 * Event which will be emitted on the native side to indicate that the transcription chunk was received.
 */
const TRANSCRIPTION_CHUNK_RECEIVED = 'TRANSCRIPTION_CHUNK_RECEIVED';
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
const notifyTranscriptionChunkReceived = (transcriptMessageID, language, participant, text, _store) => (0, functions_1.sendEvent)(_store, TRANSCRIPTION_CHUNK_RECEIVED, {
    messageID: transcriptMessageID,
    language,
    participant,
    text
});
exports.notifyTranscriptionChunkReceived = notifyTranscriptionChunkReceived;
