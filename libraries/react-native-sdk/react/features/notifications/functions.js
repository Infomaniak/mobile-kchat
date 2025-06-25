"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModerationNotificationDisplayed = exports.joinLeaveNotificationsDisabled = exports.areThereNotifications = void 0;
const constants_1 = require("../av-moderation/constants");
const functions_1 = require("../base/redux/functions");
/**
 * Tells whether or not the notifications are enabled and if there are any
 * notifications to be displayed based on the current Redux state.
 *
 * @param {IStateful} stateful - The redux store state.
 * @returns {boolean}
 */
function areThereNotifications(stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { enabled, notifications } = state['features/notifications'];
    return enabled && notifications.length > 0;
}
exports.areThereNotifications = areThereNotifications;
/**
 * Tells whether join/leave notifications are enabled in interface_config.
 *
 * @returns {boolean}
 */
function joinLeaveNotificationsDisabled() {
    return Boolean(typeof interfaceConfig !== 'undefined' && interfaceConfig?.DISABLE_JOIN_LEAVE_NOTIFICATIONS);
}
exports.joinLeaveNotificationsDisabled = joinLeaveNotificationsDisabled;
/**
 * Returns whether or not the moderation notification for the given type is displayed.
 *
 * @param {MEDIA_TYPE} mediaType - The media type to check.
 * @param {IStateful} stateful - The redux store state.
 * @returns {boolean}
 */
function isModerationNotificationDisplayed(mediaType, stateful) {
    const state = (0, functions_1.toState)(stateful);
    const { notifications } = state['features/notifications'];
    return Boolean(notifications.find(n => n.uid === constants_1.MODERATION_NOTIFICATIONS[mediaType]));
}
exports.isModerationNotificationDisplayed = isModerationNotificationDisplayed;
