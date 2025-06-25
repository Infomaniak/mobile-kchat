"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._VIDEO_INITIAL_MEDIA_STATE = exports._SCREENSHARE_INITIAL_MEDIA_STATE = exports._AUDIO_INITIAL_MEDIA_STATE = void 0;
const redux_1 = require("redux");
const actionTypes_1 = require("../conference/actionTypes");
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const actionTypes_2 = require("../tracks/actionTypes");
const actionTypes_3 = require("./actionTypes");
const constants_1 = require("./constants");
const types_1 = require("./types");
/**
 * Media state object for local audio.
 *
 * @typedef {Object} AudioMediaState
 * @property {boolean} muted=false - Audio muted state.
 */
// FIXME Technically, _AUDIO_INITIAL_MEDIA_STATE is a constant internal to the
// feature base/media and used in multiple files so it should be in
// constants.js. Practically though, AudioMediaState would then be used in
// multiple files as well so I don't know where and how to move it.
/**
 * Initial state for local audio.
 *
 * @type {AudioMediaState}
 */
exports._AUDIO_INITIAL_MEDIA_STATE = {
    available: true,
    gumPending: types_1.IGUMPendingState.NONE,
    unmuteBlocked: false,
    muted: false
};
/**
 * Reducer for audio media state.
 *
 * @param {AudioMediaState} state - Media state of local audio.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @private
 * @returns {AudioMediaState}
 */
function _audio(state = exports._AUDIO_INITIAL_MEDIA_STATE, action) {
    switch (action.type) {
        case actionTypes_3.SET_AUDIO_AVAILABLE:
            return {
                ...state,
                available: action.available
            };
        case actionTypes_3.GUM_PENDING:
            if (action.mediaTypes.includes(constants_1.MEDIA_TYPE.AUDIO)) {
                return {
                    ...state,
                    gumPending: action.status
                };
            }
            return state;
        case actionTypes_3.SET_AUDIO_MUTED:
            return {
                ...state,
                muted: action.muted
            };
        case actionTypes_3.SET_AUDIO_UNMUTE_PERMISSIONS:
            return {
                ...state,
                unmuteBlocked: action.blocked
            };
        default:
            return state;
    }
}
/**
 * Media state object for local screenshare.
 *
 * @typedef {Object} ScreenshareMediaState
 * @property {boolean} available=true - Screenshare available state.
 * @property {boolean} muted=true - Screenshare muted state.
 * @property {boolean} unmuteBlocked=false - Screenshare unmute blocked state.
 */
/**
 * Initial state for video.
 *
 * @type {ScreenshareMediaState}
 */
exports._SCREENSHARE_INITIAL_MEDIA_STATE = {
    available: true,
    muted: constants_1.SCREENSHARE_MUTISM_AUTHORITY.USER,
    unmuteBlocked: false
};
/**
 * Reducer for screenshare media state.
 *
 * @param {VideoMediaState} state - Media state of local screenshare.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @private
 * @returns {ScreenshareMediaState}
 */
function _screenshare(state = exports._SCREENSHARE_INITIAL_MEDIA_STATE, action) {
    switch (action.type) {
        case actionTypes_3.SET_SCREENSHARE_MUTED:
            return {
                ...state,
                muted: action.muted
            };
        case actionTypes_3.SET_VIDEO_UNMUTE_PERMISSIONS:
            return {
                ...state,
                unmuteBlocked: action.blocked
            };
        default:
            return state;
    }
}
/**
 * Media state object for local video.
 *
 * @typedef {Object} VideoMediaState
 * @property {CAMERA_FACING_MODE} facingMode='user' - Camera facing mode.
 * @property {boolean} muted=false - Video muted state.
 */
// FIXME Technically, _VIDEO_INITIAL_MEDIA_STATE is a constant internal to the
// feature base/media and used in multiple files so it should be in
// constants.js. Practically though, VideoMediaState would then be used in
// multiple files as well so I don't know where and how to move it.
/**
 * Initial state for video.
 *
 * @type {VideoMediaState}
 */
