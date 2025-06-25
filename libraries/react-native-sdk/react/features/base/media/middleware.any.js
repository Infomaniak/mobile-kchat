"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const actionTypes_1 = require("../../mobile/background/actionTypes");
const actions_1 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const functions_2 = require("../../participants-pane/functions");
const functions_3 = require("../../screen-share/functions");
const actionTypes_2 = require("../audio-only/actionTypes");
const actions_2 = require("../audio-only/actions");
const actionTypes_3 = require("../conference/actionTypes");
const functions_4 = require("../conference/functions");
const functions_5 = require("../participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const functions_any_1 = require("../settings/functions.any");
const actionTypes_4 = require("../tracks/actionTypes");
const actions_any_1 = require("../tracks/actions.any");
const functions_any_2 = require("../tracks/functions.any");
const actionTypes_5 = require("./actionTypes");
const actions_3 = require("./actions");
const constants_2 = require("./constants");
const functions_6 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const reducer_1 = require("./reducer");
/**
 * Implements the entry point of the middleware of the feature base/media.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_STATE_CHANGED:
            return _appStateChanged(store, next, action);
        case actionTypes_2.SET_AUDIO_ONLY:
            return _setAudioOnly(store, next, action);
        case actionTypes_3.SET_ROOM:
            return _setRoom(store, next, action);
        case actionTypes_4.TRACK_ADDED: {
            const result = next(action);
            const { track } = action;
            // Don't sync track mute state with the redux store for screenshare
            // since video mute state represents local camera mute state only.
            track.local && track.videoType !== 'desktop'
                && _syncTrackMutedState(store, track);
            return result;
        }
        case actionTypes_5.SET_AUDIO_MUTED: {
            const state = store.getState();
            const participant = (0, functions_5.getLocalParticipant)(state);
            if (!action.muted && (0, functions_2.isForceMuted)(participant, constants_2.MEDIA_TYPE.AUDIO, state)) {
                return;
            }
            break;
        }
        case actionTypes_5.SET_AUDIO_UNMUTE_PERMISSIONS: {
            const { blocked, skipNotification } = action;
            const state = store.getState();
            const tracks = state['features/base/tracks'];
            const isAudioMuted = (0, functions_any_2.isLocalTrackMuted)(tracks, constants_2.MEDIA_TYPE.AUDIO);
            if (blocked && isAudioMuted && !skipNotification) {
                store.dispatch((0, actions_1.showWarningNotification)({
                    descriptionKey: 'notify.audioUnmuteBlockedDescription',
                    titleKey: 'notify.audioUnmuteBlockedTitle'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            }
            break;
        }
        case actionTypes_5.SET_SCREENSHARE_MUTED: {
            const state = store.getState();
            const participant = (0, functions_5.getLocalParticipant)(state);
            if (!action.muted && (0, functions_2.isForceMuted)(participant, constants_2.MEDIA_TYPE.SCREENSHARE, state)) {
                return;
            }
            break;
        }
        case actionTypes_5.SET_VIDEO_MUTED: {
            const state = store.getState();
            const participant = (0, functions_5.getLocalParticipant)(state);
            if (!action.muted && (0, functions_2.isForceMuted)(participant, constants_2.MEDIA_TYPE.VIDEO, state)) {
                return;
            }
            break;
        }
        case actionTypes_5.SET_VIDEO_UNMUTE_PERMISSIONS: {
            const { blocked, skipNotification } = action;
            const state = store.getState();
            const tracks = state['features/base/tracks'];
            const isVideoMuted = (0, functions_any_2.isLocalTrackMuted)(tracks, constants_2.MEDIA_TYPE.VIDEO);
            const isMediaShared = (0, functions_3.isScreenMediaShared)(state);
            if (blocked && isVideoMuted && !isMediaShared && !skipNotification) {
                store.dispatch((0, actions_1.showWarningNotification)({
                    descriptionKey: 'notify.videoUnmuteBlockedDescription',
                    titleKey: 'notify.videoUnmuteBlockedTitle'
                }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            }
            break;
        }
    }
    return next(action);
});
/**
 * Adjusts the video muted state based on the app state.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code APP_STATE_CHANGED} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _appStateChanged({ dispatch, getState }, next, action) {
    if (navigator.product === 'ReactNative') {
        const { appState } = action;
        const mute = appState !== 'active' && !(0, functions_any_2.isLocalVideoTrackDesktop)(getState());
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createTrackMutedEvent)('video', 'background mode', mute));
        dispatch((0, actions_3.setVideoMuted)(mute, constants_2.VIDEO_MUTISM_AUTHORITY.BACKGROUND));
    }
    return next(action);
}
/**
 * Adjusts the video muted state based on the audio-only state.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code SET_AUDIO_ONLY} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _setAudioOnly({ dispatch }, next, action) {
    const { audioOnly } = action;
    (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createTrackMutedEvent)('video', 'audio-only mode', audioOnly));
    // Make sure we mute both the desktop and video tracks.
    dispatch((0, actions_3.setVideoMuted)(audioOnly, constants_2.VIDEO_MUTISM_AUTHORITY.AUDIO_ONLY));
    dispatch((0, actions_3.setScreenshareMuted)(audioOnly, constants_2.SCREENSHARE_MUTISM_AUTHORITY.AUDIO_ONLY));
    return next(action);
}
/**
 * Notifies the feature base/media that the action {@link SET_ROOM} is being
 * dispatched within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action, {@code SET_ROOM}, which is being
 * dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _setRoom({ dispatch, getState }, next, action) {
    // Figure out the desires/intents i.e. the state of base/media. There are
    // multiple desires/intents ordered by precedence such as server-side
    // config, config overrides in the user-supplied URL, user's own app
    // settings, etc.
    const state = getState();
    const { room } = action;
    const roomIsValid = (0, functions_4.isRoomValid)(room);
    // when going to welcomepage on web(room is not valid) we want to skip resetting the values of startWithA/V
    if (roomIsValid || navigator.product === 'ReactNative') {
        const audioMuted = roomIsValid ? (0, functions_6.getStartWithAudioMuted)(state) : reducer_1._AUDIO_INITIAL_MEDIA_STATE.muted;
        const videoMuted = roomIsValid ? (0, functions_6.getStartWithVideoMuted)(state) : reducer_1._VIDEO_INITIAL_MEDIA_STATE.muted;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createStartMutedConfigurationEvent)('local', audioMuted, Boolean(videoMuted)));
        logger_1.default.log(`Start muted: ${audioMuted ? 'audio, ' : ''}${videoMuted ? 'video' : ''}`);
        // Unconditionally express the desires/expectations/intents of the app and
        // the user i.e. the state of base/media. Eventually, practice/reality i.e.
        // the state of base/tracks will or will not agree with the desires.
        dispatch((0, actions_3.setAudioMuted)(audioMuted));
        dispatch((0, actions_3.setCameraFacingMode)((0, functions_any_2.getCameraFacingMode)(state)));
        dispatch((0, actions_3.setVideoMuted)(videoMuted));
    }
    // startAudioOnly
    //
    // FIXME Technically, the audio-only feature is owned by base/conference,
    // not base/media so the following should be in base/conference.
    // Practically, I presume it was easier to write the source code here
    // because it looks like startWithAudioMuted and startWithVideoMuted.
    //
    // XXX After the introduction of the "Video <-> Voice" toggle on the
    // WelcomePage, startAudioOnly is utilized even outside of
    // conferences/meetings.
    const audioOnly = Boolean((0, functions_any_1.getPropertyValue)(state, 'startAudioOnly', 
    /* sources */ {
        // FIXME Practically, base/config is (really) correct
        // only if roomIsValid. At the time of this writing,
        // base/config is overwritten by URL params which leaves
        // base/config incorrect on the WelcomePage after
        // leaving a conference which explicitly overwrites
        // base/config with URL params.
        config: roomIsValid,
        // XXX We've already overwritten base/config with
        // urlParams if roomIsValid. However, settings are more
        // important than the server-side config. Consequently,
        // we need to read from urlParams anyway. We also
        // probably want to read from urlParams when
        // !roomIsValid.
        urlParams: true,
        // The following don't have complications around whether
        // they are defined or not:
        jwt: false,
        // We need to look for 'startAudioOnly' in settings only for react native clients. Otherwise, the
        // default value from ISettingsState (false) will override the value set in config for web clients.
        settings: typeof APP === 'undefined'
    }));
    (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createStartAudioOnlyEvent)(audioOnly));
    logger_1.default.log(`Start audio only set to ${audioOnly.toString()}`);
    dispatch((0, actions_2.setAudioOnly)(audioOnly));
    if (!roomIsValid) {
        dispatch((0, actions_any_1.destroyLocalTracks)());
    }
    return next(action);
}
/**
 * Syncs muted state of local media track with muted state from media state.
 *
 * @param {Store} store - The redux store.
 * @param {Track} track - The local media track.
 * @private
 * @returns {void}
 */
function _syncTrackMutedState({ getState, dispatch }, track) {
    const state = getState()['features/base/media'];
    const mediaType = track.mediaType;
    const muted = Boolean(state[mediaType].muted);
    // XXX If muted state of track when it was added is different from our media
    // muted state, we need to mute track and explicitly modify 'muted' property
    // on track. This is because though TRACK_ADDED action was dispatched it's
    // not yet in redux state and JitsiTrackEvents.TRACK_MUTE_CHANGED may be
    // fired before track gets to state.
    if (track.muted !== muted) {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createSyncTrackStateEvent)(mediaType, muted));
        logger_1.default.log(`Sync ${mediaType} track muted state to ${muted ? 'muted' : 'unmuted'}`);
        track.muted = muted;
        (0, functions_any_2.setTrackMuted)(track.jitsiTrack, muted, state, dispatch);
    }
}
