"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../../device-selection/functions");
const actions_1 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const actions_2 = require("../../prejoin/actions");
const functions_2 = require("../../prejoin/functions");
const actionTypes_1 = require("../app/actionTypes");
const utils_1 = require("../environment/utils");
const lib_jitsi_meet_1 = __importStar(require("../lib-jitsi-meet"));
const constants_2 = require("../media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actions_3 = require("../settings/actions");
const functions_3 = require("../tracks/functions");
const actionTypes_2 = require("./actionTypes");
const actions_4 = require("./actions");
const functions_4 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const JITSI_TRACK_ERROR_TO_MESSAGE_KEY_MAP = {
    microphone: {
        [lib_jitsi_meet_1.JitsiTrackErrors.CONSTRAINT_FAILED]: 'dialog.micConstraintFailedError',
        [lib_jitsi_meet_1.JitsiTrackErrors.GENERAL]: 'dialog.micUnknownError',
        [lib_jitsi_meet_1.JitsiTrackErrors.NOT_FOUND]: 'dialog.micNotFoundError',
        [lib_jitsi_meet_1.JitsiTrackErrors.PERMISSION_DENIED]: 'dialog.micPermissionDeniedError',
        [lib_jitsi_meet_1.JitsiTrackErrors.TIMEOUT]: 'dialog.micTimeoutError'
    },
    camera: {
        [lib_jitsi_meet_1.JitsiTrackErrors.CONSTRAINT_FAILED]: 'dialog.cameraConstraintFailedError',
        [lib_jitsi_meet_1.JitsiTrackErrors.GENERAL]: 'dialog.cameraUnknownError',
        [lib_jitsi_meet_1.JitsiTrackErrors.NOT_FOUND]: 'dialog.cameraNotFoundError',
        [lib_jitsi_meet_1.JitsiTrackErrors.PERMISSION_DENIED]: 'dialog.cameraPermissionDeniedError',
        [lib_jitsi_meet_1.JitsiTrackErrors.UNSUPPORTED_RESOLUTION]: 'dialog.cameraUnsupportedResolutionError',
        [lib_jitsi_meet_1.JitsiTrackErrors.TIMEOUT]: 'dialog.cameraTimeoutError'
    }
};
/**
 * A listener for device permissions changed reported from lib-jitsi-meet.
 */
let permissionsListener;
/**
 * Implements the middleware of the feature base/devices.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT: {
            const _permissionsListener = (permissions) => {
                store.dispatch((0, actions_4.devicePermissionsChanged)(permissions));
            };
            const { mediaDevices } = lib_jitsi_meet_1.default;
            permissionsListener = _permissionsListener;
            mediaDevices.addEventListener(lib_jitsi_meet_1.JitsiMediaDevicesEvents.PERMISSIONS_CHANGED, permissionsListener);
            Promise.all([
                mediaDevices.isDevicePermissionGranted('audio'),
                mediaDevices.isDevicePermissionGranted('video')
            ])
                .then(results => {
                _permissionsListener({
                    audio: results[0],
                    video: results[1]
                });
            })
                .catch(() => {
                // Ignore errors.
            });
            break;
        }
        case actionTypes_1.APP_WILL_UNMOUNT:
            if (typeof permissionsListener === 'function') {
                lib_jitsi_meet_1.default.mediaDevices.removeEventListener(lib_jitsi_meet_1.JitsiMediaDevicesEvents.PERMISSIONS_CHANGED, permissionsListener);
                permissionsListener = undefined;
            }
            break;
        case actionTypes_2.NOTIFY_CAMERA_ERROR: {
            if (!action.error) {
                break;
            }
            const { message, name } = action.error;
            const cameraJitsiTrackErrorMsg = JITSI_TRACK_ERROR_TO_MESSAGE_KEY_MAP.camera[name];
            const cameraErrorMsg = cameraJitsiTrackErrorMsg
                || JITSI_TRACK_ERROR_TO_MESSAGE_KEY_MAP
                    .camera[lib_jitsi_meet_1.JitsiTrackErrors.GENERAL];
            const additionalCameraErrorMsg = cameraJitsiTrackErrorMsg ? null : message;
            const titleKey = name === lib_jitsi_meet_1.JitsiTrackErrors.PERMISSION_DENIED
                ? 'deviceError.cameraPermission' : 'deviceError.cameraError';
            store.dispatch((0, actions_1.showWarningNotification)({
                description: additionalCameraErrorMsg,
                descriptionKey: cameraErrorMsg,
                titleKey
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            if ((0, functions_2.isPrejoinPageVisible)(store.getState())) {
                store.dispatch((0, actions_2.setDeviceStatusWarning)(titleKey));
            }
            break;
        }
        case actionTypes_2.NOTIFY_MIC_ERROR: {
            if (!action.error) {
                break;
            }
            const { message, name } = action.error;
            const micJitsiTrackErrorMsg = JITSI_TRACK_ERROR_TO_MESSAGE_KEY_MAP.microphone[name];
            const micErrorMsg = micJitsiTrackErrorMsg
                || JITSI_TRACK_ERROR_TO_MESSAGE_KEY_MAP
                    .microphone[lib_jitsi_meet_1.JitsiTrackErrors.GENERAL];
            const additionalMicErrorMsg = micJitsiTrackErrorMsg ? null : message;
            const titleKey = name === lib_jitsi_meet_1.JitsiTrackErrors.PERMISSION_DENIED
                ? 'deviceError.microphonePermission'
                : 'deviceError.microphoneError';
            store.dispatch((0, actions_1.showWarningNotification)({
                description: additionalMicErrorMsg,
                descriptionKey: micErrorMsg,
                titleKey
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            if ((0, functions_2.isPrejoinPageVisible)(store.getState())) {
                store.dispatch((0, actions_2.setDeviceStatusWarning)(titleKey));
            }
            break;
        }
        case actionTypes_2.SET_AUDIO_INPUT_DEVICE:
            if ((0, functions_2.isPrejoinPageVisible)(store.getState())) {
                store.dispatch((0, actions_2.replaceAudioTrackById)(action.deviceId));
            }
            else {
                APP.conference.onAudioDeviceChanged(action.deviceId);
            }
            break;
        case actionTypes_2.SET_VIDEO_INPUT_DEVICE: {
            const localTrack = (0, functions_3.getLocalTrack)(store.getState()['features/base/tracks'], constants_2.MEDIA_TYPE.VIDEO);
            // on mobile devices the video stream has to be stopped before replacing it
            if ((0, utils_1.isMobileBrowser)() && localTrack && !localTrack.muted) {
                localTrack.jitsiTrack.stopStream();
            }
            if ((0, functions_2.isPrejoinPageVisible)(store.getState())) {
                store.dispatch((0, actions_2.replaceVideoTrackById)(action.deviceId));
            }
            else {
                APP.conference.onVideoDeviceChanged(action.deviceId);
            }
            break;
        }
        case actionTypes_2.UPDATE_DEVICE_LIST:
            (0, functions_4.logDevices)(action.devices, 'Device list updated');
            if ((0, functions_4.areDeviceLabelsInitialized)(store.getState())) {
                return _processPendingRequests(store, next, action);
            }
            break;
        case actionTypes_2.CHECK_AND_NOTIFY_FOR_NEW_DEVICE:
            _checkAndNotifyForNewDevice(store, action.newDevices, action.oldDevices);
            break;
    }
    return next(action);
});
/**
 * Does extra sync up on properties that may need to be updated after the
 * conference was joined.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONFERENCE_JOINED} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _processPendingRequests({ dispatch, getState }, next, action) {
    const result = next(action);
    const state = getState();
    const { pendingRequests } = state['features/base/devices'];
    if (!pendingRequests || pendingRequests.length === 0) {
        return result;
    }
    pendingRequests.forEach((request) => {
        (0, functions_1.processExternalDeviceRequest)(dispatch, getState, request, request.responseCallback);
    });
    dispatch((0, actions_4.removePendingDeviceRequests)());
    return result;
}
/**
 * Finds a new device by comparing new and old array of devices and dispatches
 * notification with the new device. For new devices with same groupId only one
 * notification will be shown, this is so to avoid showing multiple notifications
 * for audio input and audio output devices.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {MediaDeviceInfo[]} newDevices - The array of new devices we received.
 * @param {MediaDeviceInfo[]} oldDevices - The array of the old devices we have.
 * @private
 * @returns {void}
 */
function _checkAndNotifyForNewDevice(store, newDevices, oldDevices) {
    const { dispatch } = store;
    // let's intersect both newDevices and oldDevices and handle thew newly
    // added devices
    const onlyNewDevices = newDevices.filter(nDevice => !oldDevices.find(device => device.deviceId === nDevice.deviceId));
    // we group devices by groupID which normally is the grouping by physical device
    // plugging in headset we provide normally two device, one input and one output
    // and we want to show only one notification for this physical audio device
    const devicesGroupBy = onlyNewDevices.reduce((accumulated, value) => {
        accumulated[value.groupId] = accumulated[value.groupId] || [];
        accumulated[value.groupId].push(value);
        return accumulated;
    }, {});
    Object.values(devicesGroupBy).forEach(devicesArray => {
        if (devicesArray.length < 1) {
            return;
        }
        // let's get the first device as a reference, we will use it for
        // label and type
        const newDevice = devicesArray[0];
        // we want to strip any device details that are not very
        // user friendly, like usb ids put in brackets at the end
        const description = (0, functions_4.formatDeviceLabel)(newDevice.label);
        let titleKey;
        switch (newDevice.kind) {
            case 'videoinput': {
                titleKey = 'notify.newDeviceCameraTitle';
                break;
            }
            case 'audioinput':
            case 'audiooutput': {
                titleKey = 'notify.newDeviceAudioTitle';
                break;
            }
        }
        if (!(0, functions_2.isPrejoinPageVisible)(store.getState())) {
            dispatch((0, actions_1.showNotification)({
                description,
                titleKey,
                customActionNameKey: ['notify.newDeviceAction'],
                customActionHandler: [_useDevice.bind(undefined, store, devicesArray)]
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        }
    });
}
/**
 * Set a device to be currently used, selected by the user.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Array<MediaDeviceInfo|InputDeviceInfo>} devices - The devices to save.
 * @returns {boolean} - Returns true in order notifications to be dismissed.
 * @private
 */
function _useDevice({ dispatch }, devices) {
    devices.forEach(device => {
        switch (device.kind) {
            case 'videoinput': {
                dispatch((0, actions_3.updateSettings)({
                    userSelectedCameraDeviceId: device.deviceId,
                    userSelectedCameraDeviceLabel: device.label
                }));
                dispatch((0, actions_4.setVideoInputDevice)(device.deviceId));
                break;
            }
            case 'audioinput': {
                dispatch((0, actions_3.updateSettings)({
                    userSelectedMicDeviceId: device.deviceId,
                    userSelectedMicDeviceLabel: device.label
                }));
                dispatch((0, actions_4.setAudioInputDevice)(device.deviceId));
                break;
            }
            case 'audiooutput': {
                (0, functions_4.setAudioOutputDeviceId)(device.deviceId, dispatch, true, device.label)
                    .then(() => logger_1.default.log('changed audio output device'))
                    .catch(err => {
                    logger_1.default.warn('Failed to change audio output device.', 'Default or previously set audio output device will', ' be used instead.', err);
                });
                break;
            }
        }
    });
    return true;
}
