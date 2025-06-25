"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicePermissionsChanged = exports.checkAndNotifyForNewDevice = exports.updateDeviceList = exports.setVideoInputDeviceAndUpdateSettings = exports.setVideoInputDevice = exports.setAudioOutputDevice = exports.setAudioInputDeviceAndUpdateSettings = exports.setAudioInputDevice = exports.removePendingDeviceRequests = exports.notifyMicError = exports.notifyCameraError = exports.getAvailableDevices = exports.configureInitialDevices = exports.addPendingDeviceRequest = void 0;
const lib_jitsi_meet_1 = __importDefault(require("../lib-jitsi-meet"));
const actions_1 = require("../settings/actions");
const functions_web_1 = require("../settings/functions.web");
const actionTypes_1 = require("./actionTypes");
const functions_1 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Maps the WebRTC string for device type to the keys used to store configure,
 * within redux, which devices should be used by default.
 */
const DEVICE_TYPE_TO_SETTINGS_KEYS = {
    audioInput: {
        currentDeviceId: 'micDeviceId',
        userSelectedDeviceId: 'userSelectedMicDeviceId',
        userSelectedDeviceLabel: 'userSelectedMicDeviceLabel'
    },
    audioOutput: {
        currentDeviceId: 'audioOutputDeviceId',
        userSelectedDeviceId: 'userSelectedAudioOutputDeviceId',
        userSelectedDeviceLabel: 'userSelectedAudioOutputDeviceLabel'
    },
    videoInput: {
        currentDeviceId: 'cameraDeviceId',
        userSelectedDeviceId: 'userSelectedCameraDeviceId',
        userSelectedDeviceLabel: 'userSelectedCameraDeviceLabel'
    }
};
/**
 * Adds a pending device request.
 *
 * @param {Object} request - The request to be added.
 * @returns {{
 *      type: ADD_PENDING_DEVICE_REQUEST,
 *      request: Object
 * }}
 */
function addPendingDeviceRequest(request) {
    return {
        type: actionTypes_1.ADD_PENDING_DEVICE_REQUEST,
        request
    };
}
exports.addPendingDeviceRequest = addPendingDeviceRequest;
/**
 * Configures the initial A/V devices before the conference has started.
 *
 * @returns {Function}
 */
function configureInitialDevices() {
    return (dispatch, getState) => {
        const deviceLabels = (0, functions_1.getDevicesFromURL)(getState());
        let updateSettingsPromise;
        if (deviceLabels) {
            updateSettingsPromise = dispatch(getAvailableDevices()).then(() => {
                const state = getState();
                if (!(0, functions_1.areDeviceLabelsInitialized)(state)) {
                    // The labels are not available if the A/V permissions are
                    // not yet granted.
                    Object.keys(deviceLabels).forEach(key => {
                        dispatch(addPendingDeviceRequest({
                            type: 'devices',
                            name: 'setDevice',
                            device: {
                                kind: key.toLowerCase(),
                                label: deviceLabels[key]
                            },
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            responseCallback() { }
                        }));
                    });
                    return;
                }
                const newSettings = {};
                Object.keys(deviceLabels).forEach(key => {
                    const label = deviceLabels[key];
                    // @ts-ignore
                    const deviceId = (0, functions_1.getDeviceIdByLabel)(state, label, key);
                    if (deviceId) {
                        const settingsTranslationMap = DEVICE_TYPE_TO_SETTINGS_KEYS[key];
                        newSettings[settingsTranslationMap.currentDeviceId] = deviceId;
                        newSettings[settingsTranslationMap.userSelectedDeviceId] = deviceId;
                        newSettings[settingsTranslationMap.userSelectedDeviceLabel] = label;
                    }
                });
                dispatch((0, actions_1.updateSettings)(newSettings));
            });
        }
        else {
            updateSettingsPromise = Promise.resolve();
        }
        return updateSettingsPromise
            .then(() => {
            const userSelectedAudioOutputDeviceId = (0, functions_web_1.getUserSelectedOutputDeviceId)(getState());
            return (0, functions_1.setAudioOutputDeviceId)(userSelectedAudioOutputDeviceId, dispatch)
                .catch(ex => logger_1.default.warn(`Failed to set audio output device.
                        Default audio output device will be used instead ${ex}`));
        });
    };
}
exports.configureInitialDevices = configureInitialDevices;
/**
 * Queries for connected A/V input and output devices and updates the redux
 * state of known devices.
 *
 * @returns {Function}
 */
