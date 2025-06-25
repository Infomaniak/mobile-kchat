import { IStore } from '../app/types';
/**
 * Begins the UI procedure to share the URL for the current conference/room.
 *
 * @param {string} roomURL - The URL of the room to share.
 * @public
 * @returns {Function}
 */
export declare function beginShareRoom(roomURL?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Ends the UI procedure to share a specific conference/room URL.
 *
 * @param {string} roomURL - The URL of the conference/room which was shared.
 * @param {boolean} shared - True if the URL was shared successfully; false,
 * otherwise.
 * @public
 * @returns {{
 *     type: END_SHARE_ROOM,
 *     roomURL: string,
 *     shared: boolean
 * }}
 */
export declare function endShareRoom(roomURL: string, shared: boolean): {
    type: string;
    roomURL: string;
    shared: boolean;
};
/**
 * UI procedure for sharing conference room URL inside a dialog.
 *
 * @param {boolean} visible - True if share dialog is visible; false,
 * otherwise.
 * @public
 * @returns {{
 *     type: TOGGLE_SHARE_DIALOG,
 *     visible: boolean
 * }}
 */
export declare function toggleShareDialog(visible: boolean): {
    type: string;
    visible: boolean;
};
