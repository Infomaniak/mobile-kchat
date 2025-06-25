import { IStore } from '../app/types';
import { INotificationProps } from './types';
/**
 * Clears (removes) all the notifications.
 *
 * @returns {{
 *     type: CLEAR_NOTIFICATIONS
 * }}
 */
export declare function clearNotifications(): {
    type: string;
};
/**
 * Removes the notification with the passed in id.
 *
 * @param {string} uid - The unique identifier for the notification to be
 * removed.
 * @returns {{
 *     type: HIDE_NOTIFICATION,
 *     uid: string
 * }}
 */
export declare function hideNotification(uid: string): {
    type: string;
    uid: string;
};
/**
 * Stops notifications from being displayed.
 *
 * @param {boolean} enabled - Whether or not notifications should display.
 * @returns {{
 *     type: SET_NOTIFICATIONS_ENABLED,
 *     enabled: boolean
 * }}
 */
export declare function setNotificationsEnabled(enabled: boolean): {
    type: string;
    enabled: boolean;
};
/**
 * Queues an error notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
export declare function showErrorNotification(props: INotificationProps, type?: string): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => {
    type: string;
    props: INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Queues a success notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
export declare function showSuccessNotification(props: INotificationProps, type?: string): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => {
    type: string;
    props: INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Queues a notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Timeout type.
 * @returns {Function}
 */
export declare function showNotification(props?: INotificationProps, type?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
    type: string;
    props: INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Queues a warning notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
export declare function showWarningNotification(props: INotificationProps, type?: string): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => {
    type: string;
    props: INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Queues a message notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
export declare function showMessageNotification(props: INotificationProps, type?: string): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => {
    type: string;
    props: INotificationProps;
    timeout: number | boolean;
    uid: string;
} | undefined;
/**
 * Queues the display of a notification of a participant having connected to
 * the meeting. The notifications are batched so that quick consecutive
 * connection events are shown in one notification.
 *
 * @param {string} displayName - The name of the participant that connected.
 * @returns {Function}
 */
export declare function showParticipantJoinedNotification(displayName: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void | undefined;
/**
 * Queues the display of a notification of a participant having left to
 * the meeting. The notifications are batched so that quick consecutive
 * connection events are shown in one notification.
 *
 * @param {string} displayName - The name of the participant that left.
 * @returns {Function}
 */
export declare function showParticipantLeftNotification(displayName: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void | undefined;
