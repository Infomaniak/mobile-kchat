"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showParticipantLeftNotification = exports.showParticipantJoinedNotification = exports.showMessageNotification = exports.showWarningNotification = exports.showNotification = exports.showSuccessNotification = exports.showErrorNotification = exports.setNotificationsEnabled = exports.hideNotification = exports.clearNotifications = void 0;
const throttle_1 = __importDefault(require("lodash/throttle"));
const constants_1 = require("../base/flags/constants");
const functions_1 = require("../base/flags/functions");
const functions_2 = require("../base/participants/functions");
const actionTypes_1 = require("./actionTypes");
const constants_2 = require("./constants");
/**
 * Function that returns notification timeout value based on notification timeout type.
 *
 * @param {string} type - Notification type.
 * @param {Object} notificationTimeouts - Config notification timeouts.
 * @returns {number}
 */
function getNotificationTimeout(type, notificationTimeouts) {
    if (type === constants_2.NOTIFICATION_TIMEOUT_TYPE.SHORT) {
        return notificationTimeouts?.short ?? constants_2.NOTIFICATION_TIMEOUT.SHORT;
    }
    else if (type === constants_2.NOTIFICATION_TIMEOUT_TYPE.MEDIUM) {
        return notificationTimeouts?.medium ?? constants_2.NOTIFICATION_TIMEOUT.MEDIUM;
    }
    else if (type === constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG) {
        return notificationTimeouts?.long ?? constants_2.NOTIFICATION_TIMEOUT.LONG;
    }
    return constants_2.NOTIFICATION_TIMEOUT.STICKY;
}
/**
 * Clears (removes) all the notifications.
 *
 * @returns {{
 *     type: CLEAR_NOTIFICATIONS
 * }}
 */
function clearNotifications() {
    return {
        type: actionTypes_1.CLEAR_NOTIFICATIONS
    };
}
exports.clearNotifications = clearNotifications;
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
function hideNotification(uid) {
    return {
        type: actionTypes_1.HIDE_NOTIFICATION,
        uid
    };
}
exports.hideNotification = hideNotification;
/**
 * Stops notifications from being displayed.
 *
 * @param {boolean} enabled - Whether or not notifications should display.
 * @returns {{
 *     type: SET_NOTIFICATIONS_ENABLED,
 *     enabled: boolean
 * }}
 */
function setNotificationsEnabled(enabled) {
    return {
        type: actionTypes_1.SET_NOTIFICATIONS_ENABLED,
        enabled
    };
}
exports.setNotificationsEnabled = setNotificationsEnabled;
/**
 * Queues an error notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
function showErrorNotification(props, type) {
    return showNotification({
        ...props,
        appearance: constants_2.NOTIFICATION_TYPE.ERROR
    }, type);
}
exports.showErrorNotification = showErrorNotification;
/**
 * Queues a success notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
function showSuccessNotification(props, type) {
    return showNotification({
        ...props,
        appearance: constants_2.NOTIFICATION_TYPE.SUCCESS
    }, type);
}
exports.showSuccessNotification = showSuccessNotification;
/**
 * Queues a notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Timeout type.
 * @returns {Function}
 */
function showNotification(props = {}, type) {
    return function (dispatch, getState) {
        const { disabledNotifications = [], notifications, notificationTimeouts } = getState()['features/base/config'];
        const enabledFlag = (0, functions_1.getFeatureFlag)(getState(), constants_1.NOTIFICATIONS_ENABLED, true);
        const { descriptionKey, titleKey } = props;
        const shouldDisplay = enabledFlag
            && !(disabledNotifications.includes(descriptionKey ?? '')
                || disabledNotifications.includes(titleKey ?? ''))
            && (!notifications
                || notifications.includes(descriptionKey ?? '')
                || notifications.includes(titleKey ?? ''));
        if (typeof APP !== 'undefined') {
            APP.API.notifyNotificationTriggered(titleKey, descriptionKey);
        }
        if (shouldDisplay) {
            return dispatch({
                type: actionTypes_1.SHOW_NOTIFICATION,
                props,
                timeout: getNotificationTimeout(type, notificationTimeouts),
                uid: props.uid || Date.now().toString()
            });
        }
    };
}
exports.showNotification = showNotification;
/**
 * Queues a warning notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
function showWarningNotification(props, type) {
    return showNotification({
        ...props,
        appearance: constants_2.NOTIFICATION_TYPE.WARNING
    }, type);
}
exports.showWarningNotification = showWarningNotification;
/**
 * Queues a message notification for display.
 *
 * @param {Object} props - The props needed to show the notification component.
 * @param {string} type - Notification type.
 * @returns {Object}
 */
