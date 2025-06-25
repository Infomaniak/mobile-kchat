"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSharedVideo = exports.playSharedVideo = exports.stopSharedVideo = exports.showSharedVideoDialog = exports.setSharedVideoStatus = exports.resetSharedVideoStatus = void 0;
const functions_1 = require("../base/conference/functions");
const actions_1 = require("../base/dialog/actions");
const functions_2 = require("../base/participants/functions");
const actionTypes_1 = require("./actionTypes");
const components_1 = require("./components");
/**
 * Resets the status of the shared video.
 *
 * @returns {{
 *     type: SET_SHARED_VIDEO_STATUS,
 * }}
 */
function resetSharedVideoStatus() {
    return {
        type: actionTypes_1.RESET_SHARED_VIDEO_STATUS
    };
}
exports.resetSharedVideoStatus = resetSharedVideoStatus;
/**
 * Updates the current known status of the shared video.
 *
 * @param {Object} options - The options.
 * @param {boolean} options.muted - Is video muted.
 * @param {boolean} options.ownerId - Participant ID of the owner.
 * @param {boolean} options.status - Sharing status.
 * @param {boolean} options.time - Playback timestamp.
 * @param {boolean} options.videoUrl - URL of the shared video.
 *
 * @returns {{
 *     type: SET_SHARED_VIDEO_STATUS,
 *     muted: boolean,
 *     ownerId: string,
 *     status: string,
 *     time: number,
 *     videoUrl: string,
 * }}
 */
function setSharedVideoStatus({ videoUrl, status, time, ownerId, muted }) {
    return {
        type: actionTypes_1.SET_SHARED_VIDEO_STATUS,
        ownerId,
        status,
        time,
        videoUrl,
        muted
    };
}
exports.setSharedVideoStatus = setSharedVideoStatus;
/**
 * Displays the dialog for entering the video link.
 *
 * @param {Function} onPostSubmit - The function to be invoked when a valid link is entered.
 * @returns {Function}
 */
function showSharedVideoDialog(onPostSubmit) {
    return (0, actions_1.openDialog)(components_1.SharedVideoDialog, { onPostSubmit });
}
exports.showSharedVideoDialog = showSharedVideoDialog;
/**
 *
 * Stops playing a shared video.
 *
 * @returns {Function}
 */
function stopSharedVideo() {
    return (dispatch, getState) => {
        const state = getState();
        const { ownerId } = state['features/shared-video'];
        const localParticipant = (0, functions_2.getLocalParticipant)(state);
        if (ownerId === localParticipant?.id) {
            dispatch(resetSharedVideoStatus());
        }
    };
}
exports.stopSharedVideo = stopSharedVideo;
/**
 *
 * Plays a shared video.
 *
 * @param {string} videoUrl - The video url to be played.
 *
 * @returns {Function}
 */
function playSharedVideo(videoUrl) {
    return (dispatch, getState) => {
        const conference = (0, functions_1.getCurrentConference)(getState());
        if (conference) {
            const localParticipant = (0, functions_2.getLocalParticipant)(getState());
            dispatch(setSharedVideoStatus({
                videoUrl,
                status: 'start',
                time: 0,
                ownerId: localParticipant?.id
            }));
        }
    };
}
exports.playSharedVideo = playSharedVideo;
/**
 *
 * Stops playing a shared video.
 *
 * @returns {Function}
 */
function toggleSharedVideo() {
    return (dispatch, getState) => {
        const state = getState();
        const { status = '' } = state['features/shared-video'];
        if (['playing', 'start', 'pause'].includes(status)) {
            dispatch(stopSharedVideo());
        }
        else {
            dispatch(showSharedVideoDialog((id) => dispatch(playSharedVideo(id))));
        }
    };
}
exports.toggleSharedVideo = toggleSharedVideo;
