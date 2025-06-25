import { IStateful } from '../base/app/types';
export * from './functions.any';
/**
 * Returns a promise which resolves with a list of objects containing
 * all the video jitsiTracks and appropriate errors for the given device ids.
 *
 * @param {string[]} ids - The list of the camera ids for which to create tracks.
 * @param {number} [timeout] - A timeout for the createLocalTrack function call.
 *
 * @returns {Promise<Object[]>}
 */
export declare function createLocalVideoTracks(ids: string[], timeout?: number): Promise<any[]>;
/**
 * Returns a promise which resolves with a list of objects containing
 * the audio track and the corresponding audio device information.
 *
 * @param {Object[]} devices - A list of microphone devices.
 * @param {number} [timeout] - A timeout for the createLocalTrack function call.
 * @returns {Promise<{
 *   deviceId: string,
 *   hasError: boolean,
 *   jitsiTrack: Object,
 *   label: string
 * }[]>}
 */
export declare function createLocalAudioTracks(devices: Array<{
    deviceId: string;
    label: string;
}>, timeout?: number): Promise<{
    deviceId: string;
    hasError: boolean;
    jitsiTrack: any;
    label: string;
}[]>;
/**
 * Returns the properties for the "Shortcuts" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the shortcuts dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the "Shortcuts" tab from settings
 * dialog.
 */
export declare function getShortcutsTabProps(stateful: IStateful, isDisplayedOnWelcomePage?: boolean): {
    displayShortcuts: boolean;
    keyboardShortcutsEnabled: boolean;
    keyboardShortcutsHelpDescriptions: Map<string, string>;
};
/**
 * Returns the properties for the "Virtual Background" tab from settings dialog from Redux
 * state.
 *
 * @param {(Function|Object)} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the "Shortcuts" tab from settings
 * dialog.
 */
export declare function getVirtualBackgroundTabProps(stateful: IStateful, isDisplayedOnWelcomePage?: boolean): {
    options: import("../virtual-background/reducer").IVirtualBackground;
    selectedVideoInputId: string | boolean | undefined;
};
/**
 * Used for web. Indicates if the setting section is enabled.
 *
 * @param {string} settingName - The name of the setting section as defined in
 * interface_config.js and SettingsMenu.js.
 * @returns {boolean} True to indicate that the given setting section
 * is enabled, false otherwise.
 */
export declare function isSettingEnabled(settingName: string): any;
/**
 * Returns true if moderator tab in settings should be visible/accessible.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {boolean} True to indicate that moderator tab should be visible, false otherwise.
 */
export declare function shouldShowModeratorSettings(stateful: IStateful): boolean;
