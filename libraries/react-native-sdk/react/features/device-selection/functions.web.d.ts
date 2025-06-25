import { IStore } from '../app/types';
import { IStateful } from '../base/app/types';
/**
 * Returns the properties for the audio device selection dialog from Redux state.
 *
 * @param {IStateful} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the audio device selection dialog.
 */
export declare function getAudioDeviceSelectionDialogProps(stateful: IStateful, isDisplayedOnWelcomePage: boolean): {
    disableAudioInputChange: boolean;
    disableDeviceChange: boolean;
    hasAudioPermission: boolean;
    hideAudioInputPreview: boolean;
    hideAudioOutputPreview: boolean;
    hideAudioOutputSelect: boolean;
    hideDeviceHIDContainer: boolean;
    hideNoiseSuppression: boolean;
    noiseSuppressionEnabled: boolean;
    selectedAudioInputId: string | boolean | undefined;
    selectedAudioOutputId: any;
};
/**
 * Returns the properties for the device selection dialog from Redux state.
 *
 * @param {IStateful} stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} isDisplayedOnWelcomePage - Indicates whether the device selection dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the device selection dialog.
 */
export declare function getVideoDeviceSelectionDialogProps(stateful: IStateful, isDisplayedOnWelcomePage: boolean): {
    currentFramerate: number;
    desktopShareFramerates: number[];
    disableDeviceChange: boolean;
    disableVideoInputSelect: boolean;
    hasVideoPermission: boolean;
    hideAdditionalSettings: boolean;
    hideVideoInputPreview: boolean;
    localFlipX: boolean;
    selectedVideoInputId: string | true | undefined;
};
/**
 * Processes device requests from external applications.
 *
 * @param {Dispatch} dispatch - The redux {@code dispatch} function.
 * @param {Function} getState - The redux function that gets/retrieves the redux
 * state.
 * @param {Object} request - The request to be processed.
 * @param {Function} responseCallback - The callback that will send the
 * response.
 * @returns {boolean} - True if the request has been processed and false otherwise.
 */
export declare function processExternalDeviceRequest(// eslint-disable-line max-params
dispatch: IStore['dispatch'], getState: IStore['getState'], request: any, responseCallback: Function): boolean;
