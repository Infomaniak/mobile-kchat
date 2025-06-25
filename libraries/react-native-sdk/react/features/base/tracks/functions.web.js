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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isToggleCameraEnabled = exports.createPrejoinTracks = exports.createLocalTracksF = void 0;
const utils_1 = require("../environment/utils");
const lib_jitsi_meet_1 = __importStar(require("../lib-jitsi-meet"));
const actions_1 = require("../media/actions");
const constants_1 = require("../media/constants");
const functions_1 = require("../media/functions");
const types_1 = require("../media/types");
const functions_2 = require("../redux/functions");
const functions_web_1 = require("../settings/functions.web");
const functions_any_1 = require("./functions.any");
const loadEffects_1 = __importDefault(require("./loadEffects"));
const logger_1 = __importDefault(require("./logger"));
__exportStar(require("./functions.any"), exports);
/**
 * Create local tracks of specific types.
 *
 * @param {Object} options - The options with which the local tracks are to be
 * created.
 * @param {string|null} [options.cameraDeviceId] - Camera device id or
 * {@code undefined} to use app's settings.
 * @param {string[]} options.devices - Required track types such as 'audio'
 * and/or 'video'.
 * @param {string|null} [options.micDeviceId] - Microphone device id or
 * {@code undefined} to use app's settings.
 * @param {number|undefined} [oprions.timeout] - A timeout for JitsiMeetJS.createLocalTracks used to create the tracks.
 * @param {boolean} [options.firePermissionPromptIsShownEvent] - Whether lib-jitsi-meet
 * should check for a {@code getUserMedia} permission prompt and fire a
 * corresponding event.
 * @param {IStore} store - The redux store in the context of which the function
 * is to execute and from which state such as {@code config} is to be retrieved.
 * @returns {Promise<JitsiLocalTrack[]>}
 */
function createLocalTracksF(options = {}, store) {
    let { cameraDeviceId, micDeviceId } = options;
    const { desktopSharingSourceDevice, desktopSharingSources, firePermissionPromptIsShownEvent, timeout } = options;
    // TODO The app's settings should go in the redux store and then the
    // reliance on the global variable APP will go away.
    store = store || APP.store; // eslint-disable-line no-param-reassign
    const state = store.getState();
    if (typeof cameraDeviceId === 'undefined' || cameraDeviceId === null) {
        cameraDeviceId = (0, functions_web_1.getUserSelectedCameraDeviceId)(state);
    }
    if (typeof micDeviceId === 'undefined' || micDeviceId === null) {
        micDeviceId = (0, functions_web_1.getUserSelectedMicDeviceId)(state);
    }
    const { desktopSharingFrameRate, firefox_fake_device, // eslint-disable-line camelcase
    resolution } = state['features/base/config'];
    const constraints = options.constraints ?? state['features/base/config'].constraints;
    return ((0, loadEffects_1.default)(store).then((effectsArray) => {
        // Filter any undefined values returned by Promise.resolve().
        const effects = effectsArray.filter(effect => Boolean(effect));
        return lib_jitsi_meet_1.default.createLocalTracks({
            cameraDeviceId,
            constraints,
            desktopSharingFrameRate,
            desktopSharingSourceDevice,
            desktopSharingSources,
            // Copy array to avoid mutations inside library.
            devices: options.devices?.slice(0),
            effects,
            facingMode: options.facingMode || (0, functions_any_1.getCameraFacingMode)(state),
            firefox_fake_device,
            firePermissionPromptIsShownEvent,
            micDeviceId,
            resolution,
            timeout
        })
            .catch((err) => {
            logger_1.default.error('Failed to create local tracks', options.devices, err);
            return Promise.reject(err);
        });
    }));
}
exports.createLocalTracksF = createLocalTracksF;
/**
 * Returns an object containing a promise which resolves with the created tracks and the errors resulting from that
 * process.
 *
 * @returns {Promise<JitsiLocalTrack[]>}
 *
 * @todo Refactor to not use APP.
 */
