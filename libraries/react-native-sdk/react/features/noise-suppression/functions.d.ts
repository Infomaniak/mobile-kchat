import { IReduxState, IStore } from '../app/types';
/**
 * Is noise suppression currently enabled.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
export declare function isNoiseSuppressionEnabled(state: IReduxState): boolean;
/**
 * Verify if noise suppression can be enabled in the current state.
 *
 * @param {*} state - Redux state.
 * @param {*} dispatch - Redux dispatch.
 * @param {*} localAudio - Current local audio track.
 * @returns {boolean}
 */
export declare function canEnableNoiseSuppression(state: IReduxState, dispatch: IStore['dispatch'], localAudio: any): boolean;
