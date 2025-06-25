"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCalendarEvents = exports.setCalendarAuthorization = exports.refreshCalendar = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sends an action to refresh the entry list (fetches new data).
 *
 * @param {boolean} forcePermission - Whether to force to re-ask for
 * the permission or not.
 * @param {boolean} isInteractive - If true this refresh was caused by
 * direct user interaction, false otherwise.
 * @returns {{
 *     type: REFRESH_CALENDAR,
 *     forcePermission: boolean,
 *     isInteractive: boolean
 * }}
 */
function refreshCalendar(forcePermission = false, isInteractive = true) {
    return {
        type: actionTypes_1.REFRESH_CALENDAR,
        forcePermission,
        isInteractive
    };
}
exports.refreshCalendar = refreshCalendar;
/**
 * Sends an action to signal that a calendar access has been requested. For more
 * info, see {@link SET_CALENDAR_AUTHORIZATION}.
 *
 * @param {string | undefined} authorization - The result of the last calendar
 * authorization request.
 * @returns {{
 *     type: SET_CALENDAR_AUTHORIZATION,
 *     authorization: ?string
 * }}
 */
function setCalendarAuthorization(authorization) {
    return {
        type: actionTypes_1.SET_CALENDAR_AUTHORIZATION,
        authorization
    };
}
exports.setCalendarAuthorization = setCalendarAuthorization;
/**
 * Sends an action to update the current calendar list in redux.
 *
 * @param {Array<Object>} events - The new list.
 * @returns {{
 *     type: SET_CALENDAR_EVENTS,
 *     events: Array<Object>
 * }}
 */
function setCalendarEvents(events) {
    return {
        type: actionTypes_1.SET_CALENDAR_EVENTS,
        events
    };
}
exports.setCalendarEvents = setCalendarEvents;
