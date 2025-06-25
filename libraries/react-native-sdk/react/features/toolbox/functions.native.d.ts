import { IReduxState } from '../app/types';
import { IStateful } from '../base/app/types';
export * from './functions.any';
/**
 * Returns a set of the buttons that are shown in the toolbar
 * but removed from the overflow menu, based on the width of the screen.
 *
 * @param {number} width - The width of the screen.
 * @returns {Set}
 */
export declare function getMovableButtons(width: number): Set<string>;
/**
 * Indicates if the desktop share button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function isDesktopShareButtonDisabled(state: IReduxState): boolean;
/**
 * Returns true if the toolbox is visible.
 *
 * @param {IStateful} stateful - A function or object that can be
 * resolved to Redux state by the function {@code toState}.
 * @returns {boolean}
 */
export declare function isToolboxVisible(stateful: IStateful): any;
/**
 * Indicates if the video mute button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function isVideoMuteButtonDisabled(state: IReduxState): boolean;
