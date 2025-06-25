"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleShareDialog = exports.endShareRoom = exports.beginShareRoom = void 0;
const functions_1 = require("../base/connection/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Begins the UI procedure to share the URL for the current conference/room.
 *
 * @param {string} roomURL - The URL of the room to share.
 * @public
 * @returns {Function}
 */
function beginShareRoom(roomURL) {
    return (dispatch, getState) => {
        if (!roomURL) {
            // eslint-disable-next-line no-param-reassign
            roomURL = (0, functions_1.getInviteURL)(getState);
        }
        dispatch({
            type: actionTypes_1.BEGIN_SHARE_ROOM,
            roomURL
        });
    };
}
exports.beginShareRoom = beginShareRoom;
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
function endShareRoom(roomURL, shared) {
    return {
        type: actionTypes_1.END_SHARE_ROOM,
        roomURL,
        shared
    };
}
exports.endShareRoom = endShareRoom;
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
function toggleShareDialog(visible) {
    return {
        type: actionTypes_1.TOGGLE_SHARE_DIALOG,
        visible
    };
}
exports.toggleShareDialog = toggleShareDialog;
