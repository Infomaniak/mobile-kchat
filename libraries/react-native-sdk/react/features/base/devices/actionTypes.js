"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEVICE_PERMISSIONS_CHANGED = exports.CHECK_AND_NOTIFY_FOR_NEW_DEVICE = exports.REMOVE_PENDING_DEVICE_REQUESTS = exports.ADD_PENDING_DEVICE_REQUEST = exports.UPDATE_DEVICE_LIST = exports.SET_VIDEO_INPUT_DEVICE = exports.SET_AUDIO_INPUT_DEVICE = exports.NOTIFY_MIC_ERROR = exports.NOTIFY_CAMERA_ERROR = void 0;
/**
 * The type of Redux action which signals that an error occurred while obtaining
 * a camera.
 *
 * {
 *     type: NOTIFY_CAMERA_ERROR,
 *     error: Object
 * }
 */
exports.NOTIFY_CAMERA_ERROR = 'NOTIFY_CAMERA_ERROR';
/**
 * The type of Redux action which signals that an error occurred while obtaining
 * a microphone.
 *
 * {
 *     type: NOTIFY_MIC_ERROR,
 *     error: Object
 * }
 */
exports.NOTIFY_MIC_ERROR = 'NOTIFY_MIC_ERROR';
/**
 * The type of Redux action which signals that the currently used audio
 * input device should be changed.
 *
 * {
 *     type: SET_AUDIO_INPUT_DEVICE,
 *     deviceId: string,
 * }
 */
exports.SET_AUDIO_INPUT_DEVICE = 'SET_AUDIO_INPUT_DEVICE';
/**
 * The type of Redux action which signals that the currently used video
 * input device should be changed.
 *
 * {
 *     type: SET_VIDEO_INPUT_DEVICE,
 *     deviceId: string,
 * }
 */
exports.SET_VIDEO_INPUT_DEVICE = 'SET_VIDEO_INPUT_DEVICE';
/**
 * The type of Redux action which signals that the list of known available
 * audio and video sources has changed.
 *
 * {
 *     type: UPDATE_DEVICE_LIST,
 *     devices: Array<MediaDeviceInfo>,
 * }
 */
exports.UPDATE_DEVICE_LIST = 'UPDATE_DEVICE_LIST';
/**
 * The type of Redux action which will add a pending device requests that will
 * be executed later when it is possible (when the conference is joined).
 *
 * {
 *     type: ADD_PENDING_DEVICE_REQUEST,
 *     request: Object
 * }
 */
exports.ADD_PENDING_DEVICE_REQUEST = 'ADD_PENDING_DEVICE_REQUEST';
/**
 * The type of Redux action which will remove all pending device requests.
 *
 * {
 *     type: REMOVE_PENDING_DEVICE_REQUESTS
 * }
 */
exports.REMOVE_PENDING_DEVICE_REQUESTS = 'REMOVE_PENDING_DEVICE_REQUESTS';
/**
 * The type of Redux action which will check passed old and passed new devices
 * and if needed will show notifications asking the user whether to use those.
 *
 * {
 *     type: CHECK_AND_NOTIFY_FOR_NEW_DEVICE
 *     newDevices: Array<MediaDeviceInfo>
 *     oldDevices: Array<MediaDeviceInfo>
 * }
 */
exports.CHECK_AND_NOTIFY_FOR_NEW_DEVICE = 'CHECK_AND_NOTIFY_FOR_NEW_DEVICE';
/**
 * The type of Redux action which signals that the device permissions have changed.
 *
 * {
 *     type: CHECK_AND_NOTIFY_FOR_NEW_DEVICE
 *     permissions: Object
 * }
 */
exports.DEVICE_PERMISSIONS_CHANGED = 'DEVICE_PERMISSIONS_CHANGED';
