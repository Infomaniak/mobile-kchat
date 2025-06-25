import { IStore } from '../app/types';
import { INotificationProps } from '../notifications/types';
/**
 * Clears the data of every recording sessions.
 *
 * @returns {{
 *     type: CLEAR_RECORDING_SESSIONS
 * }}
 */
export declare function clearRecordingSessions(): {
    type: string;
};
/**
 * Marks the start recording notification as shown.
 *
 * @returns {{
 *      type: SET_START_RECORDING_NOTIFICATION_SHOWN
 * }}
 */
export declare function setStartRecordingNotificationShown(): {
    type: string;
};
/**
 * Sets the meeting highlight button disable state.
 *
 * @param {boolean} disabled - The disabled state value.
 * @returns {{
 *     type: CLEAR_RECORDING_SESSIONS
 * }}
 */
export declare function setHighlightMomentButtonState(disabled: boolean): {
    type: string;
    disabled: boolean;
};
/**
 * Signals that the pending recording notification should be removed from the
 * screen.
 *
 * @param {string} streamType - The type of the stream ({@code 'file'} or
 * {@code 'stream'}).
 * @returns {Function}
 */
export declare function hidePendingRecordingNotification(streamType: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets the stream key last used by the user for later reuse.
 *
 * @param {string} streamKey - The stream key to set.
 * @returns {{
 *     type: SET_STREAM_KEY,
 *     streamKey: string
 * }}
 */
export declare function setLiveStreamKey(streamKey: string): {
    type: string;
    streamKey: string;
};
/**
 * Signals that the pending recording notification should be shown on the
 * screen.
 *
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @returns {Function}
 */
export declare function showPendingRecordingNotification(streamType: string): (dispatch: IStore['dispatch']) => Promise<void>;
/**
 * Highlights a meeting moment.
 *
 * {@code stream}).
 *
 * @returns {Function}
 */
export declare function highlightMeetingMoment(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Signals that the recording error notification should be shown.
 *
 * @param {Object} props - The Props needed to render the notification.
 * @returns {showErrorNotification}
 */
export declare function showRecordingError(props: Object): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => {
    type: string;
    props: INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Signals that the recording warning notification should be shown.
 *
 * @param {Object} props - The Props needed to render the notification.
 * @returns {showWarningNotification}
 */
export declare function showRecordingWarning(props: Object): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => {
    type: string;
    props: INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Signals that the stopped recording notification should be shown on the
 * screen for a given period.
 *
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @param {string?} participantName - The participant name stopping the recording.
 * @returns {showNotification}
 */
export declare function showStoppedRecordingNotification(streamType: string, participantName?: string): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => {
    type: string;
    props: INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Signals that a started recording notification should be shown on the
 * screen for a given period.
 *
 * @param {string} mode - The type of the recording: Stream of File.
 * @param {string | Object } initiator - The participant who started recording.
 * @param {string} sessionId - The recording session id.
 * @returns {Function}
 */
export declare function showStartedRecordingNotification(mode: string, initiator: {
    getId: Function;
} | string, sessionId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
/**
 * Updates the known state for a given recording session.
 *
 * @param {Object} session - The new state to merge with the existing state in
 * redux.
 * @returns {{
 *     type: RECORDING_SESSION_UPDATED,
 *     sessionData: Object
 * }}
 */
export declare function updateRecordingSessionData(session: any): {
    type: string;
    sessionData: {
        error: any;
        id: any;
        initiator: any;
        liveStreamViewURL: any;
        mode: any;
        status: any;
        terminator: any;
        timestamp: number | undefined;
    };
};
/**
 * Sets the selected recording service.
 *
 * @param {string} selectedRecordingService - The new selected recording service.
 * @returns {Object}
 */
export declare function setSelectedRecordingService(selectedRecordingService: string): {
    type: string;
    selectedRecordingService: string;
};
/**
 * Starts local recording.
 *
 * @param {boolean} onlySelf - Whether to only record the local streams.
 * @returns {Object}
 */
export declare function startLocalVideoRecording(onlySelf?: boolean): {
    type: string;
    onlySelf: boolean | undefined;
};
/**
 * Stops local recording.
 *
 * @returns {Object}
 */
export declare function stopLocalVideoRecording(): {
    type: string;
};
/**
 * Displays the notification suggesting to start the recording.
 *
 * @param {Function} openRecordingDialog - The callback to open the recording dialog.
 * @returns {void}
 */
export declare function showStartRecordingNotificationWithCallback(openRecordingDialog: Function): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
