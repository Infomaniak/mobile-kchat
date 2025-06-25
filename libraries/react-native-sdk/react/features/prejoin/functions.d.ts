import { IReduxState } from '../app/types';
/**
 * Selector for the visibility of the 'join by phone' button.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isJoinByPhoneButtonVisible(state: IReduxState): boolean;
/**
 * Selector for determining if the device status strip is visible or not.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isDeviceStatusVisible(state: IReduxState): boolean;
/**
 * Selector for determining if the display name is mandatory.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isDisplayNameRequired(state: IReduxState): boolean;
/**
 * Selector for determining if the prejoin page is enabled in config. Defaults to `true`.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isPrejoinEnabledInConfig(state: IReduxState): boolean;
/**
 * Selector for determining if the prejoin display name field is visible.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isPrejoinDisplayNameVisible(state: IReduxState): boolean;
/**
 * Returns the text for the prejoin status bar.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
export declare function getDeviceStatusText(state: IReduxState): string;
/**
 * Returns the type of the prejoin status bar: 'ok'|'warning'.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
export declare function getDeviceStatusType(state: IReduxState): string;
/**
 * Returns the 'conferenceUrl' used for dialing out.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
export declare function getDialOutConferenceUrl(state: IReduxState): string;
/**
 * Selector for getting the dial out country.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {Object}
 */
export declare function getDialOutCountry(state: IReduxState): {
    code: string;
    dialCode: string;
    name: string;
};
/**
 * Selector for getting the dial out number (without prefix).
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
export declare function getDialOutNumber(state: IReduxState): string;
/**
 * Selector for getting the dial out status while calling.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
export declare function getDialOutStatus(state: IReduxState): string;
/**
 * Returns the full dial out number (containing country code and +).
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
export declare function getFullDialOutNumber(state: IReduxState): string;
/**
 * Selector for getting the error if any while creating streams.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {string}
 */
export declare function getRawError(state: IReduxState): string;
/**
 * Selector for getting the visibility state for the 'JoinByPhoneDialog'.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isJoinByPhoneDialogVisible(state: IReduxState): boolean;
/**
 * Returns true if the prejoin page is enabled and no flag
 * to bypass showing the page is present.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isPrejoinPageVisible(state: IReduxState): boolean;
/**
 * Returns true if we should auto-knock in case lobby is enabled for the room.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function shouldAutoKnock(state: IReduxState): boolean;
/**
 * Returns true if the unsafe room warning flag is enabled.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isUnsafeRoomWarningEnabled(state: IReduxState): boolean;
/**
 * Returns true if the room name is enabled.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
export declare function isRoomNameEnabled(state: IReduxState): boolean;
