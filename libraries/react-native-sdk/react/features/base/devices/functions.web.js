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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAudioOutputDeviceId = exports.logDevices = exports.getVideoDeviceIds = exports.getAudioOutputDeviceData = exports.getAudioInputDeviceData = exports.formatDeviceLabel = exports.flattenAvailableDevices = exports.areDevicesDifferent = exports.filterIgnoredDevices = exports.filterAudioDevices = exports.groupDevicesByKind = exports.getDevicesFromURL = exports.getDeviceLabelById = exports.getDeviceIdByLabel = exports.getDefaultDeviceId = exports.getAudioOutputDeviceId = exports.areDeviceLabelsInitialized = void 0;
const lib_jitsi_meet_1 = __importDefault(require("../lib-jitsi-meet"));
const actions_1 = require("../settings/actions");
const functions_web_1 = require("../sounds/functions.web");
const parseURLParams_1 = require("../util/parseURLParams");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
__exportStar(require("./functions.any"), exports);
const webrtcKindToJitsiKindTranslator = {
    audioinput: 'audioInput',
    audiooutput: 'audioOutput',
    videoinput: 'videoInput'
};
/**
 * Detects the use case when the labels are not available if the A/V permissions
 * are not yet granted.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} - True if the labels are already initialized and false
 * otherwise.
 */
function areDeviceLabelsInitialized(state) {
    // TODO: Replace with something that doesn't use APP when the conference.js logic is reactified.
    if (APP.conference._localTracksInitialized) {
        return true;
    }
    for (const type of ['audioInput', 'audioOutput', 'videoInput']) {
        const availableDevices = state['features/base/devices'].availableDevices;
        if ((availableDevices[type] || []).find(d => Boolean(d.label))) {
            return true;
        }
    }
    return false;
}
exports.areDeviceLabelsInitialized = areDeviceLabelsInitialized;
/**
 * Get device id of the audio output device which is currently in use.
 * Empty string stands for default device.
 *
 * @returns {string}
 */
function getAudioOutputDeviceId() {
    return lib_jitsi_meet_1.default.mediaDevices.getAudioOutputDevice();
}
exports.getAudioOutputDeviceId = getAudioOutputDeviceId;
/**
 * Finds the real device id of the default device of the given type.
 *
 * @param {Object} state - The redux state.
 * @param {*} kind - The type of the device. One of "audioInput",
 * "audioOutput", and "videoInput". Also supported is all lowercase versions
 * of the preceding types.
 * @returns {string|undefined}
 */
function getDefaultDeviceId(state, kind) {
    const kindToSearch = webrtcKindToJitsiKindTranslator[kind] || kind;
    const availableDevices = state['features/base/devices'].availableDevices;
    const defaultDevice = (availableDevices[kindToSearch] || [])
        .find(d => d.deviceId === 'default');
    // Find the device with a matching group id.
    const matchingDevice = (availableDevices[kindToSearch] || [])
        .find(d => d.deviceId !== 'default' && d.groupId === defaultDevice?.groupId);
    if (matchingDevice) {
        return matchingDevice.deviceId;
    }
}
exports.getDefaultDeviceId = getDefaultDeviceId;
/**
 * Finds a device with a label that matches the passed label and returns its id.
 *
 * @param {Object} state - The redux state.
 * @param {string} label - The label.
 * @param {string} kind - The type of the device. One of "audioInput",
 * "audioOutput", and "videoInput". Also supported is all lowercase versions
 * of the preceding types.
 * @returns {string|undefined}
 */
function getDeviceIdByLabel(state, label, kind) {
    const kindToSearch = webrtcKindToJitsiKindTranslator[kind] || kind;
    const availableDevices = state['features/base/devices'].availableDevices;
    const device = (availableDevices[kindToSearch] || [])
        .find(d => d.label === label);
    if (device) {
        return device.deviceId;
    }
}
exports.getDeviceIdByLabel = getDeviceIdByLabel;
/**
 * Finds a device with a label that matches the passed id and returns its label.
 *
 * @param {Object} state - The redux state.
 * @param {string} id - The device id.
 * @param {string} kind - The type of the device. One of "audioInput",
 * "audioOutput", and "videoInput". Also supported is all lowercase versions
 * of the preceding types.
 * @returns {string|undefined}
 */
