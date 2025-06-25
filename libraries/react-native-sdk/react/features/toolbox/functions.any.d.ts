import { IReduxState } from '../app/types';
/**
 * Indicates if the audio mute button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function isAudioMuteButtonDisabled(state: IReduxState): boolean;
/**
 * Returns the buttons corresponding to features disabled through jwt.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {string[]} - The disabled by jwt buttons array.
 */
export declare function getJwtDisabledButtons(state: IReduxState): string[];
