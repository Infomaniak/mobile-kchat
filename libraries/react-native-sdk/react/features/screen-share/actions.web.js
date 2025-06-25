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
exports.startScreenShareFlow = exports.startAudioScreenShareFlow = exports.setScreenshareAudioTrack = exports.setScreenAudioShareState = void 0;
const actions_1 = require("../base/dialog/actions");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_web_1 = require("../base/settings/functions.web");
const actions_web_1 = require("../base/tracks/actions.web");
const actionTypes_1 = require("./actionTypes");
const ShareAudioDialog_1 = __importDefault(require("./components/web/ShareAudioDialog"));
const ShareScreenWarningDialog_1 = __importDefault(require("./components/web/ShareScreenWarningDialog"));
const functions_1 = require("./functions");
__exportStar(require("./actions.any"), exports);
/**
 * Updates the current known status of the shared video.
 *
 * @param {boolean} isSharingAudio - Is audio currently being shared or not.
 * @returns {{
 *     type: SET_SCREEN_AUDIO_SHARE_STATE,
 *     isSharingAudio: boolean
 * }}
 */
function setScreenAudioShareState(isSharingAudio) {
    return {
        type: actionTypes_1.SET_SCREEN_AUDIO_SHARE_STATE,
        isSharingAudio
    };
}
exports.setScreenAudioShareState = setScreenAudioShareState;
/**
 * Updates the audio track associated with the screenshare.
 *
 * @param {JitsiLocalTrack} desktopAudioTrack - The audio track captured from the screenshare.
 * @returns {{
 *      type: SET_SCREENSHARE_TRACKS,
 *      desktopAudioTrack: JitsiTrack
 * }}
 */
function setScreenshareAudioTrack(desktopAudioTrack) {
    return {
        type: actionTypes_1.SET_SCREENSHARE_TRACKS,
        desktopAudioTrack
    };
}
exports.setScreenshareAudioTrack = setScreenshareAudioTrack;
/**
 * Start the audio only screen sharing flow. Function will switch between off and on states depending on the context.
 *
 * @param {Object} state - The state of the application.
 * @returns {void}
 */
function startAudioScreenShareFlow() {
    return (dispatch, getState) => {
        const state = getState();
        const audioOnlySharing = (0, functions_1.isAudioOnlySharing)(state);
        // If we're already in a normal screen sharing session, warn the user.
        if ((0, functions_1.isScreenVideoShared)(state)) {
            dispatch((0, actions_1.openDialog)(ShareScreenWarningDialog_1.default, { _isAudioScreenShareWarning: true }));
            return;
        }
        // If users opted out of the helper dialog toggle directly.
        // If we're in an electron environment the helper dialog is not needed as there's only one option
        // available for audio screen sharing, namely full window audio.
        // If we're already sharing audio, toggle off.
        if ((0, functions_web_1.shouldHideShareAudioHelper)(state) || lib_jitsi_meet_1.browser.isElectron() || audioOnlySharing) {
            // We don't want to explicitly set the screens share state, by passing undefined we let the
            // underlying logic decide if it's on or off.
            dispatch((0, actions_web_1.toggleScreensharing)(undefined, true));
            return;
        }
        dispatch((0, actions_1.openDialog)(ShareAudioDialog_1.default));
    };
}
exports.startAudioScreenShareFlow = startAudioScreenShareFlow;
/**
 * Start normal screen sharing flow.Function will switch between off and on states depending on the context, and if
 * not explicitly told otherwise.
 *
 * @param {boolean} enabled - Explicitly set the screen sharing state.
 * @returns {void}
 */
function startScreenShareFlow(enabled) {
    return (dispatch, getState) => {
        const state = getState();
        const audioOnlySharing = (0, functions_1.isAudioOnlySharing)(state);
        // If we're in an audio screen sharing session, warn the user.
        if (audioOnlySharing) {
            dispatch((0, actions_1.openDialog)(ShareScreenWarningDialog_1.default, { _isAudioScreenShareWarning: false }));
            return;
        }
        dispatch((0, actions_web_1.toggleScreensharing)(enabled));
    };
}
exports.startScreenShareFlow = startScreenShareFlow;
