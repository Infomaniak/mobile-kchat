"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._POTENTIAL_TRANSCRIBER_JOINED = exports._TRANSCRIBER_LEFT = exports._TRANSCRIBER_JOINED = void 0;
/**
 * The type of Redux action triggering storage of participantId of transcriber,
 * so that it can later be kicked
 *
 * {
 *     type: TRANSCRIBER_JOINED,
 *     participantId: String
 * }
 * @private
 */
exports._TRANSCRIBER_JOINED = 'TRANSCRIBER_JOINED';
/**
 * The type of Redux action signalling that the transcriber has left
 *
 * {
 *     type: TRANSCRIBER_LEFT,
 *     participantId: String
 * }
 * @private
 */
exports._TRANSCRIBER_LEFT = 'TRANSCRIBER_LEFT';
/**
 * The type of a Redux action signalling that a hidden participant has joined,
 * which can be candidate for being a transcriber.
 *
 * {
 *     type: _POTENTIAL_TRANSCRIBER_JOINED,
 * }
 * @private
 */
exports._POTENTIAL_TRANSCRIBER_JOINED = 'POTENTIAL_TRANSCRIBER_JOINED';
