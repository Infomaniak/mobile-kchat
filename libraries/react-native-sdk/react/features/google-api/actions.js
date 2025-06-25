"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCalendarEvent = exports.updateProfile = exports.signOut = exports.signIn = exports.showAccountSelection = exports.setGoogleAPIState = exports.requestLiveStreamsForYouTubeBroadcast = exports.requestAvailableYouTubeBroadcasts = exports.loadGoogleAPI = exports.getCalendarEntries = void 0;
const functions_1 = require("../invite/functions");
const functions_2 = require("../recording/components/LiveStream/functions");
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
// eslint-disable-next-line lines-around-comment
// @ts-ignore
const googleApi_1 = __importDefault(require("./googleApi"));
/**
 * Retrieves the current calendar events.
 *
 * @param {number} fetchStartDays - The number of days to go back when fetching.
 * @param {number} fetchEndDays - The number of days to fetch.
 * @returns {function(Dispatch<any>): Promise<CalendarEntries>}
 */
function getCalendarEntries(fetchStartDays, fetchEndDays) {
    return () => googleApi_1.default.get()
        .then(() => googleApi_1.default._getCalendarEntries(fetchStartDays, fetchEndDays));
}
exports.getCalendarEntries = getCalendarEntries;
/**
 * Loads Google API.
 *
 * @returns {Function}
 */
function loadGoogleAPI() {
    return (dispatch, getState) => googleApi_1.default.get()
        .then(() => {
        const { enableCalendarIntegration, googleApiApplicationClientID } = getState()['features/base/config'];
        const liveStreaming = (0, functions_2.getLiveStreaming)(getState());
        if (getState()['features/google-api'].googleAPIState
            === constants_1.GOOGLE_API_STATES.NEEDS_LOADING) {
            return googleApi_1.default.initializeClient(googleApiApplicationClientID, liveStreaming.enabled, enableCalendarIntegration);
        }
        return Promise.resolve();
    })
        .then(() => dispatch(setGoogleAPIState(constants_1.GOOGLE_API_STATES.LOADED)))
        .then(() => googleApi_1.default.signInIfNotSignedIn())
        .then(() => googleApi_1.default.isSignedIn())
        .then((isSignedIn) => {
        if (isSignedIn) {
            dispatch(setGoogleAPIState(constants_1.GOOGLE_API_STATES.SIGNED_IN));
        }
    });
}
exports.loadGoogleAPI = loadGoogleAPI;
/**
 * Executes a request for a list of all YouTube broadcasts associated with
 * user currently signed in to the Google API Client Library.
 *
 * @returns {function(): (Promise<*>|Promise<any[] | never>)}
 */
function requestAvailableYouTubeBroadcasts() {
    return () => googleApi_1.default.requestAvailableYouTubeBroadcasts()
        .then((response) => {
        // Takes in a list of broadcasts from the YouTube API,
        // removes dupes, removes broadcasts that cannot get a stream key,
        // and parses the broadcasts into flat objects.
        const broadcasts = response.result.items;
        const parsedBroadcasts = {};
        for (let i = 0; i < broadcasts.length; i++) {
            const broadcast = broadcasts[i];
            const boundStreamID = broadcast.contentDetails.boundStreamId;
            if (boundStreamID && !parsedBroadcasts[boundStreamID]) {
                parsedBroadcasts[boundStreamID] = {
                    boundStreamID,
                    id: broadcast.id,
                    status: broadcast.status.lifeCycleStatus,
                    title: broadcast.snippet.title
                };
            }
        }
        return Object.values(parsedBroadcasts);
    });
}
exports.requestAvailableYouTubeBroadcasts = requestAvailableYouTubeBroadcasts;
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
function requestLiveStreamsForYouTubeBroadcast(boundStreamID) {
    return () => googleApi_1.default.requestLiveStreamsForYouTubeBroadcast(boundStreamID)
        .then((response) => {
        const broadcasts = response.result.items;
        const streamName = broadcasts?.[0]?.cdn.ingestionInfo.streamName;
        const streamKey = streamName || '';
        return {
            streamKey,
            selectedBoundStreamID: boundStreamID
        };
    });
}
exports.requestLiveStreamsForYouTubeBroadcast = requestLiveStreamsForYouTubeBroadcast;
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
function setGoogleAPIState(googleAPIState, googleResponse) {
    return {
        type: actionTypes_1.SET_GOOGLE_API_STATE,
        googleAPIState,
        googleResponse
    };
}
exports.setGoogleAPIState = setGoogleAPIState;
/**
 * Forces the Google web client application to prompt for a sign in, such as
 * when changing account, and will then fetch available YouTube broadcasts.
 *
 * @returns {function(): (Promise<*>|Promise<{
 *  streamKey: (*|string),
 *  selectedBoundStreamID: *} | never>)}
 */
function showAccountSelection() {
    return () => googleApi_1.default.showAccountSelection(true);
}
exports.showAccountSelection = showAccountSelection;
/**
 * Prompts the participant to sign in to the Google API Client Library.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
function signIn() {
    return (dispatch) => googleApi_1.default.get()
        .then(() => googleApi_1.default.signInIfNotSignedIn(true))
        .then(() => dispatch({
        type: actionTypes_1.SET_GOOGLE_API_STATE,
        googleAPIState: constants_1.GOOGLE_API_STATES.SIGNED_IN
    }));
}
exports.signIn = signIn;
/**
 * Logs out the user.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
function signOut() {
    return (dispatch) => googleApi_1.default.get()
        .then(() => googleApi_1.default.signOut())
        .then(() => {
        dispatch({
            type: actionTypes_1.SET_GOOGLE_API_STATE,
            googleAPIState: constants_1.GOOGLE_API_STATES.LOADED
        });
        dispatch({
            type: actionTypes_1.SET_GOOGLE_API_PROFILE,
            profileEmail: ''
        });
    });
}
exports.signOut = signOut;
/**
 * Updates the profile data that is currently used.
 *
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
function updateProfile() {
    return (dispatch) => googleApi_1.default.get()
        .then(() => googleApi_1.default.signInIfNotSignedIn())
        .then(() => dispatch({
        type: actionTypes_1.SET_GOOGLE_API_STATE,
        googleAPIState: constants_1.GOOGLE_API_STATES.SIGNED_IN
    }))
        .then(() => googleApi_1.default.getCurrentUserProfile())
        .then((profile) => {
        dispatch({
            type: actionTypes_1.SET_GOOGLE_API_PROFILE,
            profileEmail: profile.email
        });
        return profile.email;
    });
}
exports.updateProfile = updateProfile;
/**
 * Updates the calendar event and adds a location and text.
 *
 * @param {string} id - The event id to update.
 * @param {string} calendarId - The calendar id to use.
 * @param {string} location - The location to add to the event.
 * @returns {function(Dispatch<any>): Promise<string | never>}
 */
function updateCalendarEvent(id, calendarId, location) {
    return (dispatch, getState) => (0, functions_1.getShareInfoText)(getState(), location)
        .then(text => googleApi_1.default._updateCalendarEntry(id, calendarId, location, text));
}
exports.updateCalendarEvent = updateCalendarEvent;
