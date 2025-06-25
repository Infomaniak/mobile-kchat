import { IReduxState } from '../../app/types';
/**
 * A selector for the internet online status.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean}
 */
export declare function isOnline(state: IReduxState): boolean | undefined;
