import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Opens the highlight dialog.
 *
 * @returns {Function}
 */
export declare function openHighlightDialog(): (dispatch: IStore['dispatch']) => void;
/**
 * Signals that a started recording notification should be shown on the
 * screen for a given period.
 *
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @returns {showNotification}
 */
export declare function showRecordingLimitNotification(streamType: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    props: import("../notifications/types").INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Displays the notification suggesting to start the recording.
 *
 * @returns {void}
 */
export declare function showStartRecordingNotification(): (dispatch: IStore['dispatch']) => void;
