import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Resize the filmstrip.
 *
 * @param {number} width - Width value for filmstrip.
 *
 * @returns {{
 *  type: RESIZE_FILMSTRIP,
 *  width: number,
 * }}
 */
export declare function resizeFilmStrip(width: number): {
    type: string;
    width: number;
};
/**
 * Sets the dimensions of the tile view grid.
 *
 * @returns {Function}
 */
export declare function setTileViewDimensions(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the dimensions of the thumbnails in vertical view.
 *
 * @returns {Function}
 */
export declare function setVerticalViewDimensions(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the dimensions of the thumbnails in horizontal view.
 *
 * @returns {Function}
 */
export declare function setHorizontalViewDimensions(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the dimensions of the stage filmstrip tile view grid.
 *
 * @returns {Function}
 */
export declare function setStageFilmstripViewDimensions(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Emulates a click on the n-th video.
 *
 * @param {number} n - Number that identifies the video.
 * @returns {Function}
 */
export declare function clickOnVideo(n: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the volume for a thumbnail's audio.
 *
 * @param {string} participantId - The participant ID associated with the audio.
 * @param {string} volume - The volume level.
 * @returns {{
 *     type: SET_VOLUME,
 *     participantId: string,
 *     volume: number
 * }}
 */
export declare function setVolume(participantId: string, volume: number): {
    type: string;
    participantId: string;
    volume: number;
};
/**
 * Sets the top filmstrip's height.
 *
 * @param {number} height - The new height of the filmstrip.
 * @returns {{
 *      type: SET_FILMSTRIP_HEIGHT,
 *      height: number
 * }}
 */
export declare function setFilmstripHeight(height: number): {
    type: string;
    height: number;
};
/**
 * Sets the filmstrip's width.
 *
 * @param {number} width - The new width of the filmstrip.
 * @returns {{
 *      type: SET_FILMSTRIP_WIDTH,
 *      width: number
 * }}
 */
export declare function setFilmstripWidth(width: number): {
    type: string;
    width: number;
};
/**
 * Sets the filmstrip's height and the user preferred height.
 *
 * @param {number} height - The new height of the filmstrip.
 * @returns {{
 *      type: SET_USER_FILMSTRIP_WIDTH,
 *      height: number
 * }}
 */
export declare function setUserFilmstripHeight(height: number): {
    type: string;
    height: number;
};
/**
 * Sets the filmstrip's width and the user preferred width.
 *
 * @param {number} width - The new width of the filmstrip.
 * @returns {{
 *      type: SET_USER_FILMSTRIP_WIDTH,
 *      width: number
 * }}
 */
export declare function setUserFilmstripWidth(width: number): {
    type: string;
    width: number;
};
/**
 * Sets whether the user is resizing or not.
 *
 * @param {boolean} resizing - Whether the user is resizing or not.
 * @returns {Object}
 */
export declare function setUserIsResizing(resizing: boolean): {
    type: string;
    resizing: boolean;
};
/**
 * Add participant to the active participants list.
 *
 * @param {string} participantId - The Id of the participant to be added.
 * @param {boolean?} pinned - Whether the participant is pinned or not.
 * @returns {Object}
 */
export declare function addStageParticipant(participantId: string, pinned?: boolean): {
    type: string;
    participantId: string;
    pinned: boolean;
};
/**
 * Remove participant from the active participants list.
 *
 * @param {string} participantId - The Id of the participant to be removed.
 * @returns {Object}
 */
export declare function removeStageParticipant(participantId: string): {
    type: string;
    participantId: string;
};
/**
 * Sets the active participants list.
 *
 * @param {Array<Object>} queue - The new list.
 * @returns {Object}
 */
export declare function setStageParticipants(queue: Object[]): {
    type: string;
    queue: Object[];
};
/**
 * Toggles the pin state of the given participant.
 *
 * @param {string} participantId - The id of the participant to be toggled.
 * @returns {Object}
 */
export declare function togglePinStageParticipant(participantId: string): {
    type: string;
    participantId: string;
};
/**
 * Clears the stage participants list.
 *
 * @returns {Object}
 */
export declare function clearStageParticipants(): {
    type: string;
};
/**
 * Set the screensharing tile dimensions.
 *
 * @returns {Object}
 */
export declare function setScreensharingTileDimensions(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the visibility of the top panel.
 *
 * @param {boolean} visible - Whether it should be visible or not.
 * @returns {Object}
 */
export declare function setTopPanelVisible(visible: boolean): {
    type: string;
    visible: boolean;
};
/**
 * Sets the participant whose screenshare to be displayed on the filmstrip.
 *
 * @param {string|undefined} participantId - The id of the participant to be set.
 * @returns {Object}
 */
export declare function setScreenshareFilmstripParticipant(participantId?: string): {
    type: string;
    participantId: string | undefined;
};
