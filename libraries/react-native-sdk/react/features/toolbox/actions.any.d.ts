import { IStore } from '../app/types';
/**
 * Enables/disables the toolbox.
 *
 * @param {boolean} enabled - True to enable the toolbox or false to disable it.
 * @returns {{
 *     type: SET_TOOLBOX_ENABLED,
 *     enabled: boolean
 * }}
 */
export declare function setToolboxEnabled(enabled: boolean): {
    type: string;
    enabled: boolean;
};
/**
 * Shows/hides the toolbox.
 *
 * @param {boolean} visible - True to show the toolbox or false to hide it.
 * @returns {Function}
 */
export declare function setToolboxVisible(visible: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to toggle the toolbox visibility.
 *
 * @returns {Function}
 */
export declare function toggleToolboxVisible(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to handle toggle video from toolbox's video buttons.
 *
 * @param {boolean} muted - Whether to mute or unmute.
 * @param {boolean} showUI - When set to false will not display any error.
 * @param {boolean} ensureTrack - True if we want to ensure that a new track is
 * created if missing.
 * @returns {Function}
 */
export declare function handleToggleVideoMuted(muted: boolean, showUI: boolean, ensureTrack: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets whether the toolbox should be shifted up or not.
 *
 * @param {boolean} shiftUp - Whether the toolbox should shift up or not.
 * @returns {Object}
 */
export declare function setShiftUp(shiftUp: boolean): {
    type: string;
    shiftUp: boolean;
};
