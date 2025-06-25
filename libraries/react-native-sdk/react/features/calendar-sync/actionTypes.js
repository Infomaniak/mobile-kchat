"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SET_LOADING_CALENDAR_EVENTS = exports.SET_CALENDAR_PROFILE_EMAIL = exports.SET_CALENDAR_AUTH_STATE = exports.SET_CALENDAR_INTEGRATION = exports.SET_CALENDAR_EVENTS = exports.SET_CALENDAR_ERROR = exports.SET_CALENDAR_AUTHORIZATION = exports.REFRESH_CALENDAR = exports.CLEAR_CALENDAR_INTEGRATION = void 0;
/**
 * Resets the state of calendar integration so stored events and selected
 * calendar type are cleared.
 *
 * {
 *     type: CLEAR_CALENDAR_INTEGRATION
 * }
 */
exports.CLEAR_CALENDAR_INTEGRATION = 'CLEAR_CALENDAR_INTEGRATION';
/**
 * Action to refresh (re-fetch) the entry list.
 *
 * {
 *     type: REFRESH_CALENDAR,
 *     forcePermission: boolean,
 *     isInteractive: boolean
 * }
 */
exports.REFRESH_CALENDAR = 'REFRESH_CALENDAR';
/**
 * Action to signal that calendar access has already been requested since the
 * app started, so no new request should be done unless the user explicitly
 * tries to refresh the calendar view.
 *
 * {
 *     type: SET_CALENDAR_AUTHORIZATION,
 *     authorization: ?string
 * }
 */
exports.SET_CALENDAR_AUTHORIZATION = 'SET_CALENDAR_AUTHORIZATION';
/**
 * Action to update the last error that occurred while trying to authenticate
 * with or fetch data from the calendar integration.
 *
 * {
 *     type: SET_CALENDAR_ERROR,
 *     error: ?Object
 * }
 */
exports.SET_CALENDAR_ERROR = 'SET_CALENDAR_ERROR';
/**
 * Action to update the current calendar entry list in the store.
 *
 * {
 *     type: SET_CALENDAR_EVENTS,
 *     events: Array<Object>
 * }
 */
exports.SET_CALENDAR_EVENTS = 'SET_CALENDAR_EVENTS';
/**
 * Action to update calendar type to be used for web.
 *
 * {
 *     type: SET_CALENDAR_INTEGRATION,
 *     integrationReady: boolean,
 *     integrationType: string
 * }
 */
exports.SET_CALENDAR_INTEGRATION = 'SET_CALENDAR_INTEGRATION';
/**
 * The type of Redux action which changes Calendar API auth state.
 *
 * {
 *     type: SET_CALENDAR_AUTH_STATE
 * }
 * @public
 */
exports.SET_CALENDAR_AUTH_STATE = 'SET_CALENDAR_AUTH_STATE';
/**
 * The type of Redux action which changes Calendar Profile email state.
 *
 * {
 *     type: SET_CALENDAR_PROFILE_EMAIL,
 *     email: string
 * }
 * @public
 */
exports.SET_CALENDAR_PROFILE_EMAIL = 'SET_CALENDAR_PROFILE_EMAIL';
/**
 * The type of Redux action which denotes whether a request is in flight to get
 * updated calendar events.
 *
 * {
 *     type: SET_LOADING_CALENDAR_EVENTS,
 *     isLoadingEvents: string
 * }
 * @public
 */
exports.SET_LOADING_CALENDAR_EVENTS = 'SET_LOADING_CALENDAR_EVENTS';
