"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLargeVideoDimensions = exports.updateKnownLargeVideoResolution = exports.selectParticipantInLargeVideo = void 0;
const constants_1 = require("../base/media/constants");
const functions_1 = require("../base/participants/functions");
const functions_2 = require("../base/redux/functions");
const functions_3 = require("../filmstrip/functions");
const functions_4 = require("../video-layout/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Action to select the participant to be displayed in LargeVideo based on the
 * participant id provided. If a participant id is not provided, the LargeVideo
 * participant will be selected based on a variety of factors: If there is a
 * dominant or pinned speaker, or if there are remote tracks, etc.
 *
 * @param {string} participant - The participant id of the user that needs to be
 * displayed on the large video.
 * @returns {Function}
 */
function selectParticipantInLargeVideo(participant) {
    return (dispatch, getState) => {
        const state = getState();
        if ((0, functions_3.isStageFilmstripAvailable)(state, 2)) {
            return;
        }
        // Keep Etherpad open.
        if (state['features/etherpad'].editing) {
            return;
        }
        const participantId = participant ?? _electParticipantInLargeVideo(state);
        const largeVideo = state['features/large-video'];
        const remoteScreenShares = state['features/video-layout'].remoteScreenShares;
        let latestScreenshareParticipantId;
        if (remoteScreenShares?.length) {
            latestScreenshareParticipantId = remoteScreenShares[remoteScreenShares.length - 1];
        }
        // When trying to auto pin screenshare, always select the endpoint even though it happens to be
        // the large video participant in redux (for the reasons listed above in the large video selection
        // logic above). The auto pin screenshare logic kicks in after the track is added
        // (which updates the large video participant and selects all endpoints because of the auto tile
        // view mode). If the screenshare endpoint is not among the forwarded endpoints from the bridge,
        // it needs to be selected again at this point.
        if (participantId !== largeVideo.participantId || participantId === latestScreenshareParticipantId) {
            dispatch({
                type: actionTypes_1.SELECT_LARGE_VIDEO_PARTICIPANT,
                participantId
            });
        }
    };
}
exports.selectParticipantInLargeVideo = selectParticipantInLargeVideo;
/**
 * Updates the currently seen resolution of the video displayed on large video.
 *
 * @param {number} resolution - The current resolution (height) of the video.
 * @returns {{
 *     type: UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION,
 *     resolution: number
 * }}
 */
function updateKnownLargeVideoResolution(resolution) {
    return {
        type: actionTypes_1.UPDATE_KNOWN_LARGE_VIDEO_RESOLUTION,
        resolution
    };
}
exports.updateKnownLargeVideoResolution = updateKnownLargeVideoResolution;
/**
 * Sets the dimenstions of the large video in redux.
 *
 * @param {number} height - The height of the large video.
 * @param {number} width - The width of the large video.
 * @returns {{
 *     type: SET_LARGE_VIDEO_DIMENSIONS,
 *     height: number,
 *     width: number
 * }}
 */
function setLargeVideoDimensions(height, width) {
    return {
        type: actionTypes_1.SET_LARGE_VIDEO_DIMENSIONS,
        height,
        width
    };
}
exports.setLargeVideoDimensions = setLargeVideoDimensions;
/**
 * Returns the most recent existing remote video track.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState} function.
 * @private
 * @returns {(Track|undefined)}
 */
function _electLastVisibleRemoteParticipant(stateful) {
    const state = (0, functions_2.toState)(stateful);
    const tracks = state['features/base/tracks'];
    // First we try to get most recent remote video track.
    for (let i = tracks.length - 1; i >= 0; --i) {
        const track = tracks[i];
        if (!track.local && track.mediaType === constants_1.MEDIA_TYPE.VIDEO && track.participantId) {
            const participant = (0, functions_1.getParticipantById)(state, track.participantId);
            if (participant) {
                return participant;
            }
        }
    }
}
/**
 * Returns the identifier of the participant who is to be on the stage and
 * should be displayed in {@code LargeVideo}.
 *
 * @param {Object} state - The Redux state from which the participant to be
 * displayed in {@code LargeVideo} is to be elected.
 * @private
 * @returns {(string|undefined)}
 */
function _electParticipantInLargeVideo(state) {
    // If a participant is pinned, they will be shown in the LargeVideo (regardless of whether they are local or
    // remote) when the filmstrip on stage is disabled.
    let participant = (0, functions_1.getPinnedParticipant)(state);
    if (participant) {
        return participant.id;
    }
    const autoPinSetting = (0, functions_4.getAutoPinSetting)();
    if (autoPinSetting) {
        // when the setting auto_pin_latest_screen_share is true as spot does, prioritize local screenshare
        if (autoPinSetting === true) {
            const localScreenShareParticipant = (0, functions_1.getLocalScreenShareParticipant)(state);
            if (localScreenShareParticipant) {
                return localScreenShareParticipant.id;
            }
        }
        // Pick the most recent remote screenshare that was added to the conference.
        const remoteScreenShares = state['features/video-layout'].remoteScreenShares;
        if (remoteScreenShares?.length) {
            return remoteScreenShares[remoteScreenShares.length - 1];
        }
    }
    // Next, pick the dominant speaker (other than self).
    participant = (0, functions_1.getDominantSpeakerParticipant)(state);
    if (participant && !participant.local) {
        // Return the screensharing participant id associated with this endpoint if multi-stream is enabled and
        // auto_pin_latest_screen_share setting is disabled.
        const screenshareParticipant = (0, functions_1.getVirtualScreenshareParticipantByOwnerId)(state, participant.id);
        return screenshareParticipant?.id ?? participant.id;
    }
    // In case this is the local participant.
    participant = undefined;
    // Next, pick the most recent participant with video.
    const lastVisibleRemoteParticipant = _electLastVisibleRemoteParticipant(state);
    if (lastVisibleRemoteParticipant) {
        return lastVisibleRemoteParticipant.id;
    }
    // Last, select the participant that joined last (other than poltergist or other bot type participants).
    const participants = [...(0, functions_1.getRemoteParticipants)(state).values()];
    for (let i = participants.length; i > 0 && !participant; i--) {
        const p = participants[i - 1];
        !p.botType && (participant = p);
    }
    if (participant) {
        return participant.id;
    }
    return (0, functions_1.getLocalParticipant)(state)?.id;
}
