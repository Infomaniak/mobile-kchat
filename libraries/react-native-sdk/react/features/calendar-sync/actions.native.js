"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCalendarEvent = exports.openUpdateCalendarEventDialog = void 0;
// @ts-expect-error
const random_1 = require("@jitsi/js-utils/random");
const functions_1 = require("../app/functions");
const actions_1 = require("../base/dialog/actions");
const actions_2 = require("./actions");
const UpdateCalendarEventDialog_native_1 = __importDefault(require("./components/UpdateCalendarEventDialog.native"));
const functions_native_1 = require("./functions.native");
__exportStar(require("./actions.any"), exports);
/**
 * Asks confirmation from the user to add a Jitsi link to the calendar event.
 *
 * @param {string} eventId - The event id.
 * @returns {{
 *     type: OPEN_DIALOG,
 *     component: React.Component,
 *     componentProps: (Object | undefined)
 * }}
 */
function openUpdateCalendarEventDialog(eventId) {
    return (0, actions_1.openDialog)(UpdateCalendarEventDialog_native_1.default, { eventId });
}
exports.openUpdateCalendarEventDialog = openUpdateCalendarEventDialog;
/**
 * Updates calendar event by generating new invite URL and editing the event
 * adding some descriptive text and location.
 *
 * @param {string} eventId - The event id.
 * @returns {Function}
 */
function updateCalendarEvent(eventId) {
    return (dispatch, getState) => {
        const defaultUrl = (0, functions_1.getDefaultURL)(getState);
        const roomName = (0, random_1.generateRoomWithoutSeparator)();
        (0, functions_native_1.addLinkToCalendarEntry)(getState(), eventId, `${defaultUrl}/${roomName}`)
            .finally(() => {
            dispatch((0, actions_2.refreshCalendar)(false, false));
        });
    };
}
exports.updateCalendarEvent = updateCalendarEvent;
