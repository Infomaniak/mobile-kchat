"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const actionTypes_1 = require("../../base/app/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../../base/redux/MiddlewareRegistry"));
const actions_1 = require("./actions");
/**
 * Middleware that captures App lifetime actions and subscribes to application
 * state changes. When the application state changes it will fire the action
 * required to mute or unmute the local video in case the application goes to
 * the background or comes back from it.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 * @see {@link https://facebook.github.io/react-native/docs/appstate.html}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT: {
            const { dispatch } = store;
            _setAppStateListener(store, _onAppStateChange.bind(undefined, dispatch));
            break;
        }
        case actionTypes_1.APP_WILL_UNMOUNT:
            _setAppStateListener(store, undefined);
            break;
    }
    return next(action);
});
/**
 * Called by React Native's AppState API to notify that the application state
 * has changed. Dispatches the change within the (associated) redux store.
 *
 * @param {Dispatch} dispatch - The redux {@code dispatch} function.
 * @param {string} appState - The current application execution state.
 * @private
 * @returns {void}
 */
function _onAppStateChange(dispatch, appState) {
    dispatch((0, actions_1.appStateChanged)(appState));
}
/**
 * Notifies the feature filmstrip that the action
 * {@link _SET_IMMERSIVE_LISTENER} is being dispatched within a specific redux
 * store.
 *
 * @param {Store} store - The redux store in which the specified action is being
 * dispatched.
 * @param {any} listener - Listener for app state status.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _setAppStateListener({ dispatch, getState }, listener) {
    const { subscription } = getState()['features/background'];
    subscription?.remove();
    dispatch((0, actions_1._setAppStateSubscription)(listener ? react_native_1.AppState.addEventListener('change', listener) : undefined));
}
