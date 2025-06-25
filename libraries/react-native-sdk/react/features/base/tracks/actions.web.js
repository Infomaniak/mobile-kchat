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
exports.handleScreenSharingError = exports.displayErrorsForCreateInitialLocalTracks = exports.createInitialAVTracks = exports.createAndAddInitialAVTracks = exports.setGUMPendingStateOnFailedTracks = exports.openAllowToggleCameraDialog = exports.setCameraFacingMode = exports.toggleScreensharing = void 0;
// @ts-expect-error
const UIErrors_1 = require("../../../../modules/UI/UIErrors");
const actions_1 = require("../../av-moderation/actions");
const functions_1 = require("../../av-moderation/functions");
const actions_2 = require("../../noise-suppression/actions");
const actions_3 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const actions_4 = require("../../remote-control/actions");
const actions_5 = require("../../screen-share/actions");
const functions_2 = require("../../screen-share/functions");
const actions_6 = require("../../screenshot-capture/actions");
const functions_3 = require("../../screenshot-capture/functions");
const AudioMixerEffect_1 = require("../../stream-effects/audio-mixer/AudioMixerEffect");
const functions_4 = require("../conference/functions");
const actions_web_1 = require("../devices/actions.web");
const actions_7 = require("../dialog/actions");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const actions_8 = require("../media/actions");
const constants_2 = require("../media/constants");
const types_1 = require("../media/types");
const actions_any_1 = require("./actions.any");
const AllowToggleCameraDialog_1 = __importDefault(require("./components/web/AllowToggleCameraDialog"));
const functions_5 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
__exportStar(require("./actions.any"), exports);
/**
 * Signals that the local participant is ending screensharing or beginning the screensharing flow.
 *
 * @param {boolean} enabled - The state to toggle screen sharing to.
 * @param {boolean} audioOnly - Only share system audio.
 * @param {Object} shareOptions - The options to be passed for capturing screenshare.
 * @returns {Function}
 */
function toggleScreensharing(enabled, audioOnly = false, shareOptions = {}) {
    return (dispatch, getState) => {
        // check for A/V Moderation when trying to start screen sharing
        if ((enabled || enabled === undefined) && (0, functions_1.shouldShowModeratedNotification)(constants_2.MEDIA_TYPE.VIDEO, getState())) {
            dispatch((0, actions_1.showModeratedNotification)(constants_2.MEDIA_TYPE.SCREENSHARE));
            return Promise.reject();
        }
        return _toggleScreenSharing({
            enabled,
            audioOnly,
            shareOptions
        }, {
            dispatch,
            getState
        });
    };
}
exports.toggleScreensharing = toggleScreensharing;
/**
 * Displays a UI notification for screensharing failure based on the error passed.
 *
 * @private
 * @param {Object} error - The error.
 * @param {Object} store - The redux store.
 * @returns {void}
 */
/**
 * Applies the AudioMixer effect on the local audio track if applicable. If there is no local audio track, the desktop
 * audio track is added to the conference.
 *
 * @private
 * @param {JitsiLocalTrack} desktopAudioTrack - The audio track to be added to the conference.
 * @param {*} state - The redux state.
 * @returns {void}
 */
async function _maybeApplyAudioMixerEffect(desktopAudioTrack, state) {
    const localAudio = (0, functions_5.getLocalJitsiAudioTrack)(state);
    const conference = (0, functions_4.getCurrentConference)(state);
    if (localAudio) {
        // If there is a localAudio stream, mix in the desktop audio stream captured by the screen sharing API.
        const mixerEffect = new AudioMixerEffect_1.AudioMixerEffect(desktopAudioTrack);
        await localAudio.setEffect(mixerEffect);
    }
    else {
        // If no local stream is present ( i.e. no input audio devices) we use the screen share audio
        // stream as we would use a regular stream.
        await conference?.replaceTrack(null, desktopAudioTrack);
    }
}
/**
 * Toggles screen sharing.
 *
 * @private
 * @param {boolean} enabled - The state to toggle screen sharing to.
 * @param {Store} store - The redux store.
 * @returns {void}
 */
