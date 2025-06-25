import { IReduxState, IStore } from '../app/types';
import { IDeviceInfo } from './types';
import WebHidManager from './webhid-manager';
/**
 * Attach web hid event listeners.
 *
 * @param {Function} initDeviceListener - Init hid device listener.
 * @param {Function} updateDeviceListener - Update hid device listener.
 * @returns {void}
 */
export declare function attachHidEventListeners(initDeviceListener: EventListenerOrEventListenerObject, updateDeviceListener: EventListenerOrEventListenerObject): void;
/**
 * Returns instance of web hid manager.
 *
* @returns {WebHidManager}  - WebHidManager instance.
 */
export declare function getWebHidInstance(): WebHidManager;
/**
 * Returns root conference state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {Object} Conference state.
 */
export declare const getWebHidState: (state: IReduxState) => import("./reducer").IWebHid;
/**
 * Returns true if hid is supported.
 *
 * @returns {boolean}
 */
export declare function isDeviceHidSupported(): boolean;
/**
 * Returns device info from state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
export declare function getDeviceInfo(state: IReduxState): IDeviceInfo;
/**
 * Handles updating hid device.
 *
 * @param {Function} dispatch - Redux dispatch.
 * @param {Function} customEventData - Custom event data.
 * @returns {void}
 */
export declare function handleUpdateHidDevice(dispatch: IStore['dispatch'], customEventData: CustomEvent<{
    actionResult?: {
        eventName: string;
    };
    deviceInfo: IDeviceInfo;
}>): void;
/**
 * Remove web hid event listeners.
 *
 * @param {Function} initDeviceListener - Init hid device listener.
 * @param {Function} updateDeviceListener - Update hid device listener.
 * @returns {void}
 */
export declare function removeHidEventListeners(initDeviceListener: EventListenerOrEventListenerObject, updateDeviceListener: EventListenerOrEventListenerObject): void;
/**
 * Returns true if there is no device info provided.
 *
 * @param {IDeviceInfo} deviceInfo - Device info state.
 * @returns {boolean}
 */
export declare function shouldRequestHIDDevice(deviceInfo: IDeviceInfo): boolean;
