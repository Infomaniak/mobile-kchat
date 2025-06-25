"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actionTypes_1 = require("../../breakout-rooms/actionTypes");
const functions_1 = require("../../prejoin/functions");
const functions_2 = require("../conference/functions");
const actionTypes_2 = require("../media/actionTypes");
const actions_1 = require("../media/actions");
const constants_1 = require("../media/constants");
const types_1 = require("../media/types");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../redux/StateListenerRegistry"));
const actionTypes_3 = require("./actionTypes");
const actions_2 = require("./actions");
const functions_3 = require("./functions");
require("./subscriber");
/**
 * Middleware that captures LIB_DID_DISPOSE and LIB_DID_INIT actions and,
 * respectively, creates/destroys local media tracks. Also listens to
 * media-related actions and performs corresponding operations with tracks.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_2.SET_AUDIO_MUTED:
            if (!action.muted
                && (0, functions_3.isUserInteractionRequiredForUnmute)(store.getState())) {
                return;
            }
            _setMuted(store, action, constants_1.MEDIA_TYPE.AUDIO);
            break;
        case actionTypes_2.SET_CAMERA_FACING_MODE: {
            // XXX The camera facing mode of a MediaStreamTrack can be specified
            // only at initialization time and then it can only be toggled. So in
            // order to set the camera facing mode, one may destroy the track and
            // then initialize a new instance with the new camera facing mode. But
            // that is inefficient on mobile at least so the following relies on the
            // fact that there are 2 camera facing modes and merely toggles between
            // them to (hopefully) get the camera in the specified state.
            const localTrack = _getLocalTrack(store, constants_1.MEDIA_TYPE.VIDEO);
            let jitsiTrack;
            if (localTrack
                && (jitsiTrack = localTrack.jitsiTrack)
                && jitsiTrack.getCameraFacingMode()
                    !== action.cameraFacingMode) {
                store.dispatch((0, actions_1.toggleCameraFacingMode)());
            }
            break;
        }
        case actionTypes_2.SET_SCREENSHARE_MUTED:
            _setMuted(store, action, constants_1.MEDIA_TYPE.SCREENSHARE);
            break;
        case actionTypes_2.SET_VIDEO_MUTED:
            if (!action.muted
                && (0, functions_3.isUserInteractionRequiredForUnmute)(store.getState())) {
                return;
            }
            _setMuted(store, action, constants_1.MEDIA_TYPE.VIDEO);
            break;
        case actionTypes_2.TOGGLE_CAMERA_FACING_MODE: {
            const localTrack = _getLocalTrack(store, constants_1.MEDIA_TYPE.VIDEO);
            let jitsiTrack;
            if (localTrack && (jitsiTrack = localTrack.jitsiTrack)) {
                // XXX MediaStreamTrack._switchCamera is a custom function
                // implemented in react-native-webrtc for video which switches
                // between the cameras via a native WebRTC library implementation
                // without making any changes to the track.
                jitsiTrack._switchCamera();
                // Don't mirror the video of the back/environment-facing camera.
                const mirror = jitsiTrack.getCameraFacingMode() === constants_1.CAMERA_FACING_MODE.USER;
                store.dispatch({
                    type: actionTypes_3.TRACK_UPDATED,
                    track: {
                        jitsiTrack,
                        mirror
                    }
                });
            }
            break;
        }
    }
    return next(action);
});
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed, remove all tracks from the store.
 */
StateListenerRegistry_1.default.register(state => (0, functions_2.getCurrentConference)(state), (conference, { dispatch, getState }, prevConference) => {
    const { authRequired, error } = getState()['features/base/conference'];
    // conference keep flipping while we are authenticating, skip clearing while we are in that process
    if (prevConference && !conference && !authRequired && !error) {
        // Clear all tracks.
        const remoteTracks = getState()['features/base/tracks'].filter(t => !t.local);
        (0, react_redux_1.batch)(() => {
            dispatch((0, actions_2.destroyLocalTracks)());
            for (const track of remoteTracks) {
                dispatch((0, actions_2.trackRemoved)(track.jitsiTrack));
            }
            dispatch({ type: actionTypes_1._RESET_BREAKOUT_ROOMS });
        });
    }
});
/**
 * Gets the local track associated with a specific {@code MEDIA_TYPE} in a
 * specific redux store.
 *
 * @param {Store} store - The redux store from which the local track associated
 * with the specified {@code mediaType} is to be retrieved.
 * @param {MEDIA_TYPE} mediaType - The {@code MEDIA_TYPE} of the local track to
 * be retrieved from the specified {@code store}.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @private
 * @returns {Track} The local {@code Track} associated with the specified
 * {@code mediaType} in the specified {@code store}.
 */
function _getLocalTrack({ getState }, mediaType, includePending = false) {
    return ((0, functions_3.getLocalTrack)(getState()['features/base/tracks'], mediaType, includePending));
}
/**
 * Mutes or unmutes a local track with a specific media type.
 *
 * @param {Store} store - The redux store in which the specified action is
 * dispatched.
 * @param {Action} action - The redux action dispatched in the specified store.
 * @param {MEDIA_TYPE} mediaType - The {@link MEDIA_TYPE} of the local track
 * which is being muted or unmuted.
 * @private
 * @returns {void}
 */
async function _setMuted(store, { ensureTrack, muted }, mediaType) {
    const { dispatch, getState } = store;
    const localTrack = _getLocalTrack(store, mediaType, /* includePending */ true);
    const state = getState();
    if (mediaType === constants_1.MEDIA_TYPE.SCREENSHARE && !muted) {
        return;
    }
    if (localTrack) {
        // The `jitsiTrack` property will have a value only for a localTrack for which `getUserMedia` has already
        // completed. If there's no `jitsiTrack`, then the `muted` state will be applied once the `jitsiTrack` is
        // created.
        const { jitsiTrack } = localTrack;
        if (jitsiTrack) {
            (0, functions_3.setTrackMuted)(jitsiTrack, muted, state, dispatch)
                .catch(() => dispatch((0, actions_2.trackMuteUnmuteFailed)(localTrack, muted)));
        }
    }
    else if (!muted && ensureTrack && (typeof APP === 'undefined' || (0, functions_1.isPrejoinPageVisible)(state))) {
        typeof APP !== 'undefined' && dispatch((0, actions_1.gumPending)([mediaType], types_1.IGUMPendingState.PENDING_UNMUTE));
        // FIXME: This only runs on mobile now because web has its own way of
        // creating local tracks. Adjust the check once they are unified.
        dispatch((0, actions_2.createLocalTracksA)({ devices: [mediaType] })).then(() => {
            typeof APP !== 'undefined' && dispatch((0, actions_1.gumPending)([mediaType], types_1.IGUMPendingState.NONE));
        });
    }
}
