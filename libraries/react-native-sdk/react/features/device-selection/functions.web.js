"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processExternalDeviceRequest = exports.getVideoDeviceSelectionDialogProps = exports.getAudioDeviceSelectionDialogProps = void 0;
const functions_web_1 = require("../base/config/functions.web");
const actions_web_1 = require("../base/devices/actions.web");
const functions_web_2 = require("../base/devices/functions.web");
const utils_1 = require("../base/environment/utils");
const lib_jitsi_meet_1 = __importDefault(require("../base/lib-jitsi-meet"));
const functions_1 = require("../base/redux/functions");
const functions_web_3 = require("../base/settings/functions.web");
const functions_2 = require("../noise-suppression/functions");
const functions_3 = require("../prejoin/functions");
const constants_1 = require("../settings/constants");
const functions_4 = require("../web-hid/functions");
/**
 * Returns the properties for the audio device selection dialog from Redux state.
 *
 * @param {IStateful} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the audio device selection dialog.
 */
function getAudioDeviceSelectionDialogProps(stateful, isDisplayedOnWelcomePage) {
    // On mobile Safari because of https://bugs.webkit.org/show_bug.cgi?id=179363#c30, the old track is stopped
    // by the browser when a new track is created for preview. That's why we are disabling all previews.
    const disablePreviews = (0, utils_1.isIosMobileBrowser)();
    const state = (0, functions_1.toState)(stateful);
    const settings = state['features/base/settings'];
    const { permissions } = state['features/base/devices'];
    const inputDeviceChangeSupported = lib_jitsi_meet_1.default.mediaDevices.isDeviceChangeAvailable('input');
    const speakerChangeSupported = lib_jitsi_meet_1.default.mediaDevices.isDeviceChangeAvailable('output');
    const userSelectedMic = (0, functions_web_3.getUserSelectedMicDeviceId)(state);
    const deviceHidSupported = (0, functions_4.isDeviceHidSupported)() && (0, functions_web_1.getWebHIDFeatureConfig)(state);
    const noiseSuppressionEnabled = (0, functions_2.isNoiseSuppressionEnabled)(state);
    const hideNoiseSuppression = (0, functions_3.isPrejoinPageVisible)(state) || isDisplayedOnWelcomePage;
    // When the previews are disabled we don't need multiple audio input support in order to change the mic. This is the
    // case for Safari on iOS.
    let disableAudioInputChange = !lib_jitsi_meet_1.default.mediaDevices.isMultipleAudioInputSupported() && !(disablePreviews && inputDeviceChangeSupported);
    let selectedAudioInputId = settings.micDeviceId;
    let selectedAudioOutputId = (0, functions_web_2.getAudioOutputDeviceId)();
    // audio input change will be a problem only when we are in a
    // conference and this is not supported, when we open device selection on
    // welcome page changing input devices will not be a problem
    // on welcome page we also show only what we have saved as user selected devices
    if (isDisplayedOnWelcomePage) {
        disableAudioInputChange = false;
        selectedAudioInputId = userSelectedMic;
        selectedAudioOutputId = (0, functions_web_3.getUserSelectedOutputDeviceId)(state);
    }
    // we fill the device selection dialog with the devices that are currently
    // used or if none are currently used with what we have in settings(user selected)
    return {
        disableAudioInputChange,
        disableDeviceChange: !lib_jitsi_meet_1.default.mediaDevices.isDeviceChangeAvailable(),
        hasAudioPermission: permissions.audio,
        hideAudioInputPreview: disableAudioInputChange || !lib_jitsi_meet_1.default.isCollectingLocalStats() || disablePreviews,
        hideAudioOutputPreview: !speakerChangeSupported || disablePreviews,
        hideAudioOutputSelect: !speakerChangeSupported,
        hideDeviceHIDContainer: !deviceHidSupported,
        hideNoiseSuppression,
        noiseSuppressionEnabled,
        selectedAudioInputId,
        selectedAudioOutputId
    };
}
exports.getAudioDeviceSelectionDialogProps = getAudioDeviceSelectionDialogProps;
/**
 * Returns the properties for the device selection dialog from Redux state.
 *
 * @param {IStateful} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the device selection dialog.
 */