async function _toggleScreenSharing({ enabled, audioOnly = false, shareOptions = {} }, store) {
    const { dispatch, getState } = store;
    const state = getState();
    const audioOnlySharing = (0, functions_2.isAudioOnlySharing)(state);
    const screenSharing = (0, functions_2.isScreenVideoShared)(state);
    const conference = (0, functions_4.getCurrentConference)(state);
    const localAudio = (0, functions_5.getLocalJitsiAudioTrack)(state);
    const localScreenshare = (0, functions_5.getLocalDesktopTrack)(state['features/base/tracks']);
    // Toggle screenshare or audio-only share if the new state is not passed. Happens in the following two cases.
    // 1. ShareAudioDialog passes undefined when the user hits continue in the share audio demo modal.
    // 2. Toggle screenshare called from the external API.
    const enable = audioOnly
        ? enabled ?? !audioOnlySharing
        : enabled ?? !screenSharing;
    const screensharingDetails = {};
    if (enable) {
        let tracks;
        // Spot proxy stream.
        if (shareOptions.desktopStream) {
            tracks = [shareOptions.desktopStream];
        }
        else {
            const { _desktopSharingSourceDevice } = state['features/base/config'];
            if (!shareOptions.desktopSharingSources && _desktopSharingSourceDevice) {
                shareOptions.desktopSharingSourceDevice = _desktopSharingSourceDevice;
            }
            const options = {
                devices: [constants_2.VIDEO_TYPE.DESKTOP],
                ...shareOptions
            };
            try {
                tracks = await (0, functions_5.createLocalTracksF)(options);
            }
            catch (error) {
                dispatch(handleScreenSharingError(error, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
                throw error;
            }
        }
        const desktopAudioTrack = tracks.find(track => track.getType() === constants_2.MEDIA_TYPE.AUDIO);
        const desktopVideoTrack = tracks.find(track => track.getType() === constants_2.MEDIA_TYPE.VIDEO);
        if (audioOnly) {
            // Dispose the desktop track for audio-only screensharing.
            desktopVideoTrack.dispose();
            if (!desktopAudioTrack) {
                dispatch(handleScreenSharingError(UIErrors_1.AUDIO_ONLY_SCREEN_SHARE_NO_TRACK, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
                throw new Error(UIErrors_1.AUDIO_ONLY_SCREEN_SHARE_NO_TRACK);
            }
        }
        else if (desktopVideoTrack) {
            if (localScreenshare) {
                await dispatch((0, actions_any_1.replaceLocalTrack)(localScreenshare.jitsiTrack, desktopVideoTrack, conference));
            }
            else {
                await dispatch((0, actions_any_1.addLocalTrack)(desktopVideoTrack));
            }
            if ((0, functions_3.isScreenshotCaptureEnabled)(state, false, true)) {
                dispatch((0, actions_6.toggleScreenshotCaptureSummary)(true));
            }
            screensharingDetails.sourceType = desktopVideoTrack.sourceType;
        }
        // Apply the AudioMixer effect if there is a local audio track, add the desktop track to the conference
        // otherwise without unmuting the microphone.
        if (desktopAudioTrack) {
            // Noise suppression doesn't work with desktop audio because we can't chain track effects yet, disable it
            // first. We need to to wait for the effect to clear first or it might interfere with the audio mixer.
            await dispatch((0, actions_2.setNoiseSuppressionEnabled)(false));
            _maybeApplyAudioMixerEffect(desktopAudioTrack, state);
            dispatch((0, actions_5.setScreenshareAudioTrack)(desktopAudioTrack));
            // Handle the case where screen share was stopped from the browsers 'screen share in progress' window.
            if (audioOnly) {
                desktopAudioTrack?.on(lib_jitsi_meet_1.JitsiTrackEvents.LOCAL_TRACK_STOPPED, () => dispatch(toggleScreensharing(undefined, true)));
            }
        }
        // Show notification about more bandwidth usage in audio-only mode if the user starts screensharing. This
        // doesn't apply to audio-only screensharing.
        const { enabled: bestPerformanceMode } = state['features/base/audio-only'];
        if (bestPerformanceMode && !audioOnly) {
            dispatch((0, actions_3.showNotification)({
                titleKey: 'notify.screenSharingAudioOnlyTitle',
                descriptionKey: 'notify.screenSharingAudioOnlyDescription'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
        }
    }
    else {
        const { desktopAudioTrack } = state['features/screen-share'];
        dispatch((0, actions_4.stopReceiver)());
        dispatch((0, actions_6.toggleScreenshotCaptureSummary)(false));
        // Mute the desktop track instead of removing it from the conference since we don't want the client to signal
        // a source-remove to the remote peer for the screenshare track. Later when screenshare is enabled again, the
        // same sender will be re-used without the need for signaling a new ssrc through source-add.
        dispatch((0, actions_8.setScreenshareMuted)(true));
        if (desktopAudioTrack) {
            if (localAudio) {
                localAudio.setEffect(undefined);
            }
            else {
                await conference?.replaceTrack(desktopAudioTrack, null);
            }
            desktopAudioTrack.dispose();
            dispatch((0, actions_5.setScreenshareAudioTrack)(null));
        }
    }
    if (audioOnly) {
        dispatch((0, actions_5.setScreenAudioShareState)(enable));
    }
    else {
        // Notify the external API.
        APP.API.notifyScreenSharingStatusChanged(enable, screensharingDetails);
    }
}
/**
 * Sets the camera facing mode(environment/user). If facing mode not provided, it will do a toggle.
 *
 * @param {string | undefined} facingMode - The selected facing mode.
 * @returns {void}
 */
function setCameraFacingMode(facingMode) {
    return async (dispatch, getState) => {
        const state = getState();
        if (!(0, functions_5.isToggleCameraEnabled)(state)) {
            return;
        }
        if (!facingMode) {
            dispatch((0, actions_any_1.toggleCamera)());
            return;
        }
        const tracks = state['features/base/tracks'];
        const localVideoTrack = (0, functions_5.getLocalVideoTrack)(tracks)?.jitsiTrack;
        if (!tracks || !localVideoTrack) {
            return;
        }
        const currentFacingMode = localVideoTrack.getCameraFacingMode();
        if (currentFacingMode !== facingMode) {
            dispatch((0, actions_any_1.toggleCamera)());
        }
    };
}
exports.setCameraFacingMode = setCameraFacingMode;
/**
 * Signals to open the permission dialog for toggling camera remotely.
 *
 * @param {Function} onAllow - Callback to be executed if permission to toggle camera was granted.
 * @param {string} initiatorId - The participant id of the requester.
 * @returns {Object} - The open dialog action.
 */
function openAllowToggleCameraDialog(onAllow, initiatorId) {
    return (0, actions_7.openDialog)(AllowToggleCameraDialog_1.default, {
        onAllow,
        initiatorId
    });
}
exports.openAllowToggleCameraDialog = openAllowToggleCameraDialog;
/**
 * Sets the GUM pending state for the tracks that have failed.
 *
 * NOTE: Some of the track that we will be setting to GUM pending state NONE may not have failed but they may have
 * been requested. This won't be a problem because their current GUM pending state will be NONE anyway.
 *
 * @param {JitsiLocalTrack} tracks - The tracks that have been created.
 * @param {Function} dispatch - The redux dispatch function.
 * @returns {void}
 */
function setGUMPendingStateOnFailedTracks(tracks, dispatch) {
    const tracksTypes = tracks.map(track => {
        if (track.getVideoType() === constants_2.VIDEO_TYPE.DESKTOP) {
            return constants_2.MEDIA_TYPE.SCREENSHARE;
        }
        return track.getType();
    });
    const nonPendingTracks = [constants_2.MEDIA_TYPE.AUDIO, constants_2.MEDIA_TYPE.VIDEO].filter(type => !tracksTypes.includes(type));
    dispatch((0, actions_8.gumPending)(nonPendingTracks, types_1.IGUMPendingState.NONE));
}
exports.setGUMPendingStateOnFailedTracks = setGUMPendingStateOnFailedTracks;
/**
 * Creates and adds to the conference the initial audio/video tracks.
 *
 * @param {Array<MediaType>} devices - Array with devices (audio/video) that will be used.
 * @returns {Function}
 */
function createAndAddInitialAVTracks(devices) {
    return async (dispatch) => {
        dispatch((0, actions_8.gumPending)(devices, types_1.IGUMPendingState.PENDING_UNMUTE));
        const { tracks, errors } = await dispatch(createInitialAVTracks({ devices }));
        setGUMPendingStateOnFailedTracks(tracks, dispatch);
        dispatch(displayErrorsForCreateInitialLocalTracks(errors));
        await Promise.allSettled(tracks.map((track) => {
            const legacyConferenceObject = APP.conference;
            if (track.isAudioTrack()) {
                return legacyConferenceObject.useAudioStream(track);
            }
            if (track.isVideoTrack()) {
                return legacyConferenceObject.useVideoStream(track);
            }
            return Promise.resolve();
        }));
        dispatch((0, actions_8.gumPending)(devices, types_1.IGUMPendingState.NONE));
    };
}
exports.createAndAddInitialAVTracks = createAndAddInitialAVTracks;
/**
 * Creates the initial audio/video tracks.
 *
 * @param {ICreateInitialTracksOptions} options - Options for creating the audio/video tracks.
 * @returns {Function}
 */
function createInitialAVTracks(options) {
    return (dispatch, _getState) => {
        const { devices, timeout, firePermissionPromptIsShownEvent } = options;
        dispatch((0, actions_8.gumPending)(devices, types_1.IGUMPendingState.PENDING_UNMUTE));
        return (0, functions_5.createLocalTracksF)(options).then(tracks => {
            return {
                errors: {},
                tracks
            };
        })
            .catch(async (error) => {
            const errors = {};
            if (error.name === lib_jitsi_meet_1.JitsiTrackErrors.TIMEOUT && !lib_jitsi_meet_1.browser.isElectron()) {
                if (devices.includes(constants_2.MEDIA_TYPE.AUDIO)) {
                    errors.audioOnlyError = error;
                }
                if (devices.includes(constants_2.MEDIA_TYPE.VIDEO)) {
                    errors.videoOnlyError = error;
                }
                if (errors.audioOnlyError && errors.videoOnlyError) {
                    errors.audioAndVideoError = error;
                }
                return {
                    errors,
                    tracks: []
                };
            }
            // Retry with separate gUM calls.
            const gUMPromises = [];
            const tracks = [];
            if (devices.includes(constants_2.MEDIA_TYPE.AUDIO)) {
                gUMPromises.push((0, functions_5.createLocalTracksF)({
                    devices: [constants_2.MEDIA_TYPE.AUDIO],
                    timeout,
                    firePermissionPromptIsShownEvent
                }));
            }
            if (devices.includes(constants_2.MEDIA_TYPE.VIDEO)) {
                gUMPromises.push((0, functions_5.createLocalTracksF)({
                    devices: [constants_2.MEDIA_TYPE.VIDEO],
                    timeout,
                    firePermissionPromptIsShownEvent
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
            return {
                tracks,
                errors
            };
        });
    };
}
exports.createInitialAVTracks = createInitialAVTracks;
/**
 * Displays error notifications according to the state carried by the passed {@code errors} object.
 *
 * @param {InitialTracksErrors} errors - The errors (if any).
 * @returns {Function}
 * @private
 */
function displayErrorsForCreateInitialLocalTracks(errors) {
    return (dispatch) => {
        const { audioOnlyError, screenSharingError, videoOnlyError } = errors;
        if (screenSharingError) {
            dispatch(handleScreenSharingError(screenSharingError, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
        }
        if (audioOnlyError || videoOnlyError) {
            if (audioOnlyError) {
                dispatch((0, actions_web_1.notifyMicError)(audioOnlyError));
            }
            if (videoOnlyError) {
                dispatch((0, actions_web_1.notifyCameraError)(videoOnlyError));
            }
        }
    };
}
exports.displayErrorsForCreateInitialLocalTracks = displayErrorsForCreateInitialLocalTracks;
/**
 * Displays a UI notification for screensharing failure based on the error passed.
 *
 * @private
 * @param {Error | AUDIO_ONLY_SCREEN_SHARE_NO_TRACK} error - The error.
 * @param {NOTIFICATION_TIMEOUT_TYPE} timeout - The time for showing the notification.
 * @returns {Function}
 */
function handleScreenSharingError(error, timeout) {
    return (dispatch) => {
        logger_1.default.error('failed to share local desktop', error);
        let descriptionKey;
        let titleKey;
        if (error.name === lib_jitsi_meet_1.JitsiTrackErrors.PERMISSION_DENIED) {
            descriptionKey = 'dialog.screenSharingPermissionDeniedError';
            titleKey = 'dialog.screenSharingFailedTitle';
        }
        else if (error.name === lib_jitsi_meet_1.JitsiTrackErrors.CONSTRAINT_FAILED) {
            descriptionKey = 'dialog.cameraConstraintFailedError';
            titleKey = 'deviceError.cameraError';
        }
        else if (error.name === lib_jitsi_meet_1.JitsiTrackErrors.SCREENSHARING_GENERIC_ERROR) {
            descriptionKey = 'dialog.screenSharingFailed';
            titleKey = 'dialog.screenSharingFailedTitle';
        }
        else if (error === UIErrors_1.AUDIO_ONLY_SCREEN_SHARE_NO_TRACK) {
            descriptionKey = 'notify.screenShareNoAudio';
            titleKey = 'notify.screenShareNoAudioTitle';
        }
        else { // safeguard for not showing notification with empty text. This will also include
            // error.name === JitsiTrackErrors.SCREENSHARING_USER_CANCELED
            return;
        }
        dispatch((0, actions_3.showErrorNotification)({
            descriptionKey,
            titleKey
        }, timeout));
    };
}
exports.handleScreenSharingError = handleScreenSharingError;
