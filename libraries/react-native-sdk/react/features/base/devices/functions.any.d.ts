import { IReduxState } from '../../app/types';
/**
 * Returns true if there are devices of a specific type or on native platform.
 *
 * @param {Object} state - The state of the application.
 * @param {string} type - The type of device: VideoOutput | audioOutput | audioInput.
 *
 * @returns {boolean}
 */
export declare function hasAvailableDevices(state: IReduxState, type: string): boolean;