function getAvailableDevices() {
    return (dispatch, getState) => new Promise(resolve => {
        const { mediaDevices } = lib_jitsi_meet_1.default;
        if (mediaDevices.isDeviceListAvailable()
            && mediaDevices.isDeviceChangeAvailable()) {
            mediaDevices.enumerateDevices((devices) => {
                const { filteredDevices, ignoredDevices } = (0, functions_1.filterIgnoredDevices)(devices);
                const oldDevices = (0, functions_1.flattenAvailableDevices)(getState()['features/base/devices'].availableDevices);
                if ((0, functions_1.areDevicesDifferent)(oldDevices, filteredDevices)) {
                    (0, functions_1.logDevices)(ignoredDevices, 'Ignored devices on device list changed:');
                    dispatch(updateDeviceList(filteredDevices));
                }
                resolve(filteredDevices);
            });
        }
        else {
            resolve([]);
        }
    });
}
exports.getAvailableDevices = getAvailableDevices;
/**
 * Signals that an error occurred while trying to obtain a track from a camera.
 *
 * @param {Object} error - The device error, as provided by lib-jitsi-meet.
 * @param {string} error.name - The constant for the type of the error.
 * @param {string} error.message - Optional additional information about the
 * error.
 * @returns {{
 *     type: NOTIFY_CAMERA_ERROR,
 *     error: Object
 * }}
 */
function notifyCameraError(error) {
    return {
        type: actionTypes_1.NOTIFY_CAMERA_ERROR,
        error
    };
}
exports.notifyCameraError = notifyCameraError;
/**
 * Signals that an error occurred while trying to obtain a track from a mic.
 *
 * @param {Object} error - The device error, as provided by lib-jitsi-meet.
 * @param {Object} error.name - The constant for the type of the error.
 * @param {string} error.message - Optional additional information about the
 * error.
 * @returns {{
 *     type: NOTIFY_MIC_ERROR,
 *     error: Object
 * }}
 */
function notifyMicError(error) {
    return {
        type: actionTypes_1.NOTIFY_MIC_ERROR,
        error
    };
}
exports.notifyMicError = notifyMicError;
/**
 * Remove all pending device requests.
 *
 * @returns {{
 *      type: REMOVE_PENDING_DEVICE_REQUESTS
 * }}
 */
function removePendingDeviceRequests() {
    return {
        type: actionTypes_1.REMOVE_PENDING_DEVICE_REQUESTS
    };
}
exports.removePendingDeviceRequests = removePendingDeviceRequests;
/**
 * Signals to update the currently used audio input device.
 *
 * @param {string} deviceId - The id of the new audio input device.
 * @returns {{
 *      type: SET_AUDIO_INPUT_DEVICE,
 *      deviceId: string
 * }}
 */
function setAudioInputDevice(deviceId) {
    return {
        type: actionTypes_1.SET_AUDIO_INPUT_DEVICE,
        deviceId
    };
}
exports.setAudioInputDevice = setAudioInputDevice;
/**
 * Sets the audio input device id and updates the settings
 * so they are persisted across sessions.
 *
 * @param {string} deviceId - The id of the new audio input device.
 * @returns {Function}
 */
