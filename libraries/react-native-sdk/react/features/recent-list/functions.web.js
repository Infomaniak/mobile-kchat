"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecentListEnabled = exports.toDisplayableList = void 0;
const uri_1 = require("../base/util/uri");
/**
 * Transforms the history list to a displayable list.
 *
 * @private
 * @param {Array<Object>} recentList - The recent list form the redux store.
 * @returns {Array<Object>}
 */
function toDisplayableList(recentList) {
    return ([...recentList].reverse()
        .map(item => {
        return {
            date: item.date,
            duration: item.duration,
            time: [item.date],
            title: (0, uri_1.safeDecodeURIComponent)((0, uri_1.parseURIString)(item.conference).room),
            url: item.conference
        };
    }));
}
exports.toDisplayableList = toDisplayableList;
/**
 * Returns <tt>true</tt> if recent list is enabled and <tt>false</tt> otherwise.
 *
 * @returns {boolean} <tt>true</tt> if recent list is enabled and <tt>false</tt>
 * otherwise.
 */
function isRecentListEnabled() {
    return interfaceConfig.RECENT_LIST_ENABLED;
}
exports.isRecentListEnabled = isRecentListEnabled;
