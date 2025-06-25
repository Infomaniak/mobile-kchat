import { IStore } from '../../app/types';
import { MediaType } from './constants';
import { IGUMPendingState } from './types';
/**
 * Action to adjust the availability of the local audio.
 *
 * @param {boolean} available - True if the local audio is to be marked as
 * available or false if the local audio is not available.
 * @returns {{
 *     type: SET_AUDIO_AVAILABLE,
 *     available: boolean
 * }}
 */
export declare function setAudioAvailable(available: boolean): {
    type: string;
    available: boolean;
};
/**
 * Action to set the muted state of the local audio.
 *
 * @param {boolean} muted - True if the local audio is to be muted or false if
 * the local audio is to be unmuted.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {{
 *     type: SET_AUDIO_MUTED,
 *     ensureTrack: boolean,
 *     muted: boolean
 * }}
 */
export declare function setAudioMuted(muted: boolean, ensureTrack?: boolean): {
    type: string;
    ensureTrack: boolean;
    muted: boolean;
};
/**
 * Action to disable/enable the audio mute icon.
 *
 * @param {boolean} blocked - True if the audio mute icon needs to be disabled.
 * @param {boolean|undefined} skipNotification - True if we want to skip showing the notification.
 * @returns {Function}
 */
export declare function setAudioUnmutePermissions(blocked: boolean, skipNotification?: boolean): {
    type: string;
    blocked: boolean;
    skipNotification: boolean;
};
/**
 * Action to set the facing mode of the local camera.
 *
 * @param {CAMERA_FACING_MODE} cameraFacingMode - The camera facing mode to set.
 * @returns {{
 *     type: SET_CAMERA_FACING_MODE,
 *     cameraFacingMode: CAMERA_FACING_MODE
 * }}
 */
export declare function setCameraFacingMode(cameraFacingMode: string): {
    type: string;
    cameraFacingMode: string;
};
/**
 * Action to set the muted state of the local screenshare.
 *
 * @param {boolean} muted - True if the local screenshare is to be enabled or false otherwise.
 * @param {number} authority - The {@link SCREENSHARE_MUTISM_AUTHORITY} which is muting/unmuting the local screenshare.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is created if missing.
 * @returns {Function}
 */
export declare function setScreenshareMuted(muted: boolean, authority?: number, ensureTrack?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    authority: number;
    ensureTrack: boolean;
    muted: number;
} | undefined;
/**
 * Action to adjust the availability of the local video.
 *
 * @param {boolean} available - True if the local video is to be marked as
 * available or false if the local video is not available.
 * @returns {{
 *     type: SET_VIDEO_AVAILABLE,
 *     available: boolean
 * }}
 */
export declare function setVideoAvailable(available: boolean): {
    type: string;
    available: boolean;
};
/**
 * Action to set the muted state of the local video.
 *
 * @param {boolean} muted - True if the local video is to be muted or false if
 * the local video is to be unmuted.
 * @param {number} authority - The {@link VIDEO_MUTISM_AUTHORITY} which is
 * muting/unmuting the local video.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {Function}
 */
export declare function setVideoMuted(muted: boolean | number, authority?: number, ensureTrack?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    authority: number;
    ensureTrack: boolean;
    muted: number;
} | undefined;
/**
 * Action to disable/enable the video mute icon.
 *
 * @param {boolean} blocked - True if the video mute icon needs to be disabled.
 * @param {boolean|undefined} skipNotification - True if we want to skip showing the notification.
 * @returns {Function}
 */
export declare function setVideoUnmutePermissions(blocked: boolean, skipNotification?: boolean): {
    type: string;
    blocked: boolean;
    skipNotification: boolean;
};
/**
 * Creates an action to store the last video {@link Transform} applied to a
 * stream.
 *
 * @param {string} streamId - The ID of the stream.
 * @param {Object} transform - The {@code Transform} to store.
 * @returns {{
 *     type: STORE_VIDEO_TRANSFORM,
 *     streamId: string,
 *     transform: Object
 * }}
 */
export declare function storeVideoTransform(streamId: string, transform: Object): {
    type: string;
    streamId: string;
    transform: Object;
};
/**
 * Toggles the camera facing mode. Most commonly, for example, mobile devices
 * such as phones have a front/user-facing and a back/environment-facing
 * cameras. In contrast to setCameraFacingMode, allows the toggling to be
 * optimally and/or natively implemented without the overhead of separate reads
 * and writes of the current/effective camera facing mode.
 *
 * @returns {{
 *     type: TOGGLE_CAMERA_FACING_MODE
 * }}
 */
export declare function toggleCameraFacingMode(): {
    type: string;
};
/**
 * Sets the GUM pending status from unmute and initial track creation operation.
 *
 * @param {Array<MediaType>} mediaTypes - An array with the media types that GUM is called with.
 * @param {IGUMPendingState} status - The GUM status.
 * @returns {{
 *     type: TOGGLE_CAMERA_FACING_MODE,
 *     mediaTypes: Array<MediaType>,
 *     status: IGUMPendingState
 * }}
 */
export declare function gumPending(mediaTypes: Array<MediaType>, status: IGUMPendingState): {
    type: string;
    mediaTypes: MediaType[];
    status: IGUMPendingState;
};
