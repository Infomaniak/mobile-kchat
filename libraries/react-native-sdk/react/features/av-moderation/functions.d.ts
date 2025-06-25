import { IReduxState } from '../app/types';
import { type MediaType } from '../base/media/constants';
import { IParticipant } from '../base/participants/types';
/**
 * Returns whether moderation is enabled per media type.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
export declare const isEnabledFromState: (mediaType: MediaType, state: IReduxState) => boolean;
/**
 * Returns whether moderation is enabled per media type.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @returns {boolean}
 */
export declare const isEnabled: (mediaType: MediaType) => (state: IReduxState) => boolean;
/**
 * Returns whether moderation is supported by the backend.
 *
 * @returns {boolean}
 */
export declare const isSupported: () => (state: IReduxState) => boolean;
/**
 * Returns whether local participant is approved to unmute a media type.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @param {IReduxState} state - Global state.
 * @returns {boolean}
 */
export declare const isLocalParticipantApprovedFromState: (mediaType: MediaType, state: IReduxState) => boolean;
/**
 * Returns whether local participant is approved to unmute a media type.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @returns {boolean}
 */
export declare const isLocalParticipantApproved: (mediaType: MediaType) => (state: IReduxState) => boolean;
/**
 * Returns a selector creator which determines if the participant is approved or not for a media type.
 *
 * @param {string} id - The participant id.
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @returns {boolean}
 */
export declare const isParticipantApproved: (id: string, mediaType: MediaType) => (state: IReduxState) => boolean;
/**
 * Returns a selector creator which determines if the participant is pending or not for a media type.
 *
 * @param {IParticipant} participant - The participant.
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @returns {boolean}
 */
export declare const isParticipantPending: (participant: IParticipant, mediaType: MediaType) => (state: IReduxState) => boolean;
/**
 * Selector which returns a list with all the participants asking to audio unmute.
 * This is visible only for the moderator.
 *
 * @param {Object} state - The global state.
 * @returns {Array<Object>}
 */
export declare const getParticipantsAskingToAudioUnmute: (state: IReduxState) => any[];
/**
 * Returns true if a special notification can be displayed when a participant
 * tries to unmute.
 *
 * @param {MediaType} mediaType - 'audio' or 'video' media type.
 * @param {Object} state - The global state.
 * @returns {boolean}
 */
export declare const shouldShowModeratedNotification: (mediaType: MediaType, state: IReduxState) => boolean;
