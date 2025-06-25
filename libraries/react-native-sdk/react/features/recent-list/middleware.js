"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const constants_1 = require("../base/conference/constants");
const actions_1 = require("../base/known-domains/actions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const iframeUtils_1 = require("../base/util/iframeUtils");
const uri_1 = require("../base/util/uri");
const actions_2 = require("./actions");
const functions_1 = require("./functions");
/**
 * Middleware that captures joined rooms so they can be saved into
 * {@code window.localStorage}.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    if ((0, functions_1.isRecentListEnabled)()) {
        switch (action.type) {
            case actionTypes_1.APP_WILL_MOUNT:
                return _appWillMount(store, next, action);
            case actionTypes_2.CONFERENCE_WILL_LEAVE:
                return _conferenceWillLeave(store, next, action);
            case actionTypes_2.SET_ROOM:
                return _setRoom(store, next, action);
        }
    }
    return next(action);
});
/**
 * Notifies the feature recent-list that the redux action {@link APP_WILL_MOUNT}
 * is being dispatched in a specific redux store.
 *
 * @param {Store} store - The redux store in which the specified action is being
 * dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The redux action {@code APP_WILL_MOUNT} which is
 * being dispatched in the specified redux store.
 * @private
 * @returns {*} The result returned by {@code next(action)}.
 */
function _appWillMount({ dispatch, getState }, next, action) {
    const result = next(action);
    // It's an opportune time to transfer the feature recent-list's knowledge
    // about "known domains" (which is local to the feature) to the feature
    // base/known-domains (which is global to the app).
    //
    // XXX Since the feature recent-list predates the feature calendar-sync and,
    // consequently, the feature known-domains, it's possible for the feature
    // known-list to know of domains which the feature known-domains is yet to
    // discover.
    const knownDomains = [];
    for (const { conference } of getState()['features/recent-list']) {
        const uri = (0, uri_1.parseURIString)(conference);
        let host;
        uri && (host = uri.host) && knownDomains.push(host);
    }
    knownDomains.length && dispatch((0, actions_1.addKnownDomains)(knownDomains));
    return result;
}
/**
 * Updates the duration of the last conference stored in the list.
 *
 * @param {Store} store - The redux store.
 * @param {Dispatch} next - The redux {@code dispatch} function.
 * @param {Action} action - The redux action {@link CONFERENCE_WILL_LEAVE}.
 * @private
 * @returns {*} The result returned by {@code next(action)}.
 */
function _conferenceWillLeave({ dispatch, getState }, next, action) {
    const state = getState();
    const { doNotStoreRoom } = state['features/base/config'];
    if (!doNotStoreRoom && !(0, iframeUtils_1.inIframe)()) {
        let locationURL;
        /**
         * FIXME:
         * It is better to use action.conference[JITSI_CONFERENCE_URL_KEY]
         * in order to make sure we get the url the conference is leaving
         * from (i.e. The room we are leaving from) because if the order of events
         * is different, we cannot be guaranteed that the location URL in base
         * connection is the url we are leaving from... Not the one we are going to
         * (the latter happens on mobile -- if we use the web implementation);
         * however, the conference object on web does not have
         * JITSI_CONFERENCE_URL_KEY so we cannot call it and must use the other way.
         */
        if (typeof APP === 'undefined') {
            const { conference } = action;
            // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
            locationURL = conference && conference[constants_1.JITSI_CONFERENCE_URL_KEY];
        }
        else {
            locationURL = state['features/base/connection'].locationURL;
        }
        dispatch((0, actions_2._updateConferenceDuration)(locationURL));
    }
    return next(action);
}
/**
 * Checks if there is a current conference (upon SET_ROOM action), and saves it
 * if necessary.
 *
 * @param {Store} store - The redux store.
 * @param {Dispatch} next - The redux {@code dispatch} function.
 * @param {Action} action - The redux action {@link SET_ROOM}.
 * @private
 * @returns {*} The result returned by {@code next(action)}.
 */
function _setRoom({ dispatch, getState }, next, action) {
    const { doNotStoreRoom } = getState()['features/base/config'];
    if (!doNotStoreRoom && !(0, iframeUtils_1.inIframe)() && action.room) {
        const { locationURL } = getState()['features/base/connection'];
        if (locationURL) {
            dispatch((0, actions_2._storeCurrentConference)(locationURL));
            // Whatever domain the feature recent-list knows about, the app as a
            // whole should know about.
            //
            // XXX Technically, _storeCurrentConference could be turned into an
            // asynchronous action creator which dispatches both
            // _STORE_CURRENT_CONFERENCE and addKnownDomains but...
            dispatch((0, actions_1.addKnownDomains)(locationURL.host));
        }
    }
    return next(action);
}
