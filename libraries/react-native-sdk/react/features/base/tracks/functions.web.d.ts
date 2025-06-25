import { IStore } from '../../app/types';
import { IStateful } from '../app/types';
import { ITrackOptions } from './types';
export * from './functions.any';
/**
 * Create local tracks of specific types.
 *
 * @param {Object} options - The options with which the local tracks are to be
 * created.
 * @param {string|null} [options.cameraDeviceId] - Camera device id or
 * {@code undefined} to use app's settings.
 * @param {string[]} options.devices - Required track types such as 'audio'
 * and/or 'video'.
 * @param {string|null} [options.micDeviceId] - Microphone device id or
 * {@code undefined} to use app's settings.
 * @param {number|undefined} [oprions.timeout] - A timeout for JitsiMeetJS.createLocalTracks used to create the tracks.
 * @param {boolean} [options.firePermissionPromptIsShownEvent] - Whether lib-jitsi-meet
 * should check for a {@code getUserMedia} permission prompt and fire a
 * corresponding event.
 * @param {IStore} store - The redux store in the context of which the function
 * is to execute and from which state such as {@code config} is to be retrieved.
 * @returns {Promise<JitsiLocalTrack[]>}
 */
export declare function createLocalTracksF(options?: ITrackOptions, store?: IStore): Promise<any>;
/**
 * Returns an object containing a promise which resolves with the created tracks and the errors resulting from that
 * process.
 *
 * @returns {Promise<JitsiLocalTrack[]>}
 *
 * @todo Refactor to not use APP.
 */
export declare function createPrejoinTracks(): {
    tryCreateLocalTracks: any;
    errors: any;
};
/**
 * Determines whether toggle camera should be enabled or not.
 *
 * @param {Function|Object} stateful - The redux store or {@code getState} function.
 * @returns {boolean} - Whether toggle camera should be enabled.
 */
export declare function isToggleCameraEnabled(stateful: IStateful): boolean;
