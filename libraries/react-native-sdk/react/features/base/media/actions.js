"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gumPending = exports.toggleCameraFacingMode = exports.storeVideoTransform = exports.setVideoUnmutePermissions = exports.setVideoMuted = exports.setVideoAvailable = exports.setScreenshareMuted = exports.setCameraFacingMode = exports.setAudioUnmutePermissions = exports.setAudioMuted = exports.setAudioAvailable = void 0;
const actions_1 = require("../../av-moderation/actions");
const functions_1 = require("../../av-moderation/functions");
const functions_2 = require("../../notifications/functions");
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
/**
 * Action to adjust the availability of the local audio.
 *
 * @param {boolean} available - True if the local audio is to be marked as
 * available or false if the local audio is not available.
 * @returns {{
 *     type: SET_AUDIO_AVAILABLE,
 *     available: boolean
 * }}
 */
function setAudioAvailable(available) {
    return {
        type: actionTypes_1.SET_AUDIO_AVAILABLE,
        available
    };
}
exports.setAudioAvailable = setAudioAvailable;
/**
 * Action to set the muted state of the local audio.
 *
 * @param {boolean} muted - True if the local audio is to be muted or false if
 * the local audio is to be unmuted.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {{
 *     type: SET_AUDIO_MUTED,
 *     ensureTrack: boolean,
 *     muted: boolean
 * }}
 */
function setAudioMuted(muted, ensureTrack = false) {
    return {
        type: actionTypes_1.SET_AUDIO_MUTED,
        ensureTrack,
        muted
    };
}
exports.setAudioMuted = setAudioMuted;
/**
 * Action to disable/enable the audio mute icon.
 *
 * @param {boolean} blocked - True if the audio mute icon needs to be disabled.
 * @param {boolean|undefined} skipNotification - True if we want to skip showing the notification.
 * @returns {Function}
 */
function setAudioUnmutePermissions(blocked, skipNotification = false) {
    return {
        type: actionTypes_1.SET_AUDIO_UNMUTE_PERMISSIONS,
        blocked,
        skipNotification
    };
}
exports.setAudioUnmutePermissions = setAudioUnmutePermissions;
/**
 * Action to set the facing mode of the local camera.
 *
 * @param {CAMERA_FACING_MODE} cameraFacingMode - The camera facing mode to set.
 * @returns {{
 *     type: SET_CAMERA_FACING_MODE,
 *     cameraFacingMode: CAMERA_FACING_MODE
 * }}
 */
function setCameraFacingMode(cameraFacingMode) {
    return {
        type: actionTypes_1.SET_CAMERA_FACING_MODE,
        cameraFacingMode
    };
}
exports.setCameraFacingMode = setCameraFacingMode;
/**
 * Action to set the muted state of the local screenshare.
 *
 * @param {boolean} muted - True if the local screenshare is to be enabled or false otherwise.
 * @param {number} authority - The {@link SCREENSHARE_MUTISM_AUTHORITY} which is muting/unmuting the local screenshare.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is created if missing.
 * @returns {Function}
 */
function setScreenshareMuted(muted, authority = constants_1.SCREENSHARE_MUTISM_AUTHORITY.USER, ensureTrack = false) {
    return (dispatch, getState) => {
        const state = getState();
        // check for A/V Moderation when trying to unmute
        if (!muted && (0, functions_1.shouldShowModeratedNotification)(constants_1.MEDIA_TYPE.SCREENSHARE, state)) {
            if (!(0, functions_2.isModerationNotificationDisplayed)(constants_1.MEDIA_TYPE.SCREENSHARE, state)) {
                ensureTrack && dispatch((0, actions_1.showModeratedNotification)(constants_1.MEDIA_TYPE.SCREENSHARE));
            }
            return;
        }
        const oldValue = state['features/base/media'].screenshare.muted;
        // eslint-disable-next-line no-bitwise
        const newValue = muted ? oldValue | authority : oldValue & ~authority;
        return dispatch({
            type: actionTypes_1.SET_SCREENSHARE_MUTED,
            authority,
            ensureTrack,
            muted: newValue
        });
    };
}
exports.setScreenshareMuted = setScreenshareMuted;
/**
 * Action to adjust the availability of the local video.
 *
 * @param {boolean} available - True if the local video is to be marked as
 * available or false if the local video is not available.
 * @returns {{
 *     type: SET_VIDEO_AVAILABLE,
 *     available: boolean
 * }}
 */
