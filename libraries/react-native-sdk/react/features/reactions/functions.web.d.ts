import { IReduxState } from '../app/types';
export * from './functions.any';
/**
 * Returns the visibility state of the reactions menu.
 *
 * @param {Object} state - The state of the application.
 * @returns {boolean}
 */
export declare function getReactionsMenuVisibility(state: IReduxState): boolean;
/**
 * Whether or not the reactions button is enabled.
 *
 * @param {Object} state - The Redux state object.
 * @returns {boolean}
 */
export declare function isReactionsButtonEnabled(state: IReduxState): boolean;
