"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
/**
 * The initial state of the feature notifications.
 *
 * @type {array}
 */
const DEFAULT_STATE = {
    enabled: true,
    notifications: []
};
/**
 * Reduces redux actions which affect the display of notifications.
 *
 * @param {Object} state - The current redux state.
 * @param {Object} action - The redux action to reduce.
 * @returns {Object} The next redux state which is the result of reducing the
 * specified {@code action}.
 */
ReducerRegistry_1.default.register('features/notifications', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CLEAR_NOTIFICATIONS:
            return {
                ...state,
                notifications: []
            };
        case actionTypes_1.HIDE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(notification => notification.uid !== action.uid)
            };
        case actionTypes_1.SET_NOTIFICATIONS_ENABLED:
            return {
                ...state,
                enabled: action.enabled
            };
        case actionTypes_1.SHOW_NOTIFICATION:
            return {
                ...state,
                notifications: _insertNotificationByPriority(state.notifications, {
                    component: action.component,
                    props: action.props,
                    timeout: action.timeout,
                    uid: action.uid
                })
            };
    }
    return state;
});
/**
 * Creates a new notification queue with the passed in notification placed at
 * the end of other notifications with higher or the same priority.
 *
 * @param {Object[]} notifications - The queue of notifications to be displayed.
 * @param {Object} notification - The new notification to add to the queue.
 * @private
 * @returns {Object[]} A new array with an updated order of the notification
 * queue.
 */
function _insertNotificationByPriority(notifications, notification) {
    // Create a copy to avoid mutation.
    const copyOfNotifications = notifications.slice();
    // Get the index of any queued notification that has the same id as the new notification
    let insertAtLocation = copyOfNotifications.findIndex((queuedNotification) => queuedNotification?.uid === notification?.uid);
    if (insertAtLocation !== -1) {
        copyOfNotifications.splice(insertAtLocation, 1, notification);
        return copyOfNotifications;
    }
    const newNotificationPriority = constants_1.NOTIFICATION_TYPE_PRIORITIES[notification.props.appearance ?? ''] || 0;
    // Find where to insert the new notification based on priority. Do not
    // insert at the front of the queue so that the user can finish acting on
    // any notification currently being read.
    for (let i = 1; i < notifications.length; i++) {
        const queuedNotification = notifications[i];
        const queuedNotificationPriority = constants_1.NOTIFICATION_TYPE_PRIORITIES[queuedNotification.props.appearance ?? '']
            || 0;
        if (queuedNotificationPriority < newNotificationPriority) {
            insertAtLocation = i;
            break;
        }
    }
    copyOfNotifications.splice(insertAtLocation, 0, notification);
    return copyOfNotifications;
}
