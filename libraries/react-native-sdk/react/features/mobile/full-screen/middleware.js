"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_immersive_mode_1 = __importDefault(require("react-native-immersive-mode"));
const actionTypes_1 = require("../../base/app/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../../base/redux/StateListenerRegistry"));
const actions_1 = require("./actions");
const functions_1 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware that captures conference actions and activates or deactivates the
 * full screen mode. On iOS it hides the status bar, and on Android it uses the
 * immersive mode:
 * https://developer.android.com/training/system-ui/immersive.html
 * In immersive mode the status and navigation bars are hidden and thus the
 * entire screen will be covered by our application.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT: {
            _setImmersiveListener(store, _onImmersiveChange.bind(undefined, store));
            break;
        }
        case actionTypes_1.APP_WILL_UNMOUNT:
            _setImmersiveListener(store, undefined);
            break;
    }
    return next(action);
});
StateListenerRegistry_1.default.register(
/* selector */ functions_1.shouldUseFullScreen, 
/* listener */ fullScreen => _setFullScreen(fullScreen));
/**
 * Handler for Immersive mode changes. This will be called when Android's
 * immersive mode changes. This can happen without us wanting, so re-evaluate if
 * immersive mode is desired and reactivate it if needed.
 *
 * @param {Object} store - The redux store.
 * @private
 * @returns {void}
 */
function _onImmersiveChange({ getState }) {
    const state = getState();
    const { appState } = state['features/background'];
    if (appState === 'active') {
        _setFullScreen((0, functions_1.shouldUseFullScreen)(state));
    }
}
/**
 * Activates/deactivates the full screen mode. On iOS it will hide the status
 * bar, and on Android it will turn immersive mode on.
 *
 * @param {boolean} fullScreen - True to set full screen mode, false to
 * deactivate it.
 * @private
 * @returns {void}
 */
function _setFullScreen(fullScreen) {
    logger_1.default.info(`Setting full-screen mode: ${fullScreen}`);
    react_native_immersive_mode_1.default.fullLayout(fullScreen);
    react_native_immersive_mode_1.default.setBarMode(fullScreen ? 'Full' : 'Normal');
}
/**
 * Notifies the feature filmstrip that the action
 * {@link _SET_IMMERSIVE_LISTENER} is being dispatched within a specific redux
 * store.
 *
 * @param {Store} store - The redux store in which the specified action is being
 * dispatched.
 * @param {Function} listener - Listener for immersive state.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _setImmersiveListener({ dispatch, getState }, listener) {
    const { subscription } = getState()['features/full-screen'];
    subscription?.remove();
    dispatch((0, actions_1._setImmersiveSubscription)(listener ? react_native_immersive_mode_1.default.addEventListener(listener) : undefined));
}
