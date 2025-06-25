/// <reference types="react" />
import { IStore } from '../app/types';
/**
 * Resets the status of the shared video.
 *
 * @returns {{
 *     type: SET_SHARED_VIDEO_STATUS,
 * }}
 */
export declare function resetSharedVideoStatus(): {
    type: string;
};
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
export declare function setSharedVideoStatus({ videoUrl, status, time, ownerId, muted }: {
    muted?: boolean;
    ownerId?: string;
    status: string;
    time: number;
    videoUrl: string;
}): {
    type: string;
    ownerId: string | undefined;
    status: string;
    time: number;
    videoUrl: string;
    muted: boolean | undefined;
};
/**
 * Displays the dialog for entering the video link.
 *
 * @param {Function} onPostSubmit - The function to be invoked when a valid link is entered.
 * @returns {Function}
 */
export declare function showSharedVideoDialog(onPostSubmit: Function): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 *
 * Stops playing a shared video.
 *
 * @returns {Function}
 */
export declare function stopSharedVideo(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 *
 * Plays a shared video.
 *
 * @param {string} videoUrl - The video url to be played.
 *
 * @returns {Function}
 */
export declare function playSharedVideo(videoUrl: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 *
 * Stops playing a shared video.
 *
 * @returns {Function}
 */
export declare function toggleSharedVideo(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