function getDeviceLabelById(state, id, kind) {
    const kindToSearch = webrtcKindToJitsiKindTranslator[kind] || kind;
    const availableDevices = state['features/base/devices'].availableDevices;
    const device = (availableDevices[kindToSearch] || [])
        .find(d => d.deviceId === id);
    if (device) {
        return device.label;
    }
}
exports.getDeviceLabelById = getDeviceLabelById;
/**
 * Returns the devices set in the URL.
 *
 * @param {Object} state - The redux state.
 * @returns {Object|undefined}
 */
function getDevicesFromURL(state) {
    const urlParams = (0, parseURLParams_1.parseURLParams)(state['features/base/connection'].locationURL ?? '');
    const audioOutput = urlParams['devices.audioOutput'];
    const videoInput = urlParams['devices.videoInput'];
    const audioInput = urlParams['devices.audioInput'];
    if (!audioOutput && !videoInput && !audioInput) {
        return undefined;
    }
    const devices = {};
    audioOutput && (devices.audioOutput = audioOutput);
    videoInput && (devices.videoInput = videoInput);
    audioInput && (devices.audioInput = audioInput);
    return devices;
}
exports.getDevicesFromURL = getDevicesFromURL;
/**
 * Converts an array of media devices into an object organized by device kind.
 *
 * @param {Array<MediaDeviceInfo>} devices - Available media devices.
 * @private
 * @returns {Object} An object with the media devices split by type. The keys
 * are device type and the values are arrays with devices matching the device
 * type.
 */
function groupDevicesByKind(devices) {
    return {
        audioInput: devices.filter(device => device.kind === 'audioinput'),
        audioOutput: devices.filter(device => device.kind === 'audiooutput'),
        videoInput: devices.filter(device => device.kind === 'videoinput')
    };
}
exports.groupDevicesByKind = groupDevicesByKind;
/**
 * Filters audio devices from a list of MediaDeviceInfo objects.
 *
 * @param {Array<MediaDeviceInfo>} devices - Unfiltered media devices.
 * @private
 * @returns {Array<MediaDeviceInfo>} Filtered audio devices.
 */
function filterAudioDevices(devices) {
    return devices.filter(device => device.kind === 'audioinput');
}
exports.filterAudioDevices = filterAudioDevices;
/**
 * Filters the devices that start with one of the prefixes from DEVICE_LABEL_PREFIXES_TO_IGNORE.
 *
 * @param {MediaDeviceInfo[]} devices - The devices to be filtered.
 * @returns {MediaDeviceInfo[]} - The filtered devices.
 */
function filterIgnoredDevices(devices = []) {
    const ignoredDevices = [];
    const filteredDevices = devices.filter(device => {
        if (!device.label) {
            return true;
        }
        if (constants_1.DEVICE_LABEL_PREFIXES_TO_IGNORE.find(prefix => device.label?.startsWith(prefix))) {
            ignoredDevices.push(device);
            return false;
        }
        return true;
    });
    return {
        filteredDevices,
        ignoredDevices
    };
}
exports.filterIgnoredDevices = filterIgnoredDevices;
/**
 * Check if the passed device arrays are different.
 *
 * @param {MediaDeviceInfo[]} devices1 - Array with devices to be compared.
 * @param {MediaDeviceInfo[]} devices2 - Array with devices to be compared.
 * @returns {boolean} - True if the device arrays are different and false otherwise.
*/
function areDevicesDifferent(devices1 = [], devices2 = []) {
    if (devices1.length !== devices2.length) {
        return true;
    }
    for (let i = 0; i < devices1.length; i++) {
        const device1 = devices1[i];
        const found = devices2.find(({ deviceId, groupId, kind, label }) => device1.deviceId === deviceId
            && device1.groupId === groupId
            && device1.kind === kind
            && device1.label === label);
        if (!found) {
            return true;
        }
    }
    return false;
}
exports.areDevicesDifferent = areDevicesDifferent;
/**
 * Flattens the availableDevices from redux.
 *
 * @param {IDevicesState.availableDevices} devices - The available devices from redux.
 * @returns {MediaDeviceInfo[]} - The flattened array of devices.
 */
function flattenAvailableDevices({ audioInput = [], audioOutput = [], videoInput = [] }) {
    return audioInput.concat(audioOutput).concat(videoInput);
}
exports.flattenAvailableDevices = flattenAvailableDevices;
/**
 * We want to strip any device details that are not very user friendly, like usb ids put in brackets at the end.
 *
 * @param {string} label - Device label to format.
 *
 * @returns {string} - Formatted string.
 */
