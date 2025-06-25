"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appStateChanged = exports._setAppStateSubscription = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sets subscription for app state.
 *
 * @param {Function} subscription - Subscription for the native event.
 * @private
 * @returns {{
 *     type: _SET_APP_STATE_SUBSCRIPTION,
 *     subscription: NativeEventSubscription
 * }}
 */
function _setAppStateSubscription(subscription) {
    return {
        type: actionTypes_1._SET_APP_STATE_SUBSCRIPTION,
        subscription
    };
}
exports._setAppStateSubscription = _setAppStateSubscription;
/**
 * Signals that the App state has changed (in terms of execution state). The
 * application can be in 3 states: 'active', 'inactive' and 'background'.
 *
 * @param {string} appState - The new App state.
 * @public
 * @returns {{
 *     type: APP_STATE_CHANGED,
 *     appState: string
 * }}
 * @see {@link https://facebook.github.io/react-native/docs/appstate.html}
 */
function appStateChanged(appState) {
    return {
        type: actionTypes_1.APP_STATE_CHANGED,
        appState
    };
}
exports.appStateChanged = appStateChanged;
