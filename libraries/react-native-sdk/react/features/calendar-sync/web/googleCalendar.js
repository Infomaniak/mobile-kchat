"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCalendarApi = void 0;
const actions_1 = require("../../google-api/actions"); // @ts-ignore
const googleApi_web_1 = __importDefault(require("../../google-api/googleApi.web"));
/**
 * A stateless collection of action creators that implements the expected
 * interface for interacting with the Google API in order to get calendar data.
 *
 * @type {Object}
 */
exports.googleCalendarApi = {
    /**
     * Retrieves the current calendar events.
     *
     * @param {number} fetchStartDays - The number of days to go back
     * when fetching.
     * @param {number} fetchEndDays - The number of days to fetch.
     * @returns {function(): Promise<CalendarEntries>}
     */
    getCalendarEntries: actions_1.getCalendarEntries,
    /**
     * Returns the email address for the currently logged in user.
     *
     * @returns {function(Dispatch<any>): Promise<string|never>}
     */
    getCurrentEmail() {
        return (0, actions_1.updateProfile)();
    },
    /**
     * Initializes the google api if needed.
     *
     * @returns {function(Dispatch<any>, Function): Promise<void>}
     */
    load() {
        return (dispatch) => dispatch((0, actions_1.loadGoogleAPI)());
    },
    /**
     * Prompts the participant to sign in to the Google API Client Library.
     *
     * @returns {function(Dispatch<any>): Promise<string|never>}
     */
    signIn: actions_1.signIn,
    /**
     * Returns whether or not the user is currently signed in.
     *
     * @returns {function(): Promise<boolean>}
     */
    _isSignedIn() {
        return () => googleApi_web_1.default.isSignedIn();
    },
    /**
     * Updates calendar event by generating new invite URL and editing the event
     * adding some descriptive text and location.
     *
     * @param {string} id - The event id.
     * @param {string} calendarId - The id of the calendar to use.
     * @param {string} location - The location to save to the event.
     * @returns {function(Dispatch<any>): Promise<string|never>}
     */
    updateCalendarEvent: actions_1.updateCalendarEvent
};
