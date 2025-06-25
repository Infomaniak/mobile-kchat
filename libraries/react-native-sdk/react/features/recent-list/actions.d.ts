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
export declare function deleteRecentListEntry(entryId: Object): {
    type: string;
    entryId: Object;
};
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
export declare function _storeCurrentConference(locationURL: Object): {
    type: string;
    locationURL: Object;
};
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
export declare function _updateConferenceDuration(locationURL: Object): {
    type: string;
    locationURL: Object;
};
