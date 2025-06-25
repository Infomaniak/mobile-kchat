import { IReduxState } from '../../app/types';
export * from './functions.any';
/**
 * Returns whether the conference is in connecting state.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} Whether conference is connecting.
 */
export declare const isConnecting: (state: IReduxState) => boolean;
