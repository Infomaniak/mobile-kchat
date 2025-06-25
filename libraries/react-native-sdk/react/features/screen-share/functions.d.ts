import { IReduxState } from '../app/types';
/**
 * Is the current screen sharing session audio only.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
export declare function isAudioOnlySharing(state: IReduxState): boolean | undefined;
/**
 * State of audio sharing.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
export declare function isScreenAudioShared(state: IReduxState): boolean | undefined;
/**
 * Returns the visibility of the audio only screen share button. Currently only chrome browser and electron on
 * windows supports this functionality.
 *
 * @returns {boolean}
 */
export declare function isScreenAudioSupported(): any;
/**
 * Is any screen media currently being shared, audio or video.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
export declare function isScreenMediaShared(state: IReduxState): any;
/**
 * Is screen sharing currently active.
 *
 * @param {IReduxState} state - The state of the application.
 * @returns {boolean}
 */
export declare function isScreenVideoShared(state: IReduxState): any;
