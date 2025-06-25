/// <reference types="react" />
import { IStore } from '../app/types';
/**
 * Opens {@code LogoutDialog}.
 *
 * @returns {Function}
 */
export declare function openLogoutDialog(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Opens {@code SettingsDialog}.
 *
 * @param {string} defaultTab - The tab in {@code SettingsDialog} that should be
 * displayed initially.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Function}
 */
export declare function openSettingsDialog(defaultTab?: string, isDisplayedOnWelcomePage?: boolean): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Submits the settings from the "More" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
export declare function submitMoreTab(newState: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Submits the settings from the "Moderator" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
export declare function submitModeratorTab(newState: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Submits the settings from the "Profile" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
export declare function submitProfileTab(newState: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Submits the settings from the "Sounds" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
export declare function submitNotificationsTab(newState: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Toggles the visibility of the audio settings.
 *
 * @returns {void}
 */
export declare function toggleAudioSettings(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Toggles the visibility of the video settings.
 *
 * @returns {void}
 */
export declare function toggleVideoSettings(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Submits the settings from the "Shortcuts" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @returns {Function}
 */
export declare function submitShortcutsTab(newState: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Submits the settings from the "Virtual Background" tab of the settings dialog.
 *
 * @param {Object} newState - The new settings.
 * @param {boolean} isCancel - Whether the change represents a cancel.
 * @returns {Function}
 */
export declare function submitVirtualBackgroundTab(newState: any, isCancel?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
