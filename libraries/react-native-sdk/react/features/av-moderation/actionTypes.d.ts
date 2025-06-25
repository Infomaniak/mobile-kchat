/**
 * The type of (redux) action which signals that A/V Moderation had been disabled.
 *
 * {
 *     type: DISABLE_MODERATION
 * }
 */
export declare const DISABLE_MODERATION = "DISABLE_MODERATION";
/**
 * The type of (redux) action which signals that the notification for audio/video unmute should
 * be dismissed.
 *
 * {
 *     type: DISMISS_PARTICIPANT_PENDING_AUDIO
 * }
 */
export declare const DISMISS_PENDING_PARTICIPANT = "DISMISS_PENDING_PARTICIPANT";
/**
 * The type of (redux) action which signals that A/V Moderation had been enabled.
 *
 * {
 *     type: ENABLE_MODERATION
 * }
 */
export declare const ENABLE_MODERATION = "ENABLE_MODERATION";
/**
 * The type of (redux) action which signals that Audio Moderation disable has been requested.
 *
 * {
 *     type: REQUEST_DISABLE_AUDIO_MODERATION
 * }
 */
export declare const REQUEST_DISABLE_AUDIO_MODERATION = "REQUEST_DISABLE_AUDIO_MODERATION";
/**
 * The type of (redux) action which signals that Video Moderation disable has been requested.
 *
 * {
 *     type: REQUEST_DISABLE_VIDEO_MODERATION
 * }
 */
export declare const REQUEST_DISABLE_VIDEO_MODERATION = "REQUEST_DISABLE_VIDEO_MODERATION";
/**
 * The type of (redux) action which signals that Audio Moderation enable has been requested.
 *
 * {
 *     type: REQUEST_ENABLE_AUDIO_MODERATION
 * }
 */
export declare const REQUEST_ENABLE_AUDIO_MODERATION = "REQUEST_ENABLE_AUDIO_MODERATION";
/**
 * The type of (redux) action which signals that Video Moderation enable has been requested.
 *
 * {
 *     type: REQUEST_ENABLE_VIDEO_MODERATION
 * }
 */
export declare const REQUEST_ENABLE_VIDEO_MODERATION = "REQUEST_ENABLE_VIDEO_MODERATION";
/**
 * The type of (redux) action which signals that the local participant had been approved.
 *
 * {
 *     type: LOCAL_PARTICIPANT_APPROVED,
 *     mediaType: MediaType
 * }
 */
export declare const LOCAL_PARTICIPANT_APPROVED = "LOCAL_PARTICIPANT_APPROVED";
/**
 * The type of (redux) action which signals that the local participant had been blocked.
 *
 * {
 *     type: LOCAL_PARTICIPANT_REJECTED,
 *     mediaType: MediaType
 * }
 */
export declare const LOCAL_PARTICIPANT_REJECTED = "LOCAL_PARTICIPANT_REJECTED";
/**
 * The type of (redux) action which signals to show notification to the local participant.
 *
 * {
 *     type: LOCAL_PARTICIPANT_MODERATION_NOTIFICATION
 * }
 */
export declare const LOCAL_PARTICIPANT_MODERATION_NOTIFICATION = "LOCAL_PARTICIPANT_MODERATION_NOTIFICATION";
/**
 * The type of (redux) action which signals that a participant was approved for a media type.
 *
 * {
 *     type: PARTICIPANT_APPROVED,
 *     mediaType: MediaType
 *     participantId: String
 * }
 */
export declare const PARTICIPANT_APPROVED = "PARTICIPANT_APPROVED";
/**
 * The type of (redux) action which signals that a participant was blocked for a media type.
 *
 * {
 *     type: PARTICIPANT_REJECTED,
 *     mediaType: MediaType
 *     participantId: String
 * }
 */
export declare const PARTICIPANT_REJECTED = "PARTICIPANT_REJECTED";
/**
 * The type of (redux) action which signals that a participant asked to have its audio umuted.
 *
 * {
 *     type: PARTICIPANT_PENDING_AUDIO
 * }
 */
export declare const PARTICIPANT_PENDING_AUDIO = "PARTICIPANT_PENDING_AUDIO";
