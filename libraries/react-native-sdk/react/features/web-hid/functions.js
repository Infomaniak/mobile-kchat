"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRequestHIDDevice = exports.removeHidEventListeners = exports.handleUpdateHidDevice = exports.getDeviceInfo = exports.isDeviceHidSupported = exports.getWebHidState = exports.getWebHidInstance = exports.attachHidEventListeners = void 0;
const constants_1 = require("../base/media/constants");
const actions_any_1 = require("../video-menu/actions.any");
const actions_1 = require("./actions");
const types_1 = require("./types");
const webhid_manager_1 = __importDefault(require("./webhid-manager"));
/**
 * Attach web hid event listeners.
 *
 * @param {Function} initDeviceListener - Init hid device listener.
 * @param {Function} updateDeviceListener - Update hid device listener.
 * @returns {void}
 */
function attachHidEventListeners(initDeviceListener, updateDeviceListener) {
    const hidManager = getWebHidInstance();
    if (typeof initDeviceListener === 'function') {
        hidManager.addEventListener(types_1.EVENT_TYPE.INIT_DEVICE, initDeviceListener);
    }
    if (typeof updateDeviceListener === 'function') {
        hidManager.addEventListener(types_1.EVENT_TYPE.UPDATE_DEVICE, updateDeviceListener);
    }
}
exports.attachHidEventListeners = attachHidEventListeners;
/**
 * Returns instance of web hid manager.
 *
* @returns {WebHidManager}  - WebHidManager instance.
 */
function getWebHidInstance() {
    const hidManager = webhid_manager_1.default.getInstance();
    return hidManager;
}
exports.getWebHidInstance = getWebHidInstance;
/**
 * Returns root conference state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {Object} Conference state.
 */
const getWebHidState = (state) => state['features/web-hid'];
exports.getWebHidState = getWebHidState;
/**
 * Returns true if hid is supported.
 *
 * @returns {boolean}
 */
function isDeviceHidSupported() {
    const hidManager = getWebHidInstance();
    return hidManager.isSupported();
}
exports.isDeviceHidSupported = isDeviceHidSupported;
/**
 * Returns device info from state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
function getDeviceInfo(state) {
    const hidState = (0, exports.getWebHidState)(state);
    return hidState.deviceInfo;
}
exports.getDeviceInfo = getDeviceInfo;
/**
 * Handles updating hid device.
 *
 * @param {Function} dispatch - Redux dispatch.
 * @param {Function} customEventData - Custom event data.
 * @returns {void}
 */
function handleUpdateHidDevice(dispatch, customEventData) {
    dispatch((0, actions_1.updateDeviceInfo)(customEventData.detail.deviceInfo));
    if (customEventData.detail?.actionResult?.eventName === types_1.ACTION_HOOK_TYPE_NAME.MUTE_SWITCH_ON) {
        dispatch((0, actions_any_1.muteLocal)(true, constants_1.MEDIA_TYPE.AUDIO));
    }
    else if (customEventData.detail?.actionResult?.eventName === types_1.ACTION_HOOK_TYPE_NAME.MUTE_SWITCH_OFF) {
        dispatch((0, actions_any_1.muteLocal)(false, constants_1.MEDIA_TYPE.AUDIO));
    }
}
exports.handleUpdateHidDevice = handleUpdateHidDevice;
/**
 * Remove web hid event listeners.
 *
 * @param {Function} initDeviceListener - Init hid device listener.
 * @param {Function} updateDeviceListener - Update hid device listener.
 * @returns {void}
 */
function removeHidEventListeners(initDeviceListener, updateDeviceListener) {
    const hidManager = getWebHidInstance();
    if (typeof initDeviceListener === 'function') {
        hidManager.removeEventListener(types_1.EVENT_TYPE.INIT_DEVICE, initDeviceListener);
    }
    if (typeof updateDeviceListener === 'function') {
        hidManager.removeEventListener(types_1.EVENT_TYPE.UPDATE_DEVICE, updateDeviceListener);
    }
}
exports.removeHidEventListeners = removeHidEventListeners;
/**
 * Returns true if there is no device info provided.
 *
 * @param {IDeviceInfo} deviceInfo - Device info state.
 * @returns {boolean}
 */
function shouldRequestHIDDevice(deviceInfo) {
    return !deviceInfo?.device || Object.keys(deviceInfo).length === 0;
}
exports.shouldRequestHIDDevice = shouldRequestHIDDevice;
