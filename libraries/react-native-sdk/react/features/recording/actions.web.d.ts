import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Signals that a started recording notification should be shown on the
 * screen for a given period.
 *
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @returns {showNotification}
 */
export declare function showRecordingLimitNotification(streamType: string): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => {
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
