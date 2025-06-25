import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
export * from './functions.any';
/**
 * Returns true if the filmstrip on mobile is visible, false otherwise.
 *
 * NOTE: Filmstrip on mobile behaves differently to web, and is only visible
 * when there are at least 2 participants.
 *
 * @param {Object | Function} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {boolean}
 */
export declare function isFilmstripVisible(stateful: IStateful): boolean;
/**
 * Determines whether the remote video thumbnails should be displayed/visible in
 * the filmstrip.
 *
 * @param {Object} state - The full redux state.
 * @returns {boolean} - If remote video thumbnails should be displayed/visible
 * in the filmstrip, then {@code true}; otherwise, {@code false}.
 */
export declare function shouldRemoteVideosBeVisible(state: IReduxState): boolean;
/**
 * Not implemented on mobile.
 *
 * @param {any} _state - Used on web.
 * @returns {Array<string>}
 */
export declare function getActiveParticipantsIds(_state: any): never[];
/**
 * Not implemented on mobile.
 *
 * @param {any} _state - Redux state.
 * @returns {Array<Object>}
 */
export declare function getPinnedActiveParticipants(_state: any): never[];
/**
 * Returns the number of participants displayed in tile view.
 *
 * @param {Object | Function} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {number} - The number of participants displayed in tile view.
 */
export declare function getTileViewParticipantCount(stateful: IStateful): number;
/**
 * Returns how many columns should be displayed for tile view.
 *
 * @param {Object | Function} stateful - The Object or Function that can be
 * resolved to a Redux state object with the toState function.
 * @returns {number} - The number of columns to be rendered in tile view.
 * @private
 */
export declare function getColumnCount(stateful: IStateful): number;
/**
 * Returns true if the filmstrip has a scroll and false otherwise.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} - True if the scroll is displayed and false otherwise.
 */
export declare function isFilmstripScrollVisible(state: IReduxState): boolean | undefined;
/**
 * Whether the stage filmstrip is available or not.
 *
 * @param {any} _state - Used on web.
 * @param {any} _count - Used on web.
 * @returns {boolean}
 */
export declare function isStageFilmstripAvailable(_state: any, _count?: any): boolean;
/**
 * Whether the stage filmstrip is enabled.
 *
 * @param {any} _state - Used on web.
 * @returns {boolean}
 */
export declare function isStageFilmstripEnabled(_state: any): boolean;
/**
 * Whether or not the top panel is enabled.
 *
 * @param {any} _state - Used on web.
 * @returns {boolean}
 */
export declare function isTopPanelEnabled(_state: any): boolean;
/**
 * Calculates the width and height of the filmstrip based on the screen size and aspect ratio.
 *
 * @param {Object} options - The screen aspect ratio, width, height and safe are insets.
 * @returns {Object} - The width and the height.
 */
export declare function getFilmstripDimensions({ aspectRatio, clientWidth, clientHeight, insets, localParticipantVisible }: {
    aspectRatio: Symbol;
    clientHeight: number;
    clientWidth: number;
    insets?: {
        bottom?: number;
        left?: number;
        right?: number;
        top?: number;
    };
    localParticipantVisible?: boolean;
}): {
    height: number;
    width: number;
};
/**
 * Returns true if the local thumbnail should be displayed separately and false otherwise.
 *
 * @returns {boolean} - True if the local thumbnail should be displayed separately and flase otherwise.
 */
export declare function shouldDisplayLocalThumbnailSeparately(): boolean;
/**
 * Not implemented on mobile.
 *
 * @param {any} _state - Used on web.
 * @returns {undefined}
 */
export declare function getScreenshareFilmstripParticipantId(_state: any): undefined;
