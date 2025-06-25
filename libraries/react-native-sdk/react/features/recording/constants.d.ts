/**
 * The identifier of the sound to be played when a live streaming session is stopped.
 *
 * @type {string}
 */
export declare const LIVE_STREAMING_OFF_SOUND_ID = "LIVE_STREAMING_OFF_SOUND";
/**
 * The identifier of the sound to be played when a live streaming session is started.
 *
 * @type {string}
 */
export declare const LIVE_STREAMING_ON_SOUND_ID = "LIVE_STREAMING_ON_SOUND";
/**
 * The identifier of the prompt to start recording notification.
 *
 * @type {string}
 */
export declare const PROMPT_RECORDING_NOTIFICATION_ID = "PROMPT_RECORDING_NOTIFICATION_ID";
/**
 * The identifier of the sound to be played when a recording session is stopped.
 *
 * @type {string}
 */
export declare const RECORDING_OFF_SOUND_ID = "RECORDING_OFF_SOUND";
/**
 * The identifier of the sound to be played when a recording session is started.
 *
 * @type {string}
 */
export declare const RECORDING_ON_SOUND_ID = "RECORDING_ON_SOUND";
/**
 * Expected supported recording types.
 *
 * @enum {string}
 */
export declare const RECORDING_TYPES: {
    JITSI_REC_SERVICE: string;
    DROPBOX: string;
    LOCAL: string;
};
/**
 * An array defining the priorities of the recording (or live streaming)
 * statuses, where the index of the array is the priority itself.
 *
 * @type {Array<string>}
 */
export declare const RECORDING_STATUS_PRIORITIES: any[];
export declare const START_RECORDING_NOTIFICATION_ID = "START_RECORDING_NOTIFICATION_ID";
export declare const RECORDING_METADATA_ID = "recording";
