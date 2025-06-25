/**
 * Transforms the history list to a displayable list.
 *
 * @private
 * @param {Array<Object>} recentList - The recent list form the redux store.
 * @returns {Array<Object>}
 */
export declare function toDisplayableList(recentList: Array<{
    conference: string;
    date: Date;
    duration: number;
}>): {
    date: Date;
    duration: number;
    time: Date[];
    title: string;
    url: string;
}[];
/**
 * Returns <tt>true</tt> if recent list is enabled and <tt>false</tt> otherwise.
 *
 * @returns {boolean} <tt>true</tt> if recent list is enabled and <tt>false</tt>
 * otherwise.
 */
export declare function isRecentListEnabled(): any;
