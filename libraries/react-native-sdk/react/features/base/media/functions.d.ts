import { IStateful } from '../app/types';
/**
 * Determines whether audio is currently muted.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean}
 */
export declare function isAudioMuted(stateful: IStateful): boolean;
/**
 * Determines whether video is currently muted by the audio-only authority.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean}
 */
export declare function isVideoMutedByAudioOnly(stateful: IStateful): boolean;
/**
 * Computes the startWithAudioMuted by retrieving its values from config, URL and settings.
 *
 * @param {Object|Function} stateful - The redux state object or {@code getState} function.
 * @returns {boolean} - The computed startWithAudioMuted value that will be used.
 */
export declare function getStartWithAudioMuted(stateful: IStateful): boolean;
/**
 * Computes the startWithVideoMuted by retrieving its values from config, URL and settings.
 *
 * @param {Object|Function} stateful - The redux state object or {@code getState} function.
 * @returns {boolean} - The computed startWithVideoMuted value that will be used.
 */
export declare function getStartWithVideoMuted(stateful: IStateful): boolean;
/**
 * Determines whether video is currently muted.
 *
 * @param {Function|Object} stateful - The redux store, state, or {@code getState} function.
 * @returns {boolean}
 */
export declare function isVideoMuted(stateful: IStateful): boolean;
/**
 * Determines whether video is currently muted by the user authority.
 *
 * @param {Function|Object} stateful - The redux store, state, or
 * {@code getState} function.
 * @returns {boolean}
 */
export declare function isVideoMutedByUser(stateful: IStateful): boolean;
/**
 * Determines whether a specific videoTrack should be rendered.
 *
 * @param {Track} videoTrack - The video track which is to be rendered.
 * @param {boolean} waitForVideoStarted - True if the specified videoTrack
 * should be rendered only after its associated video has started;
 * otherwise, false.
 * @returns {boolean} True if the specified videoTrack should be rendered;
 * otherwise, false.
 */
export declare function shouldRenderVideoTrack(videoTrack: {
    muted: boolean;
    videoStarted: boolean;
} | undefined, waitForVideoStarted: boolean): boolean | undefined;
/**
 * Computes the localized sound file source.
 *
 * @param {string} file - The default file source.
 * @param {string} language - The language to use for localization.
 * @returns {string}
 */
export declare const getSoundFileSrc: (file: string, language: string) => string;