function createPrejoinTracks() {
    const errors = {};
    const initialDevices = [constants_1.MEDIA_TYPE.AUDIO];
    const requestedAudio = true;
    let requestedVideo = false;
    const { startAudioOnly, startWithVideoMuted } = APP.store.getState()['features/base/settings'];
    const startWithAudioMuted = (0, functions_1.getStartWithAudioMuted)(APP.store.getState());
    // On Electron there is no permission prompt for granting permissions. That's why we don't need to
    // spend much time displaying the overlay screen. If GUM is not resolved within 15 seconds it will
    // probably never resolve.
    const timeout = lib_jitsi_meet_1.browser.isElectron() ? 15000 : 60000;
    // Always get a handle on the audio input device so that we have statistics even if the user joins the
    // conference muted. Previous implementation would only acquire the handle when the user first unmuted,
    // which would results in statistics ( such as "No audio input" or "Are you trying to speak?") being available
    // only after that point.
    if (startWithAudioMuted) {
        APP.store.dispatch((0, actions_1.setAudioMuted)(true));
    }
    if (!startWithVideoMuted && !startAudioOnly) {
        initialDevices.push(constants_1.MEDIA_TYPE.VIDEO);
        requestedVideo = true;
    }
    let tryCreateLocalTracks = Promise.resolve([]);
    const { dispatch } = APP.store;
    dispatch((0, actions_1.gumPending)(initialDevices, types_1.IGUMPendingState.PENDING_UNMUTE));
    if (requestedAudio || requestedVideo) {
        tryCreateLocalTracks = createLocalTracksF({
            devices: initialDevices,
            firePermissionPromptIsShownEvent: true,
            timeout
        }, APP.store)
            .catch(async (err) => {
            if (err.name === lib_jitsi_meet_1.JitsiTrackErrors.TIMEOUT && !lib_jitsi_meet_1.browser.isElectron()) {
                errors.audioAndVideoError = err;
                return [];
            }
            // Retry with separate gUM calls.
            const gUMPromises = [];
            const tracks = [];
            if (requestedAudio) {
                gUMPromises.push(createLocalTracksF({
                    devices: [constants_1.MEDIA_TYPE.AUDIO],
                    firePermissionPromptIsShownEvent: true,
                    timeout
                }));
            }
            if (requestedVideo) {
                gUMPromises.push(createLocalTracksF({
                    devices: [constants_1.MEDIA_TYPE.VIDEO],
                    firePermissionPromptIsShownEvent: true,
                    timeout
                }));
            }
            const results = await Promise.allSettled(gUMPromises);
            let errorMsg;
            results.forEach((result, idx) => {
                if (result.status === 'fulfilled') {
                    tracks.push(result.value[0]);
                }
                else {
                    errorMsg = result.reason;
                    const isAudio = idx === 0;
                    logger_1.default.error(`${isAudio ? 'Audio' : 'Video'} track creation failed with error ${errorMsg}`);
                    if (isAudio) {
                        errors.audioOnlyError = errorMsg;
                    }
                    else {
                        errors.videoOnlyError = errorMsg;
                    }
                }
            });
            if (errors.audioOnlyError && errors.videoOnlyError) {
                errors.audioAndVideoError = errorMsg;
            }
            return tracks;
        })
            .finally(() => {
            dispatch((0, actions_1.gumPending)(initialDevices, types_1.IGUMPendingState.NONE));
        });
    }
    return {
        tryCreateLocalTracks,
        errors
    };
}
exports.createPrejoinTracks = createPrejoinTracks;
/**
 * Determines whether toggle camera should be enabled or not.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState} function.
 * @returns {boolean} - Whether toggle camera should be enabled.
 */
function isToggleCameraEnabled(stateful) {
    const state = (0, functions_2.toState)(stateful);
    const { videoInput } = state['features/base/devices'].availableDevices;
    return (0, utils_1.isMobileBrowser)() && Number(videoInput?.length) > 1;
}
exports.isToggleCameraEnabled = isToggleCameraEnabled;
