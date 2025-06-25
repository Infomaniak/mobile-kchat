import { IStore } from '../app/types';
/**
 * Retrieves the current calendar events.
 *
 * @param {number} fetchStartDays - The number of days to go back when fetching.
 * @param {number} fetchEndDays - The number of days to fetch.
 * @returns {function(Dispatch<any>): Promise<CalendarEntries>}
 */
export declare function getCalendarEntries(fetchStartDays?: number, fetchEndDays?: number): () => any;
/**
 * Loads Google API.
 *
 * @returns {Function}
 */
export declare function loadGoogleAPI(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => any;
/**
 * Executes a request for a list of all YouTube broadcasts associated with
 * user currently signed in to the Google API Client Library.
 *
 * @returns {function(): (Promise<*>|Promise<any[] | never>)}
 */
export declare function requestAvailableYouTubeBroadcasts(): () => any;
/**
 * Fetches the stream key for a YouTube broadcast and updates the internal
 * state to display the associated stream key as being entered.
 *
 * @param {string} boundStreamID - The bound stream ID associated with the
 * broadcast from which to get the stream key.
 * @returns {function(): (Promise<*>|Promise<{
 *  streamKey: (*|string),
 *  selectedBoundStreamID: *} | never>)}
 */
export declare function requestLiveStreamsForYouTubeBroadcast(boundStreamID: string): () => any;
/**
 * Sets the current Google API state.
 *
 * @param {number} googleAPIState - The state to be set.
 * @param {Object} googleResponse - The last response from Google.
 * @returns {{
 *     type: SET_GOOGLE_API_STATE,
 *     googleAPIState: number
 * }}
 */
export declare function setGoogleAPIState(googleAPIState: number, googleResponse?: Object): {
    type: string;
    googleAPIState: number;
    googleResponse: Object | undefined;
};
/**
 * Forces the Google web client application to prompt for a sign in, such as
 * when changing account, and will then fetch available YouTube broadcasts.
 *
 * @returns {function(): (Promise<*>|Promise<{
 *  streamKey: (*|string),
 *  selectedBoundStreamID: *} | never>)}
 */
export declare function showAccountSelection(): () => any;
/**
 * Prompts the participant to sign in to the Google API Client Library.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export declare function signIn(): (dispatch: IStore['dispatch']) => any;
/**
 * Logs out the user.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export declare function signOut(): (dispatch: IStore['dispatch']) => any;
/**
 * Updates the profile data that is currently used.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export declare function updateProfile(): (dispatch: IStore['dispatch']) => any;
/**
 * Updates the calendar event and adds a location and text.
 *
 * @param {string} id - The event id to update.
 * @param {string} calendarId - The calendar id to use.
 * @param {string} location - The location to add to the event.
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
export declare function updateCalendarEvent(id: string, calendarId: string, location: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
