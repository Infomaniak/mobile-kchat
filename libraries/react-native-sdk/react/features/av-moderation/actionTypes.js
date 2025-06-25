"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARTICIPANT_PENDING_AUDIO = exports.PARTICIPANT_REJECTED = exports.PARTICIPANT_APPROVED = exports.LOCAL_PARTICIPANT_MODERATION_NOTIFICATION = exports.LOCAL_PARTICIPANT_REJECTED = exports.LOCAL_PARTICIPANT_APPROVED = exports.REQUEST_ENABLE_VIDEO_MODERATION = exports.REQUEST_ENABLE_AUDIO_MODERATION = exports.REQUEST_DISABLE_VIDEO_MODERATION = exports.REQUEST_DISABLE_AUDIO_MODERATION = exports.ENABLE_MODERATION = exports.DISMISS_PENDING_PARTICIPANT = exports.DISABLE_MODERATION = void 0;
/**
 * The type of (redux) action which signals that A/V Moderation had been disabled.
 *
 * {
 *     type: DISABLE_MODERATION
 * }
 */
exports.DISABLE_MODERATION = 'DISABLE_MODERATION';
/**
 * The type of (redux) action which signals that the notification for audio/video unmute should
 * be dismissed.
 *
 * {
 *     type: DISMISS_PARTICIPANT_PENDING_AUDIO
 * }
 */
exports.DISMISS_PENDING_PARTICIPANT = 'DISMISS_PENDING_PARTICIPANT';
/**
 * The type of (redux) action which signals that A/V Moderation had been enabled.
 *
 * {
 *     type: ENABLE_MODERATION
 * }
 */
exports.ENABLE_MODERATION = 'ENABLE_MODERATION';
/**
 * The type of (redux) action which signals that Audio Moderation disable has been requested.
 *
 * {
 *     type: REQUEST_DISABLE_AUDIO_MODERATION
 * }
 */
exports.REQUEST_DISABLE_AUDIO_MODERATION = 'REQUEST_DISABLE_AUDIO_MODERATION';
/**
 * The type of (redux) action which signals that Video Moderation disable has been requested.
 *
 * {
 *     type: REQUEST_DISABLE_VIDEO_MODERATION
 * }
 */
exports.REQUEST_DISABLE_VIDEO_MODERATION = 'REQUEST_DISABLE_VIDEO_MODERATION';
/**
 * The type of (redux) action which signals that Audio Moderation enable has been requested.
 *
 * {
 *     type: REQUEST_ENABLE_AUDIO_MODERATION
 * }
 */
exports.REQUEST_ENABLE_AUDIO_MODERATION = 'REQUEST_ENABLE_AUDIO_MODERATION';
/**
 * The type of (redux) action which signals that Video Moderation enable has been requested.
 *
 * {
 *     type: REQUEST_ENABLE_VIDEO_MODERATION
 * }
 */
exports.REQUEST_ENABLE_VIDEO_MODERATION = 'REQUEST_ENABLE_VIDEO_MODERATION';
/**
 * The type of (redux) action which signals that the local participant had been approved.
 *
 * {
 *     type: LOCAL_PARTICIPANT_APPROVED,
 *     mediaType: MediaType
 * }
 */
exports.LOCAL_PARTICIPANT_APPROVED = 'LOCAL_PARTICIPANT_APPROVED';
/**
 * The type of (redux) action which signals that the local participant had been blocked.
 *
 * {
 *     type: LOCAL_PARTICIPANT_REJECTED,
 *     mediaType: MediaType
 * }
 */
exports.LOCAL_PARTICIPANT_REJECTED = 'LOCAL_PARTICIPANT_REJECTED';
/**
 * The type of (redux) action which signals to show notification to the local participant.
 *
 * {
 *     type: LOCAL_PARTICIPANT_MODERATION_NOTIFICATION
 * }
 */
exports.LOCAL_PARTICIPANT_MODERATION_NOTIFICATION = 'LOCAL_PARTICIPANT_MODERATION_NOTIFICATION';
/**
 * The type of (redux) action which signals that a participant was approved for a media type.
 *
 * {
 *     type: PARTICIPANT_APPROVED,
 *     mediaType: MediaType
 *     participantId: String
 * }
 */
exports.PARTICIPANT_APPROVED = 'PARTICIPANT_APPROVED';
/**
 * The type of (redux) action which signals that a participant was blocked for a media type.
 *
 * {
 *     type: PARTICIPANT_REJECTED,
 *     mediaType: MediaType
 *     participantId: String
 * }
 */
exports.PARTICIPANT_REJECTED = 'PARTICIPANT_REJECTED';
/**
 * The type of (redux) action which signals that a participant asked to have its audio umuted.
 *
 * {
 *     type: PARTICIPANT_PENDING_AUDIO
 * }
 */
exports.PARTICIPANT_PENDING_AUDIO = 'PARTICIPANT_PENDING_AUDIO';
