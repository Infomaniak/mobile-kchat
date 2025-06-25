/**
 * The standard time when auto-disappearing notifications should disappear.
 */
export declare const NOTIFICATION_TIMEOUT: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    STICKY: boolean;
};
/**
 * Notification timeout type.
 */
export declare enum NOTIFICATION_TIMEOUT_TYPE {
    LONG = "long",
    MEDIUM = "medium",
    SHORT = "short",
    STICKY = "sticky"
}
/**
 * The set of possible notification types.
 *
 * @enum {string}
 */
export declare const NOTIFICATION_TYPE: {
    ERROR: string;
    NORMAL: string;
    SUCCESS: string;
    WARNING: string;
};
/**
 * A mapping of notification type to priority of display.
 *
 * @enum {number}
 */
export declare const NOTIFICATION_TYPE_PRIORITIES: {
    [x: string]: number;
};
/**
 * The set of possible notification icons.
 *
 * @enum {string}
 */
export declare const NOTIFICATION_ICON: {
    MESSAGE: string;
    PARTICIPANT: string;
    PARTICIPANTS: string;
    ERROR: string;
    NORMAL: string;
    SUCCESS: string;
    WARNING: string;
};
/**
 * The identifier of the calendar notification.
 *
 * @type {string}
 */
export declare const CALENDAR_NOTIFICATION_ID = "CALENDAR_NOTIFICATION_ID";
/**
 * The identifier of the disable self view notification.
 *
 * @type {string}
 */
export declare const DATA_CHANNEL_CLOSED_NOTIFICATION_ID = "DATA_CHANNEL_CLOSED_NOTIFICATION_ID";
/**
 * The identifier of the disable self view notification.
 *
 * @type {string}
 */
export declare const DISABLE_SELF_VIEW_NOTIFICATION_ID = "DISABLE_SELF_VIEW_NOTIFICATION_ID";
/**
 * The identifier of the lobby notification.
 *
 * @type {string}
 */
export declare const LOBBY_NOTIFICATION_ID = "LOBBY_NOTIFICATION";
/**
 * The identifier of the local recording notification.
 *
 * @type {string}
 */
export declare const LOCAL_RECORDING_NOTIFICATION_ID = "LOCAL_RECORDING_NOTIFICATION_ID";
/**
 * The identifier of the raise hand notification.
 *
 * @type {string}
 */
export declare const RAISE_HAND_NOTIFICATION_ID = "RAISE_HAND_NOTIFICATION";
/**
 * The identifier of the salesforce link notification.
 *
 * @type {string}
 */
export declare const SALESFORCE_LINK_NOTIFICATION_ID = "SALESFORCE_LINK_NOTIFICATION";
/**
 * The identifier of the lobby notification.
 *
 * @type {string}
 */
export declare const VISITORS_PROMOTION_NOTIFICATION_ID = "VISITORS_PROMOTION_NOTIFICATION";
/**
 * Amount of participants beyond which no join notification will be emitted.
 */
export declare const SILENT_JOIN_THRESHOLD = 30;
/**
 * Amount of participants beyond which no left notification will be emitted.
 */
export declare const SILENT_LEFT_THRESHOLD = 30;
/**
 * The identifier for the transcriber notifications.
 *
 * @type {string}
 */
export declare const TRANSCRIBING_NOTIFICATION_ID = "TRANSCRIBING_NOTIFICATION";
