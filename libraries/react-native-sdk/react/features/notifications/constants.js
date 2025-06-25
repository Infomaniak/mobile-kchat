"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSCRIBING_NOTIFICATION_ID = exports.SILENT_LEFT_THRESHOLD = exports.SILENT_JOIN_THRESHOLD = exports.VISITORS_PROMOTION_NOTIFICATION_ID = exports.SALESFORCE_LINK_NOTIFICATION_ID = exports.RAISE_HAND_NOTIFICATION_ID = exports.LOCAL_RECORDING_NOTIFICATION_ID = exports.LOBBY_NOTIFICATION_ID = exports.DISABLE_SELF_VIEW_NOTIFICATION_ID = exports.DATA_CHANNEL_CLOSED_NOTIFICATION_ID = exports.CALENDAR_NOTIFICATION_ID = exports.NOTIFICATION_ICON = exports.NOTIFICATION_TYPE_PRIORITIES = exports.NOTIFICATION_TYPE = exports.NOTIFICATION_TIMEOUT_TYPE = exports.NOTIFICATION_TIMEOUT = void 0;
/**
 * The standard time when auto-disappearing notifications should disappear.
 */
exports.NOTIFICATION_TIMEOUT = {
    SHORT: 2500,
    MEDIUM: 5000,
    LONG: 10000,
    STICKY: false
};
/**
 * Notification timeout type.
 */
var NOTIFICATION_TIMEOUT_TYPE;
(function (NOTIFICATION_TIMEOUT_TYPE) {
    NOTIFICATION_TIMEOUT_TYPE["LONG"] = "long";
    NOTIFICATION_TIMEOUT_TYPE["MEDIUM"] = "medium";
    NOTIFICATION_TIMEOUT_TYPE["SHORT"] = "short";
    NOTIFICATION_TIMEOUT_TYPE["STICKY"] = "sticky";
})(NOTIFICATION_TIMEOUT_TYPE = exports.NOTIFICATION_TIMEOUT_TYPE || (exports.NOTIFICATION_TIMEOUT_TYPE = {}));
/**
 * The set of possible notification types.
 *
 * @enum {string}
 */
exports.NOTIFICATION_TYPE = {
    ERROR: 'error',
    NORMAL: 'normal',
    SUCCESS: 'success',
    WARNING: 'warning'
};
/**
 * A mapping of notification type to priority of display.
 *
 * @enum {number}
 */
exports.NOTIFICATION_TYPE_PRIORITIES = {
    [exports.NOTIFICATION_TYPE.ERROR]: 5,
    [exports.NOTIFICATION_TYPE.NORMAL]: 3,
    [exports.NOTIFICATION_TYPE.SUCCESS]: 3,
    [exports.NOTIFICATION_TYPE.WARNING]: 4
};
/**
 * The set of possible notification icons.
 *
 * @enum {string}
 */
exports.NOTIFICATION_ICON = {
    ...exports.NOTIFICATION_TYPE,
    MESSAGE: 'message',
    PARTICIPANT: 'participant',
    PARTICIPANTS: 'participants'
};
/**
 * The identifier of the calendar notification.
 *
 * @type {string}
 */
exports.CALENDAR_NOTIFICATION_ID = 'CALENDAR_NOTIFICATION_ID';
/**
 * The identifier of the disable self view notification.
 *
 * @type {string}
 */
exports.DATA_CHANNEL_CLOSED_NOTIFICATION_ID = 'DATA_CHANNEL_CLOSED_NOTIFICATION_ID';
/**
 * The identifier of the disable self view notification.
 *
 * @type {string}
 */
exports.DISABLE_SELF_VIEW_NOTIFICATION_ID = 'DISABLE_SELF_VIEW_NOTIFICATION_ID';
/**
 * The identifier of the lobby notification.
 *
 * @type {string}
 */
exports.LOBBY_NOTIFICATION_ID = 'LOBBY_NOTIFICATION';
/**
 * The identifier of the local recording notification.
 *
 * @type {string}
 */
exports.LOCAL_RECORDING_NOTIFICATION_ID = 'LOCAL_RECORDING_NOTIFICATION_ID';
/**
 * The identifier of the raise hand notification.
 *
 * @type {string}
 */
exports.RAISE_HAND_NOTIFICATION_ID = 'RAISE_HAND_NOTIFICATION';
/**
 * The identifier of the salesforce link notification.
 *
 * @type {string}
 */
exports.SALESFORCE_LINK_NOTIFICATION_ID = 'SALESFORCE_LINK_NOTIFICATION';
/**
 * The identifier of the lobby notification.
 *
 * @type {string}
 */
exports.VISITORS_PROMOTION_NOTIFICATION_ID = 'VISITORS_PROMOTION_NOTIFICATION';
/**
 * Amount of participants beyond which no join notification will be emitted.
 */
exports.SILENT_JOIN_THRESHOLD = 30;
/**
 * Amount of participants beyond which no left notification will be emitted.
 */
exports.SILENT_LEFT_THRESHOLD = 30;
/**
 * The identifier for the transcriber notifications.
 *
 * @type {string}
 */
exports.TRANSCRIBING_NOTIFICATION_ID = 'TRANSCRIBING_NOTIFICATION';
