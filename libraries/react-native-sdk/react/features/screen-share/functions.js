"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isScreenVideoShared = exports.isScreenMediaShared = exports.isScreenAudioSupported = exports.isScreenAudioShared = exports.isAudioOnlySharing = void 0;
const environment_1 = require("../base/environment/environment");
const utils_1 = require("../base/environment/utils");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_1 = require("../base/tracks/functions");
/**
 * Is the current screen sharing session audio only.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
function isAudioOnlySharing(state) {
    return isScreenAudioShared(state) && !isScreenVideoShared(state);
}
exports.isAudioOnlySharing = isAudioOnlySharing;
/**
 * State of audio sharing.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
function isScreenAudioShared(state) {
    return state['features/screen-share'].isSharingAudio;
}
exports.isScreenAudioShared = isScreenAudioShared;
/**
 * Returns the visibility of the audio only screen share button. Currently only chrome browser and electron on
 * windows supports this functionality.
 *
 * @returns {boolean}
 */
function isScreenAudioSupported() {
    return (!(0, utils_1.isMobileBrowser)() && lib_jitsi_meet_1.browser.isChromiumBased()) || (lib_jitsi_meet_1.browser.isElectron() && (0, environment_1.isWindows)());
}
exports.isScreenAudioSupported = isScreenAudioSupported;
/**
 * Is any screen media currently being shared, audio or video.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
function isScreenMediaShared(state) {
    return isScreenAudioShared(state) || isScreenVideoShared(state);
}
exports.isScreenMediaShared = isScreenMediaShared;
/**
 * Is screen sharing currently active.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
function isScreenVideoShared(state) {
    const tracks = state['features/base/tracks'];
    const localScreenshare = (0, functions_1.getLocalDesktopTrack)(tracks);
    return localScreenshare?.jitsiTrack && !localScreenshare.jitsiTrack.isMuted();
}
exports.isScreenVideoShared = isScreenVideoShared;
