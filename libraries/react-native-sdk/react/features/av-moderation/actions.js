"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.participantRejected = exports.participantApproved = exports.participantPendingAudio = exports.showModeratedNotification = exports.localParticipantRejected = exports.localParticipantApproved = exports.requestEnableVideoModeration = exports.requestEnableAudioModeration = exports.requestDisableVideoModeration = exports.requestDisableAudioModeration = exports.enableModeration = exports.dismissPendingParticipant = exports.dismissPendingAudioParticipant = exports.disableModeration = exports.rejectParticipantVideo = exports.rejectParticipantAudio = exports.approveParticipant = exports.approveParticipantVideo = exports.approveParticipantAudio = void 0;
const functions_1 = require("../base/conference/functions");
const constants_1 = require("../base/media/constants");
const functions_2 = require("../base/participants/functions");
const functions_3 = require("../participants-pane/functions");
const actionTypes_1 = require("./actionTypes");
const functions_4 = require("./functions");
/**
 * Action used by moderator to approve audio for a participant.
 *
 * @param {staring} id - The id of the participant to be approved.
 * @returns {void}
 */
const approveParticipantAudio = (id) => (dispatch, getState) => {
    const state = getState();
    const { conference } = (0, functions_1.getConferenceState)(state);
    const participant = (0, functions_2.getParticipantById)(state, id);
    const isAudioModerationOn = (0, functions_4.isEnabledFromState)(constants_1.MEDIA_TYPE.AUDIO, state);
    const isVideoModerationOn = (0, functions_4.isEnabledFromState)(constants_1.MEDIA_TYPE.VIDEO, state);
    const isVideoForceMuted = (0, functions_3.isForceMuted)(participant, constants_1.MEDIA_TYPE.VIDEO, state);
    if (isAudioModerationOn || !isVideoModerationOn || !isVideoForceMuted) {
        conference?.avModerationApprove(constants_1.MEDIA_TYPE.AUDIO, id);
    }
};
exports.approveParticipantAudio = approveParticipantAudio;
/**
 * Action used by moderator to approve video for a participant.
 *
 * @param {staring} id - The id of the participant to be approved.
 * @returns {void}
 */
const approveParticipantVideo = (id) => (dispatch, getState) => {
    const state = getState();
    const { conference } = (0, functions_1.getConferenceState)(state);
    const participant = (0, functions_2.getParticipantById)(state, id);
    const isVideoForceMuted = (0, functions_3.isForceMuted)(participant, constants_1.MEDIA_TYPE.VIDEO, state);
    const isVideoModerationOn = (0, functions_4.isEnabledFromState)(constants_1.MEDIA_TYPE.VIDEO, state);
    if (isVideoModerationOn && isVideoForceMuted) {
        conference?.avModerationApprove(constants_1.MEDIA_TYPE.VIDEO, id);
    }
};
exports.approveParticipantVideo = approveParticipantVideo;
/**
 * Action used by moderator to approve audio and video for a participant.
 *
 * @param {staring} id - The id of the participant to be approved.
 * @returns {void}
 */
const approveParticipant = (id) => (dispatch) => {
    dispatch((0, exports.approveParticipantAudio)(id));
    dispatch((0, exports.approveParticipantVideo)(id));
};
exports.approveParticipant = approveParticipant;
/**
 * Action used by moderator to reject audio for a participant.
 *
 * @param {staring} id - The id of the participant to be rejected.
 * @returns {void}
 */
const rejectParticipantAudio = (id) => (dispatch, getState) => {
    const state = getState();
    const { conference } = (0, functions_1.getConferenceState)(state);
    const audioModeration = (0, functions_4.isEnabledFromState)(constants_1.MEDIA_TYPE.AUDIO, state);
    const participant = (0, functions_2.getParticipantById)(state, id);
    const isAudioForceMuted = (0, functions_3.isForceMuted)(participant, constants_1.MEDIA_TYPE.AUDIO, state);
    const isModerator = (0, functions_2.isParticipantModerator)(participant);
    if (audioModeration && !isAudioForceMuted && !isModerator) {
        conference?.avModerationReject(constants_1.MEDIA_TYPE.AUDIO, id);
    }
};
exports.rejectParticipantAudio = rejectParticipantAudio;
/**
 * Action used by moderator to reject video for a participant.
 *
 * @param {staring} id - The id of the participant to be rejected.
 * @returns {void}
 */
const rejectParticipantVideo = (id) => (dispatch, getState) => {
    const state = getState();
    const { conference } = (0, functions_1.getConferenceState)(state);
    const videoModeration = (0, functions_4.isEnabledFromState)(constants_1.MEDIA_TYPE.VIDEO, state);
    const participant = (0, functions_2.getParticipantById)(state, id);
    const isVideoForceMuted = (0, functions_3.isForceMuted)(participant, constants_1.MEDIA_TYPE.VIDEO, state);
    const isModerator = (0, functions_2.isParticipantModerator)(participant);
    if (videoModeration && !isVideoForceMuted && !isModerator) {
        conference?.avModerationReject(constants_1.MEDIA_TYPE.VIDEO, id);
    }
};
exports.rejectParticipantVideo = rejectParticipantVideo;
/**
 * Audio or video moderation is disabled.
 *
 * @param {MediaType} mediaType - The media type that was disabled.
 * @param {JitsiParticipant} actor - The actor disabling.
 * @returns {{
 *     type: REQUEST_DISABLE_MODERATED_AUDIO
 * }}
 */
