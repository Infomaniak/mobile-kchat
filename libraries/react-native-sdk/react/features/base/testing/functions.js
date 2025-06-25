"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRemoteVideoReceived = exports.isLargeVideoReceived = exports.getRemoteVideoType = exports.isTestModeEnabled = void 0;
const functions_1 = require("../../connection-indicator/functions");
const constants_1 = require("../media/constants");
const functions_2 = require("../participants/functions");
const functions_3 = require("../tracks/functions");
/**
 * Indicates whether the test mode is enabled. When it's enabled
 * {@link TestHint} and other components from the testing package will be
 * rendered in various places across the app to help with automatic testing.
 *
 * @param {IReduxState} state - The redux store state.
 * @returns {boolean}
 */
function isTestModeEnabled(state) {
    const testingConfig = state['features/base/config'].testing;
    return Boolean(testingConfig?.testMode);
}
exports.isTestModeEnabled = isTestModeEnabled;
/**
 * Returns the video type of the remote participant's video.
 *
 * @param {IStore} store - The redux store.
 * @param {string} id - The participant ID for the remote video.
 * @returns {VIDEO_TYPE}
 */
function getRemoteVideoType({ getState }, id) {
    const state = getState();
    const participant = (0, functions_2.getParticipantById)(state, id);
    if ((0, functions_2.isScreenShareParticipant)(participant)) {
        return constants_1.VIDEO_TYPE.DESKTOP;
    }
    return (0, functions_3.getTrackByMediaTypeAndParticipant)(state['features/base/tracks'], constants_1.MEDIA_TYPE.VIDEO, id)?.videoType;
}
exports.getRemoteVideoType = getRemoteVideoType;
/**
 * Returns whether the last media event received for large video indicates that the video is playing, if not muted.
 *
 * @param {IStore} store - The redux store.
 * @returns {boolean}
 */
function isLargeVideoReceived({ getState }) {
    const state = getState();
    const largeVideoParticipantId = state['features/large-video'].participantId ?? '';
    const largeVideoParticipant = (0, functions_2.getParticipantById)(state, largeVideoParticipantId ?? '');
    const videoTrack = (0, functions_3.getVideoTrackByParticipant)(state, largeVideoParticipant);
    return Boolean(videoTrack && !videoTrack.muted && (0, functions_1.isTrackStreamingStatusActive)(videoTrack));
}
exports.isLargeVideoReceived = isLargeVideoReceived;
/**
 * Returns whether the last media event received for a remote video indicates that the video is playing, if not muted.
 *
 * @param {IStore} store - The redux store.
 * @param {string} id - The participant ID for the remote video.
 * @returns {boolean}
 */
function isRemoteVideoReceived({ getState }, id) {
    const state = getState();
    const participant = (0, functions_2.getParticipantById)(state, id);
    const videoTrack = (0, functions_3.getVideoTrackByParticipant)(state, participant);
    return Boolean(videoTrack && !videoTrack.muted && (0, functions_1.isTrackStreamingStatusActive)(videoTrack));
}
exports.isRemoteVideoReceived = isRemoteVideoReceived;
