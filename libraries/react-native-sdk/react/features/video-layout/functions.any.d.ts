import { IReduxState, IStore } from '../app/types';
/**
 * A selector for retrieving the current automatic pinning setting.
 *
 * @private
 * @returns {string|undefined} The string "remote-only" is returned if only
 * remote screen sharing should be automatically pinned, any other truthy value
 * means automatically pin all screen shares. Falsy means do not automatically
 * pin any screen shares.
 */
export declare function getAutoPinSetting(): any;
/**
 * Returns the {@code LAYOUTS} constant associated with the layout
 * the application should currently be in.
 *
 * @param {Object} state - The redux state.
 * @returns {string}
 */
export declare function getCurrentLayout(state: IReduxState): string | undefined;
/**
 * Selector for determining if the UI layout should be in tile view. Tile view
 * is determined by more than just having the tile view setting enabled, as
 * one-on-one calls should not be in tile view, as well as etherpad editing.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} True if tile view should be displayed.
 */
export declare function shouldDisplayTileView(state: IReduxState): boolean;
/**
 * Private helper to automatically pin the latest screen share stream or unpin
 * if there are no more screen share streams.
 *
 * @param {Array<string>} screenShares - Array containing the list of all the screen sharing endpoints
 * before the update was triggered (including the ones that have been removed from redux because of the update).
 * @param {Store} store - The redux store.
 * @returns {void}
 */
export declare function updateAutoPinnedParticipant(screenShares: Array<string>, { dispatch, getState }: IStore): void;
/**
 * Selector for whether we are currently in tile view.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean}
 */
export declare function isLayoutTileView(state: IReduxState): boolean;
/**
 * Returns the video quality level for the resizable filmstrip thumbnail height.
 *
 * @param {number} height - The height of the thumbnail.
 * @param {Object} state - Redux state.
 * @returns {number}
 */
export declare function getVideoQualityForResizableFilmstripThumbnails(height: number, state: IReduxState): number;
/**
 * Returns the video quality level for the screen sharing filmstrip thumbnail height.
 *
 * @param {number} height - The height of the thumbnail.
 * @param {Object} state - Redux state.
 * @returns {number}
 */
export declare function getVideoQualityForScreenSharingFilmstrip(height: number, state: IReduxState): number;
/**
 * Returns the video quality for the large video.
 *
 * @param {number} largeVideoHeight - The height of the large video.
 * @returns {number} - The video quality for the large video.
 */
export declare function getVideoQualityForLargeVideo(largeVideoHeight: number): number;
/**
 * Returns the video quality level for the thumbnails in the stage filmstrip.
 *
 * @param {number} height - The height of the thumbnails.
 * @param {Object} state - Redux state.
 * @returns {number}
 */
export declare function getVideoQualityForStageThumbnails(height: number, state: IReduxState): number;
