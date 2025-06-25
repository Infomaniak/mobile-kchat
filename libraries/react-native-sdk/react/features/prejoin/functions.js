"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoomNameEnabled = exports.isUnsafeRoomWarningEnabled = exports.shouldAutoKnock = exports.isPrejoinPageVisible = exports.isJoinByPhoneDialogVisible = exports.getRawError = exports.getFullDialOutNumber = exports.getDialOutStatus = exports.getDialOutNumber = exports.getDialOutCountry = exports.getDialOutConferenceUrl = exports.getDeviceStatusType = exports.getDeviceStatusText = exports.isPrejoinDisplayNameVisible = exports.isPrejoinEnabledInConfig = exports.isDisplayNameRequired = exports.isDeviceStatusVisible = exports.isJoinByPhoneButtonVisible = void 0;
const functions_1 = require("../base/conference/functions");
const functions_any_1 = require("../base/config/functions.any");
const constants_1 = require("../base/flags/constants");
const functions_2 = require("../base/flags/functions");
const functions_3 = require("../base/media/functions");
const functions_4 = require("../lobby/functions");
/**
 * Selector for the visibility of the 'join by phone' button.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isJoinByPhoneButtonVisible(state) {
    return Boolean((0, functions_any_1.getDialOutUrl)(state) && (0, functions_any_1.getDialOutStatusUrl)(state));
}
exports.isJoinByPhoneButtonVisible = isJoinByPhoneButtonVisible;
/**
 * Selector for determining if the device status strip is visible or not.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isDeviceStatusVisible(state) {
    return !((0, functions_3.isAudioMuted)(state) && (0, functions_3.isVideoMutedByUser)(state))
        && !state['features/base/config'].startSilent;
}
exports.isDeviceStatusVisible = isDeviceStatusVisible;
/**
 * Selector for determining if the display name is mandatory.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isDisplayNameRequired(state) {
    return Boolean(state['features/lobby']?.isDisplayNameRequiredError
        || state['features/base/config']?.requireDisplayName);
}
exports.isDisplayNameRequired = isDisplayNameRequired;
/**
 * Selector for determining if the prejoin page is enabled in config. Defaults to `true`.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isPrejoinEnabledInConfig(state) {
    return state['features/base/config'].prejoinConfig?.enabled ?? true;
}
exports.isPrejoinEnabledInConfig = isPrejoinEnabledInConfig;
/**
 * Selector for determining if the prejoin display name field is visible.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isPrejoinDisplayNameVisible(state) {
    return !state['features/base/config'].prejoinConfig?.hideDisplayName;
}
exports.isPrejoinDisplayNameVisible = isPrejoinDisplayNameVisible;
/**
 * Returns the text for the prejoin status bar.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
function getDeviceStatusText(state) {
    return state['features/prejoin']?.deviceStatusText;
}
exports.getDeviceStatusText = getDeviceStatusText;
/**
 * Returns the type of the prejoin status bar: 'ok'|'warning'.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
function getDeviceStatusType(state) {
    return state['features/prejoin']?.deviceStatusType;
}
exports.getDeviceStatusType = getDeviceStatusType;
/**
 * Returns the 'conferenceUrl' used for dialing out.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
function getDialOutConferenceUrl(state) {
    return `${(0, functions_1.getRoomName)(state)}@${state['features/base/config'].hosts?.muc}`;
}
exports.getDialOutConferenceUrl = getDialOutConferenceUrl;
/**
 * Selector for getting the dial out country.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {Object}
 */
function getDialOutCountry(state) {
    return state['features/prejoin'].dialOutCountry;
}
exports.getDialOutCountry = getDialOutCountry;
/**
 * Selector for getting the dial out number (without prefix).
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
function getDialOutNumber(state) {
    return state['features/prejoin'].dialOutNumber;
}
exports.getDialOutNumber = getDialOutNumber;
/**
 * Selector for getting the dial out status while calling.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
function getDialOutStatus(state) {
    return state['features/prejoin'].dialOutStatus;
}
exports.getDialOutStatus = getDialOutStatus;
/**
 * Returns the full dial out number (containing country code and +).
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
function getFullDialOutNumber(state) {
    const dialOutNumber = getDialOutNumber(state);
    const country = getDialOutCountry(state);
    return `+${country.dialCode}${dialOutNumber}`;
}
exports.getFullDialOutNumber = getFullDialOutNumber;
/**
 * Selector for getting the error if any while creating streams.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
function getRawError(state) {
    return state['features/prejoin']?.rawError;
}
exports.getRawError = getRawError;
/**
 * Selector for getting the visibility state for the 'JoinByPhoneDialog'.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isJoinByPhoneDialogVisible(state) {
    return state['features/prejoin']?.showJoinByPhoneDialog;
}
exports.isJoinByPhoneDialogVisible = isJoinByPhoneDialogVisible;
/**
 * Returns true if the prejoin page is enabled and no flag
 * to bypass showing the page is present.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isPrejoinPageVisible(state) {
    return Boolean(navigator.product !== 'ReactNative'
        && isPrejoinEnabledInConfig(state)
        && state['features/prejoin']?.showPrejoin
        && !(state['features/base/config'].enableForcedReload && state['features/prejoin'].skipPrejoinOnReload));
}
exports.isPrejoinPageVisible = isPrejoinPageVisible;
/**
 * Returns true if we should auto-knock in case lobby is enabled for the room.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function shouldAutoKnock(state) {
    const { iAmRecorder, iAmSipGateway } = state['features/base/config'];
    const { userSelectedSkipPrejoin } = state['features/base/settings'];
    const { autoKnock } = (0, functions_4.getLobbyConfig)(state);
    return Boolean(((isPrejoinEnabledInConfig(state) && !userSelectedSkipPrejoin)
        || autoKnock || (iAmRecorder && iAmSipGateway))
        && !state['features/lobby'].knocking);
}
exports.shouldAutoKnock = shouldAutoKnock;
/**
 * Returns true if the unsafe room warning flag is enabled.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isUnsafeRoomWarningEnabled(state) {
    const { enableInsecureRoomNameWarning = false } = state['features/base/config'];
    return (0, functions_2.getFeatureFlag)(state, constants_1.UNSAFE_ROOM_WARNING, enableInsecureRoomNameWarning);
}
exports.isUnsafeRoomWarningEnabled = isUnsafeRoomWarningEnabled;
/**
 * Returns true if the room name is enabled.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isRoomNameEnabled(state) {
    const { hideConferenceSubject = false } = state['features/base/config'];
    return (0, functions_2.getFeatureFlag)(state, constants_1.MEETING_NAME_ENABLED, true)
        && !hideConferenceSubject;
}
exports.isRoomNameEnabled = isRoomNameEnabled;
