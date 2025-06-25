"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../app/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_2 = require("./actionTypes");
/**
 * Reference to any callback that has been created to be invoked on user
 * interaction.
 *
 * @type {Function|null}
 */
let userInteractionListener = null;
/**
 * Implements the entry point of the middleware of the feature base/user-interaction.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            _startListeningForUserInteraction(store);
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            _stopListeningForUserInteraction();
            break;
    }
    return next(action);
});
/**
 * Callback invoked when the user interacts with the page.
 *
 * @param {Function} dispatch - The redux dispatch function.
 * @param {Object} event - The DOM event for a user interacting with the page.
 * @private
 * @returns {void}
 */
function _onUserInteractionReceived(dispatch, event) {
    if (event.isTrusted) {
        dispatch({
            type: actionTypes_2.USER_INTERACTION_RECEIVED
        });
        _stopListeningForUserInteraction();
    }
}
/**
 * Registers listeners to notify redux of any user interaction with the page.
 *
 * @param {Object} store - The redux store.
 * @private
 * @returns {void}
 */
function _startListeningForUserInteraction({ dispatch }) {
    _stopListeningForUserInteraction();
    userInteractionListener = _onUserInteractionReceived.bind(null, dispatch);
    // @ts-ignore
    window.addEventListener('mousedown', userInteractionListener);
    // @ts-ignore
    window.addEventListener('keydown', userInteractionListener);
}
/**
 * De-registers listeners for user interaction with the page.
 *
 * @private
 * @returns {void}
 */
function _stopListeningForUserInteraction() {
    // @ts-ignore
    window.removeEventListener('mousedown', userInteractionListener);
    // @ts-ignore
    window.removeEventListener('keydown', userInteractionListener);
    userInteractionListener = null;
}
