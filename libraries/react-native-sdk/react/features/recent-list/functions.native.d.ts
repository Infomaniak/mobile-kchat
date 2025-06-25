import { IRecentItem } from './types';
/**
 * Transforms the history list to a displayable list
 * with sections.
 *
 * @private
 * @param {Array<Object>} recentList - The recent list form the redux store.
 * @param {Function} t - The translate function.
 * @param {string} defaultServerURL - The default server URL.
 * @returns {Array<Object>}
 */
export declare function toDisplayableList(recentList: IRecentItem[], t: Function, defaultServerURL: string): {
    data: any[];
    key: string | number;
    title: string;
}[];
/**
 * Returns <tt>true</tt> if recent list is enabled and <tt>false</tt> otherwise.
 *
 * @returns {boolean} <tt>true</tt> if recent list is enabled and <tt>false</tt>
 * otherwise.
 */
export declare function isRecentListEnabled(): boolean;
