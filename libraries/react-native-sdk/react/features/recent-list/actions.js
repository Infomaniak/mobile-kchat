"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._updateConferenceDuration = exports._storeCurrentConference = exports.deleteRecentListEntry = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Deletes a recent list entry based on url and date.
 *
 * @param {Object} entryId - An object constructed of the url and the date of
 * the entry for easy identification.
 * @returns {{
 *     type: DELETE_RECENT_LIST_ENTRY,
 *     entryId: Object
 * }}
 */
function deleteRecentListEntry(entryId) {
    return {
        type: actionTypes_1.DELETE_RECENT_LIST_ENTRY,
        entryId
    };
}
exports.deleteRecentListEntry = deleteRecentListEntry;
/**
 * Action to initiate a new addition to the list.
 *
 * @param {Object} locationURL - The current location URL.
 * @protected
 * @returns {{
 *     type: _STORE_CURRENT_CONFERENCE,
 *     locationURL: Object
 * }}
 */
function _storeCurrentConference(locationURL) {
    return {
        type: actionTypes_1._STORE_CURRENT_CONFERENCE,
        locationURL
    };
}
exports._storeCurrentConference = _storeCurrentConference;
/**
 * Action to initiate the update of the duration of the last conference.
 *
 * @param {Object} locationURL - The current location URL.
 * @protected
 * @returns {{
 *     type: _UPDATE_CONFERENCE_DURATION,
 *     locationURL: Object
 * }}
 */
function _updateConferenceDuration(locationURL) {
    return {
        type: actionTypes_1._UPDATE_CONFERENCE_DURATION,
        locationURL
    };
}
exports._updateConferenceDuration = _updateConferenceDuration;
