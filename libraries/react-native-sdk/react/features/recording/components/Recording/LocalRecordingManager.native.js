"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalRecordingManager = {
    selfRecording: {
        on: false,
        withVideo: false
    },
    /**
     * Adds audio track to the recording stream.
     *
     * @param {any} track - Track to be added,.
     * @returns {void}
     */
    addAudioTrackToLocalRecording() { },
    /**
     * Stops local recording.
     *
     * @returns {void}
     * */
    stopLocalRecording() { },
    /**
     * Starts a local recording.
     *
     * @param {IStore} store - The Redux store.
     * @returns {void}
     */
    async startLocalRecording() { },
    /**
     * Whether or not we're currently recording locally.
     *
     * @returns {boolean}
     */
    isRecordingLocally() {
        return false;
    }
};
exports.default = LocalRecordingManager;
