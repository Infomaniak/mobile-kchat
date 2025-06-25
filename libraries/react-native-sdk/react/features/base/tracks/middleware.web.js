"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../../notifications/actions");
const functions_1 = require("../../prejoin/functions");
const actions_web_1 = require("../devices/actions.web");
const actions_2 = require("../media/actions");
const constants_1 = require("../media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
const actions_web_2 = require("./actions.web");
const functions_web_1 = require("./functions.web");
require("./middleware.any");
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
        case actionTypes_1.TRACK_ADDED: {
            const { local } = action.track;
            // The devices list needs to be refreshed when no initial video permissions
            // were granted and a local video track is added by umuting the video.
            if (local) {
                store.dispatch((0, actions_web_1.getAvailableDevices)());
                break;
            }
            const result = next(action);
            const participantId = action.track?.participantId;
            if (participantId) {
                (0, functions_web_1.logTracksForParticipant)(store.getState()['features/base/tracks'], participantId, 'Track added');
            }
            return result;
        }
        case actionTypes_1.TRACK_NO_DATA_FROM_SOURCE: {
            const result = next(action);
            _handleNoDataFromSourceErrors(store, action);
            return result;
        }
        case actionTypes_1.TRACK_REMOVED: {
            _removeNoDataFromSourceNotification(store, action.track);
            const result = next(action);
            const participantId = action.track?.jitsiTrack?.getParticipantId();
            if (participantId && !action.track?.jitsiTrack?.isLocal()) {
                (0, functions_web_1.logTracksForParticipant)(store.getState()['features/base/tracks'], participantId, 'Track removed');
            }
            return result;
        }
        case actionTypes_1.TRACK_MUTE_UNMUTE_FAILED: {
            const { jitsiTrack } = action.track;
            const muted = action.wasMuted;
            const isVideoTrack = jitsiTrack.getType() !== constants_1.MEDIA_TYPE.AUDIO;
            if (isVideoTrack && jitsiTrack.getVideoType() === constants_1.VIDEO_TYPE.DESKTOP) {
                store.dispatch((0, actions_2.setScreenshareMuted)(!muted));
            }
            else if (isVideoTrack) {
                APP.conference.setVideoMuteStatus();
            }
            else {
                APP.conference.updateAudioIconEnabled();
            }
            break;
        }
        case actionTypes_1.TRACK_STOPPED: {
            const { jitsiTrack } = action.track;
            if (jitsiTrack.getVideoType() === constants_1.VIDEO_TYPE.DESKTOP) {
                store.dispatch((0, actions_web_2.toggleScreensharing)(false));
            }
            break;
        }
        case actionTypes_1.TRACK_UPDATED: {
            // TODO Remove the following calls to APP.UI once components interested
            // in track mute changes are moved into React and/or redux.
            const result = next(action);
            const state = store.getState();
            if ((0, functions_1.isPrejoinPageVisible)(state)) {
                return result;
            }
            const { jitsiTrack } = action.track;
            const participantID = jitsiTrack.getParticipantId();
            const isVideoTrack = jitsiTrack.type !== constants_1.MEDIA_TYPE.AUDIO;
            const local = jitsiTrack.isLocal();
            if (isVideoTrack) {
                if (local && !(jitsiTrack.getVideoType() === constants_1.VIDEO_TYPE.DESKTOP)) {
                    APP.conference.setVideoMuteStatus();
                }
                else if (!local) {
                    APP.UI.setVideoMuted(participantID);
                }
            }
            else if (local) {
                APP.conference.updateAudioIconEnabled();
            }
            if (typeof action.track?.muted !== 'undefined' && participantID && !local) {
                (0, functions_web_1.logTracksForParticipant)(store.getState()['features/base/tracks'], participantID, 'Track updated');
            }
            return result;
        }
    }
    return next(action);
});
/**
 * Handles no data from source errors.
 *
 * @param {Store} store - The redux store in which the specified action is
 * dispatched.
 * @param {Action} action - The redux action dispatched in the specified store.
 * @private
 * @returns {void}
 */
function _handleNoDataFromSourceErrors(store, action) {
    const { getState, dispatch } = store;
    const track = (0, functions_web_1.getTrackByJitsiTrack)(getState()['features/base/tracks'], action.track.jitsiTrack);
    if (!track?.local) {
        return;
    }
    const { jitsiTrack } = track;
    if (track.mediaType === constants_1.MEDIA_TYPE.AUDIO && track.isReceivingData) {
        _removeNoDataFromSourceNotification(store, action.track);
    }
    if (track.mediaType === constants_1.MEDIA_TYPE.VIDEO) {
        const { noDataFromSourceNotificationInfo = {} } = track;
        if (track.isReceivingData) {
            if (noDataFromSourceNotificationInfo.timeout) {
                clearTimeout(noDataFromSourceNotificationInfo.timeout);
                dispatch((0, actions_web_2.trackNoDataFromSourceNotificationInfoChanged)(jitsiTrack, undefined));
            }
            // try to remove the notification if there is one.
            _removeNoDataFromSourceNotification(store, action.track);
        }
        else {
            if (noDataFromSourceNotificationInfo.timeout) {
                return;
            }
            const timeout = setTimeout(() => dispatch((0, actions_web_2.showNoDataFromSourceVideoError)(jitsiTrack)), 5000);
            dispatch((0, actions_web_2.trackNoDataFromSourceNotificationInfoChanged)(jitsiTrack, { timeout }));
        }
    }
}
/**
 * Removes the no data from source notification associated with the JitsiTrack if displayed.
 *
 * @param {Store} store - The redux store.
 * @param {Track} track - The redux action dispatched in the specified store.
 * @returns {void}
 */
function _removeNoDataFromSourceNotification({ getState, dispatch }, track) {
    const t = (0, functions_web_1.getTrackByJitsiTrack)(getState()['features/base/tracks'], track.jitsiTrack);
    const { jitsiTrack, noDataFromSourceNotificationInfo = {} } = t || {};
    if (noDataFromSourceNotificationInfo?.uid) {
        dispatch((0, actions_1.hideNotification)(noDataFromSourceNotificationInfo.uid));
        dispatch((0, actions_web_2.trackNoDataFromSourceNotificationInfoChanged)(jitsiTrack, undefined));
    }
}