function formatDeviceLabel(label) {
    let formattedLabel = label;
    // Remove braked description at the end as it contains non user friendly strings i.e.
    // Microsoft® LifeCam HD-3000 (045e:0779:31dg:d1231)
    const ix = formattedLabel.lastIndexOf('(');
    if (ix !== -1) {
        formattedLabel = formattedLabel.substr(0, ix);
    }
    return formattedLabel;
}
exports.formatDeviceLabel = formatDeviceLabel;
/**
 * Returns a list of objects containing all the microphone device ids and labels.
 *
 * @param {Object} state - The state of the application.
 * @returns {Object[]}
 */
function getAudioInputDeviceData(state) {
    return state['features/base/devices'].availableDevices.audioInput?.map(({ deviceId, label }) => {
        return {
            deviceId,
            label
        };
    });
}
exports.getAudioInputDeviceData = getAudioInputDeviceData;
/**
 * Returns a list of objectes containing all the output device ids and labels.
 *
 * @param {Object} state - The state of the application.
 * @returns {Object[]}
 */
function getAudioOutputDeviceData(state) {
    return state['features/base/devices'].availableDevices.audioOutput?.map(({ deviceId, label }) => {
        return {
            deviceId,
            label
        };
    });
}
exports.getAudioOutputDeviceData = getAudioOutputDeviceData;
/**
 * Returns a list of all the camera device ids.
 *
 * @param {Object} state - The state of the application.
 * @returns {string[]}
 */
function getVideoDeviceIds(state) {
    return state['features/base/devices'].availableDevices.videoInput?.map(({ deviceId }) => deviceId);
}
exports.getVideoDeviceIds = getVideoDeviceIds;
/**
 * Converts an array of device info objects into string.
 *
 * @param {MediaDeviceInfo[]} devices - The devices.
 * @returns {string}
 */
function devicesToStr(devices) {
    return devices?.map(device => `\t\t${device.label}[${device.deviceId}]`).join('\n');
}
/**
 * Logs an array of devices.
 *
 * @param {MediaDeviceInfo[]} devices - The array of devices.
 * @param {string} title - The title that will be printed in the log.
 * @returns {void}
 */
function logDevices(devices, title = '') {
    const deviceList = groupDevicesByKind(devices);
    const audioInputs = devicesToStr(deviceList.audioInput);
    const audioOutputs = devicesToStr(deviceList.audioOutput);
    const videoInputs = devicesToStr(deviceList.videoInput);
    logger_1.default.debug(`${title}:\n`
        + `audioInput:\n${audioInputs}\n`
        + `audioOutput:\n${audioOutputs}\n`
        + `videoInput:\n${videoInputs}`);
}
exports.logDevices = logDevices;
/**
 * Set device id of the audio output device which is currently in use.
 * Empty string stands for default device.
 *
 * @param {string} newId - New audio output device id.
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {boolean} userSelection - Whether this is a user selection update.
 * @param {?string} newLabel - New audio output device label to store.
 * @returns {Promise}
 */
function setAudioOutputDeviceId(newId = 'default', dispatch, userSelection = false, newLabel) {
    logger_1.default.debug(`setAudioOutputDevice: ${String(newLabel)}[${newId}]`);
    if (!lib_jitsi_meet_1.default.mediaDevices.isDeviceChangeAvailable('output')) {
        logger_1.default.warn('Adjusting audio output is not supported');
        return Promise.resolve();
    }
    return lib_jitsi_meet_1.default.mediaDevices.setAudioOutputDevice(newId)
        .then(() => {
        dispatch((0, functions_web_1.setNewAudioOutputDevice)(newId));
        const newSettings = {
            audioOutputDeviceId: newId,
            userSelectedAudioOutputDeviceId: undefined,
            userSelectedAudioOutputDeviceLabel: undefined
        };
        if (userSelection) {
            newSettings.userSelectedAudioOutputDeviceId = newId;
            newSettings.userSelectedAudioOutputDeviceLabel = newLabel;
        }
        else {
            // a flow workaround, I needed to add 'userSelectedAudioOutputDeviceId: undefined'
            delete newSettings.userSelectedAudioOutputDeviceId;
            delete newSettings.userSelectedAudioOutputDeviceLabel;
        }
        return dispatch((0, actions_1.updateSettings)(newSettings));
    });
}
exports.setAudioOutputDeviceId = setAudioOutputDeviceId;
