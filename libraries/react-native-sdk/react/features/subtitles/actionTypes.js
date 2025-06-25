"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_REQUESTING_SUBTITLES = exports.TOGGLE_REQUESTING_SUBTITLES = exports.UPDATE_TRANSCRIPT_MESSAGE = exports.REMOVE_TRANSCRIPT_MESSAGE = void 0;
/**
 * The type of (redux) action which indicates that an existing transcript
 * has to be removed from the state.
 *
 * {
 *      type: REMOVE_TRANSCRIPT_MESSAGE,
 *      transciptMessageID: string,
 * }
 */
exports.REMOVE_TRANSCRIPT_MESSAGE = 'REMOVE_TRANSCRIPT_MESSAGE';
/**
 * The type of (redux) action which indicates that a transcript with an
 * given message_id to be added or updated is received.
 *
 * {
 *      type: UPDATE_TRANSCRIPT_MESSAGE,
 *      transcriptMessageID: string,
 *      newTranscriptMessage: Object
 * }
 */
exports.UPDATE_TRANSCRIPT_MESSAGE = 'UPDATE_TRANSCRIPT_MESSAGE';
/**
 * The type of (redux) action which indicates that the user pressed the
 * ClosedCaption button, to either enable or disable subtitles based on the
 * current state.
 *
 * {
 *      type: TOGGLE_REQUESTING_SUBTITLES
 * }
 */
exports.TOGGLE_REQUESTING_SUBTITLES = 'TOGGLE_REQUESTING_SUBTITLES';
/**
 * The type of (redux) action which indicates if the user set the state of
 * the subtitles to enabled or disabled.
 *
 * {
 *      type: SET_REQUESTING_SUBTITLES
 *      enabled: boolean
 * }
 */
exports.SET_REQUESTING_SUBTITLES = 'SET_REQUESTING_SUBTITLES';
