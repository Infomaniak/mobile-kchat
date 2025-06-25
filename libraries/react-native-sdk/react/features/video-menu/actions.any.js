"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.muteAllParticipants = exports.muteRemote = exports.muteLocal = void 0;
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_1 = require("../av-moderation/actions");
const functions_2 = require("../av-moderation/functions");
const actions_2 = require("../base/media/actions");
const constants_1 = require("../base/media/constants");
const actions_3 = require("../base/participants/actions");
const functions_3 = require("../base/participants/functions");
const actions_4 = require("../base/tracks/actions");
const functions_4 = require("../notifications/functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Mutes the local participant.
 *
 * @param {boolean} enable - Whether to mute or unmute.
 * @param {MEDIA_TYPE} mediaType - The type of the media channel to mute.
 * @param {boolean} stopScreenSharing - Whether or not to stop the screensharing.
 * @returns {Function}
 */
function muteLocal(enable, mediaType, stopScreenSharing = false) {
    return (dispatch, getState) => {
        const isAudio = mediaType === constants_1.MEDIA_TYPE.AUDIO;
        if (!isAudio && mediaType !== constants_1.MEDIA_TYPE.VIDEO) {
            logger_1.default.error(`Unsupported media type: ${mediaType}`);
            return;
        }
        // check for A/V Moderation when trying to unmute
        if (!enable && (0, functions_2.shouldShowModeratedNotification)(constants_1.MEDIA_TYPE.AUDIO, getState())) {
            if (!(0, functions_4.isModerationNotificationDisplayed)(constants_1.MEDIA_TYPE.AUDIO, getState())) {
                dispatch((0, actions_1.showModeratedNotification)(constants_1.MEDIA_TYPE.AUDIO));
            }
            return;
        }
        if (enable && stopScreenSharing) {
            dispatch((0, actions_4.toggleScreensharing)(false, false));
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)(isAudio ? AnalyticsEvents_1.AUDIO_MUTE : AnalyticsEvents_1.VIDEO_MUTE, { enable }));
        dispatch(isAudio ? (0, actions_2.setAudioMuted)(enable, /* ensureTrack */ true)
            : (0, actions_2.setVideoMuted)(enable, constants_1.VIDEO_MUTISM_AUTHORITY.USER, /* ensureTrack */ true));
        // FIXME: The old conference logic still relies on this event being emitted.
        if (typeof APP !== 'undefined') {
            isAudio ? APP.conference.muteAudio(enable) : APP.conference.muteVideo(enable, false);
        }
    };
}
exports.muteLocal = muteLocal;
/**
 * Mutes the remote participant with the given ID.
 *
 * @param {string} participantId - ID of the participant to mute.
 * @param {MEDIA_TYPE} mediaType - The type of the media channel to mute.
 * @returns {Function}
 */
function muteRemote(participantId, mediaType) {
    return (dispatch) => {
        if (mediaType !== constants_1.MEDIA_TYPE.AUDIO && mediaType !== constants_1.MEDIA_TYPE.VIDEO) {
            logger_1.default.error(`Unsupported media type: ${mediaType}`);
            return;
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createRemoteMuteConfirmedEvent)(participantId, mediaType));
        dispatch((0, actions_3.muteRemoteParticipant)(participantId, mediaType));
    };
}
exports.muteRemote = muteRemote;
/**
 * Mutes all participants.
 *
 * @param {Array<string>} exclude - Array of participant IDs to not mute.
 * @param {MEDIA_TYPE} mediaType - The media type to mute.
 * @returns {Function}
 */
function muteAllParticipants(exclude, mediaType) {
    return (dispatch, getState) => {
        const state = getState();
        const localId = (0, functions_3.getLocalParticipant)(state)?.id ?? '';
        if (!exclude.includes(localId)) {
            dispatch(muteLocal(true, mediaType, mediaType !== constants_1.MEDIA_TYPE.AUDIO));
        }
        (0, functions_3.getRemoteParticipants)(state).forEach((p, id) => {
            if (exclude.includes(id)) {
                return;
            }
            dispatch(muteRemote(id, mediaType));
            if (mediaType === constants_1.MEDIA_TYPE.AUDIO) {
                dispatch((0, actions_1.rejectParticipantAudio)(id));
            }
            else {
                dispatch((0, actions_1.rejectParticipantVideo)(id));
            }
        });
    };
}
exports.muteAllParticipants = muteAllParticipants;
