import { IStore } from '../app/types';
/**
 * Opens {@code LeaveReasonDialog}.
 *
 * @param {string} [title] - The dialog title.
 *
 * @returns {Promise} Resolved when the dialog is closed.
 */
export declare function openLeaveReasonDialog(title?: string): (dispatch: IStore['dispatch']) => Promise<void>;
/**
 * Dismisses calendar notification about next or ongoing event.
 *
 * @returns {Object}
 */
export declare function dismissCalendarNotification(): {
    type: string;
};
/**
 * Setups initial devices. Makes sure we populate availableDevices list before configuring.
 *
 * @returns {Promise<any>}
 */
export declare function setupInitialDevices(): (dispatch: IStore['dispatch']) => Promise<void>;
/**
 * Init.
 *
 * @returns {Promise<JitsiConnection>}
 */
export declare function init(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
