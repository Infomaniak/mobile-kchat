"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOGGLE_CAMERA_FACING_MODE = exports.SET_VIDEO_UNMUTE_PERMISSIONS = exports.STORE_VIDEO_TRANSFORM = exports.SET_VIDEO_MUTED = exports.SET_VIDEO_AVAILABLE = exports.SET_SCREENSHARE_MUTED = exports.SET_CAMERA_FACING_MODE = exports.SET_AUDIO_UNMUTE_PERMISSIONS = exports.SET_AUDIO_MUTED = exports.SET_AUDIO_AVAILABLE = exports.GUM_PENDING = void 0;
/**
 * The type of (redux) action to store the gum pending state for unmute and initial track creation.
 *
 * {
 *     type: GUM_PENDING,
 *     mediaTypes: Array<MediaType>,
 *     status: IGUMPendingState
 * }
 */
exports.GUM_PENDING = 'GUM_PENDING';
/**
 * The type of (redux) action to adjust the availability of the local audio.
 *
 * {
 *     type: SET_AUDIO_AVAILABLE,
 *     muted: boolean
 * }
 */
exports.SET_AUDIO_AVAILABLE = 'SET_AUDIO_AVAILABLE';
/**
 * The type of (redux) action to set the muted state of the local audio.
 *
 * {
 *     type: SET_AUDIO_MUTED,
 *     muted: boolean
 * }
 */
exports.SET_AUDIO_MUTED = 'SET_AUDIO_MUTED';
/**
 * The type of (redux) action to enable/disable the audio mute icon.
 *
 * {
 *     type: SET_AUDIO_UNMUTE_PERMISSIONS,
 *     blocked: boolean
 * }
 */
exports.SET_AUDIO_UNMUTE_PERMISSIONS = 'SET_AUDIO_UNMUTE_PERMISSIONS';
/**
 * The type of (redux) action to set the facing mode of the local video camera
 * to a specific value.
 *
 * {
 *     type: SET_CAMERA_FACING_MODE,
 *     cameraFacingMode: CAMERA_FACING_MODE
 * }
 */
exports.SET_CAMERA_FACING_MODE = 'SET_CAMERA_FACING_MODE';
/**
 * The type of (redux) action to set the muted state of the local screenshare.
 *
 * {
 *     type: SET_SCREENSHARE_MUTED,
 *     muted: boolean
 * }
 */
exports.SET_SCREENSHARE_MUTED = 'SET_SCREENSHARE_MUTED';
/**
 * The type of (redux) action to adjust the availability of the local video.
 *
 * {
 *     type: SET_VIDEO_AVAILABLE,
 *     available: boolean
 * }
 */
exports.SET_VIDEO_AVAILABLE = 'SET_VIDEO_AVAILABLE';
/**
 * The type of (redux) action to set the muted state of the local video.
 *
 * {
 *     type: SET_VIDEO_MUTED,
 *     muted: boolean
 * }
 */
exports.SET_VIDEO_MUTED = 'SET_VIDEO_MUTED';
/**
 * The type of (redux) action to store the last video {@link Transform} applied
 * to a stream.
 *
 * {
 *     type: STORE_VIDEO_TRANSFORM,
 *     streamId: string,
 *     transform: Transform
 * }
 */
exports.STORE_VIDEO_TRANSFORM = 'STORE_VIDEO_TRANSFORM';
/**
 * The type of (redux) action to enable/disable the video mute icon.
 *
 * {
 *     type: SET_VIDEO_UNMUTE_PERMISSIONS,
 *     blocked: boolean
 * }
 */
exports.SET_VIDEO_UNMUTE_PERMISSIONS = 'SET_VIDEO_UNMUTE_PERMISSIONS';
/**
 * The type of (redux) action to toggle the local video camera facing mode. In
 * contrast to SET_CAMERA_FACING_MODE, allows the toggling to be optimally
 * and/or natively implemented without the overhead of separate reads and writes
 * of the current/effective camera facing mode.
 *
 * {
 *     type: TOGGLE_CAMERA_FACING_MODE
 * }
 */
exports.TOGGLE_CAMERA_FACING_MODE = 'TOGGLE_CAMERA_FACING_MODE';
