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
exports.getUserSelectedOutputDeviceId = exports.getUserSelectedMicDeviceId = exports.getUserSelectedCameraDeviceId = exports.getDisplayName = exports.getCurrentOutputDeviceId = exports.getCurrentMicDeviceId = exports.getCurrentCameraDeviceId = void 0;
const functions_1 = require("../redux/functions");
__exportStar(require("./functions.any"), exports);
/**
 * Returns the deviceId for the currently used camera.
 *
 * @param {Object} state - The state of the application.
 * @returns {void}
 */
function getCurrentCameraDeviceId(state) {
    return getDeviceIdByType(state, 'isVideoTrack');
}
exports.getCurrentCameraDeviceId = getCurrentCameraDeviceId;
/**
 * Returns the deviceId for the currently used microphone.
 *
 * @param {Object} state - The state of the application.
 * @returns {void}
 */
function getCurrentMicDeviceId(state) {
    return getDeviceIdByType(state, 'isAudioTrack');
}
exports.getCurrentMicDeviceId = getCurrentMicDeviceId;
/**
 * Returns the deviceId for the currently used speaker.
 *
 * @param {Object} state - The state of the application.
 * @returns {void}
 */
function getCurrentOutputDeviceId(state) {
    return state['features/base/settings'].audioOutputDeviceId;
}
exports.getCurrentOutputDeviceId = getCurrentOutputDeviceId;
/**
 * Returns the deviceId for the corresponding local track type.
 *
 * @param {Object} state - The state of the application.
 * @param {string} isType - Can be 'isVideoTrack' | 'isAudioTrack'.
 * @returns {string}
 */
function getDeviceIdByType(state, isType) {
    const [deviceId] = state['features/base/tracks']
        .map(t => t.jitsiTrack)
        .filter(t => t?.isLocal() && t[isType]())
        .map(t => t.getDeviceId());
    return deviceId || '';
}
/**
 * Returns the saved display name.
 *
 * @param {Object} state - The state of the application.
 * @returns {string}
 */
function getDisplayName(state) {
    return state['features/base/settings'].displayName || '';
}
exports.getDisplayName = getDisplayName;
/**
 * Searches known devices for a matching deviceId and fall back to matching on
 * label. Returns the stored preferred cameraDeviceId if a match is not found.
 *
 * @param {Object|Function} stateful - The redux state object or
 * {@code getState} function.
 * @returns {string}
 */
function getUserSelectedCameraDeviceId(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { userSelectedCameraDeviceId, userSelectedCameraDeviceLabel } = state['features/base/settings'];
    const { videoInput } = state['features/base/devices'].availableDevices;
    return _getUserSelectedDeviceId({
        availableDevices: videoInput,
        // Operating systems may append " #{number}" somewhere in the label so
        // find and strip that bit.
        matchRegex: /\s#\d*(?!.*\s#\d*)/,
        userSelectedDeviceId: userSelectedCameraDeviceId,
        userSelectedDeviceLabel: userSelectedCameraDeviceLabel,
        replacement: ''
    });
}
exports.getUserSelectedCameraDeviceId = getUserSelectedCameraDeviceId;
/**
 * Searches known devices for a matching deviceId and fall back to matching on
 * label. Returns the stored preferred micDeviceId if a match is not found.
 *
 * @param {Object|Function} stateful - The redux state object or
 * {@code getState} function.
 * @returns {string}
 */
function getUserSelectedMicDeviceId(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { userSelectedMicDeviceId, userSelectedMicDeviceLabel } = state['features/base/settings'];
    const { audioInput } = state['features/base/devices'].availableDevices;
    return _getUserSelectedDeviceId({
        availableDevices: audioInput,
        // Operating systems may append " ({number}-" somewhere in the label so
        // find and strip that bit.
        matchRegex: /\s\(\d*-\s(?!.*\s\(\d*-\s)/,
        userSelectedDeviceId: userSelectedMicDeviceId,
        userSelectedDeviceLabel: userSelectedMicDeviceLabel,
        replacement: ' ('
    });
}
exports.getUserSelectedMicDeviceId = getUserSelectedMicDeviceId;
/**
 * Searches known devices for a matching deviceId and fall back to matching on
 * label. Returns the stored preferred audioOutputDeviceId if a match is not found.
 *
 * @param {Object|Function} stateful - The redux state object or
 * {@code getState} function.
 * @returns {string}
 */
function getUserSelectedOutputDeviceId(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { userSelectedAudioOutputDeviceId, userSelectedAudioOutputDeviceLabel } = state['features/base/settings'];
    const { audioOutput } = state['features/base/devices'].availableDevices;
    return _getUserSelectedDeviceId({
        availableDevices: audioOutput,
        matchRegex: undefined,
        userSelectedDeviceId: userSelectedAudioOutputDeviceId,
        userSelectedDeviceLabel: userSelectedAudioOutputDeviceLabel,
        replacement: undefined
    });
}
exports.getUserSelectedOutputDeviceId = getUserSelectedOutputDeviceId;
/**
 * A helper function to abstract the logic for choosing which device ID to
 * use. Falls back to fuzzy matching on label if a device ID match is not found.
 *
 * @param {Object} options - The arguments used to match find the preferred
 * device ID from available devices.
 * @param {Array<string>} options.availableDevices - The array of currently
 * available devices to match against.
 * @param {Object} options.matchRegex - The regex to use to find strings
 * appended to the label by the operating system. The matches will be replaced
 * with options.replacement, with the intent of matching the same device that
 * might have a modified label.
 * @param {string} options.userSelectedDeviceId - The device ID the participant
 * prefers to use.
 * @param {string} options.userSelectedDeviceLabel - The label associated with the
 * device ID the participant prefers to use.
 * @param {string} options.replacement - The string to use with
 * options.matchRegex to remove identifies added to the label by the operating
 * system.
 * @private
 * @returns {string} The preferred device ID to use for media.
 */
function _getUserSelectedDeviceId(options) {
    const { availableDevices, matchRegex = '', userSelectedDeviceId, userSelectedDeviceLabel, replacement = '' } = options;
    // If there is no label at all, there is no need to fall back to checking
    // the label for a fuzzy match.
    if (!userSelectedDeviceLabel || !userSelectedDeviceId) {
        return userSelectedDeviceId;
    }
    const foundMatchingBasedonDeviceId = availableDevices?.find(candidate => candidate.deviceId === userSelectedDeviceId);
    // Prioritize matching the deviceId
    if (foundMatchingBasedonDeviceId) {
        return userSelectedDeviceId;
    }
    const strippedDeviceLabel = matchRegex ? userSelectedDeviceLabel.replace(matchRegex, replacement)
        : userSelectedDeviceLabel;
    const foundMatchBasedOnLabel = availableDevices?.find(candidate => {
        const { label } = candidate;
        if (!label) {
            return false;
        }
        else if (strippedDeviceLabel === label) {
            return true;
        }
        const strippedCandidateLabel = label.replace(matchRegex, replacement);
        return strippedDeviceLabel === strippedCandidateLabel;
    });
    return foundMatchBasedOnLabel?.deviceId;
}
