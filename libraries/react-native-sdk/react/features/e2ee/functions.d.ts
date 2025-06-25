import { IReduxState, IStore } from '../app/types';
import { IStateful } from '../base/app/types';
/**
 * Gets the value of a specific React {@code Component} prop of the currently
 * mounted {@link App}.
 *
 * @param {IStateful} stateful - The redux store or {@code getState}
 * function.
 * @param {string} propName - The name of the React {@code Component} prop of
 * the currently mounted {@code App} to get.
 * @returns {*} The value of the specified React {@code Component} prop of the
 * currently mounted {@code App}.
 */
export declare function doesEveryoneSupportE2EE(stateful: IStateful): boolean | undefined;
/**
 * Returns true is the number of participants is larger than {@code MAX_MODE_LIMIT}.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean}
 */
export declare function isMaxModeReached(stateful: IStateful): boolean;
/**
 * Returns true is the number of participants is larger than {@code MAX_MODE_LIMIT + MAX_MODE_THREHOLD}.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState}
 * function.
 * @returns {boolean}
 */
export declare function isMaxModeThresholdReached(stateful: IStateful): boolean;
/**
 * Returns whether e2ee is enabled by the backend.
 *
 * @param {Object} state - The redux state.
 * @param {string} pId - The participant id.
 * @returns {boolean}
 */
export declare function displayVerification(state: IReduxState, pId: string): boolean;
/**
 * Unregisters the audio files based on locale.
 *
 * @param {Dispatch<any>} dispatch - The redux dispatch function.
 * @returns {void}
 */
export declare function unregisterE2eeAudioFiles(dispatch: IStore['dispatch']): void;
/**
 * Registers the audio files based on locale.
 *
 * @param {Dispatch<any>} dispatch - The redux dispatch function.
 * @param {boolean|undefined} shouldUnregister - Whether the sounds should be unregistered.
 * @returns {void}
 */
export declare function registerE2eeAudioFiles(dispatch: IStore['dispatch'], shouldUnregister?: boolean): void;
