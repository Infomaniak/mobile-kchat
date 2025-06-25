import { IStore } from '../../app/types';
/**
 * Adds a pending device request.
 *
 * @param {Object} request - The request to be added.
 * @returns {{
 *      type: ADD_PENDING_DEVICE_REQUEST,
 *      request: Object
 * }}
 */
export declare function addPendingDeviceRequest(request: Object): {
    type: string;
    request: Object;
};
/**
 * Configures the initial A/V devices before the conference has started.
 *
 * @returns {Function}
 */
export declare function configureInitialDevices(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
/**
 * Queries for connected A/V input and output devices and updates the redux
 * state of known devices.
 *
 * @returns {Function}
 */
export declare function getAvailableDevices(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<unknown>;
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
export declare function notifyCameraError(error: Error): {
    type: string;
    error: Error;
};
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
export declare function notifyMicError(error: Error): {
    type: string;
    error: Error;
};
/**
 * Remove all pending device requests.
 *
 * @returns {{
 *      type: REMOVE_PENDING_DEVICE_REQUESTS
 * }}
 */
export declare function removePendingDeviceRequests(): {
    type: string;
};
/**
 * Signals to update the currently used audio input device.
 *
 * @param {string} deviceId - The id of the new audio input device.
 * @returns {{
 *      type: SET_AUDIO_INPUT_DEVICE,
 *      deviceId: string
 * }}
 */
export declare function setAudioInputDevice(deviceId: string): {
    type: string;
    deviceId: string;
};
/**
 * Sets the audio input device id and updates the settings
 * so they are persisted across sessions.
 *
 * @param {string} deviceId - The id of the new audio input device.
 * @returns {Function}
 */
export declare function setAudioInputDeviceAndUpdateSettings(deviceId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Updates the output device id.
 *
 * @param {string} deviceId - The id of the new output device.
 * @returns {Function}
 */
export declare function setAudioOutputDevice(deviceId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
/**
 * Signals to update the currently used video input device.
 *
 * @param {string} deviceId - The id of the new video input device.
 * @returns {{
 *      type: SET_VIDEO_INPUT_DEVICE,
 *      deviceId: string
 * }}
 */
export declare function setVideoInputDevice(deviceId: string): {
    type: string;
    deviceId: string;
};
/**
 * Sets the video input device id and updates the settings
 * so they are persisted across sessions.
 *
 * @param {string} deviceId - The id of the new video input device.
 * @returns {Function}
 */
export declare function setVideoInputDeviceAndUpdateSettings(deviceId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
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
export declare function updateDeviceList(devices: MediaDeviceInfo[]): {
    type: string;
    devices: MediaDeviceInfo[];
};
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
export declare function checkAndNotifyForNewDevice(newDevices: MediaDeviceInfo[], oldDevices: MediaDeviceInfo[]): {
    type: string;
    newDevices: MediaDeviceInfo[];
    oldDevices: MediaDeviceInfo[];
};
/**
 * Signals that the device permissions have changed.
 *
 * @param {Object} permissions - Object with the permissions.
 * @returns {{
 *      type: DEVICE_PERMISSIONS_CHANGED,
 *      permissions: Object
 * }}
 */
export declare function devicePermissionsChanged(permissions: Object): {
    type: string;
    permissions: Object;
};
