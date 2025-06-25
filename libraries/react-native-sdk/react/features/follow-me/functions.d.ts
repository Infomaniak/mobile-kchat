import { IStateful } from '../base/app/types';
/**
 * Returns true if follow me is active and false otherwise.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @returns {boolean} - True if follow me is active and false otherwise.
 */
export declare function isFollowMeActive(stateful: IStateful): boolean;
