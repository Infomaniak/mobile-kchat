import { IDeviceInfo } from './types';
/**
 * Action used to init device.
 *
 * @param {IDeviceInfo} deviceInfo - Telephony device information.
 * @returns {Object}
 */
export declare function initDeviceInfo(deviceInfo: IDeviceInfo): {
    type: string;
    deviceInfo: IDeviceInfo;
};
/**
 * Request hid device.
 *
 * @returns {Object}
 */
export declare function closeHidDevice(): {
    type: string;
};
/**
 * Request hid device.
 *
 * @param {IDeviceInfo} deviceInfo - Telephony device information.
 * @returns {Object}
 */
export declare function requestHidDevice(): {
    type: string;
};
/**
 * Action used to init device.
 *
 * @param {IDeviceInfo} deviceInfo - Telephony device information.
 * @returns {Object}
 */
export declare function updateDeviceInfo(deviceInfo: IDeviceInfo): {
    type: string;
    updates: IDeviceInfo;
};
