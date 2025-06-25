import { NativeEventSubscription } from 'react-native';
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
export declare function _setAppStateSubscription(subscription?: NativeEventSubscription): {
    type: string;
    subscription: NativeEventSubscription | undefined;
};
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
export declare function appStateChanged(appState: string): {
    type: string;
    appState: string;
};
