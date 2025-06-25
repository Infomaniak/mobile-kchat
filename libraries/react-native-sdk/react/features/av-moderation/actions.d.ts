import { IStore } from '../app/types';
import { type MediaType } from '../base/media/constants';
import { IParticipant } from '../base/participants/types';
/**
 * Action used by moderator to approve audio for a participant.
 *
 * @param {staring} id - The id of the participant to be approved.
 * @returns {void}
 */
export declare const approveParticipantAudio: (id: string) => (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action used by moderator to approve video for a participant.
 *
 * @param {staring} id - The id of the participant to be approved.
 * @returns {void}
 */
export declare const approveParticipantVideo: (id: string) => (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action used by moderator to approve audio and video for a participant.
 *
 * @param {staring} id - The id of the participant to be approved.
 * @returns {void}
 */
export declare const approveParticipant: (id: string) => (dispatch: IStore['dispatch']) => void;
/**
 * Action used by moderator to reject audio for a participant.
 *
 * @param {staring} id - The id of the participant to be rejected.
 * @returns {void}
 */
export declare const rejectParticipantAudio: (id: string) => (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action used by moderator to reject video for a participant.
 *
 * @param {staring} id - The id of the participant to be rejected.
 * @returns {void}
 */
export declare const rejectParticipantVideo: (id: string) => (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Audio or video moderation is disabled.
 *
 * @param {MediaType} mediaType - The media type that was disabled.
 * @param {JitsiParticipant} actor - The actor disabling.
 * @returns {{
 *     type: REQUEST_DISABLE_MODERATED_AUDIO
 * }}
 */
export declare const disableModeration: (mediaType: MediaType, actor: Object) => {
    type: string;
    mediaType: MediaType;
    actor: Object;
};
/**
 * Hides the notification with the participant that asked to unmute audio.
 *
 * @param {IParticipant} participant - The participant for which the notification to be hidden.
 * @returns {Object}
 */
export declare function dismissPendingAudioParticipant(participant: IParticipant): {
    type: string;
    id: string;
    mediaType: MediaType;
};
/**
 * Hides the notification with the participant that asked to unmute.
 *
 * @param {string} id - The participant id for which the notification to be hidden.
 * @param {MediaType} mediaType - The media type.
 * @returns {Object}
 */
export declare function dismissPendingParticipant(id: string, mediaType: MediaType): {
    type: string;
    id: string;
    mediaType: MediaType;
};
/**
 * Audio or video moderation is enabled.
 *
 * @param {MediaType} mediaType - The media type that was enabled.
 * @param {JitsiParticipant} actor - The actor enabling.
 * @returns {{
 *     type: REQUEST_ENABLE_MODERATED_AUDIO
 * }}
 */
export declare const enableModeration: (mediaType: MediaType, actor: Object) => {
    type: string;
    mediaType: MediaType;
    actor: Object;
};
/**
 * Requests disable of audio moderation.
 *
 * @returns {{
 *     type: REQUEST_DISABLE_AUDIO_MODERATION
 * }}
 */
export declare const requestDisableAudioModeration: () => {
    type: string;
};
/**
 * Requests disable of video moderation.
 *
 * @returns {{
 *     type: REQUEST_DISABLE_VIDEO_MODERATION
 * }}
 */
export declare const requestDisableVideoModeration: () => {
    type: string;
};
/**
 * Requests enable of audio moderation.
 *
 * @returns {{
 *     type: REQUEST_ENABLE_AUDIO_MODERATION
 * }}
 */
export declare const requestEnableAudioModeration: () => {
    type: string;
};
/**
 * Requests enable of video moderation.
 *
 * @returns {{
 *     type: REQUEST_ENABLE_VIDEO_MODERATION
 * }}
 */
export declare const requestEnableVideoModeration: () => {
    type: string;
};
/**
 * Local participant was approved to be able to unmute audio and video.
 *
 * @param {MediaType} mediaType - The media type to disable.
 * @returns {{
 *     type: LOCAL_PARTICIPANT_APPROVED
 * }}
 */
export declare const localParticipantApproved: (mediaType: MediaType) => {
    type: string;
    mediaType: MediaType;
};
/**
 * Local participant was blocked to be able to unmute audio and video.
 *
 * @param {MediaType} mediaType - The media type to disable.
 * @returns {{
 *     type: LOCAL_PARTICIPANT_REJECTED
 * }}
 */
export declare const localParticipantRejected: (mediaType: MediaType) => {
    type: string;
    mediaType: MediaType;
};
/**
 * Shows notification when A/V moderation is enabled and local participant is still not approved.
 *
 * @param {MediaType} mediaType - Audio or video media type.
 * @returns {Object}
 */
export declare function showModeratedNotification(mediaType: MediaType): {
    type: string;
    mediaType: MediaType;
};
/**
 * Shows a notification with the participant that asked to audio unmute.
 *
 * @param {IParticipant} participant - The participant for which is the notification.
 * @returns {Object}
 */
export declare function participantPendingAudio(participant: IParticipant): {
    type: string;
    participant: IParticipant;
};
/**
 * A participant was approved to unmute for a mediaType.
 *
 * @param {string} id - The id of the approved participant.
 * @param {MediaType} mediaType - The media type which was approved.
 * @returns {{
 *     type: PARTICIPANT_APPROVED,
 * }}
 */
export declare function participantApproved(id: string, mediaType: MediaType): {
    type: string;
    id: string;
    mediaType: MediaType;
};
/**
 * A participant was blocked to unmute for a mediaType.
 *
 * @param {string} id - The id of the approved participant.
 * @param {MediaType} mediaType - The media type which was approved.
 * @returns {{
 *     type: PARTICIPANT_REJECTED,
 * }}
 */
export declare function participantRejected(id: string, mediaType: MediaType): {
    type: string;
    id: string;
    mediaType: MediaType;
};
