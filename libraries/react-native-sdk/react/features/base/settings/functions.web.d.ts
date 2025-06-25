import { IReduxState } from '../../app/types';
import { IStateful } from '../app/types';
export * from './functions.any';
/**
 * Returns the deviceId for the currently used camera.
 *
 * @param {Object} state - The state of the application.
 * @returns {void}
 */
export declare function getCurrentCameraDeviceId(state: IReduxState): any;
/**
 * Returns the deviceId for the currently used microphone.
 *
 * @param {Object} state - The state of the application.
 * @returns {void}
 */
export declare function getCurrentMicDeviceId(state: IReduxState): any;
/**
 * Returns the deviceId for the currently used speaker.
 *
 * @param {Object} state - The state of the application.
 * @returns {void}
 */
export declare function getCurrentOutputDeviceId(state: IReduxState): string | undefined;
/**
 * Returns the saved display name.
 *
 * @param {Object} state - The state of the application.
 * @returns {string}
 */
export declare function getDisplayName(state: IReduxState): string;
/**
 * Searches known devices for a matching deviceId and fall back to matching on
 * label. Returns the stored preferred cameraDeviceId if a match is not found.
 *
 * @param {Object|Function} stateful - The redux state object or
 * {@code getState} function.
 * @returns {string}
 */
export declare function getUserSelectedCameraDeviceId(stateful: IStateful): string | undefined;
/**
 * Searches known devices for a matching deviceId and fall back to matching on
 * label. Returns the stored preferred micDeviceId if a match is not found.
 *
 * @param {Object|Function} stateful - The redux state object or
 * {@code getState} function.
 * @returns {string}
 */
export declare function getUserSelectedMicDeviceId(stateful: IStateful): string | undefined;
/**
 * Searches known devices for a matching deviceId and fall back to matching on
 * label. Returns the stored preferred audioOutputDeviceId if a match is not found.
 *
 * @param {Object|Function} stateful - The redux state object or
 * {@code getState} function.
 * @returns {string}
 */
export declare function getUserSelectedOutputDeviceId(stateful: IStateful): string | undefined;
