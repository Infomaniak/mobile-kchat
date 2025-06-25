"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sounds = void 0;
const constants_1 = require("./constants");
/**
 * Maps the sounds IDs with the filenames sounds associated with them.
 *
 * @type {Map<string, string>}
 */
exports.sounds = new Map([
    /**
     * The name of the sound file which will be played when outgoing call is
     * expired.
     */
    [constants_1.OUTGOING_CALL_EXPIRED_SOUND_ID, { file: 'rejected.mp3' }],
    /**
     * The name of the sound file which will be played when outgoing call is
     * rejected.
     */
    [constants_1.OUTGOING_CALL_REJECTED_SOUND_ID, { file: 'rejected.mp3' }],
    /**
     * The name of the sound file which will be played when the status of an
     * outgoing call is ringing.
     */
    [
        constants_1.OUTGOING_CALL_RINGING_SOUND_ID,
        {
            file: 'outgoingRinging.mp3',
            options: { loop: true }
        }
    ],
    /**
     * The name of the sound file which will be played when outgoing call is
     * started.
     */
    [constants_1.OUTGOING_CALL_START_SOUND_ID, { file: 'outgoingStart.mp3' }]
]);
