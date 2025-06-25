/**
 * The type of (redux) action which signals that all the stored notifications
 * need to be cleared.
 *
 * {
 *     type: CLEAR_NOTIFICATIONS
 * }
 */
export declare const CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS";
/**
 * The type of (redux) action which signals that a specific notification should
 * not be displayed anymore.
 *
 * {
 *     type: HIDE_NOTIFICATION,
 *     uid: string
 * }
 */
export declare const HIDE_NOTIFICATION = "HIDE_NOTIFICATION";
/**
 * The type of (redux) action which signals that a notification component should
 * be displayed.
 *
 * {
 *     type: SHOW_NOTIFICATION,
 *     component: ReactComponent,
 *     props: Object,
 *     timeout: number,
 *     uid: string
 * }
 */
export declare const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";
/**
 * The type of (redux) action which signals that notifications should not
 * display.
 *
 * {
 *     type: SET_NOTIFICATIONS_ENABLED,
 *     enabled: Boolean
 * }
 */
export declare const SET_NOTIFICATIONS_ENABLED = "SET_NOTIFICATIONS_ENABLED";
