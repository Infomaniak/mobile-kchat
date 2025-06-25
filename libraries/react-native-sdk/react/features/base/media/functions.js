"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoundFileSrc = exports.shouldRenderVideoTrack = exports.isVideoMutedByUser = exports.isVideoMuted = exports.getStartWithVideoMuted = exports.getStartWithAudioMuted = exports.isVideoMutedByAudioOnly = exports.isAudioMuted = void 0;
const functions_1 = require("../redux/functions");
const functions_2 = require("../settings/functions");
const constants_1 = require("./constants");
// XXX The configurations/preferences/settings startWithAudioMuted and startWithVideoMuted were introduced for
// conferences/meetings. So it makes sense for these to not be considered outside of conferences/meetings
// (e.g. WelcomePage). Later on, though, we introduced a "Video <-> Voice" toggle on the WelcomePage which utilizes
// startAudioOnly outside of conferences/meetings so that particular configuration/preference/setting employs slightly
// exclusive logic.
const START_WITH_AUDIO_VIDEO_MUTED_SOURCES = {
    // We have startWithAudioMuted and startWithVideoMuted here:
    config: true,
    settings: true,
    // XXX We've already overwritten base/config with urlParams. However,
    // settings are more important than the server-side config.
    // Consequently, we need to read from urlParams anyway:
    urlParams: true,
    // We don't have startWithAudioMuted and startWithVideoMuted here:
    jwt: false
};
/**
 * Determines whether audio is currently muted.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean}
 */
function isAudioMuted(stateful) {
    return Boolean((0, functions_1.toState)(stateful)['features/base/media'].audio.muted);
}
exports.isAudioMuted = isAudioMuted;
/**
 * Determines whether video is currently muted by the audio-only authority.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean}
 */
function isVideoMutedByAudioOnly(stateful) {
    return (_isVideoMutedByAuthority(stateful, constants_1.VIDEO_MUTISM_AUTHORITY.AUDIO_ONLY));
}
exports.isVideoMutedByAudioOnly = isVideoMutedByAudioOnly;
/**
 * Determines whether video is currently muted by a specific
 * {@code VIDEO_MUTISM_AUTHORITY}.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @param {number} videoMutismAuthority - The {@code VIDEO_MUTISM_AUTHORITY}
 * which is to be checked whether it has muted video.
 * @returns {boolean} If video is currently muted by the specified
 * {@code videoMutismAuthority}, then {@code true}; otherwise, {@code false}.
 */
function _isVideoMutedByAuthority(stateful, videoMutismAuthority) {
    const { muted } = (0, functions_1.toState)(stateful)['features/base/media'].video;
    // eslint-disable-next-line no-bitwise
    return Boolean(muted & videoMutismAuthority);
}
/**
 * Computes the startWithAudioMuted by retrieving its values from config, URL and settings.
 *
 * @param {Object|Function} stateful - The redux state object or {@code getState} function.
 * @returns {boolean} - The computed startWithAudioMuted value that will be used.
 */
function getStartWithAudioMuted(stateful) {
    return Boolean((0, functions_2.getPropertyValue)(stateful, 'startWithAudioMuted', START_WITH_AUDIO_VIDEO_MUTED_SOURCES))
        || Boolean((0, functions_2.getPropertyValue)(stateful, 'startSilent', START_WITH_AUDIO_VIDEO_MUTED_SOURCES));
}
exports.getStartWithAudioMuted = getStartWithAudioMuted;
/**
 * Computes the startWithVideoMuted by retrieving its values from config, URL and settings.
 *
 * @param {Object|Function} stateful - The redux state object or {@code getState} function.
 * @returns {boolean} - The computed startWithVideoMuted value that will be used.
 */
function getStartWithVideoMuted(stateful) {
    return Boolean((0, functions_2.getPropertyValue)(stateful, 'startWithVideoMuted', START_WITH_AUDIO_VIDEO_MUTED_SOURCES));
}
exports.getStartWithVideoMuted = getStartWithVideoMuted;
/**
 * Determines whether video is currently muted.
 *
 * @param {Function|Object} stateful - The redux store, state, or {@code getState} function.
 * @returns {boolean}
 */
function isVideoMuted(stateful) {
    return Boolean((0, functions_1.toState)(stateful)['features/base/media'].video.muted);
}
exports.isVideoMuted = isVideoMuted;
/**
 * Determines whether video is currently muted by the user authority.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean}
 */
function isVideoMutedByUser(stateful) {
    return _isVideoMutedByAuthority(stateful, constants_1.VIDEO_MUTISM_AUTHORITY.USER);
}
exports.isVideoMutedByUser = isVideoMutedByUser;
/**
 * Determines whether a specific videoTrack should be rendered.
 *
 * @param {Track} videoTrack - The video track which is to be rendered.
 * @param {boolean} waitForVideoStarted - True if the specified videoTrack
 * should be rendered only after its associated video has started;
 * otherwise, false.
 * @returns {boolean} True if the specified videoTrack should be rendered;
 * otherwise, false.
 */
function shouldRenderVideoTrack(videoTrack, waitForVideoStarted) {
    return (videoTrack
        && !videoTrack.muted
        && (!waitForVideoStarted || videoTrack.videoStarted));
}
exports.shouldRenderVideoTrack = shouldRenderVideoTrack;
/**
 * Computes the localized sound file source.
 *
 * @param {string} file - The default file source.
 * @param {string} language - The language to use for localization.
 * @returns {string}
 */
const getSoundFileSrc = (file, language) => {
    if (!constants_1.AudioSupportedLanguage[language]
        || language === constants_1.AudioSupportedLanguage.en) {
        return file;
    }
    const fileTokens = file.split('.');
    return `${fileTokens[0]}_${language}.${fileTokens[1]}`;
};
exports.getSoundFileSrc = getSoundFileSrc;
