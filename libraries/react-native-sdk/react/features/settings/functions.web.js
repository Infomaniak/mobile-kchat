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
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldShowModeratorSettings = exports.isSettingEnabled = exports.getVirtualBackgroundTabProps = exports.getShortcutsTabProps = exports.createLocalAudioTracks = exports.createLocalVideoTracks = void 0;
const functions_1 = require("../base/lib-jitsi-meet/functions");
const functions_2 = require("../base/participants/functions");
const functions_3 = require("../base/redux/functions");
const functions_web_1 = require("../base/settings/functions.web");
const functions_4 = require("../keyboard-shortcuts/functions");
const functions_5 = require("../participants-pane/functions");
const functions_6 = require("../prejoin/functions");
__exportStar(require("./functions.any"), exports);
/**
 * Returns a promise which resolves with a list of objects containing
 * all the video jitsiTracks and appropriate errors for the given device ids.
 *
 * @param {string[]} ids - The list of the camera ids for which to create tracks.
 * @param {number} [timeout] - A timeout for the createLocalTrack function call.
 *
 * @returns {Promise<Object[]>}
 */
function createLocalVideoTracks(ids, timeout) {
    return Promise.all(ids.map(deviceId => (0, functions_1.createLocalTrack)('video', deviceId, timeout)
        .then((jitsiTrack) => {
        return {
            jitsiTrack,
            deviceId
        };
    })
        .catch(() => {
        return {
            jitsiTrack: null,
            deviceId,
            error: 'deviceSelection.previewUnavailable'
        };
    })));
}
exports.createLocalVideoTracks = createLocalVideoTracks;
/**
 * Returns a promise which resolves with a list of objects containing
 * the audio track and the corresponding audio device information.
 *
 * @param {Object[]} devices - A list of microphone devices.
 * @param {number} [timeout] - A timeout for the createLocalTrack function call.
 * @returns {Promise<{
 *   deviceId: string,
 *   hasError: boolean,
 *   jitsiTrack: Object,
 *   label: string
 * }[]>}
 */
function createLocalAudioTracks(devices, timeout) {
    return Promise.all(devices.map(async ({ deviceId, label }) => {
        let jitsiTrack = null;
        let hasError = false;
        try {
            jitsiTrack = await (0, functions_1.createLocalTrack)('audio', deviceId, timeout);
        }
        catch (err) {
            hasError = true;
        }
        return {
            deviceId,
            hasError,
            jitsiTrack,
            label
        };
    }));
}
exports.createLocalAudioTracks = createLocalAudioTracks;
/**
 * Returns the properties for the "Shortcuts" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the shortcuts dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the "Shortcuts" tab from settings
 * dialog.
 */
function getShortcutsTabProps(stateful, isDisplayedOnWelcomePage) {
    const state = (0, functions_3.toState)(stateful);
    return {
        displayShortcuts: !isDisplayedOnWelcomePage && !(0, functions_6.isPrejoinPageVisible)(state),
        keyboardShortcutsEnabled: (0, functions_4.areKeyboardShortcutsEnabled)(state),
        keyboardShortcutsHelpDescriptions: (0, functions_4.getKeyboardShortcutsHelpDescriptions)(state)
    };
}
exports.getShortcutsTabProps = getShortcutsTabProps;
/**
 * Returns the properties for the "Virtual Background" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the "Shortcuts" tab from settings
 * dialog.
 */
function getVirtualBackgroundTabProps(stateful, isDisplayedOnWelcomePage) {
    const state = (0, functions_3.toState)(stateful);
    const settings = state['features/base/settings'];
    const userSelectedCamera = (0, functions_web_1.getUserSelectedCameraDeviceId)(state);
    let selectedVideoInputId = settings.cameraDeviceId;
    if (isDisplayedOnWelcomePage) {
        selectedVideoInputId = userSelectedCamera;
    }
    return {
        options: state['features/virtual-background'],
        selectedVideoInputId
    };
}
exports.getVirtualBackgroundTabProps = getVirtualBackgroundTabProps;
/**
 * Used for web. Indicates if the setting section is enabled.
 *
 * @param {string} settingName - The name of the setting section as defined in
 * interface_config.js and SettingsMenu.js.
 * @returns {boolean} True to indicate that the given setting section
 * is enabled, false otherwise.
 */
function isSettingEnabled(settingName) {
    return interfaceConfig.SETTINGS_SECTIONS.includes(settingName);
}
exports.isSettingEnabled = isSettingEnabled;
/**
 * Returns true if moderator tab in settings should be visible/accessible.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {boolean} True to indicate that moderator tab should be visible, false otherwise.
 */
function shouldShowModeratorSettings(stateful) {
    const state = (0, functions_3.toState)(stateful);
    const { hideModeratorSettingsTab } = (0, functions_5.getParticipantsPaneConfig)(state);
    const hasModeratorRights = Boolean(isSettingEnabled('moderator') && (0, functions_2.isLocalParticipantModerator)(state));
    return hasModeratorRights && !hideModeratorSettingsTab;
}
exports.shouldShowModeratorSettings = shouldShowModeratorSettings;
