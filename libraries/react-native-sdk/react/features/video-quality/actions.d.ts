import { IStore } from '../app/types';
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
export declare function setMaxReceiverVideoQualityForLargeVideo(maxReceiverVideoQuality: number): {
    type: string;
    maxReceiverVideoQuality: number;
};
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
export declare function setMaxReceiverVideoQualityForScreenSharingFilmstrip(maxReceiverVideoQuality: number): {
    type: string;
    maxReceiverVideoQuality: number;
};
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
export declare function setMaxReceiverVideoQualityForStageFilmstrip(maxReceiverVideoQuality: number): {
    type: string;
    maxReceiverVideoQuality: number;
};
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
export declare function setMaxReceiverVideoQualityForTileView(maxReceiverVideoQuality: number): {
    type: string;
    maxReceiverVideoQuality: number;
};
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
export declare function setMaxReceiverVideoQualityForVerticalFilmstrip(maxReceiverVideoQuality: number): {
    type: string;
    maxReceiverVideoQuality: number;
};
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
export declare function setPreferredVideoQuality(preferredVideoQuality: number): {
    type: string;
    preferredVideoQuality: number;
};
/**
 * Sets the maximum video size the local participant should send and receive from
 * remote participants.
 *
 * @param {number} frameHeight - The user preferred max frame height for send and
 * receive video.
 * @returns {void}
 */
export declare function setVideoQuality(frameHeight: number): (dispatch: IStore['dispatch']) => void;
