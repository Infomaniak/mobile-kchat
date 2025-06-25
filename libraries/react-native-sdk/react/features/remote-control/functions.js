"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModifiers = exports.getKey = exports.getRemoteConrolEventCaptureArea = exports.onRemoteControlAPIEvent = exports.sendRemoteControlEndpointMessage = exports.isRemoteControlEnabled = void 0;
// @ts-expect-error
const VideoLayout_1 = __importDefault(require("../../../modules/UI/videolayout/VideoLayout"));
const lib_jitsi_meet_1 = __importDefault(require("../base/lib-jitsi-meet"));
const actions_1 = require("./actions");
const constants_1 = require("./constants");
const keycodes_1 = require("./keycodes");
const logger_1 = __importDefault(require("./logger"));
/**
 * Checks if the remote control is enabled.
 *
 * @param {*} state - The redux state.
 * @returns {boolean} - True if the remote control is enabled and false otherwise.
 */
function isRemoteControlEnabled(state) {
    return !state['features/base/config'].disableRemoteControl && lib_jitsi_meet_1.default.isDesktopSharingEnabled();
}
exports.isRemoteControlEnabled = isRemoteControlEnabled;
/**
 * Sends remote control message to other participant through data channel.
 *
 * @param {JitsiConference} conference - The JitsiConference object.
 * @param {string} to - The participant who will receive the event.
 * @param {RemoteControlEvent} event - The remote control event.
 * @returns {boolean} - True if the message was sent successfully and false otherwise.
 */
function sendRemoteControlEndpointMessage(conference, to, event) {
    if (!to) {
        logger_1.default.warn('Remote control: Skip sending remote control event. Params:', to);
        return false;
    }
    try {
        conference?.sendEndpointMessage(to, {
            name: constants_1.REMOTE_CONTROL_MESSAGE_NAME,
            ...event
        });
        return true;
    }
    catch (error) {
        logger_1.default.error('Failed to send EndpointMessage via the datachannels', error);
        return false;
    }
}
exports.sendRemoteControlEndpointMessage = sendRemoteControlEndpointMessage;
/**
* Handles remote control events from the external app. Currently only
* events with type EVENTS.supported and EVENTS.stop are
* supported.
*
* @param {RemoteControlEvent} event - The remote control event.
* @param {Store} store - The redux store.
* @returns {void}
*/
function onRemoteControlAPIEvent(event, { getState, dispatch }) {
    switch (event.type) {
        case constants_1.EVENTS.supported:
            logger_1.default.log('Remote Control supported.');
            if (isRemoteControlEnabled(getState())) {
                dispatch((0, actions_1.enableReceiver)());
            }
            else {
                logger_1.default.log('Remote Control disabled.');
            }
            break;
        case constants_1.EVENTS.stop: {
            dispatch((0, actions_1.stopReceiver)());
            break;
        }
    }
}
exports.onRemoteControlAPIEvent = onRemoteControlAPIEvent;
/**
 * Returns the area used for capturing mouse and key events.
 *
 * @returns {JQuery} - A JQuery selector.
 */
function getRemoteConrolEventCaptureArea() {
    return VideoLayout_1.default.getLargeVideoWrapper();
}
exports.getRemoteConrolEventCaptureArea = getRemoteConrolEventCaptureArea;
/**
 * Extract the keyboard key from the keyboard event.
 *
 * @param {KeyboardEvent} event - The event.
 * @returns {KEYS} The key that is pressed or undefined.
 */
function getKey(event) {
    return (0, keycodes_1.keyboardEventToKey)(event);
}
exports.getKey = getKey;
/**
 * Extract the modifiers from the keyboard event.
 *
 * @param {KeyboardEvent} event - The event.
 * @returns {Array} With possible values: "shift", "control", "alt", "command".
 */
function getModifiers(event) {
    const modifiers = [];
    if (event.shiftKey) {
        modifiers.push('shift');
    }
    if (event.ctrlKey) {
        modifiers.push('control');
    }
    if (event.altKey) {
        modifiers.push('alt');
    }
    if (event.metaKey) {
        modifiers.push('command');
    }
    return modifiers;
}
exports.getModifiers = getModifiers;
