import { IReduxState, IStore } from '../../app/types';
import { IDevicesState } from './types';
export * from './functions.any';
/**
 * Detects the use case when the labels are not available if the A/V permissions
 * are not yet granted.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} - True if the labels are already initialized and false
 * otherwise.
 */
export declare function areDeviceLabelsInitialized(state: IReduxState): boolean;
/**
 * Get device id of the audio output device which is currently in use.
 * Empty string stands for default device.
 *
 * @returns {string}
 */
export declare function getAudioOutputDeviceId(): any;
/**
 * Finds the real device id of the default device of the given type.
 *
 * @param {Object} state - The redux state.
 * @param {*} kind - The type of the device. One of "audioInput",
 * "audioOutput", and "videoInput". Also supported is all lowercase versions
 * of the preceding types.
 * @returns {string|undefined}
 */
export declare function getDefaultDeviceId(state: IReduxState, kind: string): string | undefined;
/**
 * Finds a device with a label that matches the passed label and returns its id.
 *
 * @param {Object} state - The redux state.
 * @param {string} label - The label.
 * @param {string} kind - The type of the device. One of "audioInput",
 * "audioOutput", and "videoInput". Also supported is all lowercase versions
 * of the preceding types.
 * @returns {string|undefined}
 */
export declare function getDeviceIdByLabel(state: IReduxState, label: string, kind: string): string | undefined;
/**
 * Finds a device with a label that matches the passed id and returns its label.
 *
 * @param {Object} state - The redux state.
 * @param {string} id - The device id.
 * @param {string} kind - The type of the device. One of "audioInput",
 * "audioOutput", and "videoInput". Also supported is all lowercase versions
 * of the preceding types.
 * @returns {string|undefined}
 */
export declare function getDeviceLabelById(state: IReduxState, id: string, kind: string): string | undefined;
/**
 * Returns the devices set in the URL.
 *
 * @param {Object} state - The redux state.
 * @returns {Object|undefined}
 */
export declare function getDevicesFromURL(state: IReduxState): {
    audioInput?: MediaDeviceInfo[] | undefined;
    audioOutput?: MediaDeviceInfo[] | undefined;
    videoInput?: MediaDeviceInfo[] | undefined;
} | undefined;
/**
 * Converts an array of media devices into an object organized by device kind.
 *
 * @param {Array<MediaDeviceInfo>} devices - Available media devices.
 * @private
 * @returns {Object} An object with the media devices split by type. The keys
 * are device type and the values are arrays with devices matching the device
 * type.
 */
export declare function groupDevicesByKind(devices: MediaDeviceInfo[]): IDevicesState['availableDevices'];
/**
 * Filters audio devices from a list of MediaDeviceInfo objects.
 *
 * @param {Array<MediaDeviceInfo>} devices - Unfiltered media devices.
 * @private
 * @returns {Array<MediaDeviceInfo>} Filtered audio devices.
 */
export declare function filterAudioDevices(devices: MediaDeviceInfo[]): MediaDeviceInfo[];
/**
 * Filters the devices that start with one of the prefixes from DEVICE_LABEL_PREFIXES_TO_IGNORE.
 *
 * @param {MediaDeviceInfo[]} devices - The devices to be filtered.
 * @returns {MediaDeviceInfo[]} - The filtered devices.
 */
export declare function filterIgnoredDevices(devices?: MediaDeviceInfo[]): {
    filteredDevices: MediaDeviceInfo[];
    ignoredDevices: MediaDeviceInfo[];
};
/**
 * Check if the passed device arrays are different.
 *
 * @param {MediaDeviceInfo[]} devices1 - Array with devices to be compared.
 * @param {MediaDeviceInfo[]} devices2 - Array with devices to be compared.
 * @returns {boolean} - True if the device arrays are different and false otherwise.
*/
export declare function areDevicesDifferent(devices1?: MediaDeviceInfo[], devices2?: MediaDeviceInfo[]): boolean;
/**
 * Flattens the availableDevices from redux.
 *
 * @param {IDevicesState.availableDevices} devices - The available devices from redux.
 * @returns {MediaDeviceInfo[]} - The flattened array of devices.
 */
export declare function flattenAvailableDevices({ audioInput, audioOutput, videoInput }: IDevicesState['availableDevices']): MediaDeviceInfo[];
/**
 * We want to strip any device details that are not very user friendly, like usb ids put in brackets at the end.
 *
 * @param {string} label - Device label to format.
 *
 * @returns {string} - Formatted string.
 */
export declare function formatDeviceLabel(label: string): string;
/**
 * Returns a list of objects containing all the microphone device ids and labels.
 *
 * @param {Object} state - The state of the application.
 * @returns {Object[]}
 */
export declare function getAudioInputDeviceData(state: IReduxState): {
    deviceId: string;
    label: string;
}[] | undefined;
/**
 * Returns a list of objectes containing all the output device ids and labels.
 *
 * @param {Object} state - The state of the application.
 * @returns {Object[]}
 */
export declare function getAudioOutputDeviceData(state: IReduxState): {
    deviceId: string;
    label: string;
}[] | undefined;
/**
 * Returns a list of all the camera device ids.
 *
 * @param {Object} state - The state of the application.
 * @returns {string[]}
 */
export declare function getVideoDeviceIds(state: IReduxState): string[] | undefined;
/**
 * Logs an array of devices.
 *
 * @param {MediaDeviceInfo[]} devices - The array of devices.
 * @param {string} title - The title that will be printed in the log.
 * @returns {void}
 */
export declare function logDevices(devices: MediaDeviceInfo[], title?: string): void;
/**
 * Set device id of the audio output device which is currently in use.
 * Empty string stands for default device.
 *
 * @param {string} newId - New audio output device id.
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {boolean} userSelection - Whether this is a user selection update.
 * @param {?string} newLabel - New audio output device label to store.
 * @returns {Promise}
 */
export declare function setAudioOutputDeviceId(newId: string | undefined, dispatch: IStore['dispatch'], userSelection?: boolean, newLabel?: string): Promise<any>;