function showMessageNotification(props, type) {
    return showNotification({
        ...props,
        concatText: true,
        titleKey: 'notify.chatMessages',
        appearance: constants_2.NOTIFICATION_TYPE.NORMAL,
        icon: constants_2.NOTIFICATION_ICON.MESSAGE
    }, type);
}
exports.showMessageNotification = showMessageNotification;
/**
 * An array of names of participants that have joined the conference. The array
 * is replaced with an empty array as notifications are displayed.
 *
 * @private
 * @type {string[]}
 */
let joinedParticipantsNames = [];
/**
 * A throttled internal function that takes the internal list of participant
 * names, {@code joinedParticipantsNames}, and triggers the display of a
 * notification informing of their joining.
 *
 * @private
 * @type {Function}
 */
const _throttledNotifyParticipantConnected = (0, throttle_1.default)((dispatch, getState) => {
    const participantCount = (0, functions_2.getParticipantCount)(getState());
    // Skip join notifications altogether for large meetings.
    if (participantCount > constants_2.SILENT_JOIN_THRESHOLD) {
        joinedParticipantsNames = [];
        return;
    }
    const joinedParticipantsCount = joinedParticipantsNames.length;
    let notificationProps;
    if (joinedParticipantsCount >= 3) {
        notificationProps = {
            titleArguments: {
                name: joinedParticipantsNames[0]
            },
            titleKey: 'notify.connectedThreePlusMembers'
        };
    }
    else if (joinedParticipantsCount === 2) {
        notificationProps = {
            titleArguments: {
                first: joinedParticipantsNames[0],
                second: joinedParticipantsNames[1]
            },
            titleKey: 'notify.connectedTwoMembers'
        };
    }
    else if (joinedParticipantsCount) {
        notificationProps = {
            titleArguments: {
                name: joinedParticipantsNames[0]
            },
            titleKey: 'notify.connectedOneMember'
        };
    }
    if (notificationProps) {
        dispatch(showNotification(notificationProps, constants_2.NOTIFICATION_TIMEOUT_TYPE.SHORT));
    }
    joinedParticipantsNames = [];
}, 2000, { leading: false });
/**
 * An array of names of participants that have left the conference. The array
 * is replaced with an empty array as notifications are displayed.
 *
 * @private
 * @type {string[]}
 */
let leftParticipantsNames = [];
/**
 * A throttled internal function that takes the internal list of participant
 * names, {@code leftParticipantsNames}, and triggers the display of a
 * notification informing of their leaving.
 *
 * @private
 * @type {Function}
 */
const _throttledNotifyParticipantLeft = (0, throttle_1.default)((dispatch, getState) => {
    const participantCount = (0, functions_2.getParticipantCount)(getState());
    // Skip left notifications altogether for large meetings.
    if (participantCount > constants_2.SILENT_LEFT_THRESHOLD) {
        leftParticipantsNames = [];
        return;
    }
    const leftParticipantsCount = leftParticipantsNames.length;
    let notificationProps;
    if (leftParticipantsCount >= 3) {
        notificationProps = {
            titleArguments: {
                name: leftParticipantsNames[0]
            },
            titleKey: 'notify.leftThreePlusMembers'
        };
    }
    else if (leftParticipantsCount === 2) {
        notificationProps = {
            titleArguments: {
                first: leftParticipantsNames[0],
                second: leftParticipantsNames[1]
            },
            titleKey: 'notify.leftTwoMembers'
        };
    }
    else if (leftParticipantsCount) {
        notificationProps = {
            titleArguments: {
                name: leftParticipantsNames[0]
            },
            titleKey: 'notify.leftOneMember'
        };
    }
    if (notificationProps) {
        dispatch(showNotification(notificationProps, constants_2.NOTIFICATION_TIMEOUT_TYPE.SHORT));
    }
    leftParticipantsNames = [];
}, 2000, { leading: false });
/**
 * Queues the display of a notification of a participant having connected to
 * the meeting. The notifications are batched so that quick consecutive
 * connection events are shown in one notification.
 *
 * @param {string} displayName - The name of the participant that connected.
 * @returns {Function}
 */
function showParticipantJoinedNotification(displayName) {
    joinedParticipantsNames.push(displayName);
    return (dispatch, getState) => _throttledNotifyParticipantConnected(dispatch, getState);
}
exports.showParticipantJoinedNotification = showParticipantJoinedNotification;
/**
 * Queues the display of a notification of a participant having left to
 * the meeting. The notifications are batched so that quick consecutive
 * connection events are shown in one notification.
 *
 * @param {string} displayName - The name of the participant that left.
 * @returns {Function}
 */
function showParticipantLeftNotification(displayName) {
    leftParticipantsNames.push(displayName);
    return (dispatch, getState) => _throttledNotifyParticipantLeft(dispatch, getState);
}
exports.showParticipantLeftNotification = showParticipantLeftNotification;
