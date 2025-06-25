"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCameraFacingMode = exports.logTracksForParticipant = exports.setTrackMuted = exports._setGUMPendingState = exports.isUserInteractionRequiredForUnmute = exports.isRemoteTrackMuted = exports.isLocalVideoTrackDesktop = exports.isLocalTrackMuted = exports.getTracksByMediaType = exports.getTrackByJitsiTrack = exports.getTrackSourceNameByMediaTypeAndParticipant = exports.getScreenShareTrack = exports.getVirtualScreenshareParticipantTrack = exports.getTrackByParticipantId = exports.getTrackByMediaTypeAndParticipant = exports.getVideoTrackByParticipant = exports.getLocalJitsiAudioTrack = exports.getLocalJitsiVideoTrack = exports.getLocalVideoTrack = exports.getLocalTracks = exports.getLocalTrack = exports.getLocalJitsiDesktopTrack = exports.getLocalDesktopTrack = exports.getLocalAudioTrack = exports.isParticipantVideoMuted = exports.isParticipantAudioMuted = exports.isParticipantMediaMuted = exports.getTrackState = void 0;
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const actions_1 = require("../media/actions");
const constants_1 = require("../media/constants");
const types_1 = require("../media/types");
const functions_1 = require("../participants/functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Returns root tracks state.
 *
 * @param {IReduxState} state - Global state.
 * @returns {Object} Tracks state.
 */
const getTrackState = (state) => state['features/base/tracks'];
exports.getTrackState = getTrackState;
/**
 * Checks if the passed media type is muted for the participant.
 *
 * @param {IParticipant} participant - Participant reference.
 * @param {MediaType} mediaType - Media type.
 * @param {IReduxState} state - Global state.
 * @returns {boolean} - Is the media type muted for the participant.
 */
function isParticipantMediaMuted(participant, mediaType, state) {
    if (!participant) {
        return false;
    }
    const tracks = (0, exports.getTrackState)(state);
    if (participant?.local) {
        return isLocalTrackMuted(tracks, mediaType);
    }
    else if (!participant?.fakeParticipant) {
        return isRemoteTrackMuted(tracks, mediaType, participant.id);
    }
    return true;
}
exports.isParticipantMediaMuted = isParticipantMediaMuted;
/**
 * Checks if the participant is audio muted.
 *
 * @param {IParticipant} participant - Participant reference.
 * @param {IReduxState} state - Global state.
 * @returns {boolean} - Is audio muted for the participant.
 */
function isParticipantAudioMuted(participant, state) {
    return isParticipantMediaMuted(participant, constants_1.MEDIA_TYPE.AUDIO, state);
}
exports.isParticipantAudioMuted = isParticipantAudioMuted;
/**
 * Checks if the participant is video muted.
 *
 * @param {IParticipant} participant - Participant reference.
 * @param {IReduxState} state - Global state.
 * @returns {boolean} - Is video muted for the participant.
 */
function isParticipantVideoMuted(participant, state) {
    return isParticipantMediaMuted(participant, constants_1.MEDIA_TYPE.VIDEO, state);
}
exports.isParticipantVideoMuted = isParticipantVideoMuted;
/**
 * Returns local audio track.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @returns {(Track|undefined)}
 */
function getLocalAudioTrack(tracks) {
    return getLocalTrack(tracks, constants_1.MEDIA_TYPE.AUDIO);
}
exports.getLocalAudioTrack = getLocalAudioTrack;
/**
 * Returns the local desktop track.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @param {boolean} [includePending] - Indicates whether a local track is to be returned if it is still pending.
 * A local track is pending if {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local track is not returned.
 * @returns {(Track|undefined)}
 */
function getLocalDesktopTrack(tracks, includePending = false) {
    return (getLocalTracks(tracks, includePending)
        .find(t => t.mediaType === constants_1.MEDIA_TYPE.SCREENSHARE || t.videoType === constants_1.VIDEO_TYPE.DESKTOP));
}
exports.getLocalDesktopTrack = getLocalDesktopTrack;
/**
 * Returns the stored local desktop jitsiLocalTrack.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {JitsiLocalTrack|undefined}
 */
function getLocalJitsiDesktopTrack(state) {
    const track = getLocalDesktopTrack((0, exports.getTrackState)(state));
    return track?.jitsiTrack;
}
exports.getLocalJitsiDesktopTrack = getLocalJitsiDesktopTrack;
/**
 * Returns local track by media type.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - Media type.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @returns {(Track|undefined)}
 */
function getLocalTrack(tracks, mediaType, includePending = false) {
    return (getLocalTracks(tracks, includePending)
        .find(t => t.mediaType === mediaType));
}
exports.getLocalTrack = getLocalTrack;
/**
 * Returns an array containing the local tracks with or without a (valid)
 * {@code JitsiTrack}.
 *
 * @param {ITrack[]} tracks - An array containing all local tracks.
 * @param {boolean} [includePending] - Indicates whether a local track is to be
 * returned if it is still pending. A local track is pending if
 * {@code getUserMedia} is still executing to create it and, consequently, its
 * {@code jitsiTrack} property is {@code undefined}. By default a pending local
 * track is not returned.
 * @returns {Track[]}
 */
function getLocalTracks(tracks, includePending = false) {
    // XXX A local track is considered ready only once it has its `jitsiTrack`
    // property set by the `TRACK_ADDED` action. Until then there is a stub
    // added just before the `getUserMedia` call with a cancellable
    // `gumInProgress` property which then can be used to destroy the track that
    // has not yet been added to the redux store. Once GUM is cancelled, it will
    // never make it to the store nor there will be any
    // `TRACK_ADDED`/`TRACK_REMOVED` actions dispatched for it.
    return tracks.filter(t => t.local && (t.jitsiTrack || includePending));
}
exports.getLocalTracks = getLocalTracks;
/**
 * Returns local video track.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @returns {(Track|undefined)}
 */
function getLocalVideoTrack(tracks) {
    return getLocalTrack(tracks, constants_1.MEDIA_TYPE.VIDEO);
}
exports.getLocalVideoTrack = getLocalVideoTrack;
/**
 * Returns the stored local video track.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {Object}
 */
function getLocalJitsiVideoTrack(state) {
    const track = getLocalVideoTrack((0, exports.getTrackState)(state));
    return track?.jitsiTrack;
}
exports.getLocalJitsiVideoTrack = getLocalJitsiVideoTrack;
/**
 * Returns the stored local audio track.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {Object}
 */
function getLocalJitsiAudioTrack(state) {
    const track = getLocalAudioTrack((0, exports.getTrackState)(state));
    return track?.jitsiTrack;
}
exports.getLocalJitsiAudioTrack = getLocalJitsiAudioTrack;
/**
 * Returns track of specified media type for specified participant.
 *
 * @param {IReduxState} state - The redux state.
 * @param {IParticipant} participant - Participant Object.
 * @returns {(Track|undefined)}
 */
function getVideoTrackByParticipant(state, participant) {
    if (!participant) {
        return;
    }
    const tracks = state['features/base/tracks'];
    if ((0, functions_1.isScreenShareParticipant)(participant)) {
        return getVirtualScreenshareParticipantTrack(tracks, participant.id);
    }
    return getTrackByMediaTypeAndParticipant(tracks, constants_1.MEDIA_TYPE.VIDEO, participant.id);
}
exports.getVideoTrackByParticipant = getVideoTrackByParticipant;
/**
 * Returns track of specified media type for specified participant id.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - Media type.
 * @param {string} participantId - Participant ID.
 * @returns {(Track|undefined)}
 */
function getTrackByMediaTypeAndParticipant(tracks, mediaType, participantId) {
    return tracks.find(t => Boolean(t.jitsiTrack) && t.participantId === participantId && t.mediaType === mediaType);
}
exports.getTrackByMediaTypeAndParticipant = getTrackByMediaTypeAndParticipant;
/**
 * Returns track for specified participant id.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {string} participantId - Participant ID.
 * @returns {(Track[]|undefined)}
 */
function getTrackByParticipantId(tracks, participantId) {
    return tracks.filter(t => t.participantId === participantId);
}
exports.getTrackByParticipantId = getTrackByParticipantId;
/**
 * Returns screenshare track of given virtualScreenshareParticipantId.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {string} virtualScreenshareParticipantId - Virtual Screenshare Participant ID.
 * @returns {(Track|undefined)}
 */
function getVirtualScreenshareParticipantTrack(tracks, virtualScreenshareParticipantId) {
    const ownderId = (0, functions_1.getVirtualScreenshareParticipantOwnerId)(virtualScreenshareParticipantId);
    return getScreenShareTrack(tracks, ownderId);
}
exports.getVirtualScreenshareParticipantTrack = getVirtualScreenshareParticipantTrack;
/**
 * Returns screenshare track of given owner ID.
 *
 * @param {Track[]} tracks - List of all tracks.
 * @param {string} ownerId - Screenshare track owner ID.
 * @returns {(Track|undefined)}
 */
function getScreenShareTrack(tracks, ownerId) {
    return tracks.find(t => Boolean(t.jitsiTrack)
        && t.participantId === ownerId
        && (t.mediaType === constants_1.MEDIA_TYPE.SCREENSHARE || t.videoType === constants_1.VIDEO_TYPE.DESKTOP));
}
exports.getScreenShareTrack = getScreenShareTrack;
/**
 * Returns track source name of specified media type for specified participant id.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - Media type.
 * @param {string} participantId - Participant ID.
 * @returns {(string|undefined)}
 */
function getTrackSourceNameByMediaTypeAndParticipant(tracks, mediaType, participantId) {
    const track = getTrackByMediaTypeAndParticipant(tracks, mediaType, participantId);
    return track?.jitsiTrack?.getSourceName();
}
exports.getTrackSourceNameByMediaTypeAndParticipant = getTrackSourceNameByMediaTypeAndParticipant;
/**
 * Returns the track if any which corresponds to a specific instance
 * of JitsiLocalTrack or JitsiRemoteTrack.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {(JitsiLocalTrack|JitsiRemoteTrack)} jitsiTrack - JitsiTrack instance.
 * @returns {(Track|undefined)}
 */
function getTrackByJitsiTrack(tracks, jitsiTrack) {
    return tracks.find(t => t.jitsiTrack === jitsiTrack);
}
exports.getTrackByJitsiTrack = getTrackByJitsiTrack;
/**
 * Returns tracks of specified media type.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - Media type.
 * @returns {Track[]}
 */
function getTracksByMediaType(tracks, mediaType) {
    return tracks.filter(t => t.mediaType === mediaType);
}
exports.getTracksByMediaType = getTracksByMediaType;
/**
 * Checks if the first local track in the given tracks set is muted.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - The media type of tracks to be checked.
 * @returns {boolean} True if local track is muted or false if the track is
 * unmuted or if there are no local tracks of the given media type in the given
 * set of tracks.
 */
function isLocalTrackMuted(tracks, mediaType) {
    const track = getLocalTrack(tracks, mediaType);
    return !track || track.muted;
}
exports.isLocalTrackMuted = isLocalTrackMuted;
/**
 * Checks if the local video track is of type DESKtOP.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean}
 */
function isLocalVideoTrackDesktop(state) {
    const desktopTrack = getLocalDesktopTrack((0, exports.getTrackState)(state));
    return desktopTrack !== undefined && !desktopTrack.muted;
}
exports.isLocalVideoTrackDesktop = isLocalVideoTrackDesktop;
/**
 * Returns true if the remote track of the given media type and the given
 * participant is muted, false otherwise.
 *
 * @param {ITrack[]} tracks - List of all tracks.
 * @param {MediaType} mediaType - The media type of tracks to be checked.
 * @param {string} participantId - Participant ID.
 * @returns {boolean}
 */
function isRemoteTrackMuted(tracks, mediaType, participantId) {
    const track = getTrackByMediaTypeAndParticipant(tracks, mediaType, participantId);
    return !track || track.muted;
}
exports.isRemoteTrackMuted = isRemoteTrackMuted;
/**
 * Returns whether or not the current environment needs a user interaction with
 * the page before any unmute can occur.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean}
 */
function isUserInteractionRequiredForUnmute(state) {
    return lib_jitsi_meet_1.browser.isUserInteractionRequiredForUnmute()
        && window
        && window.self !== window.top
        && !state['features/base/user-interaction'].interacted;
}
exports.isUserInteractionRequiredForUnmute = isUserInteractionRequiredForUnmute;
/**
 * Sets the GUM pending state for the passed track operation (mute/unmute) and media type.
 * NOTE: We need this only for web.
 *
 * @param {IGUMPendingState} status - The new GUM pending status.
 * @param {MediaType} mediaType - The media type related to the operation (audio or video).
 * @param {boolean} muted - True if the operation is mute and false for unmute.
 * @param {Function} dispatch - The dispatch method.
 * @returns {void}
 */
function _setGUMPendingState(status, mediaType, muted, dispatch) {
    if (!muted && dispatch && typeof APP !== 'undefined') {
        dispatch((0, actions_1.gumPending)([mediaType], status));
    }
}
exports._setGUMPendingState = _setGUMPendingState;
/**
 * Mutes or unmutes a specific {@code JitsiLocalTrack}. If the muted state of the specified {@code track} is already in
 * accord with the specified {@code muted} value, then does nothing.
 *
 * @param {JitsiLocalTrack} track - The {@code JitsiLocalTrack} to mute or unmute.
 * @param {boolean} muted - If the specified {@code track} is to be muted, then {@code true}; otherwise, {@code false}.
 * @param {Object} state - The redux state.
 * @param {Function} dispatch - The dispatch method.
 * @returns {Promise}
 */
function setTrackMuted(track, muted, state, dispatch) {
    muted = Boolean(muted); // eslint-disable-line no-param-reassign
    // Ignore the check for desktop track muted operation. When the screenshare is terminated by clicking on the
    // browser's 'Stop sharing' button, the local stream is stopped before the inactive stream handler is fired.
    // We still need to proceed here and remove the track from the peerconnection.
    if (track.isMuted() === muted && track.getVideoType() !== constants_1.VIDEO_TYPE.DESKTOP) {
        return Promise.resolve();
    }
    const f = muted ? 'mute' : 'unmute';
    const mediaType = track.getType();
    _setGUMPendingState(types_1.IGUMPendingState.PENDING_UNMUTE, mediaType, muted, dispatch);
    return track[f]().then((result) => {
        _setGUMPendingState(types_1.IGUMPendingState.NONE, mediaType, muted, dispatch);
        return result;
    })
        .catch((error) => {
        _setGUMPendingState(types_1.IGUMPendingState.NONE, mediaType, muted, dispatch);
        // Track might be already disposed so ignore such an error.
        if (error.name !== lib_jitsi_meet_1.JitsiTrackErrors.TRACK_IS_DISPOSED) {
            logger_1.default.error(`set track ${f} failed`, error);
            return Promise.reject(error);
        }
    });
}
exports.setTrackMuted = setTrackMuted;
/**
 * Logs the current track state for a participant.
 *
 * @param {ITrack[]} tracksState - The tracks from redux.
 * @param {string} participantId - The ID of the participant.
 * @param {string} reason - The reason for the track change.
 * @returns {void}
 */
function logTracksForParticipant(tracksState, participantId, reason) {
    if (!participantId) {
        return;
    }
    const tracks = getTrackByParticipantId(tracksState, participantId);
    const logStringPrefix = `Track state for participant ${participantId} changed`;
    const trackStateStrings = tracks.map(t => `{type: ${t.mediaType}, videoType: ${t.videoType}, muted: ${t.muted}, isReceivingData: ${t.isReceivingData}, jitsiTrack: ${t.jitsiTrack?.toString()}}`);
    const tracksLogMsg = trackStateStrings.length > 0 ? `\n${trackStateStrings.join('\n')}` : ' No tracks available!';
    logger_1.default.debug(`${logStringPrefix}${reason ? `(reason: ${reason})` : ''}:${tracksLogMsg}`);
}
exports.logTracksForParticipant = logTracksForParticipant;
/**
 * Gets the default camera facing mode.
 *
 * @param {Object} state - The redux state.
 * @returns {string} - The camera facing mode.
 */
function getCameraFacingMode(state) {
    return state['features/base/config'].cameraFacingMode ?? constants_1.CAMERA_FACING_MODE.USER;
}
exports.getCameraFacingMode = getCameraFacingMode;