const disableModeration = (mediaType, actor) => {
    return {
        type: actionTypes_1.DISABLE_MODERATION,
        mediaType,
        actor
    };
};
exports.disableModeration = disableModeration;
/**
 * Hides the notification with the participant that asked to unmute audio.
 *
 * @param {IParticipant} participant - The participant for which the notification to be hidden.
 * @returns {Object}
 */
function dismissPendingAudioParticipant(participant) {
    return dismissPendingParticipant(participant.id, constants_1.MEDIA_TYPE.AUDIO);
}
exports.dismissPendingAudioParticipant = dismissPendingAudioParticipant;
/**
 * Hides the notification with the participant that asked to unmute.
 *
 * @param {string} id - The participant id for which the notification to be hidden.
 * @param {MediaType} mediaType - The media type.
 * @returns {Object}
 */
function dismissPendingParticipant(id, mediaType) {
    return {
        type: actionTypes_1.DISMISS_PENDING_PARTICIPANT,
        id,
        mediaType
    };
}
exports.dismissPendingParticipant = dismissPendingParticipant;
/**
 * Audio or video moderation is enabled.
 *
 * @param {MediaType} mediaType - The media type that was enabled.
 * @param {JitsiParticipant} actor - The actor enabling.
 * @returns {{
 *     type: REQUEST_ENABLE_MODERATED_AUDIO
 * }}
 */
const enableModeration = (mediaType, actor) => {
    return {
        type: actionTypes_1.ENABLE_MODERATION,
        mediaType,
        actor
    };
};
exports.enableModeration = enableModeration;
/**
 * Requests disable of audio moderation.
 *
 * @returns {{
 *     type: REQUEST_DISABLE_AUDIO_MODERATION
 * }}
 */
const requestDisableAudioModeration = () => {
    return {
        type: actionTypes_1.REQUEST_DISABLE_AUDIO_MODERATION
    };
};
exports.requestDisableAudioModeration = requestDisableAudioModeration;
/**
 * Requests disable of video moderation.
 *
 * @returns {{
 *     type: REQUEST_DISABLE_VIDEO_MODERATION
 * }}
 */
const requestDisableVideoModeration = () => {
    return {
        type: actionTypes_1.REQUEST_DISABLE_VIDEO_MODERATION
    };
};
exports.requestDisableVideoModeration = requestDisableVideoModeration;
/**
 * Requests enable of audio moderation.
 *
 * @returns {{
 *     type: REQUEST_ENABLE_AUDIO_MODERATION
 * }}
 */
const requestEnableAudioModeration = () => {
    return {
        type: actionTypes_1.REQUEST_ENABLE_AUDIO_MODERATION
    };
};
exports.requestEnableAudioModeration = requestEnableAudioModeration;
/**
 * Requests enable of video moderation.
 *
 * @returns {{
 *     type: REQUEST_ENABLE_VIDEO_MODERATION
 * }}
 */
const requestEnableVideoModeration = () => {
    return {
        type: actionTypes_1.REQUEST_ENABLE_VIDEO_MODERATION
    };
};
exports.requestEnableVideoModeration = requestEnableVideoModeration;
/**
 * Local participant was approved to be able to unmute audio and video.
 *
 * @param {MediaType} mediaType - The media type to disable.
 * @returns {{
 *     type: LOCAL_PARTICIPANT_APPROVED
 * }}
 */
const localParticipantApproved = (mediaType) => {
    return {
        type: actionTypes_1.LOCAL_PARTICIPANT_APPROVED,
        mediaType
    };
};
exports.localParticipantApproved = localParticipantApproved;
/**
 * Local participant was blocked to be able to unmute audio and video.
 *
 * @param {MediaType} mediaType - The media type to disable.
 * @returns {{
 *     type: LOCAL_PARTICIPANT_REJECTED
 * }}
 */
const localParticipantRejected = (mediaType) => {
    return {
        type: actionTypes_1.LOCAL_PARTICIPANT_REJECTED,
        mediaType
    };
};
exports.localParticipantRejected = localParticipantRejected;
/**
 * Shows notification when A/V moderation is enabled and local participant is still not approved.
 *
 * @param {MediaType} mediaType - Audio or video media type.
 * @returns {Object}
 */
function showModeratedNotification(mediaType) {
    return {
        type: actionTypes_1.LOCAL_PARTICIPANT_MODERATION_NOTIFICATION,
        mediaType
    };
}
exports.showModeratedNotification = showModeratedNotification;
/**
 * Shows a notification with the participant that asked to audio unmute.
 *
 * @param {IParticipant} participant - The participant for which is the notification.
 * @returns {Object}
 */
function participantPendingAudio(participant) {
    return {
        type: actionTypes_1.PARTICIPANT_PENDING_AUDIO,
        participant
    };
}
exports.participantPendingAudio = participantPendingAudio;
/**
 * A participant was approved to unmute for a mediaType.
 *
 * @param {string} id - The id of the approved participant.
 * @param {MediaType} mediaType - The media type which was approved.
 * @returns {{
 *     type: PARTICIPANT_APPROVED,
 * }}
 */
function participantApproved(id, mediaType) {
    return {
        type: actionTypes_1.PARTICIPANT_APPROVED,
        id,
        mediaType
    };
}
exports.participantApproved = participantApproved;
/**
 * A participant was blocked to unmute for a mediaType.
 *
 * @param {string} id - The id of the approved participant.
 * @param {MediaType} mediaType - The media type which was approved.
 * @returns {{
 *     type: PARTICIPANT_REJECTED,
 * }}
 */
function participantRejected(id, mediaType) {
    return {
        type: actionTypes_1.PARTICIPANT_REJECTED,
        id,
        mediaType
    };
}
exports.participantRejected = participantRejected;
