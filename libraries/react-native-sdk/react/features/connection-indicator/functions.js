"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTrackStreamingStatusInterrupted = exports.isTrackStreamingStatusInactive = exports.isTrackStreamingStatusActive = void 0;
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
/**
 * Checks if the passed track's streaming status is active.
 *
 * @param {Object} videoTrack - Track reference.
 * @returns {boolean} - Is streaming status active.
 */
function isTrackStreamingStatusActive(videoTrack) {
    const streamingStatus = videoTrack?.streamingStatus;
    return streamingStatus === lib_jitsi_meet_1.JitsiTrackStreamingStatus.ACTIVE;
}
exports.isTrackStreamingStatusActive = isTrackStreamingStatusActive;
/**
 * Checks if the passed track's streaming status is inactive.
 *
 * @param {Object} videoTrack - Track reference.
 * @returns {boolean} - Is streaming status inactive.
 */
function isTrackStreamingStatusInactive(videoTrack) {
    const streamingStatus = videoTrack?.streamingStatus;
    return streamingStatus === lib_jitsi_meet_1.JitsiTrackStreamingStatus.INACTIVE;
}
exports.isTrackStreamingStatusInactive = isTrackStreamingStatusInactive;
/**
 * Checks if the passed track's streaming status is interrupted.
 *
 * @param {Object} videoTrack - Track reference.
 * @returns {boolean} - Is streaming status interrupted.
 */
function isTrackStreamingStatusInterrupted(videoTrack) {
    const streamingStatus = videoTrack?.streamingStatus;
    return streamingStatus === lib_jitsi_meet_1.JitsiTrackStreamingStatus.INTERRUPTED;
}
exports.isTrackStreamingStatusInterrupted = isTrackStreamingStatusInterrupted;
