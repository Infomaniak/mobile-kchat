"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeviceInfo = exports.requestHidDevice = exports.closeHidDevice = exports.initDeviceInfo = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Action used to init device.
 *
 * @param {IDeviceInfo} deviceInfo - Telephony device information.
 * @returns {Object}
 */
function initDeviceInfo(deviceInfo) {
    return {
        type: actionTypes_1.INIT_DEVICE,
        deviceInfo
    };
}
exports.initDeviceInfo = initDeviceInfo;
/**
 * Request hid device.
 *
 * @returns {Object}
 */
function closeHidDevice() {
    return {
        type: actionTypes_1.CLOSE_HID_DEVICE
    };
}
exports.closeHidDevice = closeHidDevice;
/**
 * Request hid device.
 *
 * @param {IDeviceInfo} deviceInfo - Telephony device information.
 * @returns {Object}
 */
function requestHidDevice() {
    return {
        type: actionTypes_1.REQUEST_HID_DEVICE
    };
}
exports.requestHidDevice = requestHidDevice;
/**
 * Action used to init device.
 *
 * @param {IDeviceInfo} deviceInfo - Telephony device information.
 * @returns {Object}
 */
function updateDeviceInfo(deviceInfo) {
    return {
        type: actionTypes_1.UPDATE_DEVICE,
        updates: deviceInfo
    };
}
exports.updateDeviceInfo = updateDeviceInfo;
