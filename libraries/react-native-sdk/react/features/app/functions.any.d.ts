import { IStateful } from '../base/app/types';
/**
 * Adds the current track state to the passed URL.
 *
 * @param {URL} url - The URL that will be modified.
 * @param {Function|Object} stateful - The redux store or {@code getState} function.
 * @returns {URL} - Returns the modified URL.
 */
export declare function addTrackStateToURL(url: string, stateful: IStateful): URL;
