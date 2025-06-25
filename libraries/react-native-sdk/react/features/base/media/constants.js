"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIDEO_TYPE = exports.VIDEO_MUTISM_AUTHORITY = exports.AudioSupportedLanguage = exports.SCREENSHARE_MUTISM_AUTHORITY = exports.MEDIA_TYPE = exports.CAMERA_FACING_MODE = void 0;
/**
 * The set of facing modes for camera.
 *
 * @enum {string}
 */
exports.CAMERA_FACING_MODE = {
    ENVIRONMENT: 'environment',
    USER: 'user'
};
/**
 * The set of media types.
 *
 * @enum {string}
 */
exports.MEDIA_TYPE = {
    AUDIO: 'audio',
    SCREENSHARE: 'screenshare',
    VIDEO: 'video'
};
/* eslint-disable no-bitwise */
/**
 * The types of authorities which may mute/unmute the local screenshare.
 *
 * @enum {number}
 */
exports.SCREENSHARE_MUTISM_AUTHORITY = {
    AUDIO_ONLY: 1 << 0,
    USER: 1 << 2
};
/**
 * The languages supported for audio files.
 */
var AudioSupportedLanguage;
(function (AudioSupportedLanguage) {
    AudioSupportedLanguage["en"] = "en";
    AudioSupportedLanguage["fr"] = "fr";
    AudioSupportedLanguage["frCA"] = "frCA";
})(AudioSupportedLanguage = exports.AudioSupportedLanguage || (exports.AudioSupportedLanguage = {}));
/**
 * The types of authorities which may mute/unmute the local video.
 *
 * @enum {number}
 */
exports.VIDEO_MUTISM_AUTHORITY = {
    AUDIO_ONLY: 1 << 0,
    BACKGROUND: 1 << 1,
    USER: 1 << 2,
    CAR_MODE: 1 << 3,
    SCREEN_SHARE: 1 << 4
};
/* eslint-enable no-bitwise */
/**
 * The types of video tracks.
 *
 * @enum {string}
 */
exports.VIDEO_TYPE = {
    CAMERA: 'camera',
    DESKTOP: 'desktop'
};
