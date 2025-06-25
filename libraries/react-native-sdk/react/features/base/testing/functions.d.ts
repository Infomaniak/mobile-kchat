import { IReduxState, IStore } from '../../app/types';
/**
 * Indicates whether the test mode is enabled. When it's enabled
 * {@link TestHint} and other components from the testing package will be
 * rendered in various places across the app to help with automatic testing.
 *
 * @param {IReduxState} state - The redux store state.
 * @returns {boolean}
 */
export declare function isTestModeEnabled(state: IReduxState): boolean;
/**
 * Returns the video type of the remote participant's video.
 *
 * @param {IStore} store - The redux store.
 * @param {string} id - The participant ID for the remote video.
 * @returns {VIDEO_TYPE}
 */
export declare function getRemoteVideoType({ getState }: IStore, id: string): string | null | undefined;
/**
 * Returns whether the last media event received for large video indicates that the video is playing, if not muted.
 *
 * @param {IStore} store - The redux store.
 * @returns {boolean}
 */
export declare function isLargeVideoReceived({ getState }: IStore): boolean;
/**
 * Returns whether the last media event received for a remote video indicates that the video is playing, if not muted.
 *
 * @param {IStore} store - The redux store.
 * @param {string} id - The participant ID for the remote video.
 * @returns {boolean}
 */
export declare function isRemoteVideoReceived({ getState }: IStore, id: string): boolean;
