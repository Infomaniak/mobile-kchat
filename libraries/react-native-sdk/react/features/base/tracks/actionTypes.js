"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRACK_WILL_CREATE = exports.TRACK_UPDATED = exports.TRACK_STOPPED = exports.TRACK_REMOVED = exports.TRACK_NO_DATA_FROM_SOURCE = exports.TRACK_MUTE_UNMUTE_FAILED = exports.TRACK_CREATE_ERROR = exports.TRACK_CREATE_CANCELED = exports.TRACK_ADDED = exports.SET_NO_SRC_DATA_NOTIFICATION_UID = void 0;
/**
 * The type of Redux action which sets the noSrcDataNotificationUid state representing the UID of the previous
 * no data from source notification. Used to check if such a notification was previously displayed.
 *
 * {
 *     type: SET_NO_SRC_DATA_NOTIFICATION_UID,
 *     uid: ?number
 * }
 */
exports.SET_NO_SRC_DATA_NOTIFICATION_UID = 'SET_NO_SRC_DATA_NOTIFICATION_UID';
/**
 * The type of redux action dispatched when a track has been (locally or
 * remotely) added to the conference.
 *
 * {
 *     type: TRACK_ADDED,
 *     track: Track
 * }
 */
exports.TRACK_ADDED = 'TRACK_ADDED';
/**
 * The type of redux action dispatched when a canceled {@code getUserMedia}
 * process completes either successfully or with an error (the error is ignored
 * and the track is immediately disposed if it has been created).
 *
 * {
 *     type: TRACK_CREATE_CANCELED,
 *     trackType: MEDIA_TYPE
 * }
 */
exports.TRACK_CREATE_CANCELED = 'TRACK_CREATE_CANCELED';
/**
 * The type of redux action dispatched when {@code getUserMedia} fails with an
 * error (such as permission denied).
 *
 * {
 *     type: TRACK_CREATE_ERROR,
 *     permissionDenied: Boolean,
 *     trackType: MEDIA_TYPE
 * }
 */
exports.TRACK_CREATE_ERROR = 'TRACK_CREATE_ERROR';
/**
 * The type of redux action dispatched when the track mute/unmute operation fails at the conference level. This could
 * happen because of {@code getUserMedia} errors during unmute or replace track errors at the peerconnection level.
 *
 * {
 *     type: TRACK_MUTE_UNMUTE_FAILED,
 *     track: Track,
 *     wasMuting: Boolean
 * }
 */
exports.TRACK_MUTE_UNMUTE_FAILED = 'TRACK_MUTE_UNMUTE_FAILED';
/**
 * The type of redux action dispatched when a track has triggered no data from source event.
 *
 * {
 *     type: TRACK_NO_DATA_FROM_SOURCE,
 *     track: Track
 * }
 */
exports.TRACK_NO_DATA_FROM_SOURCE = 'TRACK_NO_DATA_FROM_SOURCE';
/**
 * The type of redux action dispatched when a track has been (locally or
 * remotely) removed from the conference.
 *
 * {
 *     type: TRACK_REMOVED,
 *     track: Track
 * }
 */
exports.TRACK_REMOVED = 'TRACK_REMOVED';
/**
 * The type of redux action dispatched when a track has stopped.
 *
 * {
 *      type: TRACK_STOPPED,
 *      track: Track
 * }
 */
exports.TRACK_STOPPED = 'TRACK_STOPPED';
/**
 * The type of redux action dispatched when a track's properties were updated.
 *
 * {
 *     type: TRACK_UPDATED,
 *     track: Track
 * }
 */
exports.TRACK_UPDATED = 'TRACK_UPDATED';
/**
 * The type of redux action dispatched when a local track starts being created
 * via a WebRTC {@code getUserMedia} call. The action's payload includes an
 * extra {@code gumProcess} property which is a {@code Promise} with an extra
 * {@code cancel} method which can be used to cancel the process. Canceling will
 * result in disposing any {@code JitsiLocalTrack} returned by the
 * {@code getUserMedia} callback. There will be a {@code TRACK_CREATE_CANCELED}
 * action instead of a {@code TRACK_ADDED} or {@code TRACK_CREATE_ERROR} action.
 *
 * {
 *     type: TRACK_WILL_CREATE
 *     track: {
 *         gumProcess: Promise with a `cancel` method to cancel the process,
 *         local: true,
 *         mediaType: MEDIA_TYPE
 *     }
 * }
 */
exports.TRACK_WILL_CREATE = 'TRACK_WILL_CREATE';