function setAudioInputDeviceAndUpdateSettings(deviceId) {
    return function (dispatch, getState) {
        const deviceLabel = (0, functions_1.getDeviceLabelById)(getState(), deviceId, 'audioInput');
        dispatch(setAudioInputDevice(deviceId));
        dispatch((0, actions_1.updateSettings)({
            userSelectedMicDeviceId: deviceId,
            userSelectedMicDeviceLabel: deviceLabel
        }));
    };
}
exports.setAudioInputDeviceAndUpdateSettings = setAudioInputDeviceAndUpdateSettings;
/**
 * Updates the output device id.
 *
 * @param {string} deviceId - The id of the new output device.
 * @returns {Function}
 */
function setAudioOutputDevice(deviceId) {
    return function (dispatch, getState) {
        const deviceLabel = (0, functions_1.getDeviceLabelById)(getState(), deviceId, 'audioOutput');
        return (0, functions_1.setAudioOutputDeviceId)(deviceId, dispatch, true, deviceLabel);
    };
}
exports.setAudioOutputDevice = setAudioOutputDevice;
/**
 * Signals to update the currently used video input device.
 *
 * @param {string} deviceId - The id of the new video input device.
 * @returns {{
 *      type: SET_VIDEO_INPUT_DEVICE,
 *      deviceId: string
 * }}
 */
function setVideoInputDevice(deviceId) {
    return {
        type: actionTypes_1.SET_VIDEO_INPUT_DEVICE,
        deviceId
    };
}
exports.setVideoInputDevice = setVideoInputDevice;
/**
 * Sets the video input device id and updates the settings
 * so they are persisted across sessions.
 *
 * @param {string} deviceId - The id of the new video input device.
 * @returns {Function}
 */
function setVideoInputDeviceAndUpdateSettings(deviceId) {
    return function (dispatch, getState) {
        const deviceLabel = (0, functions_1.getDeviceLabelById)(getState(), deviceId, 'videoInput');
        dispatch(setVideoInputDevice(deviceId));
        dispatch((0, actions_1.updateSettings)({
            userSelectedCameraDeviceId: deviceId,
            userSelectedCameraDeviceLabel: deviceLabel
        }));
    };
}
exports.setVideoInputDeviceAndUpdateSettings = setVideoInputDeviceAndUpdateSettings;
/**
 * Signals to update the list of known audio and video devices.
 *
 * @param {Array<MediaDeviceInfo>} devices - All known available audio input,
 * audio output, and video input devices.
 * @returns {{
 *      type: UPDATE_DEVICE_LIST,
 *      devices: Array<MediaDeviceInfo>
 * }}
 */
function updateDeviceList(devices) {
    return {
        type: actionTypes_1.UPDATE_DEVICE_LIST,
        devices
    };
}
exports.updateDeviceList = updateDeviceList;
/**
 * Signals to check new and old devices for newly added devices and notify.
 *
 * @param {Array<MediaDeviceInfo>} newDevices - Array of the new devices.
 * @param {Array<MediaDeviceInfo>} oldDevices - Array of the old devices.
 * @returns {{
 *      type: CHECK_AND_NOTIFY_FOR_NEW_DEVICE,
 *      newDevices: Array<MediaDeviceInfo>,
 *      oldDevices: Array<MediaDeviceInfo>
 * }}
 */
function checkAndNotifyForNewDevice(newDevices, oldDevices) {
    return {
        type: actionTypes_1.CHECK_AND_NOTIFY_FOR_NEW_DEVICE,
        newDevices,
        oldDevices
    };
}
exports.checkAndNotifyForNewDevice = checkAndNotifyForNewDevice;
/**
 * Signals that the device permissions have changed.
 *
 * @param {Object} permissions - Object with the permissions.
 * @returns {{
 *      type: DEVICE_PERMISSIONS_CHANGED,
 *      permissions: Object
 * }}
 */
function devicePermissionsChanged(permissions) {
    return {
        type: actionTypes_1.DEVICE_PERMISSIONS_CHANGED,
        permissions
    };
}
exports.devicePermissionsChanged = devicePermissionsChanged;
