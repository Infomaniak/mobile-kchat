"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actions_1 = require("../base/app/actions");
const actionTypes_1 = require("../base/conference/actionTypes");
const actionTypes_2 = require("../base/connection/actionTypes");
const utils_1 = require("../base/connection/utils");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const iframeUtils_1 = require("../base/util/iframeUtils");
const actions_2 = require("./actions");
const getRouteToRender_1 = require("./getRouteToRender");
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_2.CONNECTION_ESTABLISHED:
            return _connectionEstablished(store, next, action);
        case actionTypes_2.CONNECTION_FAILED:
            return _connectionFailed(store, next, action);
        case actionTypes_1.SET_ROOM:
            return _setRoom(store, next, action);
    }
    return next(action);
});
/**
 * Notifies the feature app that the action {@link CONNECTION_ESTABLISHED} is
 * being dispatched within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONNECTION_ESTABLISHED}
 * which is being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _connectionEstablished(store, next, action) {
    const result = next(action);
    // In the Web app we explicitly do not want to display the hash and
    // query/search URL params. Unfortunately, window.location and, more
    // importantly, its params are used not only in jitsi-meet but also in
    // lib-jitsi-meet. Consequently, the time to remove the params is
    // determined by when no one needs them anymore.
    // @ts-ignore
    const { history, location } = window;
    if ((0, iframeUtils_1.inIframe)()) {
        return;
    }
    if (history
        && location
        && history.length
        && typeof history.replaceState === 'function') {
        // @ts-ignore
        const replacement = (0, utils_1.getURLWithoutParams)(location);
        // @ts-ignore
        if (location !== replacement) {
            history.replaceState(history.state, document?.title || '', replacement);
        }
    }
    return result;
}
/**
 * CONNECTION_FAILED action side effects.
 *
 * @param {Object} store - The Redux store.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the specified {@code action} to
 * the specified {@code store}.
 * @param {Action} action - The redux action {@code CONNECTION_FAILED} which is being dispatched in the specified
 * {@code store}.
 * @returns {Object}
 * @private
 */
function _connectionFailed({ dispatch, getState }, next, action) {
    // In the case of a split-brain error, reload early and prevent further
    // handling of the action.
    if (_isMaybeSplitBrainError(getState, action)) {
        dispatch((0, actions_2.reloadNow)());
        return;
    }
    return next(action);
}
/**
 * Returns whether or not a CONNECTION_FAILED action is for a possible split brain error. A split brain error occurs
 * when at least two users join a conference on different bridges. It is assumed the split brain scenario occurs very
 * early on in the call.
 *
 * @param {Function} getState - The redux function for fetching the current state.
 * @param {Action} action - The redux action {@code CONNECTION_FAILED} which is being dispatched in the specified
 * {@code store}.
 * @private
 * @returns {boolean}
 */
function _isMaybeSplitBrainError(getState, action) {
    const { error } = action;
    const isShardChangedError = error
        && error.message === 'item-not-found'
        && error.details
        && error.details.shard_changed;
    if (isShardChangedError) {
        const state = getState();
        const { timeEstablished } = state['features/base/connection'];
        const { _immediateReloadThreshold } = state['features/base/config'];
        const timeSinceConnectionEstablished = Number(timeEstablished && Date.now() - timeEstablished);
        const reloadThreshold = typeof _immediateReloadThreshold === 'number' ? _immediateReloadThreshold : 1500;
        const isWithinSplitBrainThreshold = !timeEstablished || timeSinceConnectionEstablished <= reloadThreshold;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createConnectionEvent)('failed', {
            ...error,
            connectionEstablished: timeEstablished,
            splitBrain: isWithinSplitBrainThreshold,
            timeSinceConnectionEstablished
        }));
        return isWithinSplitBrainThreshold;
    }
    return false;
}
/**
 * Navigates to a route in accord with a specific redux state.
 *
 * @param {Store} store - The redux store which determines/identifies the route
 * to navigate to.
 * @private
 * @returns {void}
 */
function _navigate({ dispatch, getState }) {
    const state = getState();
    const { app } = state['features/base/app'];
    (0, getRouteToRender_1._getRouteToRender)(state).then((route) => {
        dispatch((0, actions_1.appWillNavigate)(app, route));
        return app._navigate(route);
    });
}
/**
 * Notifies the feature app that the action {@link SET_ROOM} is being dispatched
 * within a specific redux {@code store}.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action, {@code SET_ROOM}, which is being
 * dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The new state that is the result of the reduction of the
 * specified {@code action}.
 */
function _setRoom(store, next, action) {
    const result = next(action);
    _navigate(store);
    return result;
}
