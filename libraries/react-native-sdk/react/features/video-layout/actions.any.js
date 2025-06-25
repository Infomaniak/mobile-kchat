"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTileView = exports.setTileView = exports.virtualScreenshareParticipantsUpdated = void 0;
const functions_any_1 = require("../filmstrip/functions.any");
const actionTypes_1 = require("./actionTypes");
const functions_1 = require("./functions");
/**
 * Creates a (redux) action which signals that the list of known remote virtual screen share participant ids has
 * changed.
 *
 * @param {string} participantIds - The remote virtual screen share participants.
 * @returns {{
 *     type: VIRTUAL_SCREENSHARE_REMOTE_PARTICIPANTS_UPDATED,
 *     participantIds: Array<string>
 * }}
 */
function virtualScreenshareParticipantsUpdated(participantIds) {
    return {
        type: actionTypes_1.VIRTUAL_SCREENSHARE_REMOTE_PARTICIPANTS_UPDATED,
        participantIds
    };
}
exports.virtualScreenshareParticipantsUpdated = virtualScreenshareParticipantsUpdated;
/**
 * Creates a (redux) action which signals to set the UI layout to be tiled view
 * or not.
 *
 * @param {boolean} enabled - Whether or not tile view should be shown.
 * @returns {{
 *     type: SET_TILE_VIEW,
 *     enabled: ?boolean
 * }}
 */
function setTileView(enabled) {
    return (dispatch, getState) => {
        const tileViewDisabled = (0, functions_any_1.isTileViewModeDisabled)(getState());
        !tileViewDisabled && dispatch({
            type: actionTypes_1.SET_TILE_VIEW,
            enabled
        });
    };
}
exports.setTileView = setTileView;
/**
 * Creates a (redux) action which signals either to exit tile view if currently
 * enabled or enter tile view if currently disabled.
 *
 * @returns {Function}
 */
function toggleTileView() {
    return (dispatch, getState) => {
        const tileViewActive = (0, functions_1.shouldDisplayTileView)(getState());
        dispatch(setTileView(!tileViewActive));
    };
}
exports.toggleTileView = toggleTileView;