function getVideoDeviceSelectionDialogProps(stateful, isDisplayedOnWelcomePage) {
    // On mobile Safari because of https://bugs.webkit.org/show_bug.cgi?id=179363#c30, the old track is stopped
    // by the browser when a new track is created for preview. That's why we are disabling all previews.
    const disablePreviews = (0, utils_1.isMobileBrowser)();
    const state = (0, functions_1.toState)(stateful);
    const settings = state['features/base/settings'];
    const { permissions } = state['features/base/devices'];
    const inputDeviceChangeSupported = lib_jitsi_meet_1.default.mediaDevices.isDeviceChangeAvailable('input');
    const userSelectedCamera = (0, functions_web_3.getUserSelectedCameraDeviceId)(state);
    const { localFlipX } = state['features/base/settings'];
    const hideAdditionalSettings = (0, functions_3.isPrejoinPageVisible)(state) || isDisplayedOnWelcomePage;
    const framerate = state['features/screen-share'].captureFrameRate ?? constants_1.SS_DEFAULT_FRAME_RATE;
    let disableVideoInputSelect = !inputDeviceChangeSupported;
    let selectedVideoInputId = settings.cameraDeviceId || userSelectedCamera;
    // audio input change will be a problem only when we are in a
    // conference and this is not supported, when we open device selection on
    // welcome page changing input devices will not be a problem
    // on welcome page we also show only what we have saved as user selected devices
    if (isDisplayedOnWelcomePage) {
        disableVideoInputSelect = false;
        selectedVideoInputId = userSelectedCamera;
    }
    // we fill the device selection dialog with the devices that are currently
    // used or if none are currently used with what we have in settings(user selected)
    return {
        currentFramerate: framerate,
        desktopShareFramerates: constants_1.SS_SUPPORTED_FRAMERATES,
        disableDeviceChange: !lib_jitsi_meet_1.default.mediaDevices.isDeviceChangeAvailable(),
        disableVideoInputSelect,
        hasVideoPermission: permissions.video,
        hideAdditionalSettings,
        hideVideoInputPreview: !inputDeviceChangeSupported || disablePreviews,
        localFlipX: Boolean(localFlipX),
        selectedVideoInputId
    };
}
exports.getVideoDeviceSelectionDialogProps = getVideoDeviceSelectionDialogProps;
/**
 * Processes device requests from external applications.
 *
 * @param {Dispatch} dispatch - The redux {@code dispatch} function.
 * @param {Function} getState - The redux function that gets/retrieves the redux
 * state.
 * @param {Object} request - The request to be processed.
 * @param {Function} responseCallback - The callback that will send the
 * response.
 * @returns {boolean} - True if the request has been processed and false otherwise.
 */
function processExternalDeviceRequest(// eslint-disable-line max-params
dispatch, getState, request, responseCallback) {
    if (request.type !== 'devices') {
        return false;
    }
    const state = getState();
    const settings = state['features/base/settings'];
    let result = true;
    switch (request.name) {
        case 'isDeviceListAvailable':
            responseCallback(lib_jitsi_meet_1.default.mediaDevices.isDeviceListAvailable());
            break;
        case 'isDeviceChangeAvailable':
            responseCallback(lib_jitsi_meet_1.default.mediaDevices.isDeviceChangeAvailable(request.deviceType));
            break;
        case 'isMultipleAudioInputSupported':
            responseCallback(lib_jitsi_meet_1.default.isMultipleAudioInputSupported());
            break;
        case 'getCurrentDevices': // @ts-ignore
            dispatch((0, actions_web_1.getAvailableDevices)()).then((devices) => {
                if ((0, functions_web_2.areDeviceLabelsInitialized)(state)) {
                    const deviceDescriptions = {
                        audioInput: undefined,
                        audioOutput: undefined,
                        videoInput: undefined
                    };
                    const currentlyUsedDeviceIds = new Set([
                        (0, functions_web_2.getAudioOutputDeviceId)(),
                        settings.micDeviceId ?? (0, functions_web_3.getUserSelectedMicDeviceId)(state),
                        settings.cameraDeviceId ?? (0, functions_web_3.getUserSelectedCameraDeviceId)(state)
                    ]);
                    devices.forEach(device => {
                        const { deviceId, kind } = device;
                        if (currentlyUsedDeviceIds.has(deviceId)) {
                            switch (kind) {
                                case 'audioinput':
                                    deviceDescriptions.audioInput = device;
                                    break;
                                case 'audiooutput':
                                    deviceDescriptions.audioOutput = device;
                                    break;
                                case 'videoinput':
                                    deviceDescriptions.videoInput = device;
                                    break;
                            }
                        }
                    });
                    responseCallback(deviceDescriptions);
                }
                else {
                    // The labels are not available if the A/V permissions are
                    // not yet granted.
                    dispatch((0, actions_web_1.addPendingDeviceRequest)({
                        type: 'devices',
                        name: 'getCurrentDevices',
                        responseCallback
                    }));
                }
            });
            break;
        case 'getAvailableDevices': // @ts-ignore
            dispatch((0, actions_web_1.getAvailableDevices)()).then((devices) => {
                if ((0, functions_web_2.areDeviceLabelsInitialized)(state)) {
                    responseCallback((0, functions_web_2.groupDevicesByKind)(devices));
                }
                else {
                    // The labels are not available if the A/V permissions are
                    // not yet granted.
                    dispatch((0, actions_web_1.addPendingDeviceRequest)({
                        type: 'devices',
                        name: 'getAvailableDevices',
                        responseCallback
                    }));
                }
            });
            break;
        case 'setDevice': {
            const { device } = request;
            if (!(0, functions_web_2.areDeviceLabelsInitialized)(state)) {
                dispatch((0, actions_web_1.addPendingDeviceRequest)({
                    type: 'devices',
                    name: 'setDevice',
                    device,
                    responseCallback
                }));
                return true;
            }
            const { label, id } = device;
            const deviceId = label
                ? (0, functions_web_2.getDeviceIdByLabel)(state, device.label, device.kind)
                : id;
            if (deviceId) {
                switch (device.kind) {
                    case 'audioinput':
                        dispatch((0, actions_web_1.setAudioInputDeviceAndUpdateSettings)(deviceId));
                        break;
                    case 'audiooutput':
                        dispatch((0, actions_web_1.setAudioOutputDevice)(deviceId));
                        break;
                    case 'videoinput':
                        dispatch((0, actions_web_1.setVideoInputDeviceAndUpdateSettings)(deviceId));
                        break;
                    default:
                        result = false;
                }
            }
            else {
                result = false;
            }
            responseCallback(result);
            break;
        }
        default:
            return false;
    }
    return true;
}
exports.processExternalDeviceRequest = processExternalDeviceRequest;
