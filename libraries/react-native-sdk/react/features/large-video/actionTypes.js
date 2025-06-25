"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_SEE_WHAT_IS_BEING_SHARED = exports.UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION = exports.SET_LARGE_VIDEO_DIMENSIONS = exports.SELECT_LARGE_VIDEO_PARTICIPANT = void 0;
/**
 * Action to select the participant to be displayed in LargeVideo.
 *
 * {
 *     type: SELECT_LARGE_VIDEO_PARTICIPANT,
 *     participantId: (string|undefined)
 * }
 */
exports.SELECT_LARGE_VIDEO_PARTICIPANT = 'SELECT_LARGE_VIDEO_PARTICIPANT';
/**
 * Action to set the dimensions of the large video.
 *
 * {
 *     type: SET_LARGE_VIDEO_DIMENSIONS,
 *     height: number,
 *     width: number
 * }
 */
exports.SET_LARGE_VIDEO_DIMENSIONS = 'SET_LARGE_VIDEO_DIMENSIONS';
/**
 * Action to update the redux store with the current resolution of large video.
 *
 * @returns {{
 *     type: UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION,
 *     resolution: number
 * }}
 */
exports.UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION = 'UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION';
/**
 * Action to set the redux store of the current show me what I'm sharing flag value.
 *
 * @returns {{
 *     type: SET_SEE_WHAT_IS_BEING_SHARED,
 *     seeWhatIsBeingShared: boolean
 * }}
 */
exports.SET_SEE_WHAT_IS_BEING_SHARED = 'SET_SEE_WHAT_IS_BEING_SHARED';
