/// <reference types="react" />
import { AUDIO_ONLY_SCREEN_SHARE_NO_TRACK } from '../../../../modules/UI/UIErrors';
import { IStore } from '../../app/types';
import { NOTIFICATION_TIMEOUT_TYPE } from '../../notifications/constants';
import { MediaType } from '../media/constants';
import { ICreateInitialTracksOptions, IInitialTracksErrors, IShareOptions } from './types';
export * from './actions.any';
/**
 * Signals that the local participant is ending screensharing or beginning the screensharing flow.
 *
 * @param {boolean} enabled - The state to toggle screen sharing to.
 * @param {boolean} audioOnly - Only share system audio.
 * @param {Object} shareOptions - The options to be passed for capturing screenshare.
 * @returns {Function}
 */
export declare function toggleScreensharing(enabled?: boolean, audioOnly?: boolean, shareOptions?: IShareOptions): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Sets the camera facing mode(environment/user). If facing mode not provided, it will do a toggle.
 *
 * @param {string | undefined} facingMode - The selected facing mode.
 * @returns {void}
 */
export declare function setCameraFacingMode(facingMode: string | undefined): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Signals to open the permission dialog for toggling camera remotely.
 *
 * @param {Function} onAllow - Callback to be executed if permission to toggle camera was granted.
 * @param {string} initiatorId - The participant id of the requester.
 * @returns {Object} - The open dialog action.
 */
export declare function openAllowToggleCameraDialog(onAllow: Function, initiatorId: string): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Sets the GUM pending state for the tracks that have failed.
 *
 * NOTE: Some of the track that we will be setting to GUM pending state NONE may not have failed but they may have
 * been requested. This won't be a problem because their current GUM pending state will be NONE anyway.
 *
 * @param {JitsiLocalTrack} tracks - The tracks that have been created.
 * @param {Function} dispatch - The redux dispatch function.
 * @returns {void}
 */
export declare function setGUMPendingStateOnFailedTracks(tracks: Array<any>, dispatch: IStore['dispatch']): void;
/**
 * Creates and adds to the conference the initial audio/video tracks.
 *
 * @param {Array<MediaType>} devices - Array with devices (audio/video) that will be used.
 * @returns {Function}
 */
export declare function createAndAddInitialAVTracks(devices: Array<MediaType>): (dispatch: IStore['dispatch']) => Promise<void>;
/**
 * Creates the initial audio/video tracks.
 *
 * @param {ICreateInitialTracksOptions} options - Options for creating the audio/video tracks.
 * @returns {Function}
 */
export declare function createInitialAVTracks(options: ICreateInitialTracksOptions): (dispatch: IStore['dispatch'], _getState: IStore['getState']) => Promise<{
    errors: IInitialTracksErrors;
    tracks: any;
} | {
    tracks: any[];
    errors: IInitialTracksErrors;
}>;
/**
 * Displays error notifications according to the state carried by the passed {@code errors} object.
 *
 * @param {InitialTracksErrors} errors - The errors (if any).
 * @returns {Function}
 * @private
 */
export declare function displayErrorsForCreateInitialLocalTracks(errors: IInitialTracksErrors): (dispatch: IStore['dispatch']) => void;
/**
 * Displays a UI notification for screensharing failure based on the error passed.
 *
 * @private
 * @param {Error | AUDIO_ONLY_SCREEN_SHARE_NO_TRACK} error - The error.
 * @param {NOTIFICATION_TIMEOUT_TYPE} timeout - The time for showing the notification.
 * @returns {Function}
 */
export declare function handleScreenSharingError(error: Error | AUDIO_ONLY_SCREEN_SHARE_NO_TRACK, timeout: NOTIFICATION_TIMEOUT_TYPE): (dispatch: IStore['dispatch']) => void;
