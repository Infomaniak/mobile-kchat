"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_CURRENT_NOTIFICATION_UID = void 0;
/**
 * The type of Redux action which sets the pending notification UID
 * to use it for when hiding the notification is necessary, or unsets it when
 * undefined (or no param) is passed.
 *
 * {
 *     type: SET_CURRENT_NOTIFICATION_UID,
 *     uid: ?number
 * }
 * @public
 */
exports.SET_CURRENT_NOTIFICATION_UID = 'SET_CURRENT_NOTIFICATION_UID';
