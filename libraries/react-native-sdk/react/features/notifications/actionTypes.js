"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_NOTIFICATIONS_ENABLED = exports.SHOW_NOTIFICATION = exports.HIDE_NOTIFICATION = exports.CLEAR_NOTIFICATIONS = void 0;
/**
 * The type of (redux) action which signals that all the stored notifications
 * need to be cleared.
 *
 * {
 *     type: CLEAR_NOTIFICATIONS
 * }
 */
exports.CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
/**
 * The type of (redux) action which signals that a specific notification should
 * not be displayed anymore.
 *
 * {
 *     type: HIDE_NOTIFICATION,
 *     uid: string
 * }
 */
exports.HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';
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
exports.SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
/**
 * The type of (redux) action which signals that notifications should not
 * display.
 *
 * {
 *     type: SET_NOTIFICATIONS_ENABLED,
 *     enabled: Boolean
 * }
 */
exports.SET_NOTIFICATIONS_ENABLED = 'SET_NOTIFICATIONS_ENABLED';
