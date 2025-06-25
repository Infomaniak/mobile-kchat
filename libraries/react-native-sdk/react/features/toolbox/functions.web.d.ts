import { IReduxState } from '../app/types';
import { IToolboxButton, NOTIFY_CLICK_MODE } from './types';
export * from './functions.any';
/**
 * Helper for getting the height of the toolbox.
 *
 * @returns {number} The height of the toolbox.
 */
export declare function getToolboxHeight(): number;
/**
 * Checks if the specified button is enabled.
 *
 * @param {string} buttonName - The name of the button. See {@link interfaceConfig}.
 * @param {Object|Array<string>} state - The redux state or the array with the enabled buttons.
 * @returns {boolean} - True if the button is enabled and false otherwise.
 */
export declare function isButtonEnabled(buttonName: string, state: IReduxState | Array<string>): boolean;
/**
 * Indicates if the toolbox is visible or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean} - True to indicate that the toolbox is visible, false -
 * otherwise.
 */
export declare function isToolboxVisible(state: IReduxState): boolean;
/**
 * Indicates if the audio settings button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function isAudioSettingsButtonDisabled(state: IReduxState): boolean | undefined;
/**
 * Indicates if the desktop share button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function isDesktopShareButtonDisabled(state: IReduxState): boolean;
/**
 * Indicates if the video settings button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function isVideoSettingsButtonDisabled(state: IReduxState): boolean;
/**
 * Indicates if the video mute button is disabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function isVideoMuteButtonDisabled(state: IReduxState): boolean;
/**
 * If an overflow drawer should be displayed or not.
 * This is usually done for mobile devices or on narrow screens.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function showOverflowDrawer(state: IReduxState): boolean;
/**
 * Returns true if the overflow menu button is displayed and false otherwise.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean} - True if the overflow menu button is displayed and false otherwise.
 */
export declare function showOverflowMenu(state: IReduxState): boolean;
/**
 * Indicates whether the toolbox is enabled or not.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare function isToolboxEnabled(state: IReduxState): boolean;
/**
 * Returns the toolbar timeout from config or the default value.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {number} - Toolbar timeout in milliseconds.
 */
export declare function getToolbarTimeout(state: IReduxState): number;
/**
    * Returns all buttons that could be rendered.
    *
    * @param {Object} _customToolbarButtons - An array containing custom buttons objects.
    * @returns {Object} The button maps mainMenuButtons and overflowMenuButtons.
    */
export declare function getAllToolboxButtons(_customToolbarButtons?: {
    backgroundColor?: string;
    icon: string;
    id: string;
    text: string;
}[]): {
    [key: string]: IToolboxButton;
};
/**
 * Returns the list of participant menu buttons that have that notify the api when clicked.
 *
 * @param {Object} state - The redux state.
 * @returns {Map<string, NOTIFY_CLICK_MODE>} - The list of participant menu buttons.
 */
export declare function getParticipantMenuButtonsWithNotifyClick(state: IReduxState): Map<string, NOTIFY_CLICK_MODE>;
