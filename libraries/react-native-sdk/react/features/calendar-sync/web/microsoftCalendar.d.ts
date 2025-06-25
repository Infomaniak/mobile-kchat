import { IStore } from '../../app/types';
/**
 * A stateless collection of action creators that implements the expected
 * interface for interacting with the Microsoft API in order to get calendar
 * data.
 *
 * @type {Object}
 */
export declare const microsoftCalendarApi: {
    /**
     * Retrieves the current calendar events.
     *
     * @param {number} fetchStartDays - The number of days to go back
     * when fetching.
     * @param {number} fetchEndDays - The number of days to fetch.
     * @returns {function(Dispatch<any>, Function): Promise<CalendarEntries>}
     */
    getCalendarEntries(fetchStartDays?: number, fetchEndDays?: number): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
    /**
     * Returns the email address for the currently logged in user.
     *
     * @returns {function(Dispatch<*, Function>): Promise<string>}
     */
    getCurrentEmail(): Function;
    /**
     * Sets the application ID to use for interacting with the Microsoft API.
     *
     * @returns {function(): Promise<void>}
     */
    load(): () => Promise<void>;
    /**
     * Prompts the participant to sign in to the Microsoft API Client Library.
     *
     * @returns {function(Dispatch<any>, Function): Promise<void>}
     */
    signIn(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => any;
    /**
     * Returns whether or not the user is currently signed in.
     *
     * @returns {function(Dispatch<any>, Function): Promise<boolean>}
     */
    _isSignedIn(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
    /**
     * Updates calendar event by generating new invite URL and editing the event
     * adding some descriptive text and location.
     *
     * @param {string} id - The event id.
     * @param {string} calendarId - The id of the calendar to use.
     * @param {string} location - The location to save to the event.
     * @returns {function(Dispatch<any>): Promise<string|never>}
     */
    updateCalendarEvent(id: string, calendarId: string, location: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
};
