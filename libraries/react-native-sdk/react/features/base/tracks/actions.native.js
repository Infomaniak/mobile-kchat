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
exports.toggleScreensharing = void 0;
const functions_1 = require("../../mobile/picture-in-picture/functions");
const actions_1 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const constants_2 = require("../flags/constants");
const functions_2 = require("../flags/functions");
const lib_jitsi_meet_1 = __importDefault(require("../lib-jitsi-meet"));
const actions_2 = require("../media/actions");
const constants_3 = require("../media/constants");
const actions_any_1 = require("./actions.any");
const functions_native_1 = require("./functions.native");
__exportStar(require("./actions.any"), exports);
/**
 * Signals that the local participant is ending screensharing or beginning the screensharing flow.
 *
 * @param {boolean} enabled - The state to toggle screen sharing to.
 * @param {boolean} _ignore1 - Ignored.
 * @param {any} _ignore2 - Ignored.
 * @returns {Function}
 */
function toggleScreensharing(enabled, _ignore1, _ignore2) {
    return (dispatch, getState) => {
        const state = getState();
        if (enabled) {
            const isSharing = (0, functions_native_1.isLocalVideoTrackDesktop)(state);
            if (!isSharing) {
                _startScreenSharing(dispatch, state);
            }
        }
        else {
            dispatch((0, actions_2.setScreenshareMuted)(true));
            dispatch((0, actions_2.setVideoMuted)(false, constants_3.VIDEO_MUTISM_AUTHORITY.SCREEN_SHARE));
            (0, functions_1.setPictureInPictureEnabled)(true);
        }
    };
}
exports.toggleScreensharing = toggleScreensharing;
/**
 * Creates desktop track and replaces the local one.
 *
 * @private
 * @param {Dispatch} dispatch - The redux {@code dispatch} function.
 * @param {Object} state - The redux state.
 * @returns {void}
 */
async function _startScreenSharing(dispatch, state) {
    const pipWhileScreenSharingEnabled = (0, functions_2.getFeatureFlag)(state, constants_2.PIP_WHILE_SCREEN_SHARING_ENABLED, false);
    if (!pipWhileScreenSharingEnabled) {
        (0, functions_1.setPictureInPictureEnabled)(false);
    }
    try {
        const tracks = await lib_jitsi_meet_1.default.createLocalTracks({ devices: ['desktop'] });
        const track = tracks[0];
        const currentLocalDesktopTrack = (0, functions_native_1.getLocalDesktopTrack)((0, functions_native_1.getTrackState)(state));
        const currentJitsiTrack = currentLocalDesktopTrack?.jitsiTrack;
        // The first time the user shares the screen we add the track and create the transceiver.
        // Afterwards, we just replace the old track, so the transceiver will be reused.
        if (currentJitsiTrack) {
            dispatch((0, actions_any_1.replaceLocalTrack)(currentJitsiTrack, track));
        }
        else {
            dispatch((0, actions_any_1.addLocalTrack)(track));
        }
        dispatch((0, actions_2.setVideoMuted)(true, constants_3.VIDEO_MUTISM_AUTHORITY.SCREEN_SHARE));
        const { enabled: audioOnly } = state['features/base/audio-only'];
        if (audioOnly) {
            dispatch((0, actions_1.showNotification)({
                titleKey: 'notify.screenSharingAudioOnlyTitle',
                descriptionKey: 'notify.screenSharingAudioOnlyDescription',
                maxLines: 3
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
        }
    }
    catch (error) {
        console.log('ERROR creating screen-sharing stream ', error);
        (0, functions_1.setPictureInPictureEnabled)(true);
    }
}
