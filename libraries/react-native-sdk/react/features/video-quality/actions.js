"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVideoQuality = exports.setPreferredVideoQuality = exports.setMaxReceiverVideoQualityForVerticalFilmstrip = exports.setMaxReceiverVideoQualityForTileView = exports.setMaxReceiverVideoQualityForStageFilmstrip = exports.setMaxReceiverVideoQualityForScreenSharingFilmstrip = exports.setMaxReceiverVideoQualityForLargeVideo = void 0;
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
/**
 * Sets the max frame height that should be received for the large video.
 *
 * @param {number} maxReceiverVideoQuality - The max video frame height to
 * receive.
 * @returns {{
 *     type: SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_LARGE_VIDEO,
 *     maxReceiverVideoQuality: number
 * }}
 */
function setMaxReceiverVideoQualityForLargeVideo(maxReceiverVideoQuality) {
    return {
        type: actionTypes_1.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_LARGE_VIDEO,
        maxReceiverVideoQuality
    };
}
exports.setMaxReceiverVideoQualityForLargeVideo = setMaxReceiverVideoQualityForLargeVideo;
/**
 * Sets the max frame height that should be received for the screen sharing filmstrip particpant.
 *
 * @param {number} maxReceiverVideoQuality - The max video frame height to
 * receive.
 * @returns {{
 *     type: SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_SCREEN_SHARING_FILMSTRIP,
 *     maxReceiverVideoQuality: number
 * }}
 */
function setMaxReceiverVideoQualityForScreenSharingFilmstrip(maxReceiverVideoQuality) {
    return {
        type: actionTypes_1.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_SCREEN_SHARING_FILMSTRIP,
        maxReceiverVideoQuality
    };
}
exports.setMaxReceiverVideoQualityForScreenSharingFilmstrip = setMaxReceiverVideoQualityForScreenSharingFilmstrip;
/**
 * Sets the max frame height that should be received from remote videos for the stage filmstrip.
 *
 * @param {number} maxReceiverVideoQuality - The max video frame height to
 * receive.
 * @returns {{
 *     type: SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_STAGE_FILMSTRIP,
 *     maxReceiverVideoQuality: number
 * }}
 */
function setMaxReceiverVideoQualityForStageFilmstrip(maxReceiverVideoQuality) {
    return {
        type: actionTypes_1.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_STAGE_FILMSTRIP,
        maxReceiverVideoQuality
    };
}
exports.setMaxReceiverVideoQualityForStageFilmstrip = setMaxReceiverVideoQualityForStageFilmstrip;
/**
 * Sets the max frame height that should be received from remote videos in tile view.
 *
 * @param {number} maxReceiverVideoQuality - The max video frame height to
 * receive.
 * @returns {{
 *     type: SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_TILE_VIEW,
 *     maxReceiverVideoQuality: number
 * }}
 */
function setMaxReceiverVideoQualityForTileView(maxReceiverVideoQuality) {
    return {
        type: actionTypes_1.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_TILE_VIEW,
        maxReceiverVideoQuality
    };
}
exports.setMaxReceiverVideoQualityForTileView = setMaxReceiverVideoQualityForTileView;
/**
 * Sets the max frame height that should be received from remote videos for the vertical filmstrip.
 *
 * @param {number} maxReceiverVideoQuality - The max video frame height to
 * receive.
 * @returns {{
 *     type: SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_VERTICAL_FILMSTRIP,
 *     maxReceiverVideoQuality: number
 * }}
 */
function setMaxReceiverVideoQualityForVerticalFilmstrip(maxReceiverVideoQuality) {
    return {
        type: actionTypes_1.SET_MAX_RECEIVER_VIDEO_QUALITY_FOR_VERTICAL_FILMSTRIP,
        maxReceiverVideoQuality
    };
}
exports.setMaxReceiverVideoQualityForVerticalFilmstrip = setMaxReceiverVideoQualityForVerticalFilmstrip;
/**
 * Sets the max frame height the user prefers to send and receive from the
 * remote participants.
 *
 * @param {number} preferredVideoQuality - The max video resolution to send and
 * receive.
 * @returns {{
 *     type: SET_PREFERRED_VIDEO_QUALITY,
 *     preferredVideoQuality: number
 * }}
 */
function setPreferredVideoQuality(preferredVideoQuality) {
    return {
        type: actionTypes_1.SET_PREFERRED_VIDEO_QUALITY,
        preferredVideoQuality
    };
}
exports.setPreferredVideoQuality = setPreferredVideoQuality;
/**
 * Sets the maximum video size the local participant should send and receive from
 * remote participants.
 *
 * @param {number} frameHeight - The user preferred max frame height for send and
 * receive video.
 * @returns {void}
 */
function setVideoQuality(frameHeight) {
    return (dispatch) => {
        if (frameHeight < constants_1.VIDEO_QUALITY_LEVELS.LOW) {
            logger_1.default.error(`Invalid frame height for video quality - ${frameHeight}`);
            return;
        }
        dispatch(setPreferredVideoQuality(Math.min(frameHeight, constants_1.MAX_VIDEO_QUALITY)));
    };
}
exports.setVideoQuality = setVideoQuality;
