"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVisibleRemoteParticipants = exports.setRemoteParticipants = exports.setFilmstripVisible = exports.setFilmstripEnabled = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sets whether the filmstrip is enabled.
 *
 * @param {boolean} enabled - Whether the filmstrip is enabled.
 * @returns {{
 *     type: SET_FILMSTRIP_ENABLED,
 *     enabled: boolean
 * }}
 */
function setFilmstripEnabled(enabled) {
    return {
        type: actionTypes_1.SET_FILMSTRIP_ENABLED,
        enabled
    };
}
exports.setFilmstripEnabled = setFilmstripEnabled;
/**
 * Sets whether the filmstrip is visible.
 *
 * @param {boolean} visible - Whether the filmstrip is visible.
 * @returns {{
 *     type: SET_FILMSTRIP_VISIBLE,
 *     visible: boolean
 * }}
 */
function setFilmstripVisible(visible) {
    return {
        type: actionTypes_1.SET_FILMSTRIP_VISIBLE,
        visible
    };
}
exports.setFilmstripVisible = setFilmstripVisible;
/**
 * Sets the list of the reordered remote participants based on which the visible participants in the filmstrip will be
 * determined.
 *
 * @param {Array<string>} participants - The list of the remote participant endpoint IDs.
 * @returns {{
        type: SET_REMOTE_PARTICIPANTS,
        participants: Array<string>
    }}
 */
function setRemoteParticipants(participants) {
    return {
        type: actionTypes_1.SET_REMOTE_PARTICIPANTS,
        participants
    };
}
exports.setRemoteParticipants = setRemoteParticipants;
/**
 * Sets the list of the visible participants in the filmstrip by storing the start and end index from the remote
 * participants array.
 *
 * @param {number} startIndex - The start index from the remote participants array.
 * @param {number} endIndex - The end index from the remote participants array.
 * @returns {{
 *      type: SET_VISIBLE_REMOTE_PARTICIPANTS,
 *      startIndex: number,
 *      endIndex: number
 * }}
 */
function setVisibleRemoteParticipants(startIndex, endIndex) {
    return {
        type: actionTypes_1.SET_VISIBLE_REMOTE_PARTICIPANTS,
        startIndex,
        endIndex
    };
}
exports.setVisibleRemoteParticipants = setVisibleRemoteParticipants;
