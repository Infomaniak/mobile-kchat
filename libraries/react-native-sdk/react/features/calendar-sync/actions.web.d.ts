import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Sets the initial state of calendar integration by loading third party APIs
 * and filling out any data that needs to be fetched.
 *
 * @returns {Function}
 */
export declare function bootstrapCalendarIntegration(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
/**
 * Resets the state of calendar integration so stored events and selected
 * calendar type are cleared.
 *
 * @returns {{
 *     type: CLEAR_CALENDAR_INTEGRATION
 * }}
 */
export declare function clearCalendarIntegration(): {
    type: string;
};
/**
 * Asks confirmation from the user to add a Jitsi link to the calendar event.
 *
 * NOTE: Currently there is no confirmation prompted on web, so this is just
 * a relaying method to avoid flow problems.
 *
 * @param {string} eventId - The event id.
 * @param {string} calendarId - The calendar id.
 * @returns {Function}
 */
export declare function openUpdateCalendarEventDialog(eventId: string, calendarId: string): (dispatch: import("redux-thunk").ThunkDispatch<import("../app/types").IReduxState, void, import("redux").AnyAction>, getState: () => import("../app/types").IReduxState) => Promise<{
    type: string;
    events: Object[];
}>;
/**
 * Sends an action to update the current calendar api auth state in redux.
 * This is used only for microsoft implementation to store it auth state.
 *
 * @param {number} newState - The new state.
 * @returns {{
 *     type: SET_CALENDAR_AUTH_STATE,
 *     msAuthState: Object
 * }}
 */
export declare function setCalendarAPIAuthState(newState?: Object): {
    type: string;
    msAuthState: Object | undefined;
};
/**
 * Sends an action to update the calendar error state in redux.
 *
 * @param {Object} error - An object with error details.
 * @returns {{
 *     type: SET_CALENDAR_ERROR,
 *     error: Object
 * }}
 */
export declare function setCalendarError(error?: Object): {
    type: string;
    error: Object | undefined;
};
/**
 * Sends an action to update the current calendar profile email state in redux.
 *
 * @param {number} newEmail - The new email.
 * @returns {{
 *     type: SET_CALENDAR_PROFILE_EMAIL,
 *     email: string
 * }}
 */
export declare function setCalendarProfileEmail(newEmail?: string): {
    type: string;
    email: string | undefined;
};
/**
 * Sends an to denote a request in is flight to get calendar events.
 *
 * @param {boolean} isLoadingEvents - Whether or not calendar events are being
 * fetched.
 * @returns {{
 *     type: SET_LOADING_CALENDAR_EVENTS,
 *     isLoadingEvents: boolean
 * }}
 */
export declare function setLoadingCalendarEvents(isLoadingEvents: boolean): {
    type: string;
    isLoadingEvents: boolean;
};
/**
 * Sets the calendar integration type to be used by web and signals that the
 * integration is ready to be used.
 *
 * @param {string|undefined} integrationType - The calendar type.
 * @returns {{
 *      type: SET_CALENDAR_INTEGRATION,
 *      integrationReady: boolean,
 *      integrationType: string
 * }}
 */
export declare function setIntegrationReady(integrationType: string): {
    type: string;
    integrationReady: boolean;
    integrationType: string;
};
/**
 * Signals signing in to the specified calendar integration.
 *
 * @param {string} calendarType - The calendar integration which should be
 * signed into.
 * @returns {Function}
 */
export declare function signIn(calendarType: string): (dispatch: IStore['dispatch']) => any;
/**
 * Updates calendar event by generating new invite URL and editing the event
 * adding some descriptive text and location.
 *
 * @param {string} id - The event id.
 * @param {string} calendarId - The id of the calendar to use.
 * @returns {Function}
 */
export declare function updateCalendarEvent(id: string, calendarId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<{
    type: string;
    events: Object[];
}>;
/**
 * Signals to get current profile data linked to the current calendar
 * integration that is in use.
 *
 * @param {string} calendarType - The calendar integration to which the profile
 * should be updated.
 * @returns {Function}
 */
export declare function updateProfile(calendarType: string): (dispatch: IStore['dispatch']) => any;
