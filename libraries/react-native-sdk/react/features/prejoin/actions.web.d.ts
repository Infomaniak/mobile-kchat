import { IStore } from '../app/types';
/**
 * Action used for joining the meeting with phone audio.
 * A dial out connection is tried and a polling mechanism is used for getting the status.
 * If the connection succeeds the `onSuccess` callback is executed.
 * If the phone connection fails or the number is invalid the `onFail` callback is executed.
 *
 * @param {Function} onSuccess - Success handler.
 * @param {Function} onFail - Fail handler.
 * @returns {Function}
 */
export declare function dialOut(onSuccess: Function, onFail: Function): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Adds all the newly created tracks to store on init.
 *
 * @param {Object[]} tracks - The newly created tracks.
 * @param {Object} errors - The errors from creating the tracks.
 *
 * @returns {Function}
 */
export declare function initPrejoin(tracks: Object[], errors: Object): (dispatch: IStore['dispatch']) => Promise<void>;
/**
 * Action used to start the conference.
 *
 * @param {Object} options - The config options that override the default ones (if any).
 * @param {boolean} ignoreJoiningInProgress - If true we won't check the joiningInProgress flag.
 * @param {string?} jid - The XMPP user's ID (e.g. {@code user@server.com}).
 * @param {string?} password - The XMPP user's password.
 * @returns {Function}
 */
export declare function joinConference(options?: Object, ignoreJoiningInProgress?: boolean, jid?: string, password?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Action used to set the flag for joining operation in progress.
 *
 * @param {boolean} value - The config options that override the default ones (if any).
 * @returns {Function}
 */
export declare function setJoiningInProgress(value: boolean): {
    type: string;
    value: boolean;
};
/**
 * Joins the conference without audio.
 *
 * @returns {Function}
 */
export declare function joinConferenceWithoutAudio(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Opens an external page with all the dial in numbers.
 *
 * @returns {Function}
 */
export declare function openDialInPage(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Creates a new audio track based on a device id and replaces the current one.
 *
 * @param {string} deviceId - The deviceId of the microphone.
 * @returns {Function}
 */
export declare function replaceAudioTrackById(deviceId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Creates a new video track based on a device id and replaces the current one.
 *
 * @param {string} deviceId - The deviceId of the camera.
 * @returns {Function}
 */
export declare function replaceVideoTrackById(deviceId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Sets the device status as OK with the corresponding text.
 *
 * @param {string} deviceStatusText - The text to be set.
 * @returns {Object}
 */
export declare function setDeviceStatusOk(deviceStatusText: string): {
    type: string;
    value: {
        deviceStatusText: string;
        deviceStatusType: string;
    };
};
/**
 * Sets the device status as 'warning' with the corresponding text.
 *
 * @param {string} deviceStatusText - The text to be set.
 * @returns {Object}
 */
export declare function setDeviceStatusWarning(deviceStatusText: string): {
    type: string;
    value: {
        deviceStatusText: string;
        deviceStatusType: string;
    };
};
/**
 * Action used to set the dial out country.
 *
 * @param {{ name: string, dialCode: string, code: string }} value - The country.
 * @returns {Object}
 */
export declare function setDialOutCountry(value: Object): {
    type: string;
    value: Object;
};
/**
 * Action used to set the dial out number.
 *
 * @param {string} value - The dial out number.
 * @returns {Object}
 */
export declare function setDialOutNumber(value: string): {
    type: string;
    value: string;
};
/**
 * Sets the visibility of the prejoin page when a client reload
 * is triggered as a result of call migration initiated by Jicofo.
 *
 * @param {boolean} value - The visibility value.
 * @returns {Object}
 */
export declare function setSkipPrejoinOnReload(value: boolean): {
    type: string;
    value: boolean;
};
/**
 * Action used to set the visiblitiy of the 'JoinByPhoneDialog'.
 *
 * @param {boolean} value - The value.
 * @returns {Object}
 */
export declare function setJoinByPhoneDialogVisiblity(value: boolean): {
    type: string;
    value: boolean;
};
/**
 * Action used to set the initial errors after creating the tracks.
 *
 * @param {Object} value - The track errors.
 * @returns {Object}
 */
export declare function setPrejoinDeviceErrors(value: Object): {
    type: string;
    value: Object;
};
/**
 * Action used to set the visibility of the prejoin page.
 *
 * @param {boolean} value - The value.
 * @returns {Object}
 */
export declare function setPrejoinPageVisibility(value: boolean): {
    type: string;
    value: boolean;
};