exports._VIDEO_INITIAL_MEDIA_STATE = {
    available: true,
    gumPending: types_1.IGUMPendingState.NONE,
    unmuteBlocked: false,
    facingMode: constants_1.CAMERA_FACING_MODE.USER,
    muted: 0,
    /**
     * The video {@link Transform}s applied to {@code MediaStream}s by
     * {@code id} i.e. "pinch to zoom".
     */
    transforms: {}
};
/**
 * Reducer for camera media state.
 *
 * @param {VideoMediaState} state - Media state of local video.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @private
 * @returns {VideoMediaState}
 */
function _video(state = exports._VIDEO_INITIAL_MEDIA_STATE, action) {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_FAILED:
        case actionTypes_1.CONFERENCE_LEFT:
            return _clearAllVideoTransforms(state);
        case actionTypes_3.GUM_PENDING:
            if (action.mediaTypes.includes(constants_1.MEDIA_TYPE.VIDEO)) {
                return {
                    ...state,
                    gumPending: action.status
                };
            }
            return state;
        case actionTypes_3.SET_CAMERA_FACING_MODE:
            return {
                ...state,
                facingMode: action.cameraFacingMode
            };
        case actionTypes_3.SET_VIDEO_AVAILABLE:
            return {
                ...state,
                available: action.available
            };
        case actionTypes_3.SET_VIDEO_MUTED:
            return {
                ...state,
                muted: action.muted
            };
        case actionTypes_3.SET_VIDEO_UNMUTE_PERMISSIONS:
            return {
                ...state,
                unmuteBlocked: action.blocked
            };
        case actionTypes_3.STORE_VIDEO_TRANSFORM:
            return _storeVideoTransform(state, action);
        case actionTypes_3.TOGGLE_CAMERA_FACING_MODE: {
            let cameraFacingMode = state.facingMode;
            cameraFacingMode
                = cameraFacingMode === constants_1.CAMERA_FACING_MODE.USER
                    ? constants_1.CAMERA_FACING_MODE.ENVIRONMENT
                    : constants_1.CAMERA_FACING_MODE.USER;
            return {
                ...state,
                facingMode: cameraFacingMode
            };
        }
        case actionTypes_2.TRACK_REMOVED:
            return _trackRemoved(state, action);
        default:
            return state;
    }
}
/**
 * Listen for various actions related to media devices.
 *
 * @param {Object} state - State of media devices.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Object} action.media - Information about media devices to be
 * modified.
 * @returns {Object}
 */
ReducerRegistry_1.default.register('features/base/media', (0, redux_1.combineReducers)({
    audio: _audio,
    screenshare: _screenshare,
    video: _video
}));
/**
 * Removes all stored video {@link Transform}s.
 *
 * @param {Object} state - The {@code video} state of the feature base/media.
 * @private
 * @returns {Object}
 */
function _clearAllVideoTransforms(state) {
    return {
        ...state,
        transforms: exports._VIDEO_INITIAL_MEDIA_STATE.transforms
    };
}
/**
 * Stores the last applied transform to a stream.
 *
 * @param {Object} state - The {@code video} state of the feature base/media.
 * @param {Object} action - The redux action {@link STORE_VIDEO_TRANSFORM}.
 * @private
 * @returns {Object}
 */
function _storeVideoTransform(state, { streamId, transform }) {
    return {
        ...state,
        transforms: {
            ...state.transforms,
            [streamId]: transform
        }
    };
}
/**
 * Removes the stored video {@link Transform} associated with a
 * {@code MediaStream} when its respective track is removed.
 *
 * @param {Object} state - The {@code video} state of the feature base/media.
 * @param {Object} action - The redux action {@link TRACK_REMOVED}.
 * @private
 * @returns {Object}
 */
function _trackRemoved(state, { track: { jitsiTrack } }) {
    if (jitsiTrack) {
        const streamId = jitsiTrack.getStreamId();
        if (streamId && streamId in state.transforms) {
            const nextTransforms = {
                ...state.transforms
            };
            delete nextTransforms[streamId];
            return {
                ...state,
                transforms: nextTransforms
            };
        }
    }
    return state;
}
