import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Docks/undocks the Toolbox.
 *
 * @param {boolean} dock - True if dock, false otherwise.
 * @returns {Function}
 */
export declare function dockToolbox(dock: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Signals that full screen mode has been entered or exited.
 *
 * @param {boolean} fullScreen - Whether or not full screen mode is currently
 * enabled.
 * @returns {{
 *     type: FULL_SCREEN_CHANGED,
 *     fullScreen: boolean
 * }}
 */
export declare function fullScreenChanged(fullScreen: boolean): {
    type: string;
    fullScreen: boolean;
};
/**
 * Hides the toolbox.
 *
 * @param {boolean} force - True to force the hiding of the toolbox without
 * caring about the extended toolbar side panels.
 * @returns {Function}
 */
export declare function hideToolbox(force?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Signals a request to enter or exit full screen mode.
 *
 * @param {boolean} fullScreen - True to enter full screen mode, false to exit.
 * @returns {{
 *     type: SET_FULL_SCREEN,
 *     fullScreen: boolean
 * }}
 */
export declare function setFullScreen(fullScreen: boolean): {
    type: string;
    fullScreen: boolean;
};
/**
 * Sets the mainToolbarButtonsThresholds.
 *
 * @returns {Function}
 */
export declare function setMainToolbarThresholds(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Shows the toolbox for specified timeout.
 *
 * @param {number} timeout - Timeout for showing the toolbox.
 * @returns {Function}
 */
export declare function showToolbox(timeout?: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Signals a request to display overflow as drawer.
 *
 * @param {boolean} displayAsDrawer - True to display overflow as drawer, false to preserve original behaviour.
 * @returns {{
 *     type: SET_OVERFLOW_DRAWER,
 *     displayAsDrawer: boolean
 * }}
 */
export declare function setOverflowDrawer(displayAsDrawer: boolean): {
    type: string;
    displayAsDrawer: boolean;
};
/**
 * Signals that toolbox timeout should be cleared.
 *
 * @returns {{
 *     type: CLEAR_TOOLBOX_TIMEOUT
 * }}
 */
export declare function clearToolboxTimeout(): {
    type: string;
};
/**
 * Shows/hides the hangup menu.
 *
 * @param {boolean} visible - True to show it or false to hide it.
 * @returns {{
 *     type: SET_HANGUP_MENU_VISIBLE,
 *     visible: boolean
 * }}
 */
export declare function setHangupMenuVisible(visible: boolean): {
    type: string;
    visible: boolean;
};
/**
 * Shows/hides the overflow menu.
 *
 * @param {boolean} visible - True to show it or false to hide it.
 * @returns {{
 *     type: SET_OVERFLOW_MENU_VISIBLE,
 *     visible: boolean
 * }}
 */
export declare function setOverflowMenuVisible(visible: boolean): {
    type: string;
    visible: boolean;
};
/**
 * Signals that toolbar is hovered value should be changed.
 *
 * @param {boolean} hovered - Flag showing whether toolbar is hovered.
 * @returns {{
 *     type: SET_TOOLBAR_HOVERED,
 *     hovered: boolean
 * }}
 */
export declare function setToolbarHovered(hovered: boolean): {
    type: string;
    hovered: boolean;
};
/**
 * Dispatches an action which sets new timeout for the toolbox visibility and clears the previous one.
 * On mobile browsers the toolbox does not hide on timeout. It is toggled on simple tap.
 *
 * @param {Function} handler - Function to be invoked after the timeout.
 * @param {number} timeoutMS - Delay.
 * @returns {{
 *     type: SET_TOOLBOX_TIMEOUT,
 *     handler: Function,
 *     timeoutMS: number
 * }}
 */
export declare function setToolboxTimeout(handler: Function, timeoutMS: number): (dispatch: IStore['dispatch']) => void;
/**
     * Closes the overflow menu if opened.
     *
     * @private
     * @returns {void}
     */
export declare function closeOverflowMenuIfOpen(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
