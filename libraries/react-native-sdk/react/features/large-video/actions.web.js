"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSeeWhatIsBeingShared = exports.resizeLargeVideo = exports.captureLargeVideoScreenshot = void 0;
// @ts-expect-error
const VideoLayout_1 = __importDefault(require("../../../modules/UI/videolayout/VideoLayout"));
const functions_1 = require("../base/participants/functions");
const functions_web_1 = require("../base/tracks/functions.web");
const actionTypes_1 = require("./actionTypes");
__exportStar(require("./actions.any"), exports);
/**
* Captures a screenshot of the video displayed on the large video.
*
* @returns {Function}
*/
function captureLargeVideoScreenshot() {
    return (dispatch, getState) => {
        const state = getState();
        const largeVideo = state['features/large-video'];
        const promise = Promise.resolve();
        if (!largeVideo?.participantId) {
            return promise;
        }
        const participant = (0, functions_1.getParticipantById)(state, largeVideo.participantId);
        const participantTrack = (0, functions_web_1.getVideoTrackByParticipant)(state, participant);
        // Participants that join the call video muted do not have a jitsiTrack attached.
        if (!participantTrack?.jitsiTrack) {
            return promise;
        }
        const videoStream = participantTrack.jitsiTrack.getOriginalStream();
        if (!videoStream) {
            return promise;
        }
        // Get the video element for the large video, cast HTMLElement to HTMLVideoElement to make flow happy.
        /* eslint-disable-next-line no-extra-parens*/
        const videoElement = document.getElementById('largeVideo');
        if (!videoElement) {
            return promise;
        }
        // Create a HTML canvas and draw video on to the canvas.
        const [track] = videoStream.getVideoTracks();
        const { height, width } = track.getSettings() ?? track.getConstraints();
        const canvasElement = document.createElement('canvas');
        const ctx = canvasElement.getContext('2d');
        canvasElement.style.display = 'none';
        canvasElement.height = parseInt(height, 10);
        canvasElement.width = parseInt(width, 10);
        ctx?.drawImage(videoElement, 0, 0);
        const dataURL = canvasElement.toDataURL('image/png', 1.0);
        // Cleanup.
        ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasElement.remove();
        return Promise.resolve(dataURL);
    };
}
exports.captureLargeVideoScreenshot = captureLargeVideoScreenshot;
/**
 * Resizes the large video container based on the dimensions provided.
 *
 * @param {number} width - Width that needs to be applied on the large video container.
 * @param {number} height - Height that needs to be applied on the large video container.
 * @returns {Function}
 */
function resizeLargeVideo(width, height) {
    return (dispatch, getState) => {
        const state = getState();
        const largeVideo = state['features/large-video'];
        if (largeVideo) {
            const largeVideoContainer = VideoLayout_1.default.getLargeVideo();
            largeVideoContainer.updateContainerSize(width, height);
            largeVideoContainer.resize();
        }
    };
}
exports.resizeLargeVideo = resizeLargeVideo;
/**
 * Updates the value used to display what is being shared.
 *
 * @param {boolean} seeWhatIsBeingShared - The current value.
 * @returns {{
 *     type: SET_SEE_WHAT_IS_BEING_SHARED,
 *     seeWhatIsBeingShared: boolean
 * }}
 */
function setSeeWhatIsBeingShared(seeWhatIsBeingShared) {
    return {
        type: actionTypes_1.SET_SEE_WHAT_IS_BEING_SHARED,
        seeWhatIsBeingShared
    };
}
exports.setSeeWhatIsBeingShared = setSeeWhatIsBeingShared;
