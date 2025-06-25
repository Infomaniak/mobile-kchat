import { IStore } from '../../app/types';
import { getCalendarEntries, signIn, updateCalendarEvent } from '../../google-api/actions';
/**
 * A stateless collection of action creators that implements the expected
 * interface for interacting with the Google API in order to get calendar data.
 *
 * @type {Object}
 */
export declare const googleCalendarApi: {
    /**
     * Retrieves the current calendar events.
     *
     * @param {number} fetchStartDays - The number of days to go back
     * when fetching.
     * @param {number} fetchEndDays - The number of days to fetch.
     * @returns {function(): Promise<CalendarEntries>}
     */
    getCalendarEntries: typeof getCalendarEntries;
    /**
     * Returns the email address for the currently logged in user.
     *
     * @returns {function(Dispatch<any>): Promise<string|never>}
     */
    getCurrentEmail(): (dispatch: import("redux-thunk").ThunkDispatch<import("../../app/types").IReduxState, void, import("redux").AnyAction>) => any;
    /**
     * Initializes the google api if needed.
     *
     * @returns {function(Dispatch<any>, Function): Promise<void>}
     */
    load(): (dispatch: IStore['dispatch']) => any;
    /**
     * Prompts the participant to sign in to the Google API Client Library.
     *
     * @returns {function(Dispatch<any>): Promise<string|never>}
     */
    signIn: typeof signIn;
    /**
     * Returns whether or not the user is currently signed in.
     *
     * @returns {function(): Promise<boolean>}
     */
    _isSignedIn(): () => any;
    /**
     * Updates calendar event by generating new invite URL and editing the event
     * adding some descriptive text and location.
     *
     * @param {string} id - The event id.
     * @param {string} calendarId - The id of the calendar to use.
     * @param {string} location - The location to save to the event.
     * @returns {function(Dispatch<any>): Promise<string|never>}
     */
    updateCalendarEvent: typeof updateCalendarEvent;
};
