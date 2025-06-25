import { IStore } from '../app/types';
/**
 * Action to select the participant to be displayed in LargeVideo based on the
 * participant id provided. If a participant id is not provided, the LargeVideo
 * participant will be selected based on a variety of factors: If there is a
 * dominant or pinned speaker, or if there are remote tracks, etc.
 *
 * @param {string} participant - The participant id of the user that needs to be
 * displayed on the large video.
 * @returns {Function}
 */
export declare function selectParticipantInLargeVideo(participant?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Updates the currently seen resolution of the video displayed on large video.
 *
 * @param {number} resolution - The current resolution (height) of the video.
 * @returns {{
 *     type: UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION,
 *     resolution: number
 * }}
 */
export declare function updateKnownLargeVideoResolution(resolution: number): {
    type: string;
    resolution: number;
};
/**
 * Sets the dimenstions of the large video in redux.
 *
 * @param {number} height - The height of the large video.
 * @param {number} width - The width of the large video.
 * @returns {{
 *     type: SET_LARGE_VIDEO_DIMENSIONS,
 *     height: number,
 *     width: number
 * }}
 */
export declare function setLargeVideoDimensions(height: number, width: number): {
    type: string;
    height: number;
    width: number;
};