function setVideoAvailable(available) {
    return {
        type: actionTypes_1.SET_VIDEO_AVAILABLE,
        available
    };
}
exports.setVideoAvailable = setVideoAvailable;
/**
 * Action to set the muted state of the local video.
 *
 * @param {boolean} muted - True if the local video is to be muted or false if
 * the local video is to be unmuted.
 * @param {number} authority - The {@link VIDEO_MUTISM_AUTHORITY} which is
 * muting/unmuting the local video.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {Function}
 */
function setVideoMuted(muted, authority = constants_1.VIDEO_MUTISM_AUTHORITY.USER, ensureTrack = false) {
    return (dispatch, getState) => {
        const state = getState();
        // check for A/V Moderation when trying to unmute
        if (!muted && (0, functions_1.shouldShowModeratedNotification)(constants_1.MEDIA_TYPE.VIDEO, state)) {
            if (!(0, functions_2.isModerationNotificationDisplayed)(constants_1.MEDIA_TYPE.VIDEO, state)) {
                ensureTrack && dispatch((0, actions_1.showModeratedNotification)(constants_1.MEDIA_TYPE.VIDEO));
            }
            return;
        }
        const oldValue = state['features/base/media'].video.muted;
        // eslint-disable-next-line no-bitwise
        const newValue = muted ? oldValue | authority : oldValue & ~authority;
        return dispatch({
            type: actionTypes_1.SET_VIDEO_MUTED,
            authority,
            ensureTrack,
            muted: newValue
        });
    };
}
exports.setVideoMuted = setVideoMuted;
/**
 * Action to disable/enable the video mute icon.
 *
 * @param {boolean} blocked - True if the video mute icon needs to be disabled.
 * @param {boolean|undefined} skipNotification - True if we want to skip showing the notification.
 * @returns {Function}
 */
function setVideoUnmutePermissions(blocked, skipNotification = false) {
    return {
        type: actionTypes_1.SET_VIDEO_UNMUTE_PERMISSIONS,
        blocked,
        skipNotification
    };
}
exports.setVideoUnmutePermissions = setVideoUnmutePermissions;
/**
 * Creates an action to store the last video {@link Transform} applied to a
 * stream.
 *
 * @param {string} streamId - The ID of the stream.
 * @param {Object} transform - The {@code Transform} to store.
 * @returns {{
 *     type: STORE_VIDEO_TRANSFORM,
 *     streamId: string,
 *     transform: Object
 * }}
 */
function storeVideoTransform(streamId, transform) {
    return {
        type: actionTypes_1.STORE_VIDEO_TRANSFORM,
        streamId,
        transform
    };
}
exports.storeVideoTransform = storeVideoTransform;
/**
 * Toggles the camera facing mode. Most commonly, for example, mobile devices
 * such as phones have a front/user-facing and a back/environment-facing
 * cameras. In contrast to setCameraFacingMode, allows the toggling to be
 * optimally and/or natively implemented without the overhead of separate reads
 * and writes of the current/effective camera facing mode.
 *
 * @returns {{
 *     type: TOGGLE_CAMERA_FACING_MODE
 * }}
 */
function toggleCameraFacingMode() {
    return {
        type: actionTypes_1.TOGGLE_CAMERA_FACING_MODE
    };
}
exports.toggleCameraFacingMode = toggleCameraFacingMode;
/**
 * Sets the GUM pending status from unmute and initial track creation operation.
 *
 * @param {Array<MediaType>} mediaTypes - An array with the media types that GUM is called with.
 * @param {IGUMPendingState} status - The GUM status.
 * @returns {{
 *     type: TOGGLE_CAMERA_FACING_MODE,
 *     mediaTypes: Array<MediaType>,
 *     status: IGUMPendingState
 * }}
 */
function gumPending(mediaTypes, status) {
    return {
        type: actionTypes_1.GUM_PENDING,
        mediaTypes,
        status
    };
}
exports.gumPending = gumPending;
