import { IStore } from '../app/types';
export * from './actions.any';
/**
* Captures a screenshot of the video displayed on the large video.
*
* @returns {Function}
*/
export declare function captureLargeVideoScreenshot(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void> | Promise<string>;
/**
 * Resizes the large video container based on the dimensions provided.
 *
 * @param {number} width - Width that needs to be applied on the large video container.
 * @param {number} height - Height that needs to be applied on the large video container.
 * @returns {Function}
 */
export declare function resizeLargeVideo(width: number, height: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Updates the value used to display what is being shared.
 *
 * @param {boolean} seeWhatIsBeingShared - The current value.
 * @returns {{
 *     type: SET_SEE_WHAT_IS_BEING_SHARED,
 *     seeWhatIsBeingShared: boolean
 * }}
 */
export declare function setSeeWhatIsBeingShared(seeWhatIsBeingShared: boolean): {
    type: string;
    seeWhatIsBeingShared: boolean;
};
