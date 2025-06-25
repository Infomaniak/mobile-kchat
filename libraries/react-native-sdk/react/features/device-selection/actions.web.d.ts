import { IStore } from '../app/types';
/**
 * Submits the settings related to audio device selection.
 *
 * @param {Object} newState - The new settings.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Function}
 */
export declare function submitAudioDeviceSelectionTab(newState: any, isDisplayedOnWelcomePage: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Submits the settings related to device selection.
 *
 * @param {Object} newState - The new settings.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Function}
 */
export declare function submitVideoDeviceSelectionTab(newState: any, isDisplayedOnWelcomePage: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
