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
exports.updateProfile = exports.updateCalendarEvent = exports.signIn = exports.setIntegrationReady = exports.setLoadingCalendarEvents = exports.setCalendarProfileEmail = exports.setCalendarError = exports.setCalendarAPIAuthState = exports.openUpdateCalendarEventDialog = exports.clearCalendarIntegration = exports.bootstrapCalendarIntegration = void 0;
// @ts-expect-error
const random_1 = require("@jitsi/js-utils/random");
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_1 = require("../google-api/actions");
const actionTypes_1 = require("./actionTypes");
const actions_web_1 = require("./actions.web");
const functions_web_1 = require("./functions.web");
const logger_1 = __importDefault(require("./logger"));
__exportStar(require("./actions.any"), exports);
/**
 * Sets the initial state of calendar integration by loading third party APIs
 * and filling out any data that needs to be fetched.
 *
 * @returns {Function}
 */
function bootstrapCalendarIntegration() {
    return (dispatch, getState) => {
        const state = getState();
        if (!(0, functions_web_1.isCalendarEnabled)(state)) {
            return Promise.reject();
        }
        const { googleApiApplicationClientID } = state['features/base/config'];
        const { integrationReady, integrationType } = state['features/calendar-sync'];
        return Promise.resolve()
            .then(() => {
            if (googleApiApplicationClientID) {
                return dispatch((0, actions_1.loadGoogleAPI)());
            }
        })
            .then(() => {
            if (!integrationType || integrationReady) {
                return;
            }
            const integrationToLoad = (0, functions_web_1._getCalendarIntegration)(integrationType);
            if (!integrationToLoad) {
                dispatch(clearCalendarIntegration());
                return;
            }
            return dispatch(integrationToLoad._isSignedIn())
                .then((signedIn) => {
                if (signedIn) {
                    dispatch(setIntegrationReady(integrationType));
                    dispatch(updateProfile(integrationType));
                }
                else {
                    dispatch(clearCalendarIntegration());
                }
            });
        });
    };
}
exports.bootstrapCalendarIntegration = bootstrapCalendarIntegration;
/**
 * Resets the state of calendar integration so stored events and selected
 * calendar type are cleared.
 *
 * @returns {{
 *     type: CLEAR_CALENDAR_INTEGRATION
 * }}
 */
function clearCalendarIntegration() {
    return {
        type: actionTypes_1.CLEAR_CALENDAR_INTEGRATION
    };
}
exports.clearCalendarIntegration = clearCalendarIntegration;
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
function openUpdateCalendarEventDialog(eventId, calendarId) {
    return updateCalendarEvent(eventId, calendarId);
}
exports.openUpdateCalendarEventDialog = openUpdateCalendarEventDialog;
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
function setCalendarAPIAuthState(newState) {
    return {
        type: actionTypes_1.SET_CALENDAR_AUTH_STATE,
        msAuthState: newState
    };
}
exports.setCalendarAPIAuthState = setCalendarAPIAuthState;
/**
 * Sends an action to update the calendar error state in redux.
 *
 * @param {Object} error - An object with error details.
 * @returns {{
 *     type: SET_CALENDAR_ERROR,
 *     error: Object
 * }}
 */
function setCalendarError(error) {
    return {
        type: actionTypes_1.SET_CALENDAR_ERROR,
        error
    };
}
exports.setCalendarError = setCalendarError;
/**
 * Sends an action to update the current calendar profile email state in redux.
 *
 * @param {number} newEmail - The new email.
 * @returns {{
 *     type: SET_CALENDAR_PROFILE_EMAIL,
 *     email: string
 * }}
 */
function setCalendarProfileEmail(newEmail) {
    return {
        type: actionTypes_1.SET_CALENDAR_PROFILE_EMAIL,
        email: newEmail
    };
}
exports.setCalendarProfileEmail = setCalendarProfileEmail;
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
function setLoadingCalendarEvents(isLoadingEvents) {
    return {
        type: actionTypes_1.SET_LOADING_CALENDAR_EVENTS,
        isLoadingEvents
    };
}
exports.setLoadingCalendarEvents = setLoadingCalendarEvents;
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
function setIntegrationReady(integrationType) {
    return {
        type: actionTypes_1.SET_CALENDAR_INTEGRATION,
        integrationReady: true,
        integrationType
    };
}
exports.setIntegrationReady = setIntegrationReady;
/**
 * Signals signing in to the specified calendar integration.
 *
 * @param {string} calendarType - The calendar integration which should be
 * signed into.
 * @returns {Function}
 */
function signIn(calendarType) {
    return (dispatch) => {
        const integration = (0, functions_web_1._getCalendarIntegration)(calendarType);
        if (!integration) {
            return Promise.reject('No supported integration found');
        }
        return dispatch(integration.load())
            .then(() => dispatch(integration.signIn()))
            .then(() => dispatch(setIntegrationReady(calendarType)))
            .then(() => dispatch(updateProfile(calendarType)))
            .then(() => dispatch((0, actions_web_1.refreshCalendar)()))
            .then(() => (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createCalendarConnectedEvent)()))
            .catch((error) => {
            logger_1.default.error('Error occurred while signing into calendar integration', error);
            return Promise.reject(error);
        });
    };
}
exports.signIn = signIn;
/**
 * Updates calendar event by generating new invite URL and editing the event
 * adding some descriptive text and location.
 *
 * @param {string} id - The event id.
 * @param {string} calendarId - The id of the calendar to use.
 * @returns {Function}
 */
function updateCalendarEvent(id, calendarId) {
    return (dispatch, getState) => {
        const { integrationType = '' } = getState()['features/calendar-sync'];
        const integration = (0, functions_web_1._getCalendarIntegration)(integrationType);
        if (!integration) {
            return Promise.reject('No integration found');
        }
        const { locationURL } = getState()['features/base/connection'];
        const newRoomName = (0, random_1.generateRoomWithoutSeparator)();
        let href = locationURL?.href ?? '';
        href.endsWith('/') || (href += '/');
        const roomURL = `${href}${newRoomName}`;
        return dispatch(integration.updateCalendarEvent(id, calendarId, roomURL))
            .then(() => {
            // make a copy of the array
            const events = getState()['features/calendar-sync'].events.slice(0);
            const eventIx = events.findIndex(e => e.id === id && e.calendarId === calendarId);
            // clone the event we will modify
            const newEvent = Object.assign({}, events[eventIx]);
            newEvent.url = roomURL;
            events[eventIx] = newEvent;
            return dispatch((0, actions_web_1.setCalendarEvents)(events));
        });
    };
}
exports.updateCalendarEvent = updateCalendarEvent;
/**
 * Signals to get current profile data linked to the current calendar
 * integration that is in use.
 *
 * @param {string} calendarType - The calendar integration to which the profile
 * should be updated.
 * @returns {Function}
 */
function updateProfile(calendarType) {
    return (dispatch) => {
        const integration = (0, functions_web_1._getCalendarIntegration)(calendarType);
        if (!integration) {
            return Promise.reject('No integration found');
        }
        // @ts-ignore
        return dispatch(integration.getCurrentEmail())
            .then((email) => {
            dispatch(setCalendarProfileEmail(email));
        });
    };
}
exports.updateProfile = updateProfile;
