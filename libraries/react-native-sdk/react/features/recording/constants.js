"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECORDING_METADATA_ID = exports.START_RECORDING_NOTIFICATION_ID = exports.RECORDING_STATUS_PRIORITIES = exports.RECORDING_TYPES = exports.RECORDING_ON_SOUND_ID = exports.RECORDING_OFF_SOUND_ID = exports.PROMPT_RECORDING_NOTIFICATION_ID = exports.LIVE_STREAMING_ON_SOUND_ID = exports.LIVE_STREAMING_OFF_SOUND_ID = void 0;
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
/**
 * The identifier of the sound to be played when a live streaming session is stopped.
 *
 * @type {string}
 */
exports.LIVE_STREAMING_OFF_SOUND_ID = 'LIVE_STREAMING_OFF_SOUND';
/**
 * The identifier of the sound to be played when a live streaming session is started.
 *
 * @type {string}
 */
exports.LIVE_STREAMING_ON_SOUND_ID = 'LIVE_STREAMING_ON_SOUND';
/**
 * The identifier of the prompt to start recording notification.
 *
 * @type {string}
 */
exports.PROMPT_RECORDING_NOTIFICATION_ID = 'PROMPT_RECORDING_NOTIFICATION_ID';
/**
 * The identifier of the sound to be played when a recording session is stopped.
 *
 * @type {string}
 */
exports.RECORDING_OFF_SOUND_ID = 'RECORDING_OFF_SOUND';
/**
 * The identifier of the sound to be played when a recording session is started.
 *
 * @type {string}
 */
exports.RECORDING_ON_SOUND_ID = 'RECORDING_ON_SOUND';
/**
 * Expected supported recording types.
 *
 * @enum {string}
 */
exports.RECORDING_TYPES = {
    JITSI_REC_SERVICE: 'recording-service',
    DROPBOX: 'dropbox',
    LOCAL: 'local'
};
/**
 * An array defining the priorities of the recording (or live streaming)
 * statuses, where the index of the array is the priority itself.
 *
 * @type {Array<string>}
 */
exports.RECORDING_STATUS_PRIORITIES = [
    lib_jitsi_meet_1.JitsiRecordingConstants.status.OFF,
    lib_jitsi_meet_1.JitsiRecordingConstants.status.PENDING,
    lib_jitsi_meet_1.JitsiRecordingConstants.status.ON
];
exports.START_RECORDING_NOTIFICATION_ID = 'START_RECORDING_NOTIFICATION_ID';
exports.RECORDING_METADATA_ID = 'recording';
