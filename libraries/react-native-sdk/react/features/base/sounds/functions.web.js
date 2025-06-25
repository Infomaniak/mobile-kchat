"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNewAudioOutputDevice = exports.getSoundsPath = void 0;
/**
 * Returns the location of the sounds. On Web it's the relative path to
 * the sounds folder placed in the source root.
 *
 * @returns {string}
 */
function getSoundsPath() {
    return 'sounds';
}
exports.getSoundsPath = getSoundsPath;
/**
 * Set new audio output device on the global sound elements.
 *
 * @param {string } deviceId - The new output deviceId.
 * @returns {Function}
 */
function setNewAudioOutputDevice(deviceId) {
    return function (_dispatch, getState) {
        const sounds = getState()['features/base/sounds'];
        for (const [, sound] of sounds) {
            sound.audioElement?.setSinkId?.(deviceId);
        }
    };
}
exports.setNewAudioOutputDevice = setNewAudioOutputDevice;
